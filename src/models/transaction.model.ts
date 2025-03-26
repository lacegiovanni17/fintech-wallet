import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Transaction", TransactionSchema);
