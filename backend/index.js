const express = require("express");
const app = express();
const PORT = 3000;
const socketio = require("socket.io");

const server = app.listen(PORT, () => console.log("chat server is running on Port: " + PORT));

const io = socketio(server);

io.on("connection", (socket) => {
  console.count("user connected");
  socket.on("send-message", async (message, callback) => {
    console.log(message);
    try {
      io.emit("new-message", message);
    } catch (e) {
      console.error(e);
    }
  });
});
