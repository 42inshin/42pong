import { Injectable, HttpException, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomInt } from "crypto";
import { LoginUserGateway } from "src/chatting/current.login.gateway";
import { CurrentUserDto, RankListDto, UserStatusType } from "src/util";
import { User } from "src/Entitys/user.entity";
import { UserRepository } from "src/repository/user.repository";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async checkValidNickname(nickname: string): Promise<Boolean> {
    const pattern1 = /^[a-z|A-Z|가-힣|0-9|]+$/;
    const pattern2 = /\s/;
    if (!pattern1.test(nickname) || pattern2.test(nickname) || nickname.length > 10 || nickname.length == 0) {
      return false;
    }
    let user = await this.userRepository.getUserByNickname(nickname);
    if (user) return false;
    return true;
  }

  async getUserById(id2: string): Promise<User> {
    const found = await this.userRepository.findOne({
      where: {
        id: id2,
      },
    });
    return found;
  }

  async createUser(id: string): Promise<User> {
    const user = await this.userRepository.createUser(id);
    return user;
  }

  async checkUser(id: string): Promise<Boolean> {
    return await this.userRepository.checkUser(id);
  }

  async getUserByNickname(nickname: string): Promise<User> {
    const found = await this.userRepository.getUserByNickname(nickname);
    return found;
  }

  async getUserById2(id: string) {
    return await this.userRepository.getUserById(id);
  }

  async updateNickname(nickname: string, userid: string): Promise<User> {
    let valid = await this.checkValidNickname(nickname);
    console.log(`valid = ${valid}`);
    if (valid) {
      let user = await this.userRepository.updateNickname(nickname, userid);
      console.log(`valid2`);
      return user;
    } else {
      throw new HttpException("Invalid Nickname", 453);
    }
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    return await this.userRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async turnOnTwoFactorAuthentication(userId: string) {
    return await this.userRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  async turnOffTwoFactorAuthentication(userId: number) {
    return await this.userRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: false,
    });
  }

  async getOwnerChannel(userid: string) {
    return await this.userRepository.getOwnerChannel(userid);
  }

  async updateStatus(user: User, type: UserStatusType, a: LoginUserGateway): Promise<User> {
    let tmp = await this.userRepository.updateStatus(user, type);
	console.log(`change status user: ${tmp.nickname} set status = ${tmp.status}`);
	a.broadCastingEvent("change_status", {
		id: tmp.id,
		nickname: tmp.nickname,
		avatarPath: tmp.avatarPath,
		status: tmp.status,
	  });
	  return tmp;
  }

  async getCurrentLoginUser() {
    let ret: CurrentUserDto[] = new Array();
    let users = await this.userRepository.getCurrentLoginUser();
    users.forEach((user: User) => {
      let tmp: CurrentUserDto = new CurrentUserDto();
      tmp.id = user.id;
      tmp.avatarPath = user.avatarPath;
      tmp.nickname = user.nickname;
      tmp.status = user.status;
      ret.push(tmp);
    });
    return ret;
  }

  async changeDefaultAvatar(user: User, number: number): Promise<User> {
    return await this.userRepository.changeDefaultAvatar(user, number);
  }

  async getRankingList(): Promise<RankListDto[]> {
    let rank_list = await this.userRepository.getRankinglist();
    let ret: RankListDto[] = new Array();
    rank_list.forEach((user: User) => {
      let dto = new RankListDto();
      dto.nickname = user.nickname;
      dto.lating = user.lating;
      dto.ladder_win = user.ladder_win;
      dto.ladder_lose = user.ladder_lose;
      dto.win = user.win;
      dto.lose = user.lose;
      if (user.lating > 2500) {
        dto.tier = "Grand Master";
      } else if (user.lating > 2200) {
        dto.tier = "Diamond";
      } else if (user.lating > 1800) {
        dto.tier = "Platinum";
      } else if (user.lating > 1600) {
        dto.tier = "Gold";
      } else if (user.lating > 1400) {
        dto.tier = "Silver";
      } else if (user.lating > 1200) {
        dto.tier = "Bronze";
      } else {
        dto.tier = "Newbie";
      }
      ret.push(dto);
    });
    return ret;
  }

  async updateAvatar(user: User, path: string): Promise<User> {
    return await this.userRepository.updateAvatarPath(user, path);
  }

  async updateLadderGameRecord(user: User): Promise<User> {
    return await this.userRepository.updateLadderGameRecord(user);
  }

  async updateNormalGameRecord(user: User): Promise<User> {
    return await this.userRepository.updateNormalGameRecord(user);
  }
}
