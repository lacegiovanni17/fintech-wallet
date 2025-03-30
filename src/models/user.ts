import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/db';

export interface UserAttributes {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  google_id: string;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Model {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public google_id!: string;
  public balance!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // static associate(models: any) {
  //   User.hasMany(models.Payment, { foreignKey: 'userId', as: 'payments' });
  //   User.hasMany(models.Transaction, { foreignKey: 'senderId', as: 'sentTransactions' });
  //   User.hasMany(models.Transaction, { foreignKey: 'receiverId', as: 'receivedTransactions' });
  //   User.hasOne(models.Wallet, { foreignKey: 'userId', as: 'wallet' });
  //   User.hasMany(models.Notification, { foreignKey: 'userId', as: 'notifications' });
  // }
}

// export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      google_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      balance: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        get() {
          const rawValue = this.getDataValue("balance");
          return rawValue ? parseFloat(rawValue) : 0; // ✅ Ensure number on retrieval
      },
      },
    },
    {
      sequelize,
      tableName: 'Users',
      modelName: 'User',
      timestamps: true,
    }
  );

  export default User;
// };