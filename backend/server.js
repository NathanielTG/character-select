const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies (optional if needed)
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Route to serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Route to serve the League of Legends page
app.get('/league.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'leaguequiz.html'));
});

// Optional: Route for serving other static pages
// app.get('/other-page.html', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'other-page.html'));
// });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
