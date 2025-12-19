import { Router } from "express";
import { eventController } from "../controllers/event.controller";
import { auth } from "../middlewares/auth.middleware";
const router = Router();
router.post("/create", auth, eventController.create);
router.get("/",auth, eventController.getAll);
router.get("/:id", auth, eventController.getById);
router.delete("/:id", auth, eventController.deleteEvent);
router.post("/:id/registrations", auth, eventController.joinEvent);
router.delete("/:id/registrations", auth, eventController.leaveEvent);

export default router;
