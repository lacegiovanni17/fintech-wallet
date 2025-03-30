// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import dotenv from "dotenv";
// import sequelize from "./config/db";
// import { server } from "./config/websocket"; // WebSocket server import
// import authroutes from "./routes/auth.routes";

// // Load environment variables
// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(helmet());
// app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use("/api/auth", authroutes);

// // Database Connection
// sequelize
//   .authenticate()
//   .then(() => console.log("✅ Database connected successfully."))
//   .catch((error: any) => console.error("❌ Database connection failed:", error));

// const PORT = process.env.PORT || 5000;

// // Start HTTP server (which includes WebSocket)
// server.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

// export default app;


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import routes from "./routes";
import { connectDB } from "./config/db";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api", routes);

// Create HTTP Server & Attach Socket.IO
const server = createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
    },
});

// Attach io to app for access in other files
app.set("io", io);

// WebSocket Connection Handling
io.on("connection", (socket) => {
    console.log("New WebSocket connection:", socket.id);

    // Join user-specific room
    socket.on("joinRoom", (userId: string) => {
        console.log(`User ${userId} joined WebSocket room`);
        socket.join(userId);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Export app, io, and server for use in other files
export { app, io, server, connectDB };