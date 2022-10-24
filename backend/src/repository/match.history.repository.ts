import { NotFoundException, HttpException } from "@nestjs/common";
import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { MatchHistory } from "src/Entitys/match.history.entity";
import { HistoryDto } from "src/match_history/history.dto";

@CustomRepository(MatchHistory)
export class MatchHistoryRepository extends Repository<MatchHistory> {
  async putHistory(history: MatchHistory) {
    await this.save(history);
  }

  async getHistoryJoinUserByNickname(nickname: string): Promise<MatchHistory[]> {
    let user = await this.find({
      relations: ["player1", "player2"],
      where: [{ player1: { nickname: nickname } }, { player2: { nickname: nickname } }],
    });
    return user;
  }
}
