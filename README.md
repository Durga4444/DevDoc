# Personal Project Vault

A comprehensive MERN stack application for managing personal projects with notes, code snippets, links, and file uploads.

## Features

- **Dashboard**: View all projects with search and filtering
- **Project Management**: Create, edit, and delete projects
- **Markdown Notes**: Rich text editor with live preview
- **Code Snippets**: Store and highlight code with syntax highlighting
- **Link Management**: Save and organize project-related URLs
- **File Uploads**: Attach files to projects with drag-and-drop
- **Search**: Global fuzzy search across all project content
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Multer** for file uploads
- **Mongoose-fuzzy-searching** for search functionality

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Markdown** for markdown rendering
- **Prism React Renderer** for code highlighting
- **React Dropzone** for file uploads
- **Lucide React** for icons

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-project-vault
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```bash
   cd server
   cp env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/project-vault
   NODE_ENV=development
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=10485760
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using a local installation:
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 5173).

## Project Structure

```
personal-project-vault/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── uploads/            # File upload directory
│   ├── package.json
│   └── server.js
├── package.json
└── README.md
```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects (with optional search)
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Snippets
- `POST /api/projects/:id/snippets` - Add snippet
- `PUT /api/projects/:id/snippets/:snippetId` - Update snippet
- `DELETE /api/projects/:id/snippets/:snippetId` - Delete snippet

### Links
- `POST /api/projects/:id/links` - Add link
- `PUT /api/projects/:id/links/:linkId` - Update link
- `DELETE /api/projects/:id/links/:linkId` - Delete link

### Files
- `POST /api/projects/:id/upload` - Upload file
- `DELETE /api/projects/:id/files/:fileId` - Delete file

## Usage

1. **Create a Project**: Click "New Project" and fill in the details
2. **Add Notes**: Use the markdown editor to write project notes
3. **Add Snippets**: Store code snippets with syntax highlighting
4. **Add Links**: Save important URLs related to your project
5. **Upload Files**: Drag and drop files to attach them to projects
6. **Search**: Use the global search to find projects and content
7. **Organize**: Use tags to categorize your projects

## Development

### Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production

### Code Style

The project uses ESLint for code linting. Run `npm run lint` in the client directory to check for issues.

## Deployment

### Fullstack Deployment on Render

1. **Provision a MongoDB database** (e.g., MongoDB Atlas).
2. **Build the frontend:**
   ```bash
   cd client
   npm install
   npm run build
   ```
   This creates a `dist` folder in `client/`.
3. **Copy the frontend build to the server directory:**
   ```bash
   cp -r client/dist server/
   ```
   (Or automate this in your build process.)
4. **Deploy the backend to Render:**
   - Go to [Render](https://render.com/) and create a new Web Service from the `server/` directory.
   - Set the build command:
     ```bash
     cd ../client && npm install && npm run build && cd ../server && npm install && cp -r ../client/dist .
     ```
   - Set the start command:
     ```bash
     npm start
     ```
   - Set the following environment variables in Render:
     - `MONGODB_URI` (your MongoDB connection string)
     - `NODE_ENV=production`
     - `PORT` (Render sets this automatically)
     - `MAX_FILE_SIZE` (optional, default is 10485760)

5. **Uploads:**
   - The `/uploads` directory is used for file uploads. Render persists files during the lifetime of the instance, but for permanent storage, consider using a cloud storage service.

6. **Accessing the App:**
   - Your fullstack app will be available at the Render service URL. All frontend and API routes will work from this single domain.

### Troubleshooting
- If you see a blank page or 404 on refresh, ensure the Express server is serving `index.html` for all non-API, non-uploads routes.
- If API requests fail, check the Network tab for the request URL and ensure the backend is running and accessible.
- If you get CORS errors, ensure your frontend and backend are served from the same domain (which they are in this setup).
- If you change environment variables, always redeploy the service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub. 