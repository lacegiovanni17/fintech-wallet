import Stripe from "stripe";
import Payment from "../models/payment";
import Wallet from "../models/wallet"
import User from "../models/user";
import sequelize from "../config/db";
import { notificationService } from "./notification.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-02-24.acacia",
});

export const paymentService = {
    async initiatePayment(data: { userId: string; amount: number }) {
        const { userId, amount } = data;
        const transaction = await sequelize.transaction();

        try {
            const paymentMethodId = "pm_card_visa";

            // Create a Stripe Payment Intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: "usd",
                payment_method_types: ["card"],
                confirm: true,
                payment_method: paymentMethodId,
            });

            // Create the payment record in the database
            const payment = await Payment.create(
                { userId, amount, status: "PENDING", paymentReference: paymentIntent.id },
                { transaction }
            );
            await transaction.commit();

            const finalResponse = {
                payment,
                paymentIntent
            }

            return {
                success: true,
                message: "Payment initiated successfully.",
                data: finalResponse
            };

        } catch (error) {
            await transaction.rollback();
            console.error("Payment Initiation Error:", error);
            throw new Error("Payment initiation failed.");
        }
    },

    async verifyPayment(data: { paymentReference: string }) {
        const { paymentReference } = data;
        const transaction = await sequelize.transaction();

        try {
            // Retrieve payment details from Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentReference);

            if (paymentIntent.status !== "succeeded") {
                throw new Error("Payment not completed yet");
            }

            // Update payment status in database
            await Payment.update({ status: "SUCCESS" }, { where: { paymentReference }, transaction });

            // Fetch the updated payment record
            const payment = await Payment.findOne({ where: { paymentReference }, transaction });
            if (!payment) {
                throw new Error("Payment record not found");
            }

            const user = await User.findByPk(payment.userId);
            if (!user) {
                throw new Error("User not found");
            }

            // Fetch the user's wallet
            let wallet = await Wallet.findOne({ where: { userId: payment.userId }, transaction });

            if (wallet) {
                // ✅ Ensure balance is always a number
                const currentBalance = parseFloat(wallet.balance as any) || 0;
                const paymentAmount = Number(payment.amount);

                const newBalance = currentBalance + paymentAmount;

                if (!Number.isFinite(newBalance)) {
                    throw new Error("Invalid balance calculation. Check input values.");
                }

                // ✅ Update the wallet balance
                await wallet.update({ balance: newBalance }, { transaction });
                await user.update({ balance: newBalance });
                await user.save();
                await notificationService.createNotification({ userId: payment.userId, message: "Payment received" });
            } else {
                // ✅ Create a new wallet if user doesn't have one
                wallet = await Wallet.create(
                    { userId: payment.userId, balance: Number(payment.amount) },
                    { transaction }
                );
                await user.update({ balance: wallet.balance });
                await user.save();
                await notificationService.createNotification({ userId: payment.userId, message: "New wallet created for your payment" });
                await notificationService.createNotification({ userId: payment.userId, message: "Payment received" });
            }

            // Commit transaction after successful updates
            await transaction.commit();

            return {
                message: "Payment verified and funds added successfully",
                wallet: {
                    ...wallet.toJSON(),
                    balance: wallet.balance // ✅ Use balance directly as a number
                }
            };
        } catch (error: any) {
            await transaction.rollback();
            console.error("Error in verifyPayment:", error.message);
            throw new Error(error.message ?? "Failed to verify payment");
        }
    },

    async getPaymentById(id: string): Promise<Payment | null> {
        return await Payment.findByPk(id);
    }
};