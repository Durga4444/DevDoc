import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { ProjectProvider } from './contexts/ProjectContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProjectView from './pages/ProjectView'
import CreateProject from './pages/CreateProject'
import PublicProject from './pages/PublicProject'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Project Vault...</p>
        </div>
      </div>
    )
  }

  return (
    <DarkModeProvider>
      <ProjectProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="create" element={<CreateProject />} />
              <Route path="project/:id" element={<ProjectView />} />
            </Route>
            <Route path="/public/:projectId" element={<PublicProject />} />
          </Routes>
        </div>
      </ProjectProvider>
    </DarkModeProvider>
  )
}

export default App 