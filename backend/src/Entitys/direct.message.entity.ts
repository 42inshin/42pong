import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class DM extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  from: User;

  @ManyToOne((type) => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  to: User;
}
