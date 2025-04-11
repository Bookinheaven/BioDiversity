// server.js

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to handle contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  // For now, simply log the received data to the console
  console.log('Contact Form Submission:');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);

  // In a real application, save the data to a database or send an email notification
  res.json({ success: true, message: 'Thank you for your message!' });
});

// Catch-all route for handling 404 errors (if file not found)
app.use((req, res, next) => {
  res.status(404).send('Sorry, that route does not exist.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server: http://localhost:${PORT}`);
});
