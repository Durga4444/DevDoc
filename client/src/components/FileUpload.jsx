import { useState } from 'react'
import { Download, Trash2, FileText, UploadCloud, Plus } from 'lucide-react'

const FileUpload = ({ project, onProjectUpdate }) => {
  const [uploading, setUploading] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)

  // Mock functions - replace with your actual useProjects hooks
  const uploadFile = async (projectId, file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          _id: Date.now().toString(),
          originalName: file.name,
          filename: file.name,
          size: file.size,
          path: `/uploads/${file.name}`,
        })
      }, 1000)
    })
  }

  const deleteFile = async (projectId, fileId) => {
    return new Promise((resolve) => {
      setTimeout(resolve, 500)
    })
  }

  const onDrop = async (acceptedFiles) => {
    console.log('Files dropped:', acceptedFiles)
    setUploading(true)
    const newFiles = []
    
    for (const file of acceptedFiles) {
      try {
        const uploaded = await uploadFile(project._id, file)
        newFiles.push(uploaded)
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }
    
    if (newFiles.length > 0 && onProjectUpdate) {
      onProjectUpdate({ 
        ...project, 
        files: [...(project.files || []), ...newFiles] 
      })
    }
    
    setUploading(false)
  }

  // Manual drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    onDrop(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    // Only set to false if we're leaving the dropzone completely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragActive(false)
    }
  }

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      onDrop(files)
    }
    // Reset the input so the same file can be selected again
    e.target.value = ''
  }

  const openFileDialog = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '*/*'
    input.onchange = handleFileInputChange
    input.click()
  }

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(project._id, fileId)
      if (onProjectUpdate) {
        onProjectUpdate({ 
          ...project, 
          files: (project.files || []).filter(f => f._id !== fileId) 
        })
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleDownload = (file) => {
    console.log('Downloading file:', file)
    console.log('File path:', file.path)
    
    // Try the download
    const downloadUrl = `http://localhost:5000${file.path}`
    console.log('Download URL:', downloadUrl)
    
    // Open in new tab for download
    window.open(downloadUrl, '_blank')
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <div 
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          tabIndex={0}
          aria-label="File upload area"
        >
          <UploadCloud size={32} className="mb-2 text-blue-500" />
          <p className="text-gray-700 font-medium">
            {isDragActive ? 'Drop files here!' : 'Drag & drop files here'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
          
          <button
            type="button"
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            onClick={openFileDialog}
          >
            <Plus size={16} /> Add File
          </button>
          
          {uploading && (
            <div className="mt-2 text-blue-500 font-semibold">Uploading...</div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {project.files && project.files.length > 0 ? (
          project.files.map(file => (
            <div 
              key={file._id || file.filename} 
              className="border rounded-lg p-4 flex items-center justify-between bg-white shadow-sm"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-blue-500" />
                <div>
                  <div className="font-medium text-gray-900">
                    {file.originalName || file.filename}
                  </div>
                  <div className="text-xs text-gray-500">
                    {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(file)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Download file"
                >
                  <Download size={16} />
                </button>
                <button 
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                  onClick={() => handleDelete(file._id)}
                  title="Delete file"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic text-center py-8">
            No files uploaded yet.
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUpload