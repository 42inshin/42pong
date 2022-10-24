import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "src/Entitys/channel.entity";
import { User } from "src/Entitys/user.entity";
import { CreateChannelDto } from "./channel.dto";
import { ChannelRepository } from "src/repository/channel.repository";
import * as bcrypt from "bcrypt";
import { ChannelParticipant } from "src/Entitys/channel.participant.entity";
import { ParticipantsService } from "src/participants/participants.service";
import { ChattingGateway } from "src/chatting/chatting.gateway";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelRepository)
    private channelRepository: ChannelRepository,
    private particiPantService: ParticipantsService,
    private userService: UsersService
  ) {}

  async getAllChannel(user: User): Promise<Channel[]> {
    let channels: Channel[] = await this.channelRepository.getAllChannel();
    for (let i = 0; i < channels.length; i++) {
      let participant = await this.particiPantService.getParticipant(user, channels[i]);
      if (participant) {
        for (let j = 0; j < channels[i].messages.length; j++) {
          if (channels[i].messages[j].createdAt.getTime() < participant.createdAt.getTime()) {
            channels[i].messages.splice(j, 1);
            j--;
          }
        }
      }
    }
    return channels;
  }

  async makeChannel(channel: CreateChannelDto, user: User) {
    if (channel.type == "private") {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(channel.password, salt);
      channel.password = hash;
    } else {
      channel.password = "";
    }
    return await this.channelRepository.makeChannel(channel, user);
  }

  async deleteChannel(channel: Channel) {
    await this.channelRepository.delete({
      id: channel.id,
    });
    return true;
  }

  async getChannelByOwnerId(ownerId: string) {
    let haha: Channel[] = await this.channelRepository.getChannelByOwnerId("aa");
    console.log(await bcrypt.compare("ab", haha[0].password));
  }

  async getChannelById(channel_id: number): Promise<Channel> {
    return await this.channelRepository.getChannelById(channel_id);
  }

  async getJoinChannelById(channel_id: number): Promise<Channel> {
    return await this.channelRepository.getJoinChannelById(channel_id);
  }

  async getAllParticipant(channel_id: number): Promise<ChannelParticipant[]> {
    let participants = await this.channelRepository.getAllParticipants(channel_id);
    return participants;
  }

  async changeType(channel_id: number): Promise<Channel> {
    return await this.channelRepository.changeType(channel_id);
  }

  async checkPassword(channel_id: number, password: string): Promise<Boolean> {
    let channel = await this.channelRepository.getChannelById(channel_id);
    if (channel.password) {
      let compare = bcrypt.compare(password, channel.password);
      return compare;
    } else {
      return true;
    }
  }

  async changePassword(channel_id: number, password: string): Promise<Channel> {
    let channel = await this.channelRepository.changePassword(channel_id, password);
    if (channel.type == "public") channel = await this.channelRepository.changeType(channel.id);
    return channel;
  }

  async deletePassword(channel_id: number): Promise<Channel> {
    return await this.channelRepository.deletePassword(channel_id);
  }

  async updatePassword(channel_id: number, password: string): Promise<Channel> {
    return await this.channelRepository.updatePassword(channel_id, password);
  }

  async deleteChannelByChannelName(name: string) {
    await this.channelRepository.deleteChannelByName(name);
  }

  async joinChannel(user: User, channel: Channel, password: string, chatGateway: ChattingGateway): Promise<Boolean> {
    let participant = await this.particiPantService.getParticipant(user, channel);
    console.log("user is already exist keep going");
    if (participant) {
      return true;
    }
    if (channel.type === "private") {
      let compare = await bcrypt.compare(password, channel.password);
      if (compare) {
        await this.particiPantService.addParticipant(false, false, user, channel, false);
        chatGateway.deligateJoin(user, channel);
        console.log(`${user.id} is join to ${channel.id}`);
        return true;
      } else {
        return false;
      }
    } else {
      await this.particiPantService.addParticipant(false, false, user, channel, false);
      chatGateway.deligateJoin(user, channel);
      console.log(`${user.id} is join to ${channel.id}`);
      return true;
    }
    return false;
  }

  async changeName(channel_id: number, name: string): Promise<Channel> {
    let channel = await this.channelRepository.changeName(channel_id, name);
    return channel;
  }

  async addBan(channel_id: number, user_id: string): Promise<Boolean> {
    let user = await this.userService.getUserById(user_id);
    return await this.channelRepository.addBan(channel_id, user);
  }

  async delBan(channel_id: number, user_id: string): Promise<Boolean> {
    let user = await this.userService.getUserById(user_id);
    return await this.channelRepository.delBan(channel_id, user);
  }

  async checkBan(channel_id: number, user_id: string): Promise<Boolean> {
    let user = await this.userService.getUserById(user_id);
    return await this.channelRepository.checkBan(channel_id, user);
  }

  async getBannedList(channel: Channel) : Promise<User[]>{
    return await this.channelRepository.getBannedList(channel);
  }
}
