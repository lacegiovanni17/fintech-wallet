import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: "credit" | "debit";

  @Column()
  amount!: number;

  @CreateDateColumn()
  timestamp!: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  user!: User;
}
