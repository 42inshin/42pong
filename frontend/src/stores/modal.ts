import { defineStore } from "pinia";
import { ChatStore } from "./chatting";
import { getUserById } from "@/api/UserService";
import { getParticipant } from "@/api/ChannelService";

export const modalProfileStore = defineStore({
  id: "modalProfile",
  state: () => ({
    onModal: false,
    onChat: false,
    admin: false,
    owner: "",
    channel_id: -1,
    data: {
      id: "",
      nickname: "",
      win: 0,
      lose: 0,
      ladder_win: 0,
      ladder_lose: 0,
      avatarPath: "",
      lating: 0,
      status: 0,
    },
  }),
  actions: {
    async clickUser(id: string) {
      this.data = await getUserById(id);
      this.onChat = false;
      if (ChatStore().data.category === "channel") {
        const participant = await getParticipant(ChatStore().data.chat.id);
        this.channel_id = ChatStore().data.chat.id;
        this.owner = ChatStore().data.owner;
        this.admin = participant.admin;
        this.onChat = true;
      }
      this.onModal = true;
    },
  },
});

export const modalMakeStore = defineStore({
  id: "modalMake",
  state: () => ({
    onModal: false,
    data: {
      title: "",
      password: "",
      type: "public",
    },
  }),
});

export const modalPassStore = defineStore({
  id: "modalPass",
  state: () => ({
    onModal: false,
    data: {
      index: -1,
      id: -1,
      title: "",
      password: "",
      type: "",
    },
  }),
});

export const modalEditStore = defineStore({
  id: "modalEdit",
  state: () => ({
    onModal: false,
    data: {
      index: -1,
      id: -1,
      title: "",
      password: "",
      type: "",
    },
  }),
});

export const modalRecvBattleStore = defineStore({
  id: "modalRecvBattle",
  state: () => ({
    onModal: false,
    opponentNick: "",
  }),
});

export const modalAlertStore = defineStore({
  id: "modalAlert",
  state: () => ({
    onModal: false,
    color: "",
    timer: 3,
    message: "",
  }),
  actions: {
    alertMsg(message: string, color = ""): void {
      this.message = message;
      this.onModal = true;
      this.color = color;
      this.timer = 3;
      const interval = setInterval(() => {
        this.timer--;
        if (this.timer <= 0) {
          clearInterval(interval);
          this.onModal = false;
        }
      }, 1000);
    },
  },
});
