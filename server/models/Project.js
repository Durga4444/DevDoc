const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'javascript'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

//This creates a schema that defines what each project document will look like in the database.
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

projectSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text', 
  notes: 'text' 
}, {
  weights: {
    name: 10,
    description: 5,
    tags: 3,
    notes: 1
  }
});

projectSchema.virtual('formattedUpdatedAt').get(function() {
  return this.updatedAt.toLocaleDateString();
});

projectSchema.pre('save', function(next) {
  this.lastAccessed = new Date();
  next();
});

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

projectSchema.methods.addTag = function(tag) { //instance method 
  if (!this.tags.includes(tag.toLowerCase())) {
    this.tags.push(tag.toLowerCase());
  }
  return this.save();
};

projectSchema.methods.removeTag = function(tag) { //instance method 
  this.tags = this.tags.filter(t => t !== tag.toLowerCase());
  return this.save();
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 