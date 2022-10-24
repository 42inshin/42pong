import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TwoFactorAuthenticationService } from "src/auth/2FA/twoFactorAuthentication.service";
import { AuthModule } from "src/auth/auth.module";
import { JwtTwoFactorStrategy } from "src/auth/jwt/jwt-two-factor.strategy";
import { ChattingGateway } from "src/chatting/chatting.gateway";
import { ChattingModule } from "src/chatting/chatting.module";
import { LoginUserGateway } from "src/chatting/current.login.gateway";
import { TypeOrmExModule } from "src/database/typeorm-ex-module";
import { DMModule } from "src/dm/dm.module";
import { DMService } from "src/dm/dm.service";
import { DM } from "src/Entitys/direct.message.entity";
import { UserRelation } from "src/Entitys/user.relaiton.entity";
import { DMRepository } from "src/repository/DM.repository";
import { UserRelationRepository } from "src/repository/user.relation.repository";
import { UserRelationModule } from "src/userRelation/user.relaiton.module";
import { UserRelationService } from "src/userRelation/user.relaiton.service";
import { User } from "src/Entitys/user.entity";
import { UserRepository } from "src/repository/user.repository";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRelation, DM]),
    TypeOrmExModule.forCustomRepository([UserRepository, UserRelationRepository, DMRepository]),
    MulterModule.register({
      dest: "./src/users/avatar",
    }),
    AuthModule,
    UserRelationModule,
    DMModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRelationService, TwoFactorAuthenticationService, JwtTwoFactorStrategy, DMService],
  exports: [UsersService],
})
export class UsersModule {}
