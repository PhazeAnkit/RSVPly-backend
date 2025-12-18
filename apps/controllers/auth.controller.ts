import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  async register(req: Request, res: Response) {
    const { userName, email, password, Location, contactNumber } = req.body;

    if (!userName || !email || !password || !Location || !contactNumber) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    try {
      const response = await authService.register({
        userName,
        email,
        password,
        Location,
        contactNumber,
      });

      return res.status(201).json({
        data: response,
      });
    } catch (error: any) {
      if (error.message === "User already registered") {
        return res.status(409).json({ error: error.message });
      }

      return res.status(500).json({
        error: "Something went wrong",
      });
    }
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    try {
      const response = await authService.login({ email, password });

      return res.status(200).json({
        data: response,
      });
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ error: error.message });
      }
      console.log(error.message);
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
  },
};
