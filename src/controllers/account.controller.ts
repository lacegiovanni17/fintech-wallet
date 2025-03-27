import { Response, NextFunction } from "express";
import { accountService } from "../services/account.service";
import HttpException from "../utils/exceptions/http.exception";
import { AuthRequest } from "../interfaces/account.interface";
import { IGenericResponseModel } from "../utils/interfaces/generic_response.interface";

/**
 * Get user account balance
 */
export const getBalance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<IGenericResponseModel | void> => {
  try {
    const userId = req.user?.id; // Ensure user is authenticated

    if (!userId) {
      throw new HttpException(401, "Unauthorized: User ID is missing");
    }

    const balance = await accountService.getBalance(userId);
    res.status(200).json({ success: true, balance });
  } catch (error: any) {
    next(new HttpException(error?.status || 500, error?.message || "Internal Server Error"));
  }
};
