import { Request, Response, NextFunction } from "express";
import AccountService from "../services/account.service";
import HttpException  from "../utils/exceptions/http.exception";

/**
 * Get user account balance
 */
export const getBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id; // Ensure user is authenticated

    if (!userId) {
      throw new HttpException(401, "Unauthorized: User ID is missing");
    }

    const balance = await AccountService.getBalance(userId);
    res.status(200).json({ success: true, balance });
  } catch (error: any) {
    next(new HttpException(error?.status , error?.message));
  }
};
