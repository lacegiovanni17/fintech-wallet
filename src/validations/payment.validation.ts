import { z } from 'zod';

export const initiatePaymentSchema = z.object({
    userId: z.string().uuid("Invalid user ID"),
    amount: z.number().positive("Amount must be greater than zero"),
});

export const verifyPaymentSchema = z.object({
    paymentReference: z.string().min(1, "Payment reference must be valid"),
});