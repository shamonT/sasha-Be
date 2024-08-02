const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userroutes');
// const config = require('./config');
const app = express();
const PORT = 8000;
// const MONGO_URI = 'mongodb://localhost:27017/mydatabase';
const MONGO_URI = 'mongodb+srv://shamon:Shamon%401998@cluster0.fsmvhmd.mongodb.net/';


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

});

const db = mongoose.connection;
app.use(bodyParser.urlencoded({ extended: false }));

// Set up view engine
app.set('view engine', 'ejs');

// Use routes
app.use('/user', userRoutes);

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  
  // Start the server only after successful DB connection
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});
