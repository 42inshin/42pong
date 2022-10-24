import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { useCookies } from "vue3-cookies";
import type {
  Channel,
  ChannelMessage,
  ChannelParticipant,
  JoinUser,
  Dm,
  GameChat,
  User,
} from "@/interface/interface";
import {
  getChannelUser,
  getChennelList,
  getMyChannel,
  getJoinedChannel,
} from "@/api/ChannelService";
import { useUserStore } from "./user";
import { UserListStore } from "./userList";
import { modalAlertStore } from "@/stores/modal";
import { DmStore } from "./dm";

const { cookies } = useCookies();
const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: "Bearer " + cookies.get("jwt"),
      },
    },
  },
};

export const ChatStore = defineStore({
  id: "chatStore",
  state: () => ({
    socket: io("http://localhost:5001/chat", socketOptions),
    channels: Array<Channel>(),
    ownerChannels: Array<number>(),
    isScroll: false,
    onChat: false,
    onBurger: false,
    gameState: false,
    gameChannel: {},
    myChannels: Array<number>(),
    data: {
      owner: "",
      chat: Object(),
      category: "",
      title: "",
      type: "public",
      messages: Array<ChannelMessage | Dm | GameChat>(),
      participants: Array<User | ChannelParticipant>(),
      banList: Array<User>(),
    },
  }),
  getters: {},
  actions: {
    disConnected() {
      this.socket.disconnect();
    },
    onScroll() {
      setTimeout(() => {
        const scrollTarget = document.getElementById("scroll_target");
        const scroll = scrollTarget?.scrollHeight;
        const height = scrollTarget?.clientHeight;
        if (scroll && height && scroll > height) this.isScroll = true;
        else this.isScroll = false;
      }, 100);
    },
    sendMessage(channel_index: number, message: string) {
      this.socket.emit("send", {
        channel_id: channel_index,
        message: message,
      });
    },
    dataReset() {
      this.data.owner = "";
      this.data.chat = undefined;
      this.data.category = "";
      this.data.title = "";
      this.data.type = "public";
      this.data.messages = [];
      this.data.participants = [];
      this.data.banList = [];
    },
    chatClose() {
      this.onBurger = false;
      this.data.chat.newMsgCount = 0;
      this.onChat = false;
      this.dataReset();
    },
  },
});

function checkMyChannel(tmp: Channel): boolean {
  const myChannels = ChatStore().myChannels;
  const find = myChannels.find((data) => {
    return data === tmp.id;
  });
  if (find) return true;
  else return false;
}

ChatStore().socket?.on("connect", async () => {
  ChatStore().channels = await getChennelList();
  ChatStore().channels.sort(function (a, b) {
    return a.id < b.id ? -1 : 1;
  });
  const tmp_myChannel = await getJoinedChannel();
  ChatStore().ownerChannels = await getMyChannel();
  tmp_myChannel.forEach((tmp: Channel) => {
    ChatStore().myChannels.push(tmp.id);
  });

  for (let i = 0; i < ChatStore().channels.length; i++) {
    ChatStore().channels[i].participants = await getChannelUser(
      ChatStore().channels[i].id
    );
    if (
      !ChatStore().channels[i].messages ||
      !checkMyChannel(ChatStore().channels[i])
    ) {
      ChatStore().channels[i].messages = new Array<ChannelMessage>();
    }
    ChatStore().channels[i].newMsgCount = 0;
  }
  // console.log(ChatStore().channels);
});

ChatStore().socket?.on("created_channel", async (data: Channel) => {
  console.log("created_channel");
  console.log(data);
  const participants = await getChannelUser(data.id);
  data.participants = participants;
  data.messages = new Array<ChannelMessage>();
  data.newMsgCount = 0;
  ChatStore().channels.push(data);
  if (data.owner.id === useUserStore().data.id) {
    ChatStore().myChannels.push(data.id);
  }
  ChatStore().ownerChannels = await getMyChannel();
  ChatStore().onScroll();
});

ChatStore().socket?.on("delete_channel", async (channel_id: number) => {
  console.log("delete_channel");
  const del_channel = ChatStore().channels.find(
    (channel) => channel.id == channel_id
  );
  if (del_channel) {
    /*현재 포커스 된 채널이 지워진 채널이라면 포커스 종료 */
    if (
      ChatStore().onChat &&
      ChatStore().data.chat &&
      ChatStore().data.chat.id == del_channel.id
    ) {
      ChatStore().onChat = false;
      modalAlertStore().alertMsg(
        ChatStore().data.title + " 채널이 삭제되었습니다"
      );
    }
    const idx = ChatStore().channels.indexOf(del_channel);
    if (idx != -1) {
      ChatStore().channels.splice(idx, 1);
      ChatStore().onScroll();
    }
  }
});

ChatStore().socket?.on("EnterGame", (data: Channel) => {
  console.log(data);
  ChatStore().gameState = true;
  ChatStore().gameChannel = data;
});

ChatStore().socket?.on("message", (msg: ChannelMessage) => {
  console.log("msg", msg);
  if (UserListStore().isblocked(msg.sender.id)) return;
  const findChannel = ChatStore().channels.find(function (item) {
    return item.id == msg.channel_id;
  });
  if (findChannel) {
    const tempMsg = msg;
    findChannel.messages.push(tempMsg);
    findChannel.newMsgCount += 1;
  }
});

ChatStore().socket?.on("join_channel", (user: JoinUser) => {
  console.log("join user :", user);
  const findChannel = ChatStore().channels.find(function (item) {
    return item.id === user.channel_id;
  });
  console.log("findChannel: ", findChannel);
  if (findChannel) {
    const findParticipant = findChannel.participants.find(function (item) {
      return item.id === user.id;
    });
    const participant: ChannelParticipant = {
      id: user.id,
      nickname: user.nickname,
      avatarPath: user.avatarPath,
      status: user.status,
    };
    console.log("findParticipant: ", findParticipant);

    if (!findParticipant) {
      findChannel.participants.push(participant);
      findChannel.participants.sort(function (a, b) {
        const nameA = a.nickname.toUpperCase();
        const nameB = b.nickname.toUpperCase();
        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else return 0;
      });
    }
    const tempMsg: ChannelMessage = {
      channel_id: findChannel.id,
      sender: user,
      channel: findChannel,
      message: `${user.nickname}님이 들어왔습니다`,
      createdAt: new Date(),
      notice: true,
    };
    findChannel.messages.push(tempMsg);
  }
});

ChatStore().socket?.on("change_channel_data", (data: any) => {
  console.log("change_channel_data");
  const findChannel = ChatStore().channels.find(function (item) {
    return item.id == data.id;
  });
  // console.log(findChannel);
  if (findChannel) {
    findChannel.name = data.name;
    findChannel.type = data.type;
  }
  if (
    ChatStore().data.category === "channel" &&
    findChannel?.id === ChatStore().data.chat.id
  ) {
    ChatStore().data.title = data.name;
    ChatStore().data.type = data.type;
  }
});

ChatStore().socket?.on("leave_channel", (data: any) => {
  const findIndex = ChatStore().channels.findIndex(function (item) {
    return item.id == data.channel_id;
  });
  const findChannel = ChatStore().channels[findIndex];
  // let chat_index;
  if (findChannel) {
    // chat_index = ChatStore().channels.indexOf(findChannel);
    const itemToFind = findChannel.participants.find(function (item) {
      return item.id == data.id;
    });
    if (itemToFind && findChannel) {
      const idx = findChannel.participants.indexOf(itemToFind);
      if (idx > -1) {
        findChannel.participants.splice(idx, 1);
      }
      if (data.channel_id === ChatStore().data.chat?.id) {
        ChatStore().data.participants = findChannel.participants;
      }
      console.log("leave_channel", data);
      const tempMsg: ChannelMessage = {
        channel_id: findChannel.id,
        sender: data,
        channel: findChannel,
        message: `${data.nickname}님이 나갔습니다`,
        createdAt: new Date(),
        notice: true,
      };
      findChannel.messages.push(tempMsg);
    }
  }
  console.log("rev-id: ", data.id, "store-id: ", useUserStore().data.id);
  console.log("findIndex: ", findIndex);
  if (data.id === useUserStore().data.id) {
    ChatStore().onChat = false;
    if (findIndex !== -1) {
      ChatStore().channels[findIndex].newMsgCount = 0;
      ChatStore().channels[findIndex].messages.length = 0;
    }

    /*채널 삭제 부분 */
    const checkJoinChannel = ChatStore().myChannels.findIndex((item) => {
      return item === data.channel_id;
    });
    if (checkJoinChannel !== -1) {
      console.log(`I'm kicked by channel :  ${data.channel_id}`);
      ChatStore().myChannels.splice(checkJoinChannel, 1);
    }
    /*******************/
  }
});

ChatStore().socket?.on("mutedUser", () => {
  modalAlertStore().alertMsg("채팅이 차단되었습니다.");
});
