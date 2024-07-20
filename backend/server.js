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

// Route to serve the league HTML page
app.get('/league.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Function to get questions
const getQuestions = async (gameId) => {
  try {
    // Ensure the gameId is treated as an integer
    const query = 'SELECT * FROM questions WHERE game_id = $1';
    const { rows } = await client.query(query, [gameId]);
    return rows;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// Function to get roles
const getRoles = async () => {
  try {
    const query = 'SELECT * FROM roles';
    const { rows } = await client.query(query);
    return rows;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

// Route to get questions
app.get('/api/questions', async (req, res) => {
  const gameId = parseInt(req.query.game, 10); // Convert game parameter to integer
  if (isNaN(gameId)) {
    return res.status(400).json({ error: 'Invalid game ID' });
  }
  
  try {
    const questions = await getQuestions(gameId);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Error fetching questions' });
  }
});

// Route to get roles
app.get('/api/roles', async (req, res) => {
  try {
    const roles = await getRoles();
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Error fetching roles' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
