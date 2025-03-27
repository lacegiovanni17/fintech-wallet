import { io } from "../config/websocket";

export const broadcastTransaction = (userId: string, transaction: any) => {
  io.to(userId).emit("transaction_update", transaction);
};
