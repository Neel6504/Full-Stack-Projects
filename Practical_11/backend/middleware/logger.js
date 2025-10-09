// Custom logging middleware example
// This is a template for your team to expand upon

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom request logger
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  
  const logEntry = `${timestamp} - ${method} ${url} - IP: ${ip}\n`;
  
  // Log to console
  console.log(`📝 ${logEntry.trim()}`);
  
  // Optional: Log to file (uncomment if needed)
  // const logPath = path.join(__dirname, '..', 'logs', 'access.log');
  // fs.appendFileSync(logPath, logEntry);
  
  next();
};

// Request timing middleware
export const requestTimer = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`⏱️  ${req.method} ${req.originalUrl} - ${duration}ms`);
  });
  
  next();
};

// Rate limiting example (basic)
export const rateLimiter = (limit = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old requests
    for (const [key, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    }
    
    // Count current IP requests
    const ipRequests = Array.from(requests.entries())
      .filter(([key]) => key.startsWith(ip))
      .length;
    
    if (ipRequests >= limit) {
      return res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again later.`
      });
    }
    
    // Add current request
    requests.set(`${ip}-${now}`, now);
    next();
  };
};