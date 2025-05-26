import { app } from "./app.js";
import http from "http";
import "dotenv/config";
import { Server } from "socket.io";


export const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//  client connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle new product added from client
  socket.on("product-message", (data) => {
    console.log("New product added:", data);
    // Broadcast to all clients except sender
     socket.broadcast.emit("product-created", data);
  });

  socket.on("event", (data) => {
    console.log("Received event:", data);
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.Port || 3000;
console.log(process.env.Port)
server.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
