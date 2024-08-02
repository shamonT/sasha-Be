const mongoose = require("mongoose");

const socketSchema = new mongoose.Schema({
  id: String,
  email: String,

  socket_id: String,
});

const socket = mongoose.model("socket", socketSchema);

module.exports = socket;
