import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, X, Moon, Sun, FolderOpen, LogOut } from 'lucide-react'
import { useDarkMode } from '../contexts/DarkModeContext'
import { useProjects } from '../contexts/ProjectContext'
import { useAuth } from '../contexts/AuthContext'
import SearchBar from './SearchBar'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isDark, toggleDarkMode } = useDarkMode()
  const { projects } = useProjects()
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const recentProjects = projects.slice(0, 5)

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-200/60 via-white/80 to-blue-100/60 dark:from-gray-900/80 dark:via-gray-950/90 dark:to-gray-900/80">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} lg:translate-x-0 bg-white/70 dark:bg-gray-900/70 shadow-2xl border-none backdrop-blur-xl ring-1 ring-primary-100 dark:ring-gray-800 m-4 rounded-3xl max-w-xs z-50 transition-all duration-300`}>
        <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl font-extrabold text-primary-700 dark:text-primary-300 tracking-tight drop-shadow-lg">
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">Project Vault</span>
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-3 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white/60 dark:bg-gray-800/60 shadow"
          >
            <X size={28} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="p-8 space-y-4">
            {/* Dashboard Link */}
            <Link
              to="/"
              className={`flex items-center px-5 py-3 rounded-2xl text-lg font-bold transition-colors shadow-md ${
                isActive('/')
                  ? 'bg-primary-100/80 text-primary-700 dark:bg-primary-900/80 dark:text-primary-300 ring-2 ring-primary-200 dark:ring-primary-800'
                  : 'text-gray-700 hover:bg-primary-50/80 dark:text-gray-300 dark:hover:bg-gray-800/80'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <FolderOpen size={22} className="mr-4" />
              Dashboard
            </Link>
            {/* Recent Projects */}
            {recentProjects.length > 0 && (
              <div className="mt-10">
                <h3 className="px-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Recent Projects
                </h3>
                <div className="space-y-3">
                  {recentProjects.map((project) => (
                    <Link
                      key={project._id}
                      to={`/project/${project._id}`}
                      className={`flex items-center px-5 py-2.5 rounded-xl text-base font-semibold transition-colors shadow ${
                        isActive(`/project/${project._id}`)
                          ? 'bg-primary-100/80 text-primary-700 dark:bg-primary-900/80 dark:text-primary-300 ring-2 ring-primary-200 dark:ring-primary-800'
                          : 'text-gray-700 hover:bg-primary-50/80 dark:text-gray-300 dark:hover:bg-gray-800/80'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-semibold">{project.name}</p>
                        {project.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-md">
          <div className="flex items-center justify-between px-12 py-6">
            <div className="flex items-center space-x-8 flex-1 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white/60 dark:bg-gray-800/60 shadow"
              >
                <Menu size={28} />
              </button>
              <div className="flex-1 min-w-0">
                <SearchBar />
              </div>
            </div>
            <div className="flex items-center space-x-6 ml-8">
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white/60 dark:bg-gray-800/60 shadow transition-colors"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={26} /> : <Moon size={26} />}
              </button>
              {user && (
                <button
                  onClick={logout}
                  className="p-3 rounded-xl text-gray-500 hover:text-red-600 dark:hover:text-red-400 bg-white/60 dark:bg-gray-800/60 shadow transition-colors"
                  title="Logout"
                >
                  <LogOut size={26} />
                </button>
              )}
            </div>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout 