import { Request, Response } from "express";
import { ZodError } from "zod";
import { AuthRequest } from "../middlewares/auth.middleware";
import { transactionService } from "../services/transanction.service";
import { transferFundsSchema, updateTransactionStatusSchema } from "../validations/transaction.validation";

export const transferFunds = async (req: Request, res: Response) => {
    try {
        const data = transferFundsSchema.parse(req.body);
        const transaction = await transactionService.transferFunds(data);
        res.status(200).json({ message: "Transfer successful", transaction });
    } catch (error: any) {
        console.error("Transfer Error:", error); // 🔍 Log the full error for debugging

        if (error instanceof ZodError) {
            res.status(400).json({ error: error.errors.map(err => err.message) }); // 🛠️ Return specific validation errors
        } else {
            res.status(400).json({ error: error.message ?? "Invalid request" });
        }
    }
};

export const getTransactionById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id) {
            throw new Error("Transaction ID is required");
        }

        const transaction = await transactionService.getTransactionById(id);
        res.status(200).json({ message: "Transaction retrieved", transaction });
    } catch (error: any) {
        res.status(400).json({ error: error.errors ?? "Invalid request" });
    }
}

export const getUserTransactionHistory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Extract user ID from request
        if (!userId) {
            res.status(400).json({ error: "User ID is required" });
            return; // Ensure function stops execution
        }

        const transactions = await transactionService.getUserTransactionHistory(userId);
        res.status(200).json({ message: "Transaction history retrieved", transactions });
    } catch (error: any) {
        res.status(400).json({ error: error.errors ?? "Invalid request" });
    }
};

export const processTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const data = req.body;
        const transaction = await transactionService.processTransaction(data);
        res.status(200).json({ message: "Transaction processed", transaction });
    } catch (error: any) {
        console.error("❌ Error in processTransaction:", error); // Log for debugging
        res.status(400).json({ error: error.message || "Invalid request" });
    }
};

export const getAllTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await transactionService.getAllTransactions();
        res.status(200).json({ message: "Transactions retrieved", transactions });
    } catch (error: any) {
        res.status(400).json({ error: error.errors ?? "Invalid request" });
    }
}

export const updateTransactionStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id) {
            throw new Error("Transaction ID is required");
        }

        const data = updateTransactionStatusSchema.parse(req.body);
        const mappedData = {
            transactionId: id,
            status: data.status.toUpperCase() as "PENDING" | "SUCCESS" | "FAILED",
        };

        const transaction = await transactionService.updateTransactionStatus(mappedData);
        res.status(200).json({ message: "Transaction status updated", transaction });
    } catch (error: any) {
        res.status(400).json({ error: error.errors ?? "Invalid request" });
    }
};

export const deleteUserTransaction = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            throw new Error("Transaction ID is required");
        }

        const transaction = await transactionService.deleteUserTransaction(userId);
        res.status(200).json({ message: "Transaction deleted", transaction });
    } catch (error: any) {
        res.status(400).json({ error: error.errors ?? "Invalid request" });
    }
}
export const deleteTransaction = (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id) {
            throw new Error("Transaction ID is required");
        }

        const transaction = transactionService.deleteTransaction(id);
        res.status(200).json({ message: "Transaction deleted", transaction });
    } catch (error: any) {
        res.status(400).json({ error: error.errors ?? "Invalid request" });
    }
}
