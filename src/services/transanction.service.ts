import { io } from "../app";
import { Wallet } from "../models/wallet";
import { Transaction } from "../models/transaction";
import { Op } from "sequelize";
import { TransactionAttributes } from "../models/transaction";
import sequelize from "../config/db";
import { notificationService } from "./notification.service";

export const transactionService = {
    async transferFunds({ senderId, receiverId, amount }: { senderId: string; receiverId: string; amount: number }) {
        return await sequelize.transaction(async (t) => {
            const senderWallet = await Wallet.findOne({ where: { userId: senderId }, transaction: t });
            const receiverWallet = await Wallet.findOne({ where: { userId: receiverId }, transaction: t });

            if (!senderWallet) throw new Error("Sender wallet not found");
            if (!receiverWallet) throw new Error("Receiver wallet not found");
            if (senderWallet.balance < amount) throw new Error("Insufficient funds");

            await senderWallet.update({ balance: senderWallet.balance - amount }, { transaction: t });
            await receiverWallet.update({ balance: receiverWallet.balance + amount }, { transaction: t });

            const transaction = await Transaction.create(
                { senderId, receiverId, amount, status: "SUCCESS", type: "transfer" },
                { transaction: t }
            );

            await notificationService.sendNotification({ userId: receiverId, message: `You received $${amount} from ${senderId}.` });
            await notificationService.sendNotification({ userId: senderId, message: `You sent $${amount} to ${receiverId}.` });

            io.to(receiverId).emit("newTransaction", { message: `Transaction received: $${amount}` });
            io.to(senderId).emit("transactionSent", { message: `Transaction sent: $${amount}` });

            return transaction;
        });
    },

    async updateTransactionStatus({ transactionId, status }: { transactionId: string; status: "SUCCESS" | "PENDING" | "FAILED" }) {
        return await sequelize.transaction(async (t) => {
            const transaction = await Transaction.findByPk(transactionId, { transaction: t });
            if (!transaction) throw new Error("Transaction not found");

            await transaction.update({ status }, { transaction: t });

            io.to(transaction.senderId).emit("transactionUpdated", { transactionId, status });
            io.to(transaction.receiverId).emit("transactionUpdated", { transactionId, status });

            return transaction;
        });
    },

    async processTransaction(data: Partial<TransactionAttributes>) {
        try {
            console.log("🔍 Received transaction data:", data);

            const { senderId, receiverId, amount, type } = data;
            if (!senderId || !receiverId || !amount || !type) throw new Error("Missing required fields.");

            return await sequelize.transaction(async (t) => {
                let senderWallet = await Wallet.findOne({ where: { userId: senderId }, transaction: t });
                let receiverWallet = await Wallet.findOne({ where: { userId: receiverId }, transaction: t });

                if (!receiverWallet) {
                    receiverWallet = await Wallet.create({ userId: receiverId, balance: 0 }, { transaction: t });
                }
                if (!senderWallet && type === "transfer") {
                    throw new Error("Sender wallet not found.");
                }

                if (type === "transfer" && senderWallet!.balance < amount) {
                    throw new Error("Insufficient funds.");
                }

                if (type === "transfer") {
                    senderWallet!.balance -= amount;
                    receiverWallet.balance += amount;
                } else if (type === "deposit") {
                    receiverWallet.balance += amount;
                }

                await senderWallet?.save({ transaction: t });
                await receiverWallet.save({ transaction: t });

                const transaction = await Transaction.create(
                    { senderId, receiverId, type, amount, status: "SUCCESS" },
                    { transaction: t }
                );

                await notificationService.sendNotification({ userId: receiverId, message: `You received $${amount} from ${senderId}.` });
                io.to(receiverId).emit("newTransaction", { message: `Transaction received: ${amount}` });

                return transaction;
            });
        } catch (error) {
            console.error("❌ Error in processTransaction:", error);
            throw new Error("Transaction processing failed.");
        }
    },

    async getAllTransactions() {
        return await Transaction.findAll();
    },

    async getTransactionById(id: string) {
        return await Transaction.findByPk(id);
    },

    async getUserTransactionHistory(userId: string) {
        return await Transaction.findAll({
            where: {
                [Op.or]: [{ senderId: userId }, { receiverId: userId }],
            },
        });
    },

    async deleteUserTransaction(userId: string) {
        await sequelize.transaction(async (t) => {
            await Transaction.destroy({
                where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] },
                transaction: t,
            });
        });

        return { message: "Transaction deleted successfully" };
    },

    async deleteTransaction(id: string) {
        await sequelize.transaction(async (t) => {
            await Transaction.destroy({ where: { id }, transaction: t });
        });

        return { message: "Transaction deleted successfully" };
    },
};