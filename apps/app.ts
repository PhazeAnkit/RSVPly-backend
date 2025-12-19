import express from "express";
import healthRouter from "./routes/health.routes";
import authRouter from "./routes/auth.routes";
import cors from "cors";
import eventRouter from "./routes/event.routes";

const app = express();
app.use(cors({*}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/event", eventRouter);

app.use("/", (req, res) => {
  res.json({
    status: "OK",
    message: `Server Running `,
  });
});

app.use("/health", healthRouter);
app.use("/auth", authRouter);

export default app;
