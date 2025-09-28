import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import logRoutes from './routes/logRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from logs directory
app.use('/logs', express.static(path.join(__dirname, 'logs')));

// Routes
app.use('/api', logRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Error Log Viewer API Server Running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Logs directory: ${path.join(__dirname, 'logs')}`);
});