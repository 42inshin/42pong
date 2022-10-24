import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMessageService } from 'src/channel_message/CM.service';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { Channel } from 'src/Entitys/channel.entity';
import { ChannelMessage } from 'src/Entitys/channel.message.entity';
import { ChannelParticipant } from 'src/Entitys/channel.participant.entity';
import { User } from 'src/Entitys/user.entity';
import { ParticipantsModule } from 'src/participants/participants.module';
import { ParticipantsService } from 'src/participants/participants.service';
import { ChannelMessageRepository } from 'src/repository/channel.message.repository';
import { ChannelParticipantRepository } from 'src/repository/participant.repository';
import { UserRepository } from 'src/repository/user.repository';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { ChannelRepository } from '../repository/channel.repository';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User,ChannelParticipant, ChannelMessage]),
    TypeOrmExModule.forCustomRepository([ChannelRepository, UserRepository, ChannelParticipantRepository, ChannelMessageRepository]),
    UsersModule,
    ParticipantsModule,
  ],
  controllers: [ChannelsController],
  providers: [
    ChannelsService,
    UsersService,
    ParticipantsService,
    ChannelMessageService
  ],
})
export class ChannelModule {}
