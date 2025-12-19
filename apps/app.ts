import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes";
import authRouter from "./routes/auth.routes";
import eventRouter from "./routes/event.routes";
import connectDB from "./utils/db";

const app = express();

app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/event", eventRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
