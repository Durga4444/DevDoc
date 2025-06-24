import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import api from '../utils/api'

const ProjectContext = createContext()

export const useProjects = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider')
  }
  return context
}

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lastProjectId, setLastProjectId] = useState(() => {
    return localStorage.getItem('lastProjectId')
  })

  // Load projects on mount
  useEffect(() => {
    fetchProjects()
  }, [])

  // Save last project ID to localStorage
  useEffect(() => {
    if (lastProjectId) {
      localStorage.setItem('lastProjectId', lastProjectId)
    }
  }, [lastProjectId])

  const fetchProjects = useCallback(async (search = '') => {
    setLoading(true)
    try {
      const response = await api.get(`/projects${search ? `?search=${search}` : ''}`)
      setProjects(response.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  const createProject = async (projectData) => {
    try {
      const response = await api.post('/projects', projectData)
      setProjects(prev => [response.data, ...prev])
      toast.success('Project created successfully')
      return response.data
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project')
      throw error
    }
  }

  const updateProject = async (id, updates) => {
    try {
      const response = await api.put(`/projects/${id}`, updates)
      setProjects(prev => 
        prev.map(project => 
          project._id === id ? response.data : project
        )
      )
      toast.success('Project updated successfully')
      return response.data
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
      throw error
    }
  }

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`)
      setProjects(prev => prev.filter(project => project._id !== id))
      toast.success('Project deleted successfully')
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
      throw error
    }
  }

  const getProject = async (id) => {
    try {
      const response = await api.get(`/projects/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Failed to load project')
      throw error
    }
  }

  const addSnippet = async (projectId, snippetData) => {
    try {
      const response = await api.post(`/projects/${projectId}/snippets`, snippetData)
      setProjects(prev => 
        prev.map(project => 
          project._id === projectId 
            ? { ...project, snippets: [...project.snippets, response.data] }
            : project
        )
      )
      toast.success('Snippet added successfully')
      return response.data
    } catch (error) {
      console.error('Error adding snippet:', error)
      toast.error('Failed to add snippet')
      throw error
    }
  }

  const updateSnippet = async (projectId, snippetId, updates) => {
    try {
      const response = await api.put(`/projects/${projectId}/snippets/${snippetId}`, updates)
      setProjects(prev => 
        prev.map(project => 
          project._id === projectId 
            ? {
                ...project,
                snippets: project.snippets.map(snippet =>
                  snippet._id === snippetId ? response.data : snippet
                )
              }
            : project
        )
      )
      toast.success('Snippet updated successfully')
      return response.data
    } catch (error) {
      console.error('Error updating snippet:', error)
      toast.error('Failed to update snippet')
      throw error
    }
  }

  const deleteSnippet = async (projectId, snippetId) => {
    try {
      await api.delete(`/projects/${projectId}/snippets/${snippetId}`)
      setProjects(prev => 
        prev.map(project => 
          project._id === projectId 
            ? {
                ...project,
                snippets: project.snippets.filter(snippet => snippet._id !== snippetId)
              }
            : project
        )
      )
      toast.success('Snippet deleted successfully')
    } catch (error) {
      console.error('Error deleting snippet:', error)
      toast.error('Failed to delete snippet')
      throw error
    }
  }

  const addLink = async (projectId, linkData) => {
    try {
      const response = await api.post(`/projects/${projectId}/links`, linkData)
      setProjects(prev => 
        prev.map(project => 
          project._id === projectId 
            ? { ...project, links: [...project.links, response.data] }
            : project
        )
      )
      toast.success('Link added successfully')
      return response.data
    } catch (error) {
      console.error('Error adding link:', error)
      toast.error('Failed to add link')
      throw error
    }
  }

  const updateLink = async (projectId, linkId, updates) => {
    try {
      const response = await api.put(`/projects/${projectId}/links/${linkId}`, updates)
      setProjects(prev => 
        prev.map(project => 
          project._id === projectId 
            ? {
                ...project,
                links: project.links.map(link =>
                  link._id === linkId ? response.data : link
                )
              }
            : project
        )
      )
      toast.success('Link updated successfully')
      return response.data
    } catch (error) {
      console.error('Error updating link:', error)
      toast.error('Failed to update link')
      throw error
    }
  }

  const deleteLink = async (projectId, linkId) => {
    try {
      await api.delete(`/projects/${projectId}/links/${linkId}`)
      setProjects(prev => 
        prev.map(project => 
          project._id === projectId 
            ? {
                ...project,
                links: project.links.filter(link => link._id !== linkId)
              }
            : project
        )
      )
      toast.success('Link deleted successfully')
    } catch (error) {
      console.error('Error deleting link:', error)
      toast.error('Failed to delete link')
      throw error
    }
  }

  const uploadFile = async (projectId, file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post(`/projects/${projectId}/upload`, formData)
      setProjects(prev => 
        prev.map(project => 
          project._id === projectId 
            ? { ...project, files: [...project.files, response.data] }
            : project
        )
      )
      toast.success('File uploaded successfully')
      return response.data
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
      throw error
    }
  }

  const deleteFile = async (projectId, fileId) => {
    try {
      await api.delete(`/projects/${projectId}/files/${fileId}`)
      setProjects(prev => 
        prev.map(project => 
          project._id === projectId 
            ? {
                ...project,
                files: project.files.filter(file => file._id !== fileId)
              }
            : project
        )
      )
      toast.success('File deleted successfully')
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Failed to delete file')
      throw error
    }
  }

  const searchProjects = useCallback((query) => {
    setSearchQuery(query)
    fetchProjects(query)
  }, [fetchProjects])

  const value = {
    projects,
    loading,
    searchQuery,
    lastProjectId,
    setLastProjectId,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    addLink,
    updateLink,
    deleteLink,
    uploadFile,
    deleteFile,
    searchProjects
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
} 