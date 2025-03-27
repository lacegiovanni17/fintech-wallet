import { Request, Response } from "express";
import TransactionService from "../services/transaction.service";

class TransactionController {
  static async transferFunds(req: Request, res: Response) {
    try {
      const { recipientId, amount } = req.body;
      const senderId = req.user.id; // Extract user ID from middleware

      const result = await TransactionService.transfer(senderId, recipientId, amount);
      return res.status(200).json({ success: true, transaction: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default TransactionController;
