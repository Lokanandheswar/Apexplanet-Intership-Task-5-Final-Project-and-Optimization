const express = require('express');
const path = require('path');
const app = express();

let feedbackList = [];

app.use(express.static('public'));
app.use(express.json());

// GET all feedback
app.get('/feedback', (req, res) => {
  res.json(feedbackList);
});

// POST new feedback with validation and timestamp
app.post('/feedback', (req, res) => {
  const { username, comment } = req.body;

  if (
    typeof username !== 'string' || username.trim().length < 2 ||
    typeof comment !== 'string' || comment.trim().length < 5
  ) {
    return res.status(400).json({ message: 'Invalid username or comment' });
  }

  const newFeedback = {
    id: Date.now(), // unique ID based on timestamp
    username: username.trim(),
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  };

  feedbackList.unshift(newFeedback); // add newest first

  res.status(201).json({ message: 'Feedback added', feedback: newFeedback });
});

// Serve 404 for anything else
app.use((req, res) => {
  res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
