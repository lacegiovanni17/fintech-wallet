import { io } from "../app";
import { Notification } from "../models/notification";

export const notificationService = {
    async createNotification({ userId, message }: { userId: string; message: string }) {
        return await Notification.create({ userId, message, status: "unread" });
    },

    async sendNotification({ userId, message }: { userId: string; message: string }) {
        try {
            // Create notification in the database
            const notification = await this.createNotification({ userId, message });

            // Emit the notification via WebSocket
            io.to(userId).emit("notification", { message });

            console.log(`📩 Notification sent to user ${userId}: ${message}`);
            return notification;
        } catch (error) {
            console.error("❌ Error sending notification:", error);
            throw new Error("Failed to send notification");
        }
    },

    async findById(notificationId: number): Promise<Notification | null> {
        return await Notification.findByPk(notificationId);
    },

    async getUserNotifications(userId: number): Promise<Notification[]> {
        return await Notification.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
        });
    },

    async markAsRead(notificationId: number): Promise<Notification> {
        const notification = await Notification.findByPk(notificationId);
        if (!notification) throw new Error("Notification not found");

        await notification.update({ status: "READ" });
        return notification;
    },
};