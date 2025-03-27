import { Transaction } from "sequelize";
import Account from "../models/account.model";
import TransactionModel from "../models/transaction.model";

class TransactionService {
  static async transfer(senderId: string, recipientId: string, amount: number) {
    return await Account.sequelize.transaction(async (t: Transaction) => {
      const sender = await Account.findOne({ where: { userId: senderId }, transaction: t });
      const recipient = await Account.findOne({ where: { userId: recipientId }, transaction: t });

      if (!sender || !recipient) throw new Error("Account not found");
      if (sender.balance < amount) throw new Error("Insufficient funds");

      // Deduct from sender
      await sender.update({ balance: sender.balance - amount }, { transaction: t });

      // Add to recipient
      await recipient.update({ balance: recipient.balance + amount }, { transaction: t });

      // Create transaction record
      return await TransactionModel.create(
        { senderId, recipientId, amount, status: "successful" },
        { transaction: t }
      );
    });
  }
}

export default TransactionService;
