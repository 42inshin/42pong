import { defineStore } from "pinia";
import { Socket } from "socket.io-client";
import type { GameChat } from "@/interface/interface";

export const gameMyselfStore = defineStore({
  id: "gameMyself",
  state: () => ({
    data: {
      avatarPath: "",
      lating: 0,
      nickname: "",
      ladder_win: 0,
      ladder_lose: 0,
      win: 0,
      lose: 0,
    },
  }),
});

export const gameOpponentStore = defineStore({
  id: "gameOpponent",
  state: () => ({
    data: {
      avatarPath: "",
      lating: 0,
      nickname: "",
      ladder_win: 0,
      ladder_lose: 0,
      win: 0,
      lose: 0,
    },
  }),
});

export const gameRoomInfoStore = defineStore({
  id: "gameRoomInfo",
  state: () => ({
    socket: Socket.prototype,
    messages: Array<GameChat>(),
    data: {
      mode: -1,
      roomNum: 0,
      rank: "랭크 게임",
      normal: "일반 모드",
      portal: "포탈 모드",
    },
  }),
});

export const gameWatchStore = defineStore({
	id: "gameWatch",
	state: () => ({
	  data: {
		isWatch: false,
	  },
	}),
  });
