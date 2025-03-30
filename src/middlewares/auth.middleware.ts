import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  user?: { id: string; email: string }; // Include email now
}

// Middleware to verify JWT token
export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
      return;
    }

    // Extract both id and email from token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string };

    req.user = { id: decoded.id, email: decoded.email }; // Attach both ID and email to request
    next();
  } catch (error) {
    next(error)
  }
};
