import { useState } from 'react'

function LogFileList({ files, selectedFile, onFileSelect, loading, onRefresh }) {
  const [sortBy, setSortBy] = useState('name')

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const sortedFiles = [...files].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'size':
        return b.size - a.size
      case 'modified':
        return new Date(b.modified) - new Date(a.modified)
      default:
        return 0
    }
  })

  return (
    <div className="log-file-list">
      <div className="list-header">
        <h2>📁 Log Files ({files.length})</h2>
        <button 
          onClick={onRefresh} 
          disabled={loading}
          className="refresh-btn"
          title="Refresh file list"
        >
          🔄 {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="sort-controls">
        <label>
          Sort by:
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="modified">Modified</option>
          </select>
        </label>
      </div>

      {files.length === 0 ? (
        <div className="no-files">
          {loading ? (
            <p>🔄 Loading files...</p>
          ) : (
            <p>📭 No log files found</p>
          )}
        </div>
      ) : (
        <ul className="file-list">
          {sortedFiles.map((file) => (
            <li key={file.name}>
              <button
                className={`file-item ${
                  selectedFile === file.name ? 'selected' : ''
                }`}
                onClick={() => onFileSelect(file.name)}
                disabled={loading}
              >
                <div className="file-info">
                  <div className="file-name">
                    📄 {file.name}
                  </div>
                  <div className="file-meta">
                    <span className="file-size">{formatFileSize(file.size)}</span>
                    <span className="file-date">{formatDate(file.modified)}</span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .log-file-list {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f0f0f0;
          text-align: center;
        }

        .list-header h2 {
          font-size: 1.2rem;
          color: #333;
          margin: 0;
          text-align: center;
          flex: 1;
        }

        .refresh-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .refresh-btn:hover:not(:disabled) {
          background: #5a6fd8;
        }

        .refresh-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .sort-controls {
          margin-bottom: 1rem;
        }

        .sort-controls label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }

        .sort-select {
          padding: 0.25rem 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .file-list {
          list-style: none;
          padding: 0;
          margin: 0;
          flex: 1;
          overflow-y: auto;
        }

        .file-list li {
          margin-bottom: 0.5rem;
        }

        .file-item {
          width: 100%;
          text-align: center;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .file-item:hover:not(:disabled) {
          background: #e9ecef;
          border-color: #667eea;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .file-item.selected {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .file-item:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .file-info {
          width: 100%;
        }

        .file-name {
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .file-meta {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .file-item.selected .file-meta {
          opacity: 0.9;
        }

        .no-files {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 2rem;
        }
      `}</style>
    </div>
  )
}

export default LogFileList