import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { Channel } from 'src/Entitys/channel.entity';
import { ChannelMessage } from 'src/Entitys/channel.message.entity';
import { ChannelParticipant } from 'src/Entitys/channel.participant.entity';
import { User } from 'src/Entitys/user.entity';
import { ParticipantsService } from 'src/participants/participants.service';
import { ChannelMessageRepository } from 'src/repository/channel.message.repository';
import { ChannelParticipantRepository } from 'src/repository/participant.repository';
import { ChannelMessageService } from './CM.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelMessage, User, Channel]),
    TypeOrmExModule.forCustomRepository([ChannelMessageRepository]),
  ],
  controllers: [],
  providers: [
    ChannelMessageService,
  ],
})
export class CMModule {}
