import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { ChannelsService } from "src/channel/channels.service";
import { Channel } from "src/Entitys/channel.entity";
import { ParticipantsService } from "src/participants/participants.service";
import { TMP, UserStatusType } from "src/util";
import * as bcrypt from "bcrypt";
import { User } from "src/Entitys/user.entity";
import { UsersService } from "src/users/users.service";
import { ChannelMessageService } from "src/channel_message/CM.service";
// import { CommandService } from "src/command/command.service";
import { channel } from "diagnostics_channel";
import { ChannelParticipant } from "src/Entitys/channel.participant.entity";
import { ChannelMessage } from "src/Entitys/channel.message.entity";

let clientMap = new Map<string, Socket>();

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  middlewares: [],
  namespace: "/chat",
})
export class ChattingGateway {
  constructor(private authService: AuthService, private channelService: ChannelsService, private particiPantService: ParticipantsService, private userService: UsersService, private CMService: ChannelMessageService) {}

  @WebSocketServer()
  server: Server;

  wsClients = [];

  // async SocketLeave(user: User) {
  //   clientMap.delete(user.id);
  //   let leave_user_channels = await this.particiPantService.getChannelByUser(user);
  // leave_user_channels.forEach((data: Channel) => {
  // this.server.emit("change_data", {
  //   // channel_id: data.id,
  //   id: user.id,
  //   nickname: user.nickname,
  //   avatarPath: user.avatarPath,
  //   status: 0,
  // });
  // // });
  // }
  async SocketConnect(user: User, client: Socket) {
    clientMap.set(user.id, client);
    let connect_user_channels = await this.particiPantService.getChannelByUser(user);
    connect_user_channels.forEach((data: Channel) => {
      client.join(String(data.id));
    });
    // this.server.emit("change_data", {
    //   // channel_id: data.id,
    //   id: user.id,
    //   nickname: user.nickname,
    //   avatarPath: user.avatarPath,
    //   status: 1,
    // });
  }

  broadCastingEvent(event: string, data: any) {
    this.server.emit(event, data);
  }

  async handleConnection(@ConnectedSocket() client) {
    let user_id = await this.getUserId(client);
    let user = await this.userService.getUserById(user_id);
    console.log("chat join user : " + user.nickname);
    this.SocketConnect(user, client);
    let tmp = {
      user: user,
      client: client,
    };
    this.wsClients.push(tmp);
  }

  async handleDisconnect(@ConnectedSocket() client) {
    let user_id = await this.getUserId(client);
    // let user = await this.userService.getUserById(user_id);
    clientMap.delete(user_id);
    //전체 유저에게
    for (var i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i].id == client.id) {
        this.wsClients.splice(i, 1);
        i--;
      }
    }
  }

  /* 유저가 보낸 jwt로부터 userid를 수동으로 파싱해옴 */
  private async getUserId(@ConnectedSocket() client) {
    try {
      /********* 암시적인 에러 발생 가능 부분********/
      let haha = String(client.handshake.headers.authorization);
      haha = haha.replace("Bearer ", "");
      /*********************************************/
      const user: TMP = await this.authService.jwtVerify(haha);
      if (user) return user.id;
      else throw new WsException("need jwt");
    } catch (e) {}
  }

  // public gameChatRoomJoin(user_id: string, rankRoom: string) {
  //   console.log(`${user_id} is joined room number : ${rankRoom}`);
  //   clientMap.get(user_id).join(rankRoom);
  // }

  public deligateEventSend(user_id: string, event: string, channel: Channel) {
    clientMap.get(user_id).emit(event, channel);
  }

  public async deligateJoin(user: User, channel: Channel) {
    console.log(`${user.nickname} is joined channel ${channel.id}`);
    await clientMap.get(user.id).join(String(channel.id));
    this.server.in(String(channel.id)).emit("join_channel", {
      channel_id: channel.id,
      id: user.id,
      nickname: user.nickname,
      avatarPath: user.avatarPath,
      status: user.status,
    });
  }

  public deligateChannelEmit(event: string, channel_id: string, data: any) {
    this.server.in(channel_id).emit(event, data);
    clientMap.get(data.id).leave(channel_id);
  }

  private async checkParticipant(channel: Channel, user: User): Promise<Boolean> {
    let participants = await this.channelService.getAllParticipant(channel.id);
    let tf = false;
    participants.forEach((element) => {
      if (element.user.id === user.id) {
        tf = true;
      }
    });
    return tf;
  }

  private async sendBroadCast(@ConnectedSocket() client, channel: Channel, user: User, message: string, event_name: string) {
    let cm: ChannelMessage;
    // if (channel.type != "game") {
    let tf = await this.checkParticipant(channel, user);
    if (tf) {
      /*해당 채널로 전송 부분 */
      // if (!(await this.commandService.processMessage(message, client))) {
      if (event_name === "message") {
        cm = await this.CMService.addMessage(user, channel, message);
      }
      this.server.in(String(channel.id)).emit(event_name, {
        channel_id: channel.id,
        message: message,
        sender: {
          id: user.id,
          nickname: user.nickname,
          avatarPath: user.avatarPath,
        },
        createdAt: cm.createdAt,
      });
      // }
    }
    // } else {
    //   this.server.in(channel.name).emit(event_name, {
    //     channel_id: channel.id,
    //     nickname: user.nickname,
    //     message: message,
    //     avatarPath: user.avatarPath,
    //   });
    // }
  }

  @SubscribeMessage("send")
  async Send(@MessageBody("channel_id") channel_id, @MessageBody("message") message, @ConnectedSocket() client) {
    let user_id = await this.getUserId(client);
    let user = await this.userService.getUserById(user_id);
    let channel = await this.channelService.getChannelById(channel_id);
    let participant = await this.particiPantService.getParticipant(user, channel);
    if (channel && user && !participant.muted) {
      await this.sendBroadCast(client, channel, user, message, "message");
    } else if (channel && user && participant.muted) {
      clientMap.get(participant.user.id).emit("mutedUser");
    } else {
      console.log("message send fail");
      throw new WsException("message send fail");
    }
  }

  //   @SubscribeMessage("leave_channel")
  //   async leaveChannel(@MessageBody("channel_id") channel_id, @ConnectedSocket() client) {
  //     let user_id = await this.getUserId(client);
  //     let user = await this.userService.getUserById(user_id);
  //     let channel = await this.channelService.getChannelById(channel_id);
  //     if (channel && user) {
  //       await this.sendBroadCast(client, channel, user, "", "leave_channel");
  //     } else {
  //       console.log("channel or user is not exist");
  //       throw new WsException("channel or user is not exist");
  //     }
  //   }
}
