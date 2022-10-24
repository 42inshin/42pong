import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MatchHistoryRepository } from "src/repository/match.history.repository";
import { MatchHistory } from "src/Entitys/match.history.entity";
import { HistoryDto } from "./history.dto";
import { User } from "src/Entitys/user.entity";

@Injectable()
export class MatchHistorysService {
  constructor(
    @InjectRepository(MatchHistoryRepository)
    private matchHistoryRepository: MatchHistoryRepository
  ) {}

  async putHistory(historyDto: HistoryDto, player1: User, player2: User) {
    let history = new MatchHistory();
    if (!player1 || !player2) throw new BadRequestException("not exist user");
    history.player1 = player1;
    history.player1Score = historyDto.player1score;
    history.player2 = player2;
    history.player2Score = historyDto.player2score;
    history.gameMode = historyDto.gameMode;
    this.matchHistoryRepository.putHistory(history);
  }

  async getHistoryJoinUserByNickname(nickname: string) {
    let user = await this.matchHistoryRepository.getHistoryJoinUserByNickname(nickname);
    return user;
  }
}
