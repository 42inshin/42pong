import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmExModule } from "src/database/typeorm-ex-module";
import { MatchHistory } from "src/Entitys/match.history.entity";
import { User } from "src/Entitys/user.entity";
import { MatchHistoryRepository } from "src/repository/match.history.repository";
import { ChannelParticipantRepository } from "src/repository/participant.repository";
import { UserRepository } from "src/repository/user.repository";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";
import { MatchHistorysController } from "./history.controller";
import { MatchHistorysService } from "./history.service";

@Module({
  imports: [TypeOrmModule.forFeature([MatchHistory, User]), TypeOrmExModule.forCustomRepository([MatchHistoryRepository, UserRepository])],
  controllers: [MatchHistorysController],
  providers: [MatchHistorysService, UsersService],
})
export class MatchHistoryModule {}
