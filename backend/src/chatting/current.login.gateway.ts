import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { ChannelsService } from "src/channel/channels.service";
import { Channel } from "src/Entitys/channel.entity";
import { ParticipantsService } from "src/participants/participants.service";
import { TMP, UserStatusType } from "src/util";
import * as bcrypt from "bcrypt";
import { User } from "src/Entitys/user.entity";
import { UsersService } from "src/users/users.service";
import { DMService } from "src/dm/dm.service";
import { ChattingGateway } from "./chatting.gateway";

let rootClientMap = new Map<string, Socket>();

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  middlewares: [],
  namespace: "/",
})
export class LoginUserGateway {
  constructor(private authService: AuthService, private userService: UsersService, private dmService: DMService, private chatGateWay: ChattingGateway) {}

  @WebSocketServer()
  server: Server;

  wsClients = [];

  broadCastingEvent(event: string, data: any) {
    this.wsClients.forEach(async (tmp) => {
      await tmp.client.emit(event, data);
    });
  }

  deligateClientEmit(event: string, user_id: string, data: any) {
    let find = this.wsClients.find((element, index, array) => {
      return element.user.id === user_id;
    });
    find.client.emit(event, data);
  }

  async handleConnection(@ConnectedSocket() client) {
    let user_id = await this.getUserId(client);
    let user = await this.userService.getUserById(user_id);
    await this.userService.updateStatus(user, UserStatusType.ONLINE, this);
    console.log(`current gateway login ${user.nickname}`);
    this.broadCastingEvent("login", {
      id: user.id,
      nickname: user.nickname,
      avatarPath: user.avatarPath,
      status: user.status,
    });
    let tmp = {
      user: user,
      client: client,
    };
    this.wsClients.push(tmp);
    rootClientMap.set(user.id, client);
  }

  async handleDisconnect(@ConnectedSocket() client) {
    let user_id = await this.getUserId(client);
    let user = await this.userService.getUserById(user_id);
    await this.userService.updateStatus(user, UserStatusType.OFFLINE, this);
    console.log("logout : " + user.nickname);
    for (var i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i].client.id == client.id) {
        this.wsClients.splice(i, 1);
        i--;
      }
    }
    this.broadCastingEvent("logout", {
      id: user.id,
      nickname: user.nickname,
      status: user.status,
      avatarPath: user.avatarPath,
    });
    rootClientMap.delete(user.id);
  }

  /* 유저가 보낸 jwt로부터 userid를 수동으로 파싱해옴 */
  private async getUserId(@ConnectedSocket() client) {
    try {
      /********* 암시적인 에러 발생 가능 부분********/
      let haha = String(client.handshake.headers.authorization);
      haha = haha.replace("Bearer ", "");
      /*********************************************/
      const user: TMP = await this.authService.jwtVerify(haha);
      return user.id;
    } catch (e) {}
  }

  @SubscribeMessage("dm")
  async join(@MessageBody("nickname") nickname, @MessageBody("message") message, @ConnectedSocket() client) {
    let user_id = await this.getUserId(client);
    let from = await this.userService.getUserById(user_id);
    let to = await this.userService.getUserByNickname(nickname);
    let dm = await this.dmService.saveDM(from, to, message);
    console.log("dm save");
    if (to.status)
      rootClientMap.get(to.id).emit("dm", {
        id: dm.id,
        to: from.id,
        message: message,
        createdAt: dm.createdAt,
        sender: {
          id: from.id,
          nickname: from.nickname,
          avatarPath: from.avatarPath,
        },
      });
    if (from.status)
      rootClientMap.get(from.id).emit("dm", {
        id: dm.id,
        to: to.id,
        message: message,
        createdAt: dm.createdAt,
        sender: {
          id: from.id,
          nickname: from.nickname,
          avatarPath: from.avatarPath,
        },
      });
  }

  async recvBattle(user: User, nick: string, id: string) {
    console.log("recvBattle: ", user, " to ", nick);
    rootClientMap.get(user.id).emit("recvBattle", { id: id, nickname: nick });
  }
}
