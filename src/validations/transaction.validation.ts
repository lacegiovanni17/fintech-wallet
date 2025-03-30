import { z } from 'zod';

export const updateTransactionStatusSchema = z.object({
    transactionId: z.string().uuid("Invalid user ID"),
    status: z.enum(["pending", "success", "failed"]),
});

export const transactionSchema = z.object({
    senderId: z.string().uuid("Invalid user ID"),
    receiverId: z.string().uuid("Invalid user ID"),
    amount: z.number().positive("Amount must be greater than zero"),
    type: z.enum(["fund", "transfer", "withdrawal"]),
    status: z.enum(["pending", "completed", "failed"]).default("pending"),
});

export const transferFundsSchema = z.object({
    senderId: z.string().uuid("Invalid user ID"),
    receiverId: z.string().uuid("Invalid user ID"),
    amount: z.number().positive("Amount must be greater than zero"),
});

export const fundWalletSchema = z.object({
    userId: z.string().uuid("Invalid user ID"),
    amount: z.number().positive("Amount must be greater than zero"),
});

export const withdrawFundsSchema = z.object({
    userId: z.string().uuid("Invalid user ID"),
    amount: z.number().positive("Amount must be greater than zero"),
});