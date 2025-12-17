import "dotenv/config";
import app from "./app";
import connectDB from "./utils/db";
import http from "http";
import mongoose from "mongoose";
const PORT = 4000;

let server: http.Server;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    server = app.listen(process.env.PORT || 5000, () => {
      console.log("Server started");
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};

startServer();

const shutdown = async (signal: string): Promise<void> => {
  console.log(`${signal} received`);

  if (server) {
    server.close(() => {
      console.log("🧯 HTTP server closed");
    });
  }

  try {
    await mongoose.connection.close(false);
    console.log(" MongoDB disconnected");
  } catch (err) {
    console.error(" MongoDB close error:", err);
  }

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("SIGQUIT", shutdown);

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Rejection:", reason);
  shutdown("unhandledRejection");
});
