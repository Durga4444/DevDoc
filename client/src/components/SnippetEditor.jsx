import { useState, useEffect } from 'react'
import { Plus, X, Edit, Save, Trash2, Code } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-sql'
import 'prismjs/themes/prism.css'
import { useProjects } from '../contexts/ProjectContext'

const SnippetEditor = ({ project, onProjectUpdate }) => {
  const { addSnippet, updateSnippet, deleteSnippet } = useProjects()
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', code: '', language: 'javascript' })
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Prism.highlightAll()
  }, [project.snippets, editingId])

  const handleEdit = (snippet) => {
    setEditingId(snippet._id)
    setForm({ title: snippet.title, code: snippet.code, language: snippet.language || 'javascript' })
  }

  const handleSave = async (snippetId) => {
    setLoading(true)
    try {
      const updated = await updateSnippet(project._id, snippetId, form)
      onProjectUpdate && onProjectUpdate({ ...project, snippets: project.snippets.map(s => s._id === snippetId ? updated : s) })
      setEditingId(null)
      setForm({ title: '', code: '', language: 'javascript' })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!form.title.trim() || !form.code.trim()) return
    setLoading(true)
    try {
      const newSnippet = await addSnippet(project._id, form)
      onProjectUpdate && onProjectUpdate({ ...project, snippets: [...project.snippets, newSnippet] })
      setForm({ title: '', code: '', language: 'javascript' })
      setAdding(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (snippetId) => {
    setLoading(true)
    try {
      await deleteSnippet(project._id, snippetId)
      onProjectUpdate && onProjectUpdate({ ...project, snippets: project.snippets.filter(s => s._id !== snippetId) })
    } finally {
      setLoading(false)
    }
  }

  const highlightCode = (code, language) => {
    try {
      return Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language)
    } catch (error) {
      return code
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Code Snippets</h3>
        <button className="btn-primary flex items-center" onClick={() => setAdding(!adding)}>
          <Plus size={16} className="mr-2" />
          Add Snippet
        </button>
      </div>
      {adding && (
        <div className="card p-4 mb-4">
          <div className="mb-2">
            <input
              className="input mb-2"
              placeholder="Snippet Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            <input
              className="input mb-2"
              placeholder="Language (e.g. javascript, python)"
              value={form.language}
              onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
            />
            <textarea
              className="input font-mono text-sm mb-2"
              placeholder="Paste your code here..."
              rows={6}
              value={form.code}
              onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
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
        {project.snippets && project.snippets.length > 0 ? project.snippets.map(snippet => (
          <div key={snippet._id} className="card p-4 relative">
            {editingId === snippet._id ? (
              <div>
                <input
                  className="input mb-2"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
                <input
                  className="input mb-2"
                  value={form.language}
                  onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                />
                <textarea
                  className="input font-mono text-sm mb-2"
                  rows={6}
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                />
                <div className="flex gap-2">
                  <button className="btn-primary" onClick={() => handleSave(snippet._id)} disabled={loading}>
                    <Save size={16} className="mr-2" />Save
                  </button>
                  <button className="btn-secondary" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <Code size={16} className="mr-2" />{snippet.title}
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-secondary" onClick={() => handleEdit(snippet)}>
                      <Edit size={14} />
                    </button>
                    <button className="btn-danger" onClick={() => handleDelete(snippet._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">{snippet.language}</div>
                <pre className="rounded-lg p-4 overflow-x-auto text-sm bg-gray-100 dark:bg-gray-800">
                  <code 
                    className={`language-${snippet.language || 'javascript'}`}
                    dangerouslySetInnerHTML={{ 
                      __html: highlightCode(snippet.code, snippet.language || 'javascript') 
                    }}
                  />
                </pre>
              </div>
            )}
          </div>
        )) : (
          <div className="text-gray-500 dark:text-gray-400 italic">No snippets yet.</div>
        )}
      </div>
    </div>
  )
}

export default SnippetEditor 