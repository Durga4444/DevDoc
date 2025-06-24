import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useProjects } from '../contexts/ProjectContext'
import { useDebounce } from '../hooks/useDebounce'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const { searchProjects, searchQuery } = useProjects()
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    searchProjects(debouncedQuery)
  }, [debouncedQuery, searchProjects])

  const handleClear = () => {
    setQuery('')
    searchProjects('')
  }

  return (
    <div className="relative w-full max-w-sm sm:max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects..."
        className="w-full pl-10 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

export default SearchBar 