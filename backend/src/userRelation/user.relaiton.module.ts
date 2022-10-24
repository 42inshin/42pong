import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmExModule } from "src/database/typeorm-ex-module";
import { UserRelation } from "src/Entitys/user.relaiton.entity";
import { UserRelationRepository } from "src/repository/user.relation.repository";
import { UserRelationService } from "./user.relaiton.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserRelation]), TypeOrmExModule.forCustomRepository([UserRelationRepository])],
  controllers: [],
  providers: [UserRelationService],
})
export class UserRelationModule {}
