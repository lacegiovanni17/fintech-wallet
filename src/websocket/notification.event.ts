import { io } from "../config/websocket";

export const sendNotification = (userId: string, message: string) => {
  io.to(userId).emit("notification", { message });
};
