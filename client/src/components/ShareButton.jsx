import { useState, useRef, useEffect } from 'react'
import { Share2, Copy, Mail, MessageSquare, Download, ExternalLink, Check, X } from 'lucide-react'

const ShareButton = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState('')
  const [showToast, setShowToast] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const showToastMessage = (message) => {
    setShowToast(message)
    setTimeout(() => setShowToast(false), 3000)
  }

  const publicUrl = `${window.location.origin}/public/${project._id}`
  const editUrl = window.location.href

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      showToastMessage(`${type} copied to clipboard!`)
      setTimeout(() => setCopied(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      showToastMessage('Failed to copy to clipboard')
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out my project: ${project.name}`)
    const body = encodeURIComponent(
      `I wanted to share my project "${project.name}" with you.\n\n` +
      `${project.description ? `Description: ${project.description}\n\n` : ''}` +
      `View it here: ${publicUrl}\n\n` +
      `Best regards!`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
    setIsOpen(false)
  }

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out my project "${project.name}": ${publicUrl}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
    setIsOpen(false)
  }

  const shareViaTwitter = () => {
    const text = encodeURIComponent(
      `Check out my project: "${project.name}" ${publicUrl}`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
    setIsOpen(false)
  }




  const useNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.name,
          text: project.description || `Check out my project: ${project.name}`,
          url: publicUrl
        })
        setIsOpen(false)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <Check size={16} />
          {showToast}
        </div>
      )}

      {/* Share Button */}
      <button
        className="btn-secondary flex items-center gap-2 relative"
        onClick={() => setIsOpen(!isOpen)}
        title="Share project"
      >
        <Share2 size={16} />
        Share
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-2">
            {/* Copy Links Section */}
            <div className="space-y-1 mb-3">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
                Copy Links
              </h4>
              
              <button
                onClick={() => copyToClipboard(publicUrl, 'Public link')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ExternalLink size={16} className="text-blue-500" />
                <span className="flex-1 text-left">Public View Link</span>
                {copied === 'Public link' ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} className="text-gray-400" />
                )}
              </button>

              <button
                onClick={() => copyToClipboard(editUrl, 'Edit link')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Copy size={16} className="text-purple-500" />
                <span className="flex-1 text-left">Edit Link</span>
                {copied === 'Edit link' ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} className="text-gray-400" />
                )}
              </button>
            </div>

            <hr className="border-gray-200 dark:border-gray-600 my-2" />

            {/* Social Sharing Section */}
            <div className="space-y-1 mb-3">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
                Share Via
              </h4>

              {/* Native Share (if supported) */}
              {navigator.share && (
                <button
                  onClick={useNativeShare}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Share2 size={16} className="text-blue-500" />
                  <span className="flex-1 text-left">Native Share</span>
                </button>
              )}
              
              <button
                onClick={shareViaEmail}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Mail size={16} className="text-red-500" />
                <span className="flex-1 text-left">Email</span>
              </button>

              <button
                onClick={shareViaWhatsApp}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MessageSquare size={16} className="text-green-500" />
                <span className="flex-1 text-left">WhatsApp</span>
              </button>

              <button
                onClick={shareViaTwitter}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <span className="flex-1 text-left">Twitter</span>
              </button>


            </div>

            <hr className="border-gray-200 dark:border-gray-600 my-2" />          
          </div>
        </div>
      )}
    </div>
  )
}

export default ShareButton