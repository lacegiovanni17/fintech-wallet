import { Model, Optional } from "sequelize";

export interface IUserModel extends Model  {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  balance?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserCreationAttributes extends Optional<IUserModel, "id" | "balance"> {}
