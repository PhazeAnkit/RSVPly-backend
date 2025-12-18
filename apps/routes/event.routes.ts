import { Router } from "express";
import { eventController } from "../controllers/event.controller";
import { auth } from "../middlewares/auth.middleware";
const router = Router();
router.post("/create", auth, eventController.create);
router.get("/:id", auth, eventController.getById);
router.delete("/:id", auth, eventController.deleteEvent);

export default router;
