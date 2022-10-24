import { NotFoundException, HttpException } from "@nestjs/common";
import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Channel } from "src/Entitys/channel.entity";
import { User } from "src/Entitys/user.entity";
import { MoreThan, Repository } from "typeorm";
import { CreateChannelDto } from "src/channel/channel.dto";
import * as bcrypt from "bcrypt";
import { ChannelParticipant } from "src/Entitys/channel.participant.entity";
import { ChannelMessage } from "src/Entitys/channel.message.entity";

@CustomRepository(Channel)
export class ChannelRepository extends Repository<Channel> {
  async getAllChannel(): Promise<Channel[]> {
    let allChannel = await this.find({
      relations: ["participants", "owner", "messages", "messages.sender"],
      where: [{ type: "public" }, { type: "private" }],
      order: {
        id: "ASC",
        messages: {
          id: "ASC",
        },
      },
    });
    return allChannel;
  }

  async getAllChannelJoin(): Promise<Channel[]> {
    const allChannel = this.find({
      relations: ["participants", "owner"],
    });
    return allChannel;
  }

  async getJoinChannelById(id: number): Promise<Channel> {
    const allChannel = this.findOne({
      relations: ["participants", "owner"],
      where: {
        id: id,
      },
    });
    return allChannel;
  }

  async makeChannel(channel: CreateChannelDto, user: User) {
    let tmp = new Channel();
    tmp.name = channel.name;
    tmp.password = channel.password;
    tmp.type = channel.type;
    tmp.owner = user;
    return await this.save(tmp);
  }

  async getChannelByOwnerId(aa: string) {
    let haha = await this.find({
      where: {
        type: "private",
        id: 28,
      },
    });
    return haha;
  }

  async getChannelById(id: number): Promise<Channel> {
    let data = await this.findOne({
      where: {
        id: id,
      },
    });
    return data;
  }

  async getAllParticipants(id: number): Promise<ChannelParticipant[]> {
    let data = await this.findOne({
      where: { id: id },
      relations: ["participants", "participants.user"],
    });
    return data.participants;
  }

  async changeType(channel_id: number): Promise<Channel> {
    let data = await this.findOne({
      where: { id: channel_id },
    });
    if (data.type == "public") {
      data.type = "private";
    } else data.type = "public";
    return await this.save(data);
  }

  async changePassword(channel_id: number, password: string): Promise<Channel> {
    let data = await this.findOne({
      where: { id: channel_id },
    });
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    data.password = hash;
    await this.update(data.id, data);
    return data;
  }

  async changeName(channel_id: number, name: string): Promise<Channel> {
    let data = await this.findOne({
      where: { id: channel_id },
    });
    data.name = name;
    await this.update(data.id, data);
    return data;
  }

  async deletePassword(channel_id): Promise<Channel> {
    let data = await this.findOne({
      where: { id: channel_id },
    });
    data.password = "";
    data.type = "public";
    return await this.save(data);
  }

  async updatePassword(channel_id: number, password: string): Promise<Channel> {
    let data = await this.findOne({
      where: { id: channel_id },
    });
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    data.password = hash;
    return await this.save(data);
  }

  async deleteChannelByName(name: string) {
    let channels = await this.find({
      where: {
        name: name,
      },
    });
    if (channels) {
      channels.forEach((channel) => {
        this.delete(channel.id);
      });
    }
  }

  async addBan(channel_id: number, user: User): Promise<Boolean> {
    let exist = false;
    let channel = await this.findOne({
      relations: ["ban_users"],
      where: {
        id: channel_id,
      },
    });
    channel.ban_users.forEach((data) => {
      if (data.id == user.id) {
        exist = true;
      }
    });

    if (!exist) {
      channel.ban_users.push(user);
      await this.save(channel);
      return true;
    } else {
      return false;
    }
  }

  async delBan(channel_id: number, user: User): Promise<Boolean> {
    let channel = await this.findOne({
      relations: ["ban_users"],
      where: {
        id: channel_id,
      },
    });
    channel.ban_users.forEach(function (data: User, index: number, object: User[]) {
      if (data.id == user.id) {
        object.splice(index, 1);
      }
    });
    await this.save(channel);
    return true;
  }

  async checkBan(channel_id: number, user: User): Promise<Boolean> {
    let exist = false;
    let channel = await this.findOne({
      relations: ["ban_users"],
      where: {
        id: channel_id,
      },
    });
    channel.ban_users.forEach((data) => {
      if (data.id == user.id) {
        exist = true;
      }
    });
    if (exist) {
      return true;
    } else {
      return false;
    }
  }

  async getBannedList(channel: Channel): Promise<User[]> {
    let tmp = await this.findOne({
      relations: ["ban_users"],
      where: {
        id: channel.id,
      },
    });
    return tmp.ban_users;
  }
}
