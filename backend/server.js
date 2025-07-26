const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Get all tasks for a user
app.get('/tasks/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { user_id, title, description, points } = req.body;
  db.query(
    'INSERT INTO tasks (user_id, title, description, points) VALUES (?, ?, ?, ?)',
    [user_id, title, description, points],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Task added successfully!' });
    }
  );
});

// Mark task as completed and add points
app.put('/tasks/complete/:id', (req, res) => {
  const taskId = req.params.id;
  const { user_id, points } = req.body;

  const query = `
    UPDATE tasks SET is_completed = 1 WHERE id = ?;
    UPDATE users SET total_points = total_points + ? WHERE id = ?;
  `;

  db.query(query, [taskId, points, user_id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Task completed and points updated!' });
  });
});

// Get rewards list
app.get('/rewards', (req, res) => {
  db.query('SELECT * FROM rewards', (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// Claim a reward
app.post('/rewards/claim', (req, res) => {
  const { user_id, reward_id, required_points } = req.body;

  db.query('SELECT total_points FROM users WHERE id = ?', [user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    const userPoints = result[0].total_points;
    if (userPoints >= required_points) {
      const query = `
        INSERT INTO user_rewards (user_id, reward_id) VALUES (?, ?);
        UPDATE users SET total_points = total_points - ? WHERE id = ?;
      `;
      db.query(query, [user_id, reward_id, required_points, user_id], (err2) => {
        if (err2) return res.status(500).json({ error: err2 });
        res.json({ message: 'Reward claimed!' });
      });
    } else {
      res.status(400).json({ message: 'Not enough points!' });
    }
  });
});

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
