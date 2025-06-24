import { useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useProjects } from '../contexts/ProjectContext'
import { Download, Trash2, FileText, UploadCloud, Plus } from 'lucide-react'

const FileUpload = ({ project, onProjectUpdate }) => {
  const { uploadFile, deleteFile } = useProjects()
  const inputRef = useRef()
  const [uploading, setUploading] = useState(false)

  const onDrop = async (acceptedFiles) => {
    setUploading(true)
    for (const file of acceptedFiles) {
      const uploaded = await uploadFile(project._id, file)
      onProjectUpdate && onProjectUpdate({ ...project, files: [...project.files, uploaded] })
    }
    setUploading(false)
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ onDrop, noClick: true })

  const handleDelete = async (fileId) => {
    await deleteFile(project._id, fileId)
    onProjectUpdate && onProjectUpdate({ ...project, files: project.files.filter(f => f._id !== fileId) })
  }

  return (
    <div>
      <div className="mb-4">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ${isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}`}
          tabIndex={0}
          aria-label="File upload area"
        >
          <input {...getInputProps()} ref={inputRef} />
          <UploadCloud size={32} className="mb-2 text-primary-500" />
          <p className="text-gray-700 dark:text-gray-200 font-medium">Drag & drop files here</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max file size: 10MB</p>
          <button
            type="button"
            className="btn-secondary mt-4 flex items-center gap-2"
            onClick={open}
            tabIndex={-1}
          >
            <Plus size={16} /> Add File
          </button>
          {uploading && <div className="mt-2 text-primary-500 font-semibold">Uploading...</div>}
        </div>
      </div>
      <div className="space-y-4">
        {project.files && project.files.length > 0 ? project.files.map(file => (
          <div key={file._id || file.filename} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-primary-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{file.originalName || file.filename}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={file.path} download className="btn-secondary" target="_blank" rel="noopener noreferrer">
                <Download size={16} />
              </a>
              <button className="btn-danger" onClick={() => handleDelete(file._id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-gray-500 dark:text-gray-400 italic">No files uploaded yet.</div>
        )}
      </div>
    </div>
  )
}

export default FileUpload 