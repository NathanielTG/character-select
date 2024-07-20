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

// Middleware to parse JSON bodies
app.use(express.json());

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

// Function to get roles from the database
const getRoles = async () => {
  const query = 'SELECT * FROM roles'; // Adjust this query based on your schema
  try {
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching roles from database:', error);
    throw new Error('Database query error');
  }
};

// Function to get questions from the database based on game type
const getQuestions = async (game) => {
  const query = `
    SELECT q.question_id, q.question_text, q.role_id
    FROM questions q
    JOIN games g ON q.game_id = g.game_id
    WHERE g.game_name = $1
  `;
  try {
    const result = await client.query(query, [game]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching questions from database:', error);
    throw new Error('Database query error');
  }
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
