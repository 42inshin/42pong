import { AfterUpdate, BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";
import { User } from "./user.entity";

@Entity()
export class ChannelParticipant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner: Boolean;

  @Column()
  admin: Boolean;

  @Column()
  muted: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user: User;

  @ManyToOne((type) => Channel, (channel) => channel.id, {
    onDelete: "CASCADE",
  })
  channel: Channel;

  @AfterUpdate()
  mutedtimer() {
    if (this.muted == true) {
      setTimeout(() => {
        this.muted = false;
        this.save();
      }, 10000);
    }
  }
}
