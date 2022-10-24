import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/Entitys/channel.entity';
import { ChannelMessage } from 'src/Entitys/channel.message.entity';
import { User } from 'src/Entitys/user.entity';
import { ChannelMessageRepository } from 'src/repository/channel.message.repository';

@Injectable()
export class ChannelMessageService {
  constructor(
    @InjectRepository(ChannelMessageRepository)
    private CMRepository: ChannelMessageRepository,
  ) {}

  async getMessageLimit50(channel :Channel) : Promise<ChannelMessage[] | undefined> {
    return await this.CMRepository.getDescLimit50ByChannel(channel);
  }

  async addMessage(user :User, channel :Channel, message :String) : Promise<ChannelMessage>{
    return await this.CMRepository.addMessage(user, channel, message);
  }

}
