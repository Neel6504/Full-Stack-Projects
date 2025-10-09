import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Path to logs directory
const logsDirectory = path.join(__dirname, '..', 'logs');

// Get list of all log files
router.get('/logs', async (req, res) => {
  try {
    const files = await fs.promises.readdir(logsDirectory);
    const logFiles = files.filter(file => file.endsWith('.txt') || file.endsWith('.log'));
    
    // Get file stats for each log file
    const fileDetails = await Promise.all(
      logFiles.map(async (file) => {
        const filePath = path.join(logsDirectory, file);
        const stats = await fs.promises.stat(filePath);
        return {
          name: file,
          size: stats.size,
          modified: stats.mtime,
          created: stats.birthtime
        };
      })
    );

    res.json({
      success: true,
      files: fileDetails
    });
  } catch (error) {
    console.error('Error reading logs directory:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to read logs directory',
      message: error.message
    });
  }
});

// Get content of a specific log file
router.get('/logs/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(logsDirectory, filename);

    // Security check: ensure the file is within the logs directory
    const resolvedPath = path.resolve(filePath);
    const resolvedLogsDir = path.resolve(logsDirectory);
    
    if (!resolvedPath.startsWith(resolvedLogsDir)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'File access outside logs directory is not allowed'
      });
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
        message: `Log file '${filename}' does not exist`
      });
    }

    // Read file content
    const content = await fs.promises.readFile(filePath, 'utf8');
    const stats = await fs.promises.stat(filePath);

    res.json({
      success: true,
      filename: filename,
      content: content,
      size: stats.size,
      modified: stats.mtime,
      lines: content.split('\n').length
    });

  } catch (error) {
    console.error('Error reading log file:', error);
    
    if (error.code === 'ENOENT') {
      res.status(404).json({
        success: false,
        error: 'File not found',
        message: `Log file '${req.params.filename}' does not exist`
      });
    } else if (error.code === 'EACCES') {
      res.status(403).json({
        success: false,
        error: 'Access denied',
        message: `Permission denied to read file '${req.params.filename}'`
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Unable to read log file',
        message: error.message
      });
    }
  }
});

// Search within log files
router.get('/logs/:filename/search', async (req, res) => {
  try {
    const filename = req.params.filename;
    const searchTerm = req.query.q;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        error: 'Search term required',
        message: 'Please provide a search term using ?q=searchterm'
      });
    }

    const filePath = path.join(logsDirectory, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
        message: `Log file '${filename}' does not exist`
      });
    }

    const content = await fs.promises.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    
    const matches = lines
      .map((line, index) => ({ line, number: index + 1 }))
      .filter(({ line }) => line.toLowerCase().includes(searchTerm.toLowerCase()));

    res.json({
      success: true,
      filename: filename,
      searchTerm: searchTerm,
      matches: matches,
      totalMatches: matches.length
    });

  } catch (error) {
    console.error('Error searching log file:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
});

export default router;