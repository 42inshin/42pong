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
export class MatchHistory extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	player1Score: number;

	@Column()
	player2Score: number;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne((type) => User, (user) => user.id, {
		onDelete: "CASCADE",
	})
	player1: User;

	@ManyToOne((type) => User, (user) => user.id, {
		onDelete: "CASCADE",
	})
	player2: User;

	@Column()
	gameMode: string;
}
