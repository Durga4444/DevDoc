import { FolderOpen } from 'lucide-react'

const EmptyState = ({ title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4">
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-sm">
        <FolderOpen size={32} className="sm:w-10 sm:h-10 text-primary-600 dark:text-primary-400" />
      </div>
      
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center">
        {title}
      </h3>
      
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 text-center max-w-md mb-8 sm:mb-10 leading-relaxed">
        {description}
      </p>
      
      {action && (
        <div className="w-full sm:w-auto">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState 