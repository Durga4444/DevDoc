import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Filter } from 'lucide-react'
import { useProjects } from '../contexts/ProjectContext'
import ProjectCard from '../components/ProjectCard'
import EmptyState from '../components/EmptyState'
import { Button } from '../components/ui/button'

const Dashboard = () => {
  const { projects, loading, searchQuery } = useProjects()
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterTags, setFilterTags] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Get all unique tags from projects
  const allTags = [...new Set(projects.flatMap(project => project.tags))].sort()

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      if (filterTags.length === 0) return true
      return filterTags.some(tag => project.tags.includes(tag))
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'updatedAt' || sortBy === 'createdAt') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleTagFilter = (tag) => {
    setFilterTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setFilterTags([])
    setSortBy('updatedAt')
    setSortOrder('desc')
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-12 bg-gradient-to-br from-indigo-200/60 via-white/80 to-blue-100/60 dark:from-gray-900/60 dark:via-gray-950/90 dark:to-gray-900/80 min-h-screen">
      {/* Header */}
      <div className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-10">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight drop-shadow-lg">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'My Projects'}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              {searchQuery && ` found for "${searchQuery}"`}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button asChild size="lg" className="text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-200 rounded-full px-10 py-4">
              <Link to="/create">
                <Plus size={24} className="mr-3" />
                Create Project
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-14">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-7 py-3 rounded-2xl text-lg font-bold transition-all duration-200 shadow-md ${
              showFilters 
                ? 'bg-primary-100/80 text-primary-700 dark:bg-primary-900/80 dark:text-primary-300 ring-2 ring-primary-200 dark:ring-primary-800'
                : 'bg-white/80 text-gray-700 hover:bg-primary-50/80 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-800/80'
            }`}
          >
            <Filter size={22} className="mr-3" />
            Filters
            {(filterTags.length > 0 || sortBy !== 'updatedAt' || sortOrder !== 'desc') && (
              <span className="ml-3 bg-primary-500 text-white text-sm rounded-full px-3 py-0.5">
                {filterTags.length + (sortBy !== 'updatedAt' ? 1 : 0) + (sortOrder !== 'desc' ? 1 : 0)}
              </span>
            )}
          </button>

          {(filterTags.length > 0 || sortBy !== 'updatedAt' || sortOrder !== 'desc') && (
            <button
              onClick={clearFilters}
              className="text-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-7 p-10 bg-white/80 dark:bg-gray-900/80 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Sort Options */}
              <div>
                <label className="block text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
                  Sort by
                </label>
                <div className="flex flex-col sm:flex-row gap-6">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input text-lg"
                  >
                    <option value="updatedAt">Last Updated</option>
                    <option value="createdAt">Created Date</option>
                    <option value="name">Name</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="input text-lg"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>

              {/* Tag Filters */}
              <div>
                <label className="block text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
                  Filter by tags
                </label>
                <div className="flex flex-wrap gap-3">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagFilter(tag)}
                      className={`px-5 py-2 rounded-full text-base font-bold transition-all duration-200 shadow ${
                        filterTags.includes(tag)
                          ? 'bg-primary-100/80 text-primary-700 dark:bg-primary-900/80 dark:text-primary-300 ring-2 ring-primary-200 dark:ring-primary-800'
                          : 'bg-white/80 text-gray-700 hover:bg-primary-50/80 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-800/80'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState 
          title={searchQuery ? "No projects found" : "No projects yet"}
          description={searchQuery 
            ? `No projects match your search for "${searchQuery}"`
            : "Get started by creating your first project"}
          action={
            <Button asChild size="lg" className="text-lg font-bold rounded-full px-10 py-4">
              <Link to="/create">
                <Plus size={24} className="mr-3" />
                Create Project
              </Link>
            </Button>
          }
        />
      )}
    </div>
  )
}

export default Dashboard 