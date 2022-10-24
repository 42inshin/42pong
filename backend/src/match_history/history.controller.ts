import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { MatchHistorysService } from "./history.service";
import { HistoryDto } from "./history.dto";
import { MatchHistory } from "src/Entitys/match.history.entity";

@Controller("MatchHistory")
export class MatchHistorysController {
  constructor(private matchHistoryService: MatchHistorysService, private userService: UsersService) {}

  @Post("/")
  async putHistory(@Body() historyDto: HistoryDto) {
    try {
      let player1 = await this.userService.getUserById(historyDto.player1);
      let player2 = await this.userService.getUserById(historyDto.player2);
      await this.matchHistoryService.putHistory(historyDto, player1, player2);
    } catch (e) {
      throw e;
    }
  }

  @Get("/:nickname")
  async getHistoryByNickname(@Param("nickname") nickname): Promise<MatchHistory[]> {
    console.log(nickname);
    return await this.matchHistoryService.getHistoryJoinUserByNickname(nickname);
  }
}
