import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

export interface NotificationAttributes {
  id?: string;
  userId: string;
  message: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Notification extends Model {
  public id!: string;
  public userId!: string;
  public message!: string;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // static associate(models: any) {
  //   // Define associations here (e.g., Notification belongs to a User)
  //   Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  // }
}

// export default (sequelize: Sequelize) => {
  Notification.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Notifications',
      modelName: 'Notification',
      timestamps: true,
    }
  );

  export default Notification;
// };