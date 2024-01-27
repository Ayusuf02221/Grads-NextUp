const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const awsConfig = require('./config/aws');
const dbConfig = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

require('./config/aws');


require('./config/db')

// Create Express app
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/resources', resourceRoutes);
app.use('/projects', projectRoutes);
app.use('/interviews', interviewRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to my website!');
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
