import { useState, useEffect } from 'react'
import './App.css'

const API_BASE_URL = 'http://localhost:3002'

function App() {
  const [dashboardData, setDashboardData] = useState(null)
  const [healthStatus, setHealthStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch dashboard data from Express backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${API_BASE_URL}/home`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setDashboardData(data.data)
    } catch (err) {
      setError(`Failed to connect to backend: ${err.message}`)
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Check backend health
  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`)
      if (response.ok) {
        const data = await response.json()
        setHealthStatus(data)
      }
    } catch (err) {
      console.error('Health check failed:', err)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData()
    checkHealth()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Team Dashboard</h1>
        <p>React Frontend + Express Backend</p>
        
        <div className="server-status">
          {healthStatus ? (
            <div className="status-indicator online">
              <span className="status-dot"></span>
              Backend Online - {healthStatus.status}
            </div>
          ) : (
            <div className="status-indicator offline">
              <span className="status-dot"></span>
              Backend Offline
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="error-section">
            <h2>❌ Connection Error</h2>
            <p>{error}</p>
            <div className="error-help">
              <h3>Troubleshooting:</h3>
              <ul>
                <li>Make sure Express server is running on port 3002</li>
                <li>Check if backend started properly: <code>npm start</code></li>
                <li>Verify backend URL: <a href={API_BASE_URL} target="_blank">{API_BASE_URL}</a></li>
              </ul>
              <button onClick={fetchDashboardData} className="retry-btn">
                🔄 Retry Connection
              </button>
            </div>
          </div>
        ) : dashboardData ? (
          <div className="dashboard-content">
            <section className="welcome-section">
              <div className="welcome-card">
                <h2>👋 {dashboardData.message}</h2>
                <p className="subtitle">{dashboardData.subtitle}</p>
                <p className="timestamp">Connected at: {dashboardData.timestamp}</p>
              </div>
            </section>

            <section className="features-section">
              <h3>✨ Backend Features:</h3>
              <div className="features-grid">
                {dashboardData.features.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <span className="feature-icon">✅</span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="next-steps-section">
              <h3>🚀 Next Development Steps:</h3>
              <div className="steps-grid">
                {dashboardData.nextSteps.map((step, index) => (
                  <div key={index} className="step-card">
                    <span className="step-number">{index + 1}</span>
                    <span className="step-text">{step}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="api-section">
              <h3>🔗 Available Endpoints:</h3>
              <div className="api-links">
                <a href={`${API_BASE_URL}/home`} target="_blank" className="api-link">
                  📄 Dashboard Data (JSON)
                </a>
                <a href={`${API_BASE_URL}/api/health`} target="_blank" className="api-link">
                  💚 Health Check
                </a>
              </div>
            </section>
          </div>
        ) : (
          <div className="no-data">
            <h2>📊 No Data Available</h2>
            <button onClick={fetchDashboardData} className="load-btn">
              Load Dashboard Data
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Full-Stack Template v1.0.0 | 
          Frontend: React + Vite | 
          Backend: Express.js
        </p>
      </footer>
    </div>
  )
}

export default App
