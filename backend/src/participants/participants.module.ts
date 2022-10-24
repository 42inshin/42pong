import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmExModule } from "src/database/typeorm-ex-module";
import { ChannelParticipant } from "src/Entitys/channel.participant.entity";
import { ParticipantsService } from "src/participants/participants.service";
import { ChannelParticipantRepository } from "src/repository/participant.repository";

@Module({
  imports: [TypeOrmModule.forFeature([ChannelParticipant]), TypeOrmExModule.forCustomRepository([ChannelParticipantRepository])],
  controllers: [],
  providers: [ParticipantsService],
})
export class ParticipantsModule {}
