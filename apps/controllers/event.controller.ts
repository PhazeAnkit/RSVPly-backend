import { Request, Response } from "express";
import { eventService } from "../services/event.service";

export const eventController = {
  async create(req: Request, res: Response) {
    const {
      eventCapacity,
      bookedCount,
      eventTime,
      bookingClose,
      description,
      location,
      meetingLink,
    } = req.body;

    const user = req.user;

    if (!user || !user.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (
      eventCapacity === undefined ||
      bookedCount === undefined ||
      !eventTime ||
      !bookingClose ||
      !description
    ) {
      return res.status(400).json({ error: "Missing required field" });
    }

    try {
      const response = await eventService.create({
        event: {
          eventCapacity,
          bookedCount,
          eventTime,
          bookingClose,
          description,
          location,
          meetingLink,
        },
        user,
      });

      return res.status(201).json({ data: response });
    } catch (error) {
      if (error instanceof Error) {
        const status = error.message === "Unauthorized" ? 401 : 500;
        return res.status(status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Server error" });
    }
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) return res.status(401).json({ error: "Invalid Id" });
    try {
      const event = await eventService.getById(id);
      return res.status(200).json({ data: event });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
    }
  },

  async deleteEvent(req: Request, res: Response) {
    const { id } = req.params;
    const user = req.user;

    if (!user || !user.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ error: "Invalid Id" });
    }

    try {
      const response = await eventService.deleteEvent({
        user,
        id,
      });

      return res.status(200).json({
        message: "Event deleted successfully",
        data: response,
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "Unauthorized":
            return res.status(401).json({ error: "Unauthorized" });

          case "Forbidden":
            return res.status(403).json({
              error: "You are not allowed to delete this event",
            });

          case "EventNotFound":
            return res.status(404).json({ error: "Event not found" });

          default:
            return res.status(500).json({ error: "Server error" });
        }
      }

      return res.status(500).json({ error: "Server error" });
    }
  },
  async getAll(req: Request, res: Response) {
    try {
      const events = await eventService.getAll();
      return res.status(200).json({ data: events });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch events" });
    }
  },
  async joinEvent(req: Request, res: Response) {
    const { id } = req.params;
    const user = req.user;

    if (!user || !user.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      await eventService.joinEvent({ user, id });
      return res.status(200).json({ message: "Event joined successfully" });
    } catch (error: any) {
      return res
        .status(error.statusCode || 500)
        .json({ error: error.message || "Server error" });
    }
  },

  async leaveEvent(req: Request, res: Response) {
    const { id } = req.params;
    const user = req.user;

    if (!user || !user.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      await eventService.leaveEvent({ user, id });
      return res.status(200).json({ message: "Left event successfully" });
    } catch (error: any) {
      return res
        .status(error.statusCode || 500)
        .json({ error: error.message || "Server error" });
    }
  },
  async dashboard(req: Request, res: Response) {
    try {
      const data = await eventService.getDashboard(req.user);

      return res.status(200).json({
        data,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to load dashboard",
      });
    }
  },
};
