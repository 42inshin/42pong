import { IsNotEmpty, IsString, isString } from "class-validator";
import { User } from "src/Entitys/user.entity";

export class CreateChannelDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  password: string;

  createdAt: Date;

  ownerId: User;
}
