const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact Form Submission:');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);

  res.json({ success: true, message: 'Thank you for your message!' });
});

app.use((req, res, next) => {
  res.status(404).send('Sorry, that route does not exist.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server: http://localhost:${PORT}`);
});
