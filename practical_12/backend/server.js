import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper function to validate numbers
const isValidNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
};

// Helper function to perform calculations
const calculate = (num1, num2, operation) => {
  const a = parseFloat(num1);
  const b = parseFloat(num2);
  
  switch (operation) {
    case 'add':
      return a + b;
    case 'subtract':
      return a - b;
    case 'multiply':
      return a * b;
    case 'divide':
      if (b === 0) {
        throw new Error('Cannot divide by zero! 🚫');
      }
      return a / b;
    default:
      throw new Error('Invalid operation');
  }
};

// Routes

// Home page - Calculator form
app.get('/', (req, res) => {
  res.render('calculator', {
    result: null,
    error: null,
    num1: '',
    num2: '',
    operation: 'add'
  });
});

// Handle calculator form submission
app.post('/calculate', (req, res) => {
  const { num1, num2, operation } = req.body;
  
  let result = null;
  let error = null;
  
  try {
    // Validate inputs
    if (!num1 || !num2) {
      throw new Error('Please enter both numbers! 📝');
    }
    
    if (!isValidNumber(num1)) {
      throw new Error(`"${num1}" is not a valid number! Please use only numbers. 🔢`);
    }
    
    if (!isValidNumber(num2)) {
      throw new Error(`"${num2}" is not a valid number! Please use only numbers. 🔢`);
    }
    
    // Perform calculation
    result = calculate(num1, num2, operation);
    
    // Round result to 2 decimal places if needed
    result = Math.round(result * 100) / 100;
    
  } catch (err) {
    error = err.message;
  }
  
  res.render('calculator', {
    result,
    error,
    num1: num1 || '',
    num2: num2 || '',
    operation: operation || 'add'
  });
});

// API endpoint for JSON responses
app.post('/api/calculate', (req, res) => {
  const { num1, num2, operation } = req.body;
  
  try {
    if (!num1 || !num2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both numbers'
      });
    }
    
    if (!isValidNumber(num1) || !isValidNumber(num2)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide valid numbers only'
      });
    }
    
    const result = calculate(num1, num2, operation);
    
    res.json({
      success: true,
      result: Math.round(result * 100) / 100,
      calculation: `${num1} ${getOperationSymbol(operation)} ${num2} = ${Math.round(result * 100) / 100}`
    });
    
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// Helper function to get operation symbol
const getOperationSymbol = (operation) => {
  const symbols = {
    'add': '+',
    'subtract': '-',
    'multiply': '×',
    'divide': '÷'
  };
  return symbols[operation] || '?';
};

// 404 handler
app.use('*', (req, res) => {
  res.status(404).send(`
    <h1>404 - Page Not Found</h1>
    <p>Oops! The page you're looking for doesn't exist.</p>
    <a href="/">Go back to Calculator</a>
  `);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🧮 Kids Calculator Server running on port ${PORT}`);
  console.log(`🌟 Open http://localhost:${PORT} to use the calculator!`);
  console.log(`🔢 API endpoint: http://localhost:${PORT}/api/calculate`);
});