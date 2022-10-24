import { Body, Controller, Get, HttpException, Post, Request, Response, UseGuards, UseInterceptors, UploadedFile, Param, UnauthorizedException, Delete, Query, HttpStatus } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { existsSync } from "fs";
import * as fs from "fs";
import { diskStorage } from "multer";
import { join } from "path";
import { User } from "../Entitys/user.entity";
import { UsersService } from "./users.service";
import { TMP, imageFileFilter, UserStatusType } from "src/util";
import { TwoFactorAuthenticationService } from "src/auth/2FA/twoFactorAuthentication.service";
import JwtTwoFactorGuard from "src/auth/jwt/jwt-two-factor.guard";
import { AuthService } from "src/auth/auth.service";
import { UserRelationService } from "src/userRelation/user.relaiton.service";
import { DMService } from "src/dm/dm.service";
import { DM } from "src/Entitys/direct.message.entity";
import { LoginUserGateway } from "src/chatting/current.login.gateway";
import { ChattingGateway } from "src/chatting/chatting.gateway";
import { randomInt } from "crypto";
import { ConfigService } from "@nestjs/config";

@Controller("users")
export class UsersController {
  constructor(
    private userService: UsersService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private authService: AuthService,
    private relationService: UserRelationService,
    private dmService: DMService,
    private rootGateway: LoginUserGateway,
    private chatGateway: ChattingGateway,
    private configService: ConfigService
  ) {}

  @Post("/login")
  async login(@Response() res, @Body("code") code: string) {
    console.log(this.configService.get("JWT_ACCESS_TOKEN_SECRET"));
    console.log(this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME"));
    console.log(this.configService.get("ClIENT_42_ID"));
    console.log(this.configService.get("CLIENT_42_SECRET"));
    const tmp = await this.authService.getResourceOwnerId(code);
    console.log(tmp);
    if (tmp == "-1") {
      throw new HttpException("Can't get resourceOwner ID", HttpStatus.BAD_REQUEST);
    } else {
      if ((await this.userService.checkUser(tmp)) == false) {
        await this.userService.createUser(tmp);
      }
      const user = await this.userService.getUserById(tmp);
      const payload = { id: tmp, sub: tmp };
      if (user.status == 0) {
        const jwt = await this.authService.sign(payload);
        await this.userService.updateStatus(user, UserStatusType.ONLINE, this.rootGateway);
        console.log(jwt);
        res.setHeader("Authorization", "Bearer " + jwt);
        res.cookie("jwt", jwt, {
          maxAge: 60 * 60 * 1000,
        });
        return res.send(user);
      } else {
        throw new HttpException("Already Logged in User", HttpStatus.CONFLICT);
      }
    }
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get("/")
  async getUserById(@Request() req): Promise<User> {
    return this.userService.getUserById(req.user.id);
  }

  @Get("/avatar/:id")
  async getAvatar(@Request() req, @Response() res, @Param("id") id) {
    let path = join(process.cwd(), "./src/users/avatar/" + id + ".png");
    console.log("1:", path);
    if (existsSync(path)) {
      res.sendFile(path);
      console.log("2:", path);
    } else {
      path = join(process.cwd(), "./src/users/avatar/" + id + ".svg");
      console.log("3:", path);
      if (existsSync(path)) {
        res.sendFile(path);
      } else {
        throw new HttpException("Not exist avatar file", 454);
      }
    }
  }

  @Post("/")
  @UseGuards(JwtTwoFactorGuard)
  async createUser(@Request() req, @Body() body) {
    const user = this.userService.createUser(req.user.id);
    return user;
  }

  @Get("/nickname")
  @UseGuards(JwtTwoFactorGuard)
  async getUserByNickname(@Request() req, @Query("nickname") nickname) {
    return await this.userService.getUserByNickname(nickname);
  }

  @Get("/id")
  @UseGuards(JwtTwoFactorGuard)
  async getUserById2(@Query("id") id) {
    return await this.userService.getUserById(id);
  }

  @Post("/nickname")
  @UseGuards(JwtTwoFactorGuard)
  async createNickname(@Request() req, @Body("nickname") nickname) {
    let user = await this.userService.updateNickname(nickname, req.user.id);
    this.rootGateway.broadCastingEvent("change_nickname", {
      id: user.id,
      nickname: user.nickname,
      avatarPath: user.avatarPath,
      status: user.status,
    });
    // this.chatGateway.broadCastingEvent("change_data", {
    //   id: user.id,
    //   nickname: user.nickname,
    //   avatarPath: user.avatarPath,
    //   status: user.status,
    // });
    return user;
  }

  @UseGuards(JwtTwoFactorGuard)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./src/users/avatar",
        filename: (req, file, cb) => {
          let p1: TMP = {};
          p1 = req.user;
          let filename = p1.id + "-" + randomInt(100);
          cb(null, filename + ".png");
        },
      }),
      fileFilter: imageFileFilter,
    })
  )
  @Post("/avatar")
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    let user = await this.userService.getUserById(req.user.id);
    let path = "/api/users/avatar/" + file.filename.replace(/\.[^/.]+$/, "");

    let filename = user.avatarPath.replace(/^.*[\\\/]/, "");
    if (!filename.includes("profile")) {
      fs.unlinkSync(join(process.cwd(), "./src/users/avatar/" + filename + ".png"));
    }
    let user2 = await this.userService.updateAvatar(user, path);
    this.rootGateway.broadCastingEvent("change_avatar", {
      id: user2.id,
      avatarPath: user2.avatarPath,
    });
    // this.chatGateway.broadCastingEvent("change_data", {
    //   id: user2.id,
    //   nickname: user2.nickname,
    //   avatarPath: user2.avatarPath,
    //   status: user2.status,
    // });
    //return file.destination.substring(file.destination.indexOf("users")) + "/" + req.user.id;
    return "success";
  }

  @Post("/avatar/default")
  @UseGuards(JwtTwoFactorGuard)
  async changeDefaultAvatar(@Request() req, @Body("number") number) {
    let user = await this.userService.getUserById(req.user.id);
    let user2 = await this.userService.changeDefaultAvatar(user, number);
    this.rootGateway.broadCastingEvent("change_avatar", {
      id: user2.id,
      avatarPath: user2.avatarPath,
    });
    // this.chatGateway.broadCastingEvent("change_data", {
    //   id: user2.id,
    //   nickname: user2.nickname,
    //   avatarPath: user2.avatarPath,
    //   status: user2.status,
    // });
    //return file.destination.substring(file.destination.indexOf("users")) + "/" + req.user.id;
    return user.avatarPath;
  }

  @Get("generate")
  @UseGuards(JwtTwoFactorGuard)
  async register(@Request() req) {
    const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(req.user);
    return otpauthUrl;
  }

  @Post("turn-on")
  @UseGuards(JwtTwoFactorGuard)
  async turnOnTwoFactorAuthentication(@Request() req, @Body("code") code) {
    let user = await this.userService.getUserById(req.user.id);
    const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(code, user);
    console.log(`twofactor code  :  ${isCodeValid}`);
    if (!isCodeValid) {
      console.log("fail");
      throw new UnauthorizedException("Wrong authentication code");
    }
    await this.userService.turnOnTwoFactorAuthentication(req.user.id);
  }

  @Post("turn-off")
  @UseGuards(JwtTwoFactorGuard)
  async turnOffTwoFactorAuthentication(@Request() req) {
    await this.userService.turnOffTwoFactorAuthentication(req.user.id);
    console.log(`turn off`);
  }

  @Get("login-user")
  //@UseGuards(JwtTwoFactorGuard)
  async getCurrentLoginUser() {
    let loginUser = await this.userService.getCurrentLoginUser();
    return loginUser;
  }

  //<----------------------------------------------------------------------->//
  @Post("friends")
  @UseGuards(JwtTwoFactorGuard)
  async makeFriends(@Request() req, @Body("id") user_id) {
    let self = await this.userService.getUserById(req.user.id);
    let friend = await this.userService.getUserById(user_id);
    console.log(`${self.nickname} - ${friend.nickname}`);
    this.rootGateway.deligateClientEmit("add_friend", self.id, friend);
    return await this.relationService.setFriend(self, friend);
  }

  @Get("friends")
  @UseGuards(JwtTwoFactorGuard)
  async getFriends(@Request() req) {
    let user = await this.userService.getUserById(req.user.id);
    return await this.relationService.getFrinedsByUser(user);
  }

  @Delete("friends/:id")
  @UseGuards(JwtTwoFactorGuard)
  async deleteFriends(@Request() req, @Param("id") user_id: string) {
    let self = await this.userService.getUserById(req.user.id);
    let friend = await this.userService.getUserById(user_id);
    this.rootGateway.deligateClientEmit("del_friend", self.id, friend);
    return await this.relationService.deleteRelation(self, friend);
  }

  @Post("block")
  @UseGuards(JwtTwoFactorGuard)
  async makeBlock(@Request() req, @Body("id") user_id) {
    console.log("makeBlock", user_id);
    let self = await this.userService.getUserById(req.user.id);
    let user = await this.userService.getUserById(user_id);
    console.log(user);
    this.rootGateway.deligateClientEmit("add_block", self.id, user);
    return await this.relationService.setBlock(self, user);
  }

  @Get("block")
  @UseGuards(JwtTwoFactorGuard)
  async getBlock(@Request() req) {
    let user = await this.userService.getUserById(req.user.id);
    return await this.relationService.getBlocksByUser(user);
  }

  @Delete("block")
  @UseGuards(JwtTwoFactorGuard)
  async deleteBlock(@Request() req, user_id: string) {
    let self = await this.userService.getUserById(req.user.id);
    let user = await this.userService.getUserById(user_id);
    return await this.relationService.deleteRelation(self, user);
  }

  @Get("dm")
  @UseGuards(JwtTwoFactorGuard)
  async getDM(@Request() req, @Query("id") user_id): Promise<DM[]> {
    let user = await this.userService.getUserById(req.user.id);
    let user2 = await this.userService.getUserById(user_id);
    return await this.dmService.getDM(user, user2);
  }

  @Get("RankingList")
  @UseGuards(JwtTwoFactorGuard)
  async getRankingList() {
    return await this.userService.getRankingList();
  }
}
