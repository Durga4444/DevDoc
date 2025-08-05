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

  const shareViaLinkedIn = () => {
    const url = encodeURIComponent(publicUrl)
    const title = encodeURIComponent(project.name)
    const summary = encodeURIComponent(project.description || '')
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`,
      '_blank'
    )
    setIsOpen(false)
  }

  const exportAsMarkdown = () => {
    const markdown = generateMarkdown(project)
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setIsOpen(false)
    showToastMessage('Project exported as Markdown!')
  }

  const exportAsJSON = () => {
    const json = JSON.stringify(project, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setIsOpen(false)
    showToastMessage('Project exported as JSON!')
  }

  const generateMarkdown = (project) => {
    let markdown = `# ${project.name}\n\n`
    
    if (project.description) {
      markdown += `${project.description}\n\n`
    }

    if (project.tags && project.tags.length > 0) {
      markdown += `**Tags:** ${project.tags.map(tag => `\`${tag}\``).join(', ')}\n\n`
    }

    if (project.notes) {
      markdown += `## Notes\n\n${project.notes}\n\n`
    }

    if (project.snippets && project.snippets.length > 0) {
      markdown += `## Code Snippets\n\n`
      project.snippets.forEach((snippet, index) => {
        markdown += `### ${snippet.title}\n\n`
        if (snippet.description) {
          markdown += `${snippet.description}\n\n`
        }
        markdown += `\`\`\`${snippet.language || ''}\n${snippet.code}\n\`\`\`\n\n`
      })
    }

    if (project.links && project.links.length > 0) {
      markdown += `## Links\n\n`
      project.links.forEach(link => {
        markdown += `- [${link.title}](${link.url})`
        if (link.description) {
          markdown += ` - ${link.description}`
        }
        markdown += `\n`
      })
      markdown += `\n`
    }

    if (project.files && project.files.length > 0) {
      markdown += `## Files\n\n`
      project.files.forEach(file => {
        markdown += `- ${file.originalName || file.filename} (${(file.size / 1024).toFixed(1)} KB)\n`
      })
    }

    markdown += `\n---\n*Generated from DevDoc*`
    return markdown
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

              <button
                onClick={shareViaLinkedIn}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                <span className="flex-1 text-left">LinkedIn</span>
              </button>
            </div>

            <hr className="border-gray-200 dark:border-gray-600 my-2" />

            {/* Export Section */}
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
                Export
              </h4>
              
              <button
                onClick={exportAsMarkdown}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Download size={16} className="text-orange-500" />
                <span className="flex-1 text-left">Export as Markdown</span>
              </button>

              <button
                onClick={exportAsJSON}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Download size={16} className="text-yellow-500" />
                <span className="flex-1 text-left">Export as JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShareButton