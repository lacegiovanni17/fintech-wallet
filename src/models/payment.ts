import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

export interface PaymentAttributes {
  id?: string;
  userId: string;
  amount: number;
  status: string;
  paymentReference: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Payment extends Model {
  public id!: string;
  public userId!: string;
  public amount!: number;
  public status!: string;
  public paymentReference!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // static associate(models: any) {
  //   // Define associations (e.g., Payment belongs to a User)
  //   Payment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  // }
}

// export default (sequelize: Sequelize) => {
  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
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
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentReference: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Payments',
      modelName: 'Payment',
      timestamps: true,
    }
  );

  export default Payment;
// };