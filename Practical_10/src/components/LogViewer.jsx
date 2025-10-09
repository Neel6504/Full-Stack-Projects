function LogViewer({ file, content, loading, searchResults }) {
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm) return text
    
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} style={{ backgroundColor: '#ffeb3b', padding: '0 2px' }}>{part}</mark> : 
        part
    )
  }

  if (loading) {
    return (
      <div className="log-viewer loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading log content...</p>
        </div>
        <style jsx>{`
          .log-viewer.loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 300px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          .loading-spinner {
            text-align: center;
            color: #666;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!file) {
    return (
      <div className="log-viewer empty">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No log file selected</h3>
          <p>Choose a log file from the list to view its contents</p>
        </div>
        <style jsx>{`
          .log-viewer.empty {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          .empty-state {
            text-align: center;
            color: #666;
          }
          .empty-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          .empty-state h3 {
            color: #333;
            margin-bottom: 0.5rem;
          }
        `}</style>
      </div>
    )
  }

  const displayContent = searchResults ? (
    <div className="search-results">
      <div className="search-summary">
        <h4>🔍 Search Results for "{searchResults.searchTerm}"</h4>
        <p>{searchResults.totalMatches} matches found</p>
      </div>
      {searchResults.matches.map((match, index) => (
        <div key={index} className="search-match">
          <div className="line-number">Line {match.number}</div>
          <div className="match-content">
            {highlightSearchTerm(match.line, searchResults.searchTerm)}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <pre className="log-content">{content}</pre>
  )

  return (
    <div className="log-viewer">
      <div className="log-header">
        <div className="file-title">
          <h2>📄 {file.filename || file.name}</h2>
          <div className="file-stats">
            <span>Size: {formatFileSize(file.size)}</span>
            <span>Lines: {file.lines || content.split('\n').length}</span>
            <span>Modified: {formatDate(file.modified)}</span>
          </div>
        </div>
      </div>
      
      <div className="log-body">
        {displayContent}
      </div>

      <style jsx>{`
        .log-viewer {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }

        .log-header {
          padding: 1.5rem;
          border-bottom: 2px solid #f0f0f0;
          background: #f8f9fa;
          text-align: center;
        }

        .file-title h2 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 1.5rem;
          text-align: center;
        }

        .file-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.9rem;
          color: #666;
          justify-content: center;
          align-items: center;
        }

        .file-stats span {
          background: #e9ecef;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-weight: 500;
        }

        .log-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .log-content {
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
          color: #333;
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .search-results {
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        }

        .search-summary {
          background: #e8f4f8;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 4px solid #667eea;
        }

        .search-summary h4 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .search-summary p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .search-match {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          overflow: hidden;
        }

        .line-number {
          background: #667eea;
          color: white;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .match-content {
          padding: 1rem;
          font-size: 0.9rem;
          line-height: 1.5;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  )
}

export default LogViewer