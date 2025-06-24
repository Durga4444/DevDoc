import { Link } from 'react-router-dom'
import { Calendar, Tag, FileText, Code, Link as LinkIcon } from 'lucide-react'

const ProjectCard = ({ project }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  return (
    <Link
      to={`/project/${project._id}`}
      className="group block focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-3xl transition-all duration-200"
    >
      <div className="card p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-none rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors duration-200 drop-shadow-lg">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-base text-gray-600 dark:text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-primary-100/80 text-primary-700 dark:bg-primary-900/80 dark:text-primary-300 shadow ring-1 ring-primary-200 dark:ring-primary-800 group-hover:bg-primary-200 group-hover:text-primary-800 dark:group-hover:bg-primary-800 dark:group-hover:text-primary-100 transition-colors duration-200"
              >
                <Tag size={14} className="mr-2" />
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gray-100/80 text-gray-700 dark:bg-gray-700/80 dark:text-gray-300 shadow">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-base text-gray-500 dark:text-gray-400 pt-6 border-t border-gray-200 dark:border-gray-800 mt-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span className="font-bold">{project.notes ? '1' : '0'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Code size={16} />
              <span className="font-bold">{project.snippets?.length || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon size={16} />
              <span className="font-bold">{project.links?.length || 0}</span>
            </div>
          </div>
          <div className="flex items-center text-sm gap-2">
            <Calendar size={14} />
            <span className="hidden sm:inline">{formatDate(project.updatedAt)}</span>
            <span className="sm:hidden">{formatDate(project.updatedAt).split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard 