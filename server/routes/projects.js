const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Ensure uploads directory exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
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
    // Allow common file types
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

// GET /api/projects - Get all projects with optional search
router.get('/', auth, async (req, res) => {
  try {
    const { search, sort = 'updatedAt', order = 'desc' } = req.query;
    let projects;
    if (search) {
      projects = await Project.searchProjects(search);
      projects = projects.filter(p => p.user.toString() === req.user.id);
    } else {
      const sortObj = {};
      sortObj[sort] = order === 'desc' ? -1 : 1;
      projects = await Project.find({ user: req.user.id }).sort(sortObj);
    }
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects - Create new project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, tags, notes } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    const project = new Project({
      user: req.user.id,
      name,
      description,
      tags: tags || [],
      notes: notes || ''
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, tags, notes, links, snippets } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags;
    if (notes !== undefined) updateData.notes = notes;
    if (links !== undefined) updateData.links = links;
    if (snippets !== undefined) updateData.snippets = snippets;

    await project.updateOne(updateData);
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete associated files
    for (const file of project.files) {
      const filePath = path.join(__dirname, '../uploads', file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// POST /api/projects/:id/upload - Upload file to project
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

// DELETE /api/projects/:id/files/:fileId - Delete file from project
router.delete('/:id/files/:fileId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const file = project.files.id(req.params.fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../uploads', file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove file from project
    file.deleteOne();
    await project.save();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// POST /api/projects/:id/snippets - Add snippet to project
router.post('/:id/snippets', auth, async (req, res) => {
  try {
    const { title, code, language } = req.body;
    
    if (!title || !code) {
      return res.status(400).json({ error: 'Title and code are required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.snippets.push({ title, code, language: language || 'javascript' });
    await project.save();

    res.json(project.snippets[project.snippets.length - 1]);
  } catch (error) {
    console.error('Error adding snippet:', error);
    res.status(500).json({ error: 'Failed to add snippet' });
  }
});

// PUT /api/projects/:id/snippets/:snippetId - Update snippet
router.put('/:id/snippets/:snippetId', auth, async (req, res) => {
  try {
    const { title, code, language } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const snippet = project.snippets.id(req.params.snippetId);
    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    if (title !== undefined) snippet.title = title;
    if (code !== undefined) snippet.code = code;
    if (language !== undefined) snippet.language = language;

    await project.save();
    res.json(snippet);
  } catch (error) {
    console.error('Error updating snippet:', error);
    res.status(500).json({ error: 'Failed to update snippet' });
  }
});

// DELETE /api/projects/:id/snippets/:snippetId - Delete snippet
router.delete('/:id/snippets/:snippetId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const snippet = project.snippets.id(req.params.snippetId);
    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    snippet.deleteOne();
    await project.save();

    res.json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    console.error('Error deleting snippet:', error);
    res.status(500).json({ error: 'Failed to delete snippet' });
  }
});

// POST /api/projects/:id/links - Add link to project
router.post('/:id/links', auth, async (req, res) => {
  try {
    const { title, url } = req.body;
    
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.links.push({ title, url });
    await project.save();

    res.json(project.links[project.links.length - 1]);
  } catch (error) {
    console.error('Error adding link:', error);
    res.status(500).json({ error: 'Failed to add link' });
  }
});

// PUT /api/projects/:id/links/:linkId - Update link
router.put('/:id/links/:linkId', auth, async (req, res) => {
  try {
    const { title, url } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const link = project.links.id(req.params.linkId);
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    if (title !== undefined) link.title = title;
    if (url !== undefined) link.url = url;

    await project.save();
    res.json(link);
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({ error: 'Failed to update link' });
  }
});

// DELETE /api/projects/:id/links/:linkId - Delete link
router.delete('/:id/links/:linkId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || project.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const link = project.links.id(req.params.linkId);
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    link.deleteOne();
    await project.save();

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

// PUBLIC: GET /api/projects/public/:id - Get single project (public view, no auth)
router.get('/public/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    // Optionally, filter out sensitive fields
    res.json({
      _id: project._id,
      name: project.name,
      description: project.description,
      tags: project.tags,
      notes: project.notes,
      links: project.links,
      snippets: project.snippets,
      files: project.files,
      updatedAt: project.updatedAt,
      createdAt: project.createdAt
    });
  } catch (error) {
    console.error('Error fetching public project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

module.exports = router; 