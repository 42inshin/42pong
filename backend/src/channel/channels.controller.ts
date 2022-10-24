import { Controller, Get, Param, Post, Delete, Body, UsePipes, UseGuards, Request, Patch, Query, BadRequestException, HttpException } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto } from "./channel.dto";
import { CustomValidation } from "src/utils/channel.type.validation";
import JwtTwoFactorGuard from "src/auth/jwt/jwt-two-factor.guard";
import { UsersService } from "src/users/users.service";
import { ParticipantsService } from "src/participants/participants.service";
import { ChannelMessageService } from "src/channel_message/CM.service";
import { ChannelMessage } from "src/Entitys/channel.message.entity";
import { ChattingGateway } from "src/chatting/chatting.gateway";
import * as bcrypt from "bcrypt";

@Controller("channels")
export class ChannelsController {
  constructor(private channelService: ChannelsService, private participantService: ParticipantsService, private userService: UsersService, private CMService: ChannelMessageService, private chatGateway: ChattingGateway) {}

  @Get("/list")
  @UseGuards(JwtTwoFactorGuard)
  async getAllChannel(@Request() req) {
    const user = await this.userService.getUserById(req.user.id);
    return await this.channelService.getAllChannel(user);
  }

  @Get("joinedChannel")
  @UseGuards(JwtTwoFactorGuard)
  async getJoinedChannel(@Request() req) {
    const user = await this.userService.getUserById(req.user.id);
    return await this.participantService.getChannelByUser(user);
  }

  @Patch("/:id")
  @UseGuards(JwtTwoFactorGuard)
  async patchChannel(@Request() req, @Param("id") channel_id, @Body("name") name, @Body("password") password) {
    let user = await this.userService.getUserById(req.user.id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    if (channel.owner.id != user.id) {
      throw new BadRequestException("user is not owner");
    }
    channel = await this.channelService.changeName(channel_id, name);
    if (password) {
      channel = await this.channelService.changePassword(channel_id, password);
    } else {
      channel = await this.channelService.deletePassword(channel_id);
    }
    this.chatGateway.broadCastingEvent("change_channel_data", channel);
    return true;
  }

  @Post("/")
  @UseGuards(JwtTwoFactorGuard)
  @UsePipes(new CustomValidation())
  async makeChannel(@Request() req, @Body() createChannelDto: CreateChannelDto) {
    const user = await this.userService.getUserById(req.user.id);
    const channel = await this.channelService.makeChannel(createChannelDto, user);
    await this.participantService.addParticipant(true, false, user, channel, true);
    this.chatGateway.deligateJoin(user, channel);
    this.chatGateway.broadCastingEvent("created_channel", channel);
    return channel;
  }

  @Delete("/kick")
  @UseGuards(JwtTwoFactorGuard)
  async kickChannel(@Request() req, @Query("channel_id") channel_id, @Query("id") user_id) {
    let user = await this.userService.getUserById(req.user.id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    let participant = await this.participantService.getParticipant(user, channel);
    if (participant.admin) {
      let kick_user = await this.userService.getUserById(user_id);
      await this.participantService.deleteParticipant(kick_user, channel);
      this.chatGateway.deligateChannelEmit("leave_channel", channel_id, {
        channel_id: channel.id,
        id: kick_user.id,
        nickname: kick_user.nickname,
        // message: kick_user.nickname + "님이 강제퇴장 되었습니다",
      });
      return true;
    }
    return false;
  }

  @Delete("/")
  @UseGuards(JwtTwoFactorGuard)
  async deleteChannel(@Request() req, @Query("channel_id") channel_id): Promise<Boolean> {
    let user = await this.userService.getUserById(req.user.id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    if (!user || !channel) {
      throw new HttpException("channel id invalid", 455);
    }
    if (channel.owner.id == user.id) {
      console.log("delete channel");
      let ret = await this.channelService.deleteChannel(channel);
      this.chatGateway.broadCastingEvent("delete_channel", channel_id);
      return ret;
    } else {
      console.log("leave channel user");
      let ret = await this.participantService.deleteParticipant(user, channel);
      this.chatGateway.deligateChannelEmit("leave_channel", channel_id, {
        channel_id: channel.id,
        id: user.id,
        nickname: user.nickname,
        // message: user.nickname + "님이 나갔습니다",
      });
      return ret;
    }
  }

  /* Join Channel */
  @Post("/participant")
  @UseGuards(JwtTwoFactorGuard)
  async addParticipant(@Request() req, @Body("channel_id") channel_id, @Body("password") password) {
    let user = await this.userService.getUserById(req.user.id);
    let channel = await this.channelService.getChannelById(channel_id);
    if (user && channel) {
      let check_ban = await this.channelService.checkBan(channel_id, user.id);
      console.log("check_ban:", check_ban);
      if (check_ban) {
        throw new HttpException("Banned from the channel", 403);
      }
      let tf = await this.channelService.joinChannel(user, channel, password, this.chatGateway);
      if (tf) {
        return true;
      } else {
        return false;
      }
    } else {
      throw new HttpException("channel is not exist", 454);
    }
  }

  @Get("/admin")
  @UseGuards(JwtTwoFactorGuard)
  async getAdmin(@Request() req, @Query("channel_id") channel_id, @Query("user_id") user_id) {
    let user = await this.userService.getUserById(req.user.id);
    let to = await this.userService.getUserById(user_id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    if (channel.owner.id != user.id) {
      throw new BadRequestException("user is not owner");
    }
    return await this.participantService.getAdmin(to, channel);
  }

  @Post("/admin")
  @UseGuards(JwtTwoFactorGuard)
  async giveAdmin(@Request() req, @Body("user_id") user_id, @Body("channel_id") channel_id) {
    let user = await this.userService.getUserById(req.user.id);
    let to = await this.userService.getUserById(user_id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    let participant;
    if (channel.owner.id != user.id) {
      throw new BadRequestException("user is not owner");
    }
    try {
      participant = await this.participantService.changeAdmin(to, channel);
    } catch (e) {
      throw new HttpException("user_id don't belong in channle_id", 409);
    }
    return participant;
  }

  @Post("/muted")
  @UseGuards(JwtTwoFactorGuard)
  async giveMuted(@Request() req, @Body("user_id") user_id, @Body("channel_id") channel_id, @Body("value") value) {
    let user = await this.userService.getUserById(req.user.id);
    let to = await this.userService.getUserById(user_id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    let cp = await this.participantService.getParticipant(user, channel);
    let participant;
    if (!cp.admin) {
      throw new BadRequestException("fail muted / need Grant");
    }
    try {
      participant = await this.participantService.changeMuted(to, channel, value == true);
    } catch (e) {
      throw new HttpException("user_id don't belong in channle_id", 409);
    }
    return participant;
  }

  @Get("/participants/all/:channel_id")
  @UseGuards(JwtTwoFactorGuard)
  async getAllParticipants(@Param("channel_id") channel_id) {
    let participants = await this.channelService.getAllParticipant(channel_id);
    let participants_user = Array();
    participants.forEach((tmp) => {
      participants_user.push({
        channel_id: channel_id,
        id: tmp.user.id,
        nickname: tmp.user.nickname,
        avatarPath: tmp.user.avatarPath,
        status: tmp.user.status,
      });
    });
    return participants_user;
  }

  @Get("/participant/:channel_id")
  @UseGuards(JwtTwoFactorGuard)
  async getParticipant(@Request() req, @Param("channel_id") channel_id) {
    let user = await this.userService.getUserById(req.user.id);
    let channel = await this.channelService.getJoinChannelById(channel_id);

    return await this.participantService.getParticipant(user, channel);
  }

  @Post("/password")
  @UseGuards(JwtTwoFactorGuard)
  async changePassword(@Request() req, @Body("channel_id") channel_id, @Body("password") password) {
    let user = await this.userService.getUserById(req.user.id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    if (channel.owner.id != user.id) {
      throw new BadRequestException("user is not owner");
    }
    if (password == "") {
      throw new BadRequestException("password is invalid");
    }
    let ret = await this.channelService.changePassword(channel.id, password);
    return ret;
  }

  @Post("/name")
  @UseGuards(JwtTwoFactorGuard)
  async changeName(@Request() req, @Body("channel_id") channel_id, @Body("name") name) {
    let user = await this.userService.getUserById(req.user.id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    if (channel.owner.id != user.id) {
      throw new BadRequestException("user is not owner");
    }
    if (name == "") {
      throw new BadRequestException("Invalid Channel Name");
    }
    let ret = await this.channelService.changeName(channel.id, name);
    return ret;
  }

  @Delete("/password/:channel_id")
  @UseGuards(JwtTwoFactorGuard)
  async deletePassword(@Request() req, @Param("channel_id") channel_id) {
    let user = await this.userService.getUserById(req.user.id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    if (channel.owner.id != user.id) {
      throw new BadRequestException("user is not owner");
    }
    return await this.channelService.deletePassword(channel_id);
  }

  @Patch("/password")
  @UseGuards(JwtTwoFactorGuard)
  async patchPassword(@Request() req, @Body("channel_id") channel_id, @Body("password") password) {
    let user = await this.userService.getUserById(req.user.id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    if (channel.owner.id != user.id) {
      throw new BadRequestException("user is not owner");
    }
    if (channel.type == "public") throw new BadRequestException("public can't have password");
    return await this.channelService.updatePassword(channel_id, password);
  }

  @Get("/message/:id")
  @UseGuards(JwtTwoFactorGuard)
  async getChannelMessage(@Param("id") channel_id): Promise<ChannelMessage[]> {
    try {
      let channel = await this.channelService.getChannelById(channel_id);
      return await this.CMService.getMessageLimit50(channel);
    } catch (e) {
      throw new HttpException("invalid channel_id", 409);
    }
  }

  @Get("checkpassword")
  @UseGuards(JwtTwoFactorGuard)
  async checkPassword(@Query("channel_id") channel_id, @Query("password") password) {
    return await this.channelService.checkPassword(channel_id, password);
  }

  @Get("ownerChannel")
  @UseGuards(JwtTwoFactorGuard)
  async getMyChannel(@Request() req) {
    let user = await this.userService.getUserById(req.user.id);
    return await this.participantService.getOwnerChannel(user);
  }

  @Get("/ban")
  @UseGuards(JwtTwoFactorGuard)
  async checkBan(@Request() req, @Query("channel_id") channel_id, @Query("id") user_id) {
    let user = await this.userService.getUserById(req.user.id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    if (channel.owner.id != user.id) {
      throw new BadRequestException("user is not owner");
    }
    let ret = await this.channelService.checkBan(channel_id, user_id);
    return ret;
  }

  @Post("/ban")
  @UseGuards(JwtTwoFactorGuard)
  async addBan(@Request() req, @Body("channel_id") channel_id, @Body("id") user_id) {
    let user = await this.userService.getUserById(req.user.id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    if (channel.owner.id != user.id) {
      throw new BadRequestException("user is not owner");
    }
    let ret = await this.channelService.addBan(channel_id, user_id);
    if (ret == false) {
      return 457;
    }
    return 201;
  }

  @Delete("/ban")
  @UseGuards(JwtTwoFactorGuard)
  async delBan(@Request() req, @Query("channel_id") channel_id, @Query("id") user_id) {
    let user = await this.userService.getUserById(req.user.id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    if (channel.owner.id != user.id) {
      throw new BadRequestException("user is not owner");
    }
    let ret = await this.channelService.delBan(channel_id, user_id);
    if (ret == false) {
      return 457;
    }
    return 201;
  }

  @Get("/bannedList/:channel_id")
  @UseGuards(JwtTwoFactorGuard)
  async getBannedList(@Request() req, @Param("channel_id") channel_id) {
    let user = await this.userService.getUserById(req.user.id);
    let channel = await this.channelService.getJoinChannelById(channel_id);
    if (channel.owner.id != user.id) {
      throw new BadRequestException("user is not owner");
    }
    let ret = await this.channelService.getBannedList(channel_id);
    console.log(ret);
    return ret;
  }
}
