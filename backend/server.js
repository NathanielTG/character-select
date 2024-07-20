const express = require('express');
const path = require('path');
const { Client } = require('pg'); // Import the pg client for PostgreSQL
const app = express();
const port = 3000;

// Create a new PostgreSQL client
const client = new Client({
  user: 'capa',
  host: 'localhost',
  database: 'quizdb',
  password: 'capa', // Update with your database password
  port: 5432,
});

// Connect to the PostgreSQL database
client.connect();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Route to serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Route to serve the main HTML page
app.get('/league.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Route to serve the quiz questions based on the game
app.get('/api/questions', async (req, res) => {
  const gameName = req.query.game; // Get the game from the query parameter

  if (!gameName) {
    return res.status(400).json({ error: 'Game name is required' });
  }

  try {
    // Fetch the game_id based on the game name
    const gameResult = await client.query('SELECT game_id FROM games WHERE game_name = $1', [gameName]);
    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const gameId = gameResult.rows[0].game_id;

    // Fetch the questions related to the specified game
    const result = await client.query('SELECT * FROM questions WHERE game_id = $1', [gameId]);
    res.json(result.rows); // Send the questions as JSON
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch roles
app.get('/api/roles', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM roles');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
