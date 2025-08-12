require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(helmet());
app.set('trust proxy', 1)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200 
});
app.use(limiter);

app.use(cors({
  //origin: true,
  credentials: true,
   origin: ["http://localhost:5173", "https://dev-doc-b6kj.vercel.app","https://dev-doc-omdm.vercel.app","dev-doc-neqg.vercel.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('DevDoc API is running');
});


app.get(/^\/(?!api|uploads).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});


app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

module.exports = app; 