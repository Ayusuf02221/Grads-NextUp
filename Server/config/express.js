// express.js

const express = require('express');
const bodyParser = require('body-parser'); // Middleware to parse JSON bodies
const cors = require('cors'); // Middleware to enable CORS

module.exports = (app) => {
  // Enable CORS with default settings
  app.use(cors());

  // Apply middleware to parse JSON bodies
  app.use(bodyParser.json());

  // Add more middleware as needed
  // e.g., app.use(bodyParser.urlencoded({ extended: true }));

  // Basic error handler - Customize as needed
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // ... any other app-wide configurations ...
};
