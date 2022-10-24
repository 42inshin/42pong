import { Injectable } from "@nestjs/common";
import { ConnectedSocket } from "@nestjs/websockets";
import { User } from "src/Entitys/user.entity";
import { UsersService } from "src/users/users.service";
/**불필요한 파일 test tmp 주석 삭제 테스트 임시 템프 temp*/
@Injectable()
export class CommandService {
  constructor(private userService: UsersService) {}

  commands = ["/game", "/profile"];
  function = [this.sendMatch.bind(this), this.getProfile.bind(this)];

  async getProfile(nickname: string): Promise<User> {
    console.log(nickname);
    let user = await this.userService.getUserByNickname(nickname);
    return user;
  }

  async sendMatch(nickname: string) {}

  isCommand(command: string): boolean {
    let tf = false;
    this.commands.forEach((element) => {
      if (element == command) {
        // === 연산은 다르다고 나와서(?) 느슨한 compare로 비꿈
        tf = true;
      }
    });
    return tf;
  }

  getIndex(command: string): number {
    let index = 0;
    for (let i = 0; this.commands.length; i++) {
      if (this.commands[i] == command) {
        index = i;
        break;
      }
    }
    return index;
  }

  async processMessage(message: string, @ConnectedSocket() client): Promise<Boolean> {
    let splits = message.split(" ");
    if (this.isCommand(splits[0])) {
      let index = this.getIndex(splits[0]); // match what command index
      let data = await this.function[index](splits[1]);
      splits[0] = splits[0].replace("/", "");
      if (data) {
        client.emit(splits[0], data);
      } else {
        client.emit(splits[0], "not exist data");
      }
      return true;
    }
    console.log(splits);
    return false;
  }
}
