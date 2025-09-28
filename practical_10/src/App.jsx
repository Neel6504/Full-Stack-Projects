import { useState, useEffect } from 'react'
import LogFileList from './components/LogFileList'
import LogViewer from './components/LogViewer'
import SearchBar from './components/SearchBar'
import './App.css'

const API_BASE_URL = 'http://localhost:3001/api'

function App() {
  const [logFiles, setLogFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [logContent, setLogContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchResults, setSearchResults] = useState(null)

  // Fetch list of log files on component mount
  useEffect(() => {
    fetchLogFiles()
  }, [])

  const fetchLogFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/logs`)
      const data = await response.json()
      
      if (data.success) {
        setLogFiles(data.files)
        setError('')
      } else {
        setError(data.error || 'Failed to fetch log files')
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure the backend is running on port 3001.')
    } finally {
      setLoading(false)
    }
  }

  const fetchLogContent = async (filename) => {
    try {
      setLoading(true)
      setSearchResults(null)
      const response = await fetch(`${API_BASE_URL}/logs/${filename}`)
      const data = await response.json()
      
      if (data.success) {
        setLogContent(data.content)
        setSelectedFile({
          ...data,
          name: filename
        })
        setError('')
      } else {
        setError(data.error || 'Failed to fetch log content')
        setLogContent('')
      }
    } catch (err) {
      setError('Failed to fetch log content')
      setLogContent('')
    } finally {
      setLoading(false)
    }
  }

  const searchInFile = async (filename, searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults(null)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/logs/${filename}/search?q=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data)
        setError('')
      } else {
        setError(data.error || 'Search failed')
        setSearchResults(null)
      }
    } catch (err) {
      setError('Search failed')
      setSearchResults(null)
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchResults(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔍 Error Log Viewer</h1>
        <p>View and search company error logs</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
            <button onClick={() => setError('')} className="error-close">×</button>
          </div>
        )}

        <div className="app-content">
          <aside className="sidebar">
            <LogFileList 
              files={logFiles}
              selectedFile={selectedFile?.name}
              onFileSelect={fetchLogContent}
              loading={loading}
              onRefresh={fetchLogFiles}
            />
          </aside>

          <section className="main-content">
            {selectedFile && (
              <SearchBar 
                filename={selectedFile.name}
                onSearch={searchInFile}
                onClear={clearSearch}
                searchResults={searchResults}
              />
            )}
            
            <LogViewer 
              file={selectedFile}
              content={logContent}
              loading={loading}
              searchResults={searchResults}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
