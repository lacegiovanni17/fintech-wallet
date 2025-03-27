import { Server } from "socket.io";
import { createServer } from "http";
import app from "../app"; // Import the Express app

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`⚡ New WebSocket connection: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

export { server, io };
