const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const conn = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Get all tasks
app.get('/tasks/:userId', (req, res) => {
  const sql = 'SELECT * FROM tasks WHERE user_id = ?';
  conn.query(sql, [req.params.userId], (err, rows) => {
    if (err) res.status(500).send(err);
    else res.send(rows);
  });
});

// Add new task
app.post('/tasks', (req, res) => {
  const { user_id, title, points } = req.body;
  const sql = 'INSERT INTO tasks (user_id, title, points) VALUES (?, ?, ?)';
  conn.query(sql, [user_id, title, points], (err) => {
    if (err) res.status(500).send(err);
    else res.send({ message: 'Task added successfully' });
  });
});

// Mark task as complete
app.put('/tasks/complete/:id', (req, res) => {
  const sql = 'UPDATE tasks SET is_completed = 1 WHERE id = ?';
  conn.query(sql, [req.params.id], (err) => {
    if (err) res.status(500).send(err);
    else res.send({ message: 'Task marked complete' });
  });
});

// Get rewards
app.get('/rewards', (req, res) => {
  conn.query('SELECT * FROM rewards', (err, rows) => {
    if (err) res.status(500).send(err);
    else res.send(rows);
  });
});

// Claim a reward
app.post('/rewards/claim', (req, res) => {
  const { user_id, reward_id } = req.body;
  const sql = 'INSERT INTO user_rewards (user_id, reward_id) VALUES (?, ?)';
  conn.query(sql, [user_id, reward_id], (err) => {
    if (err) res.status(500).send(err);
    else res.send({ message: 'Reward claimed' });
  });
});

// Save student profile
app.post('/profile', (req, res) => {
  const { name, age, standard, school_name, fav_subject } = req.body;
  const sql = 'INSERT INTO student_profiles (name, age, standard, school_name, fav_subject) VALUES (?, ?, ?, ?, ?)';
  conn.query(sql, [name, age, standard, school_name, fav_subject], (err) => {
    if (err) res.status(500).send(err);
    else res.send({ message: 'Profile saved successfully' });
  });
});

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});

