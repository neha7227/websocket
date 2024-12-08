import { Server } from "socket.io";
import { createServer } from "http";

// server.js (Node.js backend)
// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Event for listening to "sendDriverData" from client
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.emit("welcome", "Welcome to channel");

  // socket.on("msg", (data) => {
  //   console.log("message from client: ", data);
  // });

  // Listen for "sendDriverData" event from client
  socket.on("sendDriverData", (data) => {
    console.log("Client sent frequency:", data);

    // Simulate driver data based on frequency
    let driverData;
    if (data.frequency === "monthly") {
      driverData = {
        id: 123,
        name: "John Doe",
        frequency: "monthly",
        licenseNumber: "AB123CD",
      };
    } else if (data.frequency === "weekly") {
      driverData = {
        id: 124,
        name: "Jane Smith",
        frequency: "weekly",
        licenseNumber: "CD456EF",
      };
    } else {
      driverData = {
        message: "No data available for the specified frequency",
      };
    }

    // Emit the "getDriverData" event with the response data
    socket.emit("getDriverData", driverData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
server.listen(4005, () => {
  console.log("Server is running on http://localhost:4005");
});
