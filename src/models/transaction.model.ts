import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface TransactionAttributes {
  id: string;
  sender_id: string;
  receiver_id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, "id" | "status"> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> {
  public id!: string;
  public sender_id!: string;
  public receiver_id!: string;
  public amount!: number;
  public status!: "pending" | "completed" | "failed";
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Transaction",
    tableName: "transactions",
  }
);

export default Transaction;
