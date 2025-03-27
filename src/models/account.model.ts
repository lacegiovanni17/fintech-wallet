import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface AccountAttributes {
  id: string;
  user_id: string;
  account_number: string;
  balance: number;
}

interface AccountCreationAttributes extends Optional<AccountAttributes, "id" | "balance"> {}

class Account extends Model<AccountAttributes, AccountCreationAttributes> {
  public id!: string;
  public user_id!: string;
  public account_number!: string;
  public balance!: number;
}

Account.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Account",
    tableName: "accounts",
  }
);

export default Account;
