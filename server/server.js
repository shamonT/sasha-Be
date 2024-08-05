const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userroutes");
const http = require("http");
const { Server } = require("socket.io");
const { addsocketdetails } = require("./controllers/socket.controller");
const app = express();
const PORT = 8000;
const MONGO_URI ="mongodb://localhost:27017/"
//   "mongodb+srv://shamonthaibe:Shamon%401998@cluster0.ruxbjbk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Server and Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket, user_id) => {
  console.log(`User connected ${socket.id}`);
  socket.on("register_user", async (details) => {
    console.log(details, "details");
    await addsocketdetails(details, socket.id);
  });
  socket.on("send_message", async (data) => {
    console.log(`Message received: ${JSON.stringify(data)}`);
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });
});

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Set up view engine
app.set("view engine", "ejs");

// Use routes
app.use("/user", userRoutes);

// Routes
app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");

  // Start the server only after successful DB connection
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});
