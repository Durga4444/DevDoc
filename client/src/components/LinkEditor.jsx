import { useState } from 'react'
import { Plus, Edit, Save, Trash2, ExternalLink } from 'lucide-react'
import { useProjects } from '../contexts/ProjectContext'

const LinkEditor = ({ project, onProjectUpdate }) => {
  const { addLink, updateLink, deleteLink } = useProjects()
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', url: '' })
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEdit = (link) => {
    setEditingId(link._id)
    setForm({ title: link.title, url: link.url })
  }

  const handleSave = async (linkId) => {
    setLoading(true)
    try {
      const updated = await updateLink(project._id, linkId, form)
      onProjectUpdate && onProjectUpdate({ ...project, links: project.links.map(l => l._id === linkId ? updated : l) })
      setEditingId(null)
      setForm({ title: '', url: '' })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!form.title.trim() || !form.url.trim()) return
    setLoading(true)
    try {
      const newLink = await addLink(project._id, form)
      onProjectUpdate && onProjectUpdate({ ...project, links: [...project.links, newLink] })
      setForm({ title: '', url: '' })
      setAdding(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (linkId) => {
    setLoading(true)
    try {
      await deleteLink(project._id, linkId)
      onProjectUpdate && onProjectUpdate({ ...project, links: project.links.filter(l => l._id !== linkId) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project Links</h3>
        <button className="btn-primary flex items-center" onClick={() => setAdding(!adding)}>
          <Plus size={16} className="mr-2" />
          Add Link
        </button>
      </div>
      {adding && (
        <div className="card p-4 mb-4">
          <div className="mb-2">
            <input
              className="input mb-2"
              placeholder="Link Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            <input
              className="input mb-2"
              placeholder="https://example.com"
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={handleAdd} disabled={loading}>
              <Save size={16} className="mr-2" />Save
            </button>
            <button className="btn-secondary" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {project.links && project.links.length > 0 ? project.links.map(link => (
          <div key={link._id} className="card p-4 relative">
            {editingId === link._id ? (
              <div>
                <input
                  className="input mb-2"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
                <input
                  className="input mb-2"
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                />
                <div className="flex gap-2">
                  <button className="btn-primary" onClick={() => handleSave(link._id)} disabled={loading}>
                    <Save size={16} className="mr-2" />Save
                  </button>
                  <button className="btn-secondary" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-700 dark:text-primary-300 flex items-center">
                    <ExternalLink size={16} className="mr-2" />{link.title}
                  </a>
                  <div className="text-xs text-gray-500 dark:text-gray-400 break-all">{link.url}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary" onClick={() => handleEdit(link)}>
                    <Edit size={14} />
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(link._id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="text-gray-500 dark:text-gray-400 italic">No links yet.</div>
        )}
      </div>
    </div>
  )
}

export default LinkEditor 