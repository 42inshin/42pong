import { NotFoundException, HttpException } from "@nestjs/common";
import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Channel } from "src/Entitys/channel.entity";
import { ChannelParticipant } from "src/Entitys/channel.participant.entity";
import { User } from "src/Entitys/user.entity";
import { Repository } from "typeorm";

@CustomRepository(ChannelParticipant)
export class ChannelParticipantRepository extends Repository<ChannelParticipant> {
  async addParticipant(admin: Boolean, muted: Boolean, user: User, channel: Channel, owner: Boolean) {
    let exist = await this.getParticipant(user, channel);
    if (!exist) {
      let tmp = new ChannelParticipant();
      tmp.admin = admin;
      tmp.muted = muted;
      tmp.user = user;
      tmp.channel = channel;
      tmp.owner = owner;
      let haha = await this.save(tmp);
      return haha;
    } else {
      throw new HttpException("Already exist user", 409);
    }
  }

  async getParticipant(user2: User, channel: Channel) {
    let getUser = await this.findOne({
      relations: ["user", "channel"],
      where: { user: { id: user2.id }, channel: { id: channel.id } },
    });
    return getUser;
  }

  async getParticipantByChannel(channel: Channel): Promise<ChannelParticipant[]> {
    let getUser = await this.find({
      relations: ["user", "channel"],
      where: { channel: { id: channel.id } },
    });
    return getUser;
  }

  async getAdmin(cp: ChannelParticipant) {
    let getCp = await this.findOne({
      where: { id: cp.id },
    });
    return getCp.admin;
  }

  async changeAdmin(cp: ChannelParticipant) {
    let getCp = await this.findOne({
      where: { id: cp.id },
    });
    getCp.admin = !getCp.admin;
    return await this.save(getCp);
  }

  async changeMuted(cp: ChannelParticipant, value: Boolean) {
    let getCp = await this.findOne({
      where: { id: cp.id },
    });
    getCp.muted = value;
    await this.update(getCp.id, getCp);
    return getCp;
  }

  async getChannelByUser(user: User): Promise<Channel[]> {
    let channels: Channel[] = new Array();
    let participants = await this.find({
      relations: ["user", "channel"],
      where: {
        user: {
          id: user.id,
        },
      },
    });
    participants.forEach((participant) => {
      channels.push(participant.channel);
    });
    return channels;
  }
  async getOwnerChannel(user: User): Promise<number[]> {
    let channels: number[] = new Array();
    let participants = await this.find({
      relations: ["user", "channel"],
      where: {
        owner: true,
        user: {
          id: user.id,
        },
      },
    });
    participants.forEach((tmp) => {
      channels.push(tmp.channel.id);
    });
    return channels;
  }

  async deleteParticipant(participant: ChannelParticipant) {
    await this.delete(participant.id);
  }
}
