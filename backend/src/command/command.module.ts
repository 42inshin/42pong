import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { ChannelModule } from "src/channel/channels.module";
import { ChannelsService } from "src/channel/channels.service";
import { CMModule } from "src/channel_message/CM.module";
import { ChannelMessageService } from "src/channel_message/CM.service";
import { TypeOrmExModule } from "src/database/typeorm-ex-module";
import { Channel } from "src/Entitys/channel.entity";
import { ChannelMessage } from "src/Entitys/channel.message.entity";
import { ChannelParticipant } from "src/Entitys/channel.participant.entity";
import { User } from "src/Entitys/user.entity";
import { ParticipantsModule } from "src/participants/participants.module";
import { ParticipantsService } from "src/participants/participants.service";
import { ChannelMessageRepository } from "src/repository/channel.message.repository";
import { ChannelRepository } from "src/repository/channel.repository";
import { ChannelParticipantRepository } from "src/repository/participant.repository";
import { UserRepository } from "src/repository/user.repository";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmExModule.forCustomRepository([UserRepository]), UsersModule],
  providers: [UsersService],
})
export class CommandModule {}
