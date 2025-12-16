import express from "express";
import healthRouter from "./routes/health.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => {
  res.json({
    status: "OK",
    message: `Server Running `,
  });
});

app.use("/health", healthRouter);

export default app;
