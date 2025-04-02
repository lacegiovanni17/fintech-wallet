import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transaction } from "./Transaction";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: 0 })
  balance!: number;

  @Column({ nullable: true, unique: true }) // 👈 add this
  googleId!: string;

  @OneToMany(() => Transaction, (tx) => tx.user)
  transactions!: Transaction[];
}
