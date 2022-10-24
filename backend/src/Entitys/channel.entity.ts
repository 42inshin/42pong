import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ChannelMessage } from "./channel.message.entity";
import { ChannelParticipant } from "./channel.participant.entity";
import { User } from "./user.entity";

@Entity()
export class Channel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany((type) => ChannelParticipant, (participant) => participant.channel, {
    onDelete: "CASCADE",
  })
  participants: ChannelParticipant[];

  @ManyToOne((type) => User, (user) => user.channels, {
    onDelete: "CASCADE",
  })
  owner: User;

  @OneToMany((type) => ChannelMessage, (cm) => cm.channel)
  messages: ChannelMessage[];

  @ManyToMany( (type) => User)
  @JoinTable()
  ban_users: User[];

}
