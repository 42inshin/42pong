import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Channel } from "./channel.entity";
import { ChannelMessage } from "./channel.message.entity";
import { ChannelParticipant } from "./channel.participant.entity";
import { DM } from "./direct.message.entity";

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  nickname: string;

  @Column()
  win: number;

  @Column()
  lose: number;

  @Column()
  ladder_win: number;

  @Column()
  ladder_lose: number;

  @Column()
  admin: boolean;

  @Column()
  avatarPath: string;

  @Column()
  status: number;

  @Column({ nullable: true })
  twoFactorAuthenticationSecret: string;

  @Column()
  isTwoFactorAuthenticationEnabled: boolean;

  @Column({ nullable: true })
  lating: number;

  @OneToMany((type) => Channel, (channels) => channels.owner)
  channels: Channel[];

  @OneToMany((type) => ChannelParticipant, (participant) => participant.user)
  participants: ChannelParticipant[];

  @OneToMany((type) => ChannelMessage, (cm) => cm.sender)
  messages: ChannelMessage[];

  @OneToMany((type) => DM, (dm) => dm.to)
  to: DM[];

  @OneToMany((type) => DM, (dm) => dm.from)
  from: DM[];

  @ManyToMany( (type) => Channel, (channel) => channel.ban_users)
  ban_channels: Channel[];
}
