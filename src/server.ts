import "reflect-metadata";
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { RegisterRoutes } from "./routes/routes";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger/swagger.json";
import { AppDataSource } from "./config/data-source";
import passport from "passport";
import "./config/passport";
import authRoutes from "./routes/auth.routes";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
RegisterRoutes(app);

// Attach io instance globally
app.set("io", io);

AppDataSource.initialize()
  .then(() => {
    console.log("DB connected");

    server.listen(process.env.PORT || 4000, () => {
      console.log(`Server running on port ${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
