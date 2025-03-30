import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";
import { ZodError } from "zod";
import Payment from "../models/payment";
import { AuthRequest } from "../middlewares/auth.middleware";
import { initiatePaymentSchema, verifyPaymentSchema } from "../validations/payment.validation";

export const addFunds = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log("User from authMiddleware:", req.user); // Debugging

        if (!req.user?.id) {
            res.status(401).json({ error: "Unauthorized - No user ID found" });
            return;
        }

        const data = initiatePaymentSchema.parse({ ...req.body, userId: req.user.id });
        const payment = await paymentService.initiatePayment(data);
        
        res.status(200).json({ message: "Payment initiated", payment });
    } catch (error: any) {
        console.error("Validation Error:", error);

        if (error instanceof ZodError) {
            res.status(400).json({ error: error.errors.map(err => err.message) });
        } else {
            res.status(400).json({ error: error.message ?? "Invalid request" });
        }
    }
};

export const confirmPayment = async (req: Request, res: Response) => {
    try {
        console.log("Incoming request body:", req.body); 

        const data = verifyPaymentSchema.parse(req.body);
        console.log("Parsed data:", data); // Check parsed data

        const result = await paymentService.verifyPayment(data);
        res.status(200).json({ message: "Payment verified", result });
    } catch (error: any) {
        console.error("Error in confirmPayment:", error);
        res.status(400).json({
            error: error instanceof ZodError ? error.errors.map(err => err.message) : error.message || "Invalid request",
        });
    }
};

export const getAllPayments = async (req: AuthRequest, res: Response) => {
    try {
        const payments = await Payment.findAll({ where: { userId: req?.user?.id } });
        res.status(200).json({ message: "Payments retrieved", data: payments });
    } catch (error: any) {
        console.error("Error in getAllPayments:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
}

export const getPaymentById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("Payment ID is required");
        }
        const payment = await paymentService.getPaymentById(id);
        if (!payment) {
            res.status(404).json({ error: "Payment not found" });
            return;
        }
        
        res.status(200).json({ message: "Payment retrieved", data: payment });
    } catch (error: any) {
        console.error("Error in getPaymentById:", error);
        res.status(500).json({ error: error.message ?? "Internal server error" });
    }
}