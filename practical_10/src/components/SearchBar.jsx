import { useState } from 'react'

function SearchBar({ filename, onSearch, onClear, searchResults }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    
    setIsSearching(true)
    await onSearch(filename, searchTerm)
    setIsSearching(false)
  }

  const handleClear = () => {
    setSearchTerm('')
    onClear()
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Auto-clear search results when input is empty
    if (!value.trim() && searchResults) {
      onClear()
    }
  }

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={`Search in ${filename}...`}
            className="search-input"
            disabled={isSearching}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={!searchTerm.trim() || isSearching}
          >
            {isSearching ? '🔄' : '🔍'} 
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          {(searchResults || searchTerm) && (
            <button 
              type="button" 
              onClick={handleClear}
              className="clear-button"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </form>
      
      {searchResults && (
        <div className="search-info">
          <span className="search-status">
            Found {searchResults.totalMatches} matches for "{searchResults.searchTerm}"
          </span>
        </div>
      )}

      <style jsx>{`
        .search-bar {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin-bottom: 1rem;
          text-align: center;
        }

        .search-form {
          width: 100%;
        }

        .search-input-group {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          justify-content: center;
        }

        .search-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-input:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
        }

        .search-button {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
          white-space: nowrap;
        }

        .search-button:hover:not(:disabled) {
          background: #5a6fd8;
        }

        .search-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .clear-button {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clear-button:hover {
          background: #c82333;
        }

        .search-info {
          margin-top: 1rem;
          padding: 0.75rem;
          background: #e8f4f8;
          border-radius: 6px;
          border-left: 4px solid #667eea;
        }

        .search-status {
          color: #333;
          font-weight: 500;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  )
}

export default SearchBar