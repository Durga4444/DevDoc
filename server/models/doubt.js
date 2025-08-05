
projectSchema.statics.searchProjects = async function(query) { //static method 
  if (!query || query.trim() === '') {
    return this.find().sort({ updatedAt: -1 });
  }
  const searchResults = await this.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" }, updatedAt: -1 });
  if (searchResults.length === 0) {
    const regex = new RegExp(query, 'i');
    return this.find({
      $or: [
        { name: regex },
        { description: regex },
        { tags: regex },
        { notes: regex }
      ]
    }).sort({ updatedAt: -1 });
  }
  return searchResults;
};


const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',//This enables Mongoose population — a feature that fetches the entire user document from the users collection when you want it.
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  notes: {
    type: String,
    default: ''
  },
  links: [linkSchema],
  snippets: [snippetSchema],
  files: [fileSchema],
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});




const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|md|js|ts|jsx|tsx|css|html|json|xml|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, documents, and code files are allowed.'));
    }
  }
});


//console.log(req),datatype of req

//findbyid,updateONe

 for (const file of project.files) {
      const filePath = path.join(__dirname, '../uploads', file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }


router.post('/:id/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const project = await Project.findById(req.params.id);
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const fileData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype
    };
    project.files.push(fileData);
    await project.save();
    res.json(fileData);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});



//status 404

//

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.set('trust proxy', 1)
Server.js 
(process.env.MONGO_URI)

export const useProjects = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider')
  }
  return context
}

useCallback()

//projectcontext 
 /*const uploadFile = async (projectId, file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post(`/projects/${projectId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })*/


  const searchProjects = useCallback((query) => {
    setSearchQuery(query)
    fetchProjects(query)
  }, [fetchProjects])
//e.target 


helmet