import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { FolderOpen, FileText, Code, Link as LinkIcon, Download, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

const PublicProject = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notesExpanded, setNotesExpanded] = useState(false);

  useEffect(() => {
    api.get(`/projects/public/${projectId}`)
      .then(res => setProject(res.data))
      .catch(() => setError('Project not found'))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!project) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FolderOpen size={22} className="text-primary-500" />
          {project.name}
        </h1>
      </div>
      {project.description && (
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">{project.description}</p>
      )}
      {project.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mb-8">
        <h2 className="text-lg font-semibold  dark:text-white mb-2 flex items-center gap-2">
          <FileText size={18} /> Notes
        </h2>
        <div
          className={`markdown border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-all duration-200 cursor-pointer break-words whitespace-pre-line ${notesExpanded ? 'max-h-[60vh] overflow-y-auto' : 'line-clamp-3 overflow-hidden'}`}
          aria-label={notesExpanded ? 'Collapse notes' : 'Expand notes'}
          tabIndex={0}
          onClick={() => setNotesExpanded((v) => !v)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setNotesExpanded(v => !v) }}
        >
          <ReactMarkdown>{project.notes}</ReactMarkdown>
          {!notesExpanded && (
            <div className="mt-2 text-xs text-primary-500 font-semibold select-none">Show more...</div>
          )}
          {notesExpanded && (
            <div className="mt-2 text-xs text-primary-500 font-semibold select-none">Show less</div>
          )}
        </div>
      </div>
      {project.snippets?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Code size={18} /> Code Snippets
          </h2>
          <ul className="space-y-4">
            {project.snippets.map(snippet => (
              <li key={snippet._id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="mb-2 font-semibold text-primary-700 dark:text-primary-300">{snippet.title}</div>
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto text-sm mb-2"><code>{snippet.code}</code></pre>
                <div className="text-xs text-gray-500">Language: {snippet.language}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {project.links?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <LinkIcon size={18} /> Links
          </h2>
          <ul className="space-y-2">
            {project.links.map(link => (
              <li key={link._id}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {project.files?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Download size={18} /> Files
          </h2>
          <ul className="space-y-2">
            {project.files.map(file => (
              <li key={file._id}>
                <a href={file.path} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">
                  {file.originalName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PublicProject; 