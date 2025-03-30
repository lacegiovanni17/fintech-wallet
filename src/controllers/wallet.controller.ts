import { Request, Response } from "express";
import { fundWalletSchema, withdrawFundsSchema } from "../validations/transaction.validation";
import { walletService } from "../services/wallet.service";

export const fundWallet = async (req: Request, res: Response) => {
    try {
        const data = fundWalletSchema.parse(req.body);
        const transaction = await walletService.fundWallet(data);
        res.status(200).json({ message: "Wallet funded successfully", transaction });
    } catch (error: any) {
        res.status(400).json({ error: error.errors ?? "Invalid request" });
    }
};

export const withdrawFunds = async (req: Request, res: Response) => {
    try {
        const data = withdrawFundsSchema.parse(req.body);
        const transaction = await walletService.withdrawFunds(data);
        res.status(200).json({ message: "Withdrawal successful", transaction });
    } catch (error: any) {
        res.status(400).json({ error: error.errors ?? "Invalid request" });
    }
};

export const findWalletByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const wallet = await walletService.findWalletByUserId(userId);
        if (!wallet) {
            res.status(404).json({ message: "Wallet not found" });
            return;
        }
        res.status(200).json(wallet);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch wallet" });
    }
};

export const createWallet = async (req: Request, res: Response) => {
    try {
        const { userId, initialBalance } = req.body;
        const wallet = await walletService.createWallet(userId, initialBalance);
        res.status(201).json({ message: "Wallet created successfully", wallet });
    } catch (error: any) {
        res.status(400).json({ error: "Failed to create wallet" });
    }
};

export const updateWalletBalance = async (req: Request, res: Response) => {
    try {
        const { userId, newBalance } = req.body;
        const wallet = await walletService.updateWalletBalance(userId, newBalance);
        res.status(200).json({ message: "Wallet balance updated successfully", wallet });
    } catch (error: any) {
        res.status(400).json({ error: "Failed to update wallet balance" });
    }
};

export const getAllWallets = async (_req: Request, res: Response) => {
    try {
        const wallets = await walletService.getAllWallets();
        res.status(200).json(wallets);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to retrieve wallets" });
    }
};

export const deleteWallet = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const wallet = await walletService.deleteWallet(userId);
        res.status(200).json({ message: "Wallet deleted successfully", wallet });
    } catch (error: any) {
        res.status(400).json({ error: "Failed to delete wallet" });
    }
}

export const getWalletById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const wallet = await walletService.getWalletById(id);
        if (!wallet) {
            res.status(404).json({ error: "Wallet not found" });
            return;
        }
        res.status(200).json(wallet);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch wallet" });
    }
}