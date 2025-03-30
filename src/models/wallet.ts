import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

export interface WalletAttributes {
  id?: string;
  userId: string;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Wallet extends Model {
  public id!: string;
  public userId!: string;
  public balance!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // static associate(models: any) {
  //   Wallet.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  // }
}

// export default (sequelize: Sequelize) => {
  Wallet.init(
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
      balance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        get() {
          const value = this.getDataValue('balance');
          return parseFloat(value);
        }
      },
    },
    {
      sequelize,
      tableName: 'Wallets',
      modelName: 'Wallet',
      timestamps: true,
    }
  );

  export default Wallet;
// };