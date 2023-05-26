const express = require('express');
const cors = require('cors'); // import cors for cross-origin resource sharing
const bodyParser = require('body-parser'); // import body-parser for parsing request bodies
const mongoose = require('mongoose'); // import mongoose for interacting with MongoDB
const todoRoutes = require('./routes/todoRoutes'); // import todo routes
const userRoutes = require('./routes/userRoutes'); // import user routes

const app = express(); // create express app
const port = 8080; // port to listen on

app.use(cors()); // use cors
app.use(express.json()); // use express.json to parse json bodies
app.use(bodyParser.json()); // use body-parser to parse json bodies


// Connect to MongoDB
mongoose.connect(`${process.env.MONGO_DB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: {
    w: 'majority',
  }
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });

app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
