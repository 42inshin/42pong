import { HttpModule } from "@nestjs/axios";
import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { ChannelModule } from "src/channel/channels.module";
import { ChannelsService } from "src/channel/channels.service";
import { CMModule } from "src/channel_message/CM.module";
import { ChannelMessageService } from "src/channel_message/CM.service";
import { CommandModule } from "src/command/command.module";
// import { CommandService } from "src/command/command.service";
import { TypeOrmExModule } from "src/database/typeorm-ex-module";
import { DMModule } from "src/dm/dm.module";
import { DMService } from "src/dm/dm.service";
import { Channel } from "src/Entitys/channel.entity";
import { ChannelMessage } from "src/Entitys/channel.message.entity";
import { ChannelParticipant } from "src/Entitys/channel.participant.entity";
import { DM } from "src/Entitys/direct.message.entity";
import { User } from "src/Entitys/user.entity";
import { ParticipantsModule } from "src/participants/participants.module";
import { ParticipantsService } from "src/participants/participants.service";
import { ChannelMessageRepository } from "src/repository/channel.message.repository";
import { ChannelRepository } from "src/repository/channel.repository";
import { DMRepository } from "src/repository/DM.repository";
import { ChannelParticipantRepository } from "src/repository/participant.repository";
import { UserRepository } from "src/repository/user.repository";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";
import { ChattingGateway } from "./chatting.gateway";
import { LoginUserGateway } from "./current.login.gateway";
import { GameGateway } from "src/game/game.gateway";
import { MatchHistorysService } from "src/match_history/history.service";
import { MatchHistoryRepository } from "src/repository/match.history.repository";
import { MatchHistory } from "src/Entitys/match.history.entity";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User, ChannelParticipant, ChannelMessage, DM, MatchHistory]),
    TypeOrmExModule.forCustomRepository([ChannelRepository, UserRepository, ChannelParticipantRepository, ChannelMessageRepository, DMRepository, MatchHistoryRepository]),
    AuthModule,
    ChannelModule,
    UsersModule,
    HttpModule,
    ParticipantsModule,
    CMModule,
    CommandModule,
    DMModule,
  ],
  providers: [ChattingGateway, AuthService, ChannelsService, UsersService, ParticipantsService, LoginUserGateway, ChannelMessageService, DMService, GameGateway, MatchHistorysService],
  exports: [ChattingGateway, LoginUserGateway, GameGateway],
})
export class ChattingModule {}
