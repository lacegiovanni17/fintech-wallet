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
