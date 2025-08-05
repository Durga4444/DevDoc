import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Edit, Save, X, Plus, Trash2, ExternalLink, Download, FileText, Code, Link as LinkIcon, Share2, Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useProjects } from '../contexts/ProjectContext'
import SnippetEditor from '../components/SnippetEditor'
import LinkEditor from '../components/LinkEditor'
import FileUpload from '../components/FileUpload'
import ConfirmationModal from '../components/ConfirmationModal'
import { useDebounce } from '../hooks/useDebounce'
import ShareButton from '../components/ShareButton'
// Text highlighting component
const HighlightedText = ({ text, searchQuery }) => {
  if (!searchQuery || !text) {
    return <span>{text}</span>
  }

  const parts = text.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  
  return (
    <span>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === searchQuery.toLowerCase()
        return (
          <span
            key={index}
            className={isMatch ? 'bg-yellow-500 dark:bg-yellow-500 font-medium rounded px-1' : ''}
          >
            {part}
          </span>
        )
      })}
    </span>
  )
}

// Enhanced textarea with highlighting overlay
const HighlightedTextarea = ({ value, onChange, searchQuery, className, ...props }) => {
  const textareaRef = useRef(null)
  const highlightRef = useRef(null)

  const handleScroll = () => {
    if (highlightRef.current && textareaRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  const renderHighlightedContent = () => {
    if (!searchQuery || !value) {
      return value
    }

    const parts = value.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    
    return parts.map((part, index) => {
      const isMatch = part.toLowerCase() === searchQuery.toLowerCase()
      if (isMatch) {
        return `<mark class="bg-yellow-400 dark:bg-yellow-500 font-medium rounded px-1">${part}</mark>`
      }
      return part
    }).join('')
  }

  return (
    <div className="relative">
      {/* Highlighting overlay */}
      <div
        ref={highlightRef}
        className={`absolute inset-0 pointer-events-none overflow-hidden whitespace-pre-wrap font-mono text-sm ${className} text-transparent`}
        style={{
          padding: '0.75rem',
        //  border: '1px solid transparent',
          lineHeight: '1.5',
          wordWrap: 'break-word'
        }}
        dangerouslySetInnerHTML={{
          __html: renderHighlightedContent()
        }}
      />
      
      {/* Actual textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        className={`${className}`}
        {...props}
      />
    </div>
  )
}

const ProjectView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { getProject, updateProject, deleteProject, setLastProjectId } = useProjects()
  
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('notes')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: [],
    notes: ''
  })
  const [newTag, setNewTag] = useState('')
  const [notes, setNotes] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedNotes = useDebounce(notes, 1000)
  const autoSaveTimeoutRef = useRef(null)

  // Extract search query from URL params or state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const query = urlParams.get('search') || location.state?.searchQuery || ''
    setSearchQuery(query)
    
    // If there's a search query, automatically switch to notes tab
    if (query && location.state?.searchQuery) {
      setActiveTab('notes')
    }
  }, [location])

  useEffect(() => {
    loadProject()
  }, [id])

  useEffect(() => {
    if (project) {
      setLastProjectId(project._id)
    }
  }, [project, setLastProjectId])

  // Auto-save notes
  useEffect(() => {
    if (debouncedNotes !== project?.notes && project) {
      autoSaveTimeoutRef.current = setTimeout(async () => {
        try {
          await updateProject(project._id, { notes: debouncedNotes })
        } catch (error) {
          console.error('Auto-save failed:', error)
        }
      }, 1000)
    }
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [debouncedNotes, project])

  const loadProject = async () => {
    try {
      const projectData = await getProject(id)
      setProject(projectData)
      setFormData({
        name: projectData.name,
        description: projectData.description || '',
        tags: projectData.tags || [],
        notes: projectData.notes || ''
      })
      setNotes(projectData.notes || '')
    } catch (error) {
      console.error('Error loading project:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSave = async () => {
    try {
      const updatedProject = await updateProject(project._id, formData)
      setProject(updatedProject)
      setEditing(false)
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteProject(project._id)
      navigate('/')
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject)
  }

  const clearSearch = () => {
    setSearchQuery('')
    // Remove search params from URL
    navigate(location.pathname, { replace: true })
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Project not found
          </h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'snippets', label: 'Snippets', icon: Code },
    { id: 'links', label: 'Links', icon: LinkIcon },
    { id: 'files', label: 'Files', icon: Download }
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
            >
              <ArrowLeft size={20} />
            </button>
            
            {editing ? (
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-lg sm:text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary-500 min-w-0"
                />
                <button
                  onClick={handleSave}
                  className="btn-primary text-sm sm:text-base"
                >
                  <Save size={16} className="mr-2" />
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="btn-secondary text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  <HighlightedText text={project.name} searchQuery={searchQuery} />
                </h1>
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-secondary text-sm sm:text-base"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="btn-danger text-sm sm:text-base"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Share Button */}
         <ShareButton project={project} />
        </div>

        {/* Search Query Display */}
        {searchQuery && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Searching for: "{searchQuery}"
                </span>
              </div>
              <button
                onClick={clearSearch}
                className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
                title="Clear search"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Project Info */}
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="input resize-none"
                placeholder="Project description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="input flex-1"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn-secondary px-4 py-2 sm:py-0"
                >
                  <Plus size={16} />
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                    >
                      <HighlightedText text={tag} searchQuery={searchQuery} />
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {project.description && (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <HighlightedText text={project.description} searchQuery={searchQuery} />
              </p>
            )}
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    <HighlightedText text={tag} searchQuery={searchQuery} />
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Project Notes
                {searchQuery && (
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    (Highlighting "{searchQuery}")
                  </span>
                )}
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Auto-saves as you type
              </div>
            </div>
            <div>
              <HighlightedTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                searchQuery={searchQuery}
                className="input h-64 sm:h-80 font-mono text-sm mb-4 max-w-full overflow-x-auto"
                placeholder="Write your notes here... (Markdown supported)"
              />
            </div>
          </div>
        )}

        {activeTab === 'snippets' && (
          <div className="max-w-full overflow-x-auto">
            <SnippetEditor 
              project={project} 
              onProjectUpdate={handleProjectUpdate}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {activeTab === 'links' && (
          <div className="max-w-full overflow-x-auto">
            <LinkEditor 
              project={project} 
              onProjectUpdate={handleProjectUpdate}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {activeTab === 'files' && (
          <div className="max-w-full overflow-x-auto">
            <FileUpload 
              project={project} 
              onProjectUpdate={handleProjectUpdate}
              searchQuery={searchQuery}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmText="Delete Project"
        confirmVariant="danger"
      />
    </div>
  )
}

export default ProjectView 