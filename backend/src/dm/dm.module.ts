import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmExModule } from "src/database/typeorm-ex-module";
import { DM } from "src/Entitys/direct.message.entity";
import { User } from "src/Entitys/user.entity";
import { DMRepository } from "src/repository/DM.repository";
import { UserRepository } from "src/repository/user.repository";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";
import { DMService } from "./dm.service";

@Module({
  imports: [TypeOrmModule.forFeature([DM]), TypeOrmExModule.forCustomRepository([DMRepository])],
  providers: [DMService],
})
export class DMModule {}
