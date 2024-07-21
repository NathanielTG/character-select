const express = require('express');
const path = require('path');
const { Client } = require('pg'); // Import the pg client for PostgreSQL
const cors = require('cors'); // Add this line to import cors
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

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors()); // Add this line to use cors

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

// Helper function to get questions from the database
const getQuestions = async (game) => {
  const query = 'SELECT question_id, question_text, role_id FROM questions WHERE game_id = $1';
  const values = [game];
  const res = await client.query(query, values);
  return res.rows;
};

// Helper function to get roles from the database
const getRoles = async () => {
  const query = 'SELECT role_id, role_name FROM roles';
  const res = await client.query(query);
  return res.rows;
};

// Route to get questions
app.get('/api/questions', async (req, res) => {
  const game = req.query.game;
  try {
    const questions = await getQuestions(game);
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

// Route to update scores
app.post('/api/updateScores', async (req, res) => {
  const { gameId, roleId, totalPoints } = req.body;
  const query = `
    INSERT INTO results (game_id, role_id, total_points)
    VALUES ($1, $2, $3)
    ON CONFLICT (game_id, role_id)
    DO UPDATE SET total_points = EXCLUDED.total_points
  `;
  const values = [gameId, roleId, totalPoints];
  try {
    await client.query(query, values);
    res.status(200).send('Score updated successfully');
  } catch (error) {
    console.error('Error updating scores:', error);
    res.status(500).send('Error updating scores');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
