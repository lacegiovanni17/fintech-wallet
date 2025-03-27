import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/db";

interface UserAttributes {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  balance: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "balance"> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: string;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public password!: string;
  public phone_number!: string;
  public balance!: number;

  // Hash password before saving to DB
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Compare passwords
  async comparePassword(candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
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
    modelName: "User",
    tableName: "users",
    hooks: {
      beforeCreate: async (user) => {
        await user.hashPassword();
      },
    },
  }
);

export default User;
