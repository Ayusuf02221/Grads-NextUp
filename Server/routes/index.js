// index.js

const express = require('express');
const app = express();

// Import route modules
const authRoutes = require('./authRoutes');
const resourceRoutes = require('./resourceRoutes');
const projectRoutes = require('./projectRoutes');
const interviewRoutes = require('./interviewRoutes');
const userRoutes = require('./userRoutes');

// Use route modules
app.use('/auth', authRoutes);
app.use('/resources', resourceRoutes);
app.use('/projects', projectRoutes);
app.use('/interviews', interviewRoutes);
app.use('/users', userRoutes);

// Catch-all route for unmatched routes
app.use('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

module.exports = app;
