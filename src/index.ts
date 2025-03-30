import { app, server, connectDB } from "./app";

// Database Connection & Server Start
const startServer = async () => {
    try {
        await connectDB();

        // Health check route
        app.get("/", (req, res) => {
            res.send("Mini Fintech API is Running...");
        });

        // Start server
        const PORT = process.env.PORT ?? 8080;
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

// Start the server
startServer();