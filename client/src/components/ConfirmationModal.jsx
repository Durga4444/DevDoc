import { Fragment } from 'react'
import { X } from 'lucide-react'

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  confirmVariant = 'primary'
}) => {
  if (!isOpen) return null

  const getButtonClasses = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'btn-danger'
      case 'secondary':
        return 'btn-secondary'
      default:
        return 'btn-primary'
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="mt-2">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 dark:bg-gray-700 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="btn-secondary order-2 sm:order-1 flex-1 sm:flex-none"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`${getButtonClasses()} order-1 sm:order-2 flex-1 sm:flex-none`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal 