import { Injectable, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "src/Entitys/channel.entity";
import { ChannelParticipantRepository } from "src/repository/participant.repository";
import { User } from "src/Entitys/user.entity";

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(ChannelParticipantRepository)
    private participantRepository: ChannelParticipantRepository
  ) {}

  async addParticipant(admin: Boolean, muted: Boolean, user: User, channel: Channel, owner: Boolean): Promise<Boolean> {
    let exist = await this.participantRepository.getParticipant(user, channel);
    if (!exist) {
      let participant = await this.participantRepository.addParticipant(admin, muted, user, channel, owner);
      return true;
    } else {
      return true;
    }
  }

  async getAdmin(user: User, channel: Channel) {
    let getCp = await this.participantRepository.getParticipant(user, channel);
    if (getCp) {
      let tf = await this.participantRepository.getAdmin(getCp);
      return tf;
    }
    return false;
  }

  async changeAdmin(user: User, channel: Channel) {
    let getCp = await this.participantRepository.getParticipant(user, channel);
    getCp = await this.participantRepository.changeAdmin(getCp);
    return getCp;
  }

  async changeMuted(user: User, channel: Channel, value: Boolean) {
    let getCp = await this.participantRepository.getParticipant(user, channel);
    getCp = await this.participantRepository.changeMuted(getCp, value);
    return getCp;
  }

  async getParticipant(user: User, channel: Channel) {
    let getCp = await this.participantRepository.getParticipant(user, channel);
    return getCp;
  }

  async getChannelByUser(user: User): Promise<Channel[]> {
    return await this.participantRepository.getChannelByUser(user);
  }

  async getOwnerChannel(user: User) {
    return await this.participantRepository.getOwnerChannel(user);
  }

  async deleteParticipant(user: User, channel: Channel) {
    let getCp = await this.participantRepository.getParticipant(user, channel);
    if (getCp) {
      await this.participantRepository.deleteParticipant(getCp);
    } else {
      throw new HttpException("Invalid channel participant ( Not Exist)", 455);
    }
    return true;
  }
}
