import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { useCookies } from "vue3-cookies";
import { modalAlertStore } from "@/stores/modal";

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

export const GameSocketStore = defineStore({
  id: "GameSocketStore",
  state: () => ({
    socket: io("http://localhost:5001/game", socketOptions),
  }),
  actions: {
    disConnected() {
      this.socket.disconnect();
    },
  },
});

const gameSocketStore = GameSocketStore();

/**게임신청을 할 수 없을 때(게임중, 게임신창중), 수락을 눌렀는데 상대가 방을 나간상태 일 때 */
gameSocketStore.socket?.on("canNotAvailableGame", () => {
  modalAlertStore().alertMsg("게임을 할 수 없습니다");
});

gameSocketStore.socket?.on("noExitGame", () => {
  modalAlertStore().alertMsg("관전을 할 수 없습니다");
});
