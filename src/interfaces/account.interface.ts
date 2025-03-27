import { IUserModel } from "./user.interface";
import { Request } from "express";

/**
 * Custom Request interface for authenticated users.
 * Ensures `req.user` contains only the `id` field.
 */
export interface AuthRequest extends Request {
  user?: Pick<IUserModel, "id">; 
}
