import { IsNotEmpty, IsNumber, IsString, isString } from "class-validator";
import { User } from "src/Entitys/user.entity";

export class HistoryDto {
  @IsNumber()
  player1score: number;

  @IsNumber()
  player2score: number;

  player1: string;
  player2: string;

  gameMode: string;
}
