import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity()
export class ChannelMessage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  }) // specify inverse side as a second parameter
  @JoinColumn()
  sender: User;

  @ManyToOne(() => Channel, {
    onDelete: 'CASCADE',
  }) // specify inverse side as a second parameter
  @JoinColumn()
  channel: Channel;

  @Column()
  message: String;

  @CreateDateColumn()
  createdAt: Date;
}
