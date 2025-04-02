import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Transaction } from "../entities/Transaction";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.pass,
  database: env.db.name,
  synchronize: true,
  entities: [User, Transaction],
});
