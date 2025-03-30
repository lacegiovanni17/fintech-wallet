import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

export interface TransactionAttributes {
  id?: string;
  senderId: string;
  receiverId: string;
  amount: number;
  type: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt?: Date;
  updatedAt?: Date;
}

export class Transaction extends Model  {
  public id!: string;
  public senderId!: string;
  public receiverId!: string;
  public amount!: number;
  public type!: string;
  public status!: 'PENDING' | 'SUCCESS' | 'FAILED';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // static associate(models: any) {
  //   Transaction.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
  //   Transaction.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
  // }
}

// export default (sequelize: Sequelize) => {
  Transaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        // references: {
        //   model: 'Users',
        //   key: 'id',
        // },
        // onDelete: 'CASCADE',
        // onUpdate: 'CASCADE',
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
    },
    {
      sequelize,
      tableName: 'Transactions',
      modelName: 'Transaction',
      timestamps: true,
    }
  );

  export default Transaction;
// };