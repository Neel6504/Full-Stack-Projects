import express from 'express';

const router = express.Router();

// Home dashboard route
router.get('/home', (req, res) => {
  const welcomeData = {
    title: 'Welcome to Your Dashboard',
    message: 'Hello! Welcome to your new Express.js application.',
    subtitle: 'This is your team onboarding template',
    features: [
      'Express.js server with modern ES6+ syntax',
      'Security middleware (Helmet, CORS)',
      'Request logging with Morgan',
      'Environment configuration with dotenv',
      'Structured routing system',
      'Error handling middleware',
      'Static file serving',
      'Health check endpoint'
    ],
    nextSteps: [
      'Customize this dashboard for your team needs',
      'Add authentication and user management',
      'Integrate with your database of choice',
      'Add more API endpoints',
      'Implement your business logic'
    ],
    timestamp: new Date().toLocaleString()
  };

  // For API requests (JSON response)
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({
      success: true,
      data: welcomeData
    });
  }

  // For browser requests (HTML response)
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${welcomeData.title}</title>
        <link rel="stylesheet" href="/css/dashboard.css">
    </head>
    <body>
        <div class="container">
            <header class="header">
                <h1>🎉 ${welcomeData.title}</h1>
                <p class="subtitle">${welcomeData.subtitle}</p>
            </header>
            
            <main class="main-content">
                <section class="welcome-section">
                    <div class="welcome-card">
                        <h2>👋 ${welcomeData.message}</h2>
                        <p class="timestamp">Started at: ${welcomeData.timestamp}</p>
                    </div>
                </section>

                <section class="features-section">
                    <h3>✨ What's Included:</h3>
                    <ul class="features-list">
                        ${welcomeData.features.map(feature => `<li>✅ ${feature}</li>`).join('')}
                    </ul>
                </section>

                <section class="next-steps-section">
                    <h3>🚀 Next Steps:</h3>
                    <ul class="steps-list">
                        ${welcomeData.nextSteps.map(step => `<li>📋 ${step}</li>`).join('')}
                    </ul>
                </section>

                <section class="api-section">
                    <h3>🔗 API Endpoints:</h3>
                    <div class="api-links">
                        <a href="/api/health" class="api-link">Health Check</a>
                        <a href="/home" class="api-link">Dashboard (JSON)</a>
                    </div>
                </section>
            </main>
            
            <footer class="footer">
                <p>Express.js Template v1.0.0 | Ready for your team! 🎯</p>
            </footer>
        </div>
    </body>
    </html>
  `);
});

// Root route redirect
router.get('/', (req, res) => {
  res.redirect('/home');
});

export default router;