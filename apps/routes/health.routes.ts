import { Router } from "express";

const router = Router();
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Server Working Properly",
    timestamp: new Date().toISOString(),
  });
});

export default router;
