import { useState } from 'react'
import './App.css'

function App() {
  const [num1, setNum1] = useState('')
  const [num2, setNum2] = useState('')
  const [operation, setOperation] = useState('add')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCalculate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('http://localhost:3004/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num1: parseFloat(num1),
          num2: parseFloat(num2),
          operation
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(data.result)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure the backend is running on port 3004.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setNum1('')
    setNum2('')
    setOperation('add')
    setResult(null)
    setError('')
  }

  const getOperationSymbol = () => {
    switch(operation) {
      case 'add': return '+'
      case 'subtract': return '−'
      case 'multiply': return '×'
      case 'divide': return '÷'
      default: return '+'
    }
  }

  const getOperationEmoji = () => {
    switch(operation) {
      case 'add': return '➕'
      case 'subtract': return '➖'
      case 'multiply': return '✖️'
      case 'divide': return '➗'
      default: return '➕'
    }
  }

  return (
    <div className="kids-calculator">
      <div className="calculator-container">
        <header className="calculator-header">
          <h1>🧮 Kids Calculator</h1>
          <p>Let's have fun with math! 🎉</p>
        </header>

        <form onSubmit={handleCalculate} className="calculator-form">
          <div className="input-group">
            <label htmlFor="num1">First Number:</label>
            <input
              type="number"
              id="num1"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              placeholder="Enter first number"
              required
              min="0"
              max="1000"
              step="0.01"
            />
          </div>

          <div className="operation-group">
            <label>Choose Operation:</label>
            <div className="operation-buttons">
              {[
                { value: 'add', label: 'Add ➕', emoji: '🟢' },
                { value: 'subtract', label: 'Subtract ➖', emoji: '🔵' },
                { value: 'multiply', label: 'Multiply ✖️', emoji: '🟡' },
                { value: 'divide', label: 'Divide ➗', emoji: '🔴' }
              ].map(op => (
                <button
                  key={op.value}
                  type="button"
                  className={`operation-btn ${operation === op.value ? 'active' : ''}`}
                  onClick={() => setOperation(op.value)}
                >
                  <span className="emoji">{op.emoji}</span>
                  <span className="label">{op.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="num2">Second Number:</label>
            <input
              type="number"
              id="num2"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              placeholder="Enter second number"
              required
              min="0"
              max="1000"
              step="0.01"
            />
          </div>

          {num1 && num2 && (
            <div className="preview">
              <span className="preview-text">
                {num1} {getOperationSymbol()} {num2} = ?
              </span>
            </div>
          )}

          <div className="button-group">
            <button 
              type="submit" 
              className="calculate-btn"
              disabled={loading || !num1 || !num2}
            >
              {loading ? 'Calculating... 🤔' : `Calculate ${getOperationEmoji()}`}
            </button>
            <button 
              type="button" 
              onClick={handleReset}
              className="reset-btn"
            >
              Reset 🔄
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <span className="error-emoji">😕</span>
            <p>{error}</p>
          </div>
        )}

        {result !== null && (
          <div className="result-container">
            <div className="result-header">
              <span className="success-emoji">🎉</span>
              <h2>Great job! Here's your answer:</h2>
            </div>
            <div className="result-display">
              <span className="equation">
                {num1} {getOperationSymbol()} {num2} = 
              </span>
              <span className="result-value">{result}</span>
            </div>
            <div className="celebration">
              <span>🌟 You're a math star! 🌟</span>
            </div>
          </div>
        )}

        <footer className="calculator-footer">
          <p>🎯 Practice makes perfect! Keep calculating! 🚀</p>
        </footer>
      </div>
    </div>
  )
}

export default App
