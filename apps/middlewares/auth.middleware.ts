import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { userToken } from "../utils/types/index";

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Access token missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Invalid authorization format" });
  }

  try {
    const payload: userToken = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (error: any) {
    if (error.message === "Invalid token") {
      return res.status(401).json({ error: "Invalid token signature" });
    }
    if (error.message === "Token expired") {
      return res.status(401).json({ error: "Access token expired" });
    }

    console.error("Auth middleware unexpected error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
