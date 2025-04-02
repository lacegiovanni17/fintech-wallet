import { AppDataSource } from "../config/data-source";
import { createPayPalOrder, capturePayPalOrder } from "./paypal.service";
import { User } from "../entities/User";
import { Transaction } from "../entities/Transaction";
import express from "express";

const io = express.application.get("io"); // Get socket.io instance

export class FundService {
  public async createOrder(amount: number) {
    return await createPayPalOrder(amount);
  }

  public async captureOrder(
    orderId: string,
    userId: number
  ): Promise<{ success: boolean; newBalance: number }> {
    const data = await capturePayPalOrder(orderId);
    const amount = parseFloat(data.purchase_units[0].payments.captures[0].amount.value);

    const userRepo = AppDataSource.getRepository(User);
    const txRepo = AppDataSource.getRepository(Transaction);

    const user = await userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    user.balance += amount;
    await userRepo.save(user);

    const tx = txRepo.create({ type: "credit", amount, user });
    await txRepo.save(tx);

    // ✅ Emit real-time PayPal credit notification
    if (io) {
      io.emit(`notify:${user.email}`, {
        type: "paypal",
        message: `Your wallet was credited ₦${amount} via PayPal.`,
        amount,
      });
    }

    return { success: true, newBalance: user.balance };
  }

  public async transferFunds(
    senderId: number,
    recipientEmail: string,
    amount: number
  ): Promise<{
    success: boolean;
    message: string;
    senderBalance: number;
    recipientBalance: number;
  }> {
    if (amount <= 0) {
      throw new Error("Transfer amount must be greater than zero");
    }

    const userRepo = AppDataSource.getRepository(User);
    const txRepo = AppDataSource.getRepository(Transaction);

    const sender = await userRepo.findOneBy({ id: senderId });
    const recipient = await userRepo.findOneBy({ email: recipientEmail });

    if (!sender) throw new Error("Sender not found");
    if (!recipient) throw new Error("Recipient not found");
    if (sender.id === recipient.id) throw new Error("Cannot transfer to yourself");
    if (sender.balance < amount) throw new Error("Insufficient balance");

    // Transfer
    sender.balance -= amount;
    recipient.balance += amount;

    await userRepo.save([sender, recipient]);

    // Log transactions
    const senderTx = txRepo.create({ type: "debit", amount, user: sender });
    const recipientTx = txRepo.create({
      type: "credit",
      amount,
      user: recipient,
    });

    await txRepo.save([senderTx, recipientTx]);

    // ✅ Emit real-time transfer notification to recipient
    if (io) {
      io.emit(`notify:${recipient.email}`, {
        type: "transfer",
        message: `You received ₦${amount} from ${sender.email}`,
        amount,
      });
    }

    return {
      success: true,
      message: `Transferred ₦${amount} to ${recipient.email}`,
      senderBalance: sender.balance,
      recipientBalance: recipient.balance,
    };
  }

  public async getTransactions(userId: number): Promise<Transaction[]> {
    const txRepo = AppDataSource.getRepository(Transaction);
    return await txRepo.find({
      where: {
        user: { id: userId },
      },
      relations: ["user"],
      order: {
        timestamp: "DESC",
      },
      take: 50,
    });
  }
}
