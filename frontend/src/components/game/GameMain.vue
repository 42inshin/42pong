<script setup lang="ts">
import GameBtnNormal from "@/components/game/GameBtnNormal.vue";
import GameBtnRank from "@/components/game/GameBtnRank.vue";
import GameList from "@/components/game/GameList.vue";
import ModalMakeRoom from "@/components/game/ModalMakeRoom.vue";
import ModalListInputPass from "@/components/game/ModalListInputPass.vue";

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { gameRoomInfoStore } from "@/stores/game";
import { GameSocketStore } from "@/stores/gameSocket";
import { modalAlertStore } from "@/stores/modal";

const gameSocketStore = GameSocketStore();

interface RoomData {
  name: string;
  pass: string;
  mode: number;
  person: number;
  id: number;
  secret: boolean;
  participation: boolean;
}

const roomData: RoomData = {
  name: "",
  pass: "",
  mode: 1,
  person: 0,
  id: 0,
  secret: false,
  participation: true,
};

const gameRoomInfo = gameRoomInfoStore();
const showMakeRoom = ref(false);
const showListInputPass = ref(false);
const enterRoomNum = ref(0);
const enterRoomName = ref("");
const roomList = ref();
const invalidPass = ref(false);
const invalidPassString = ref("비밀번호가 맞지 않습니다");
const router = useRouter();

onMounted(() => {
  gameSocketStore.socket.emit("requestRoomList");
});

const clickNomalButton = () => {
  gameRoomInfo.data.mode = 1;
  showMakeRoom.value = true;
};

function setGameMode(mode: number) {
  gameRoomInfo.data.mode = roomData.mode = mode;
}

function submitRoomDataButton(input: [string, string]) {
  roomData.mode = gameRoomInfo.data.mode;
  roomData.name = input[0];
  roomData.pass = input[1];
  if (roomData.pass.length != 0) {
    roomData.secret = true;
  }
  showMakeRoom.value = false;
  gameSocketStore.socket.emit("submitRoomData", roomData);
}

gameSocketStore.socket.on("done", () => {
  router.push("battle");
});

function cancelRoomButton() {
  roomData.name = "";
  roomData.pass = "";
  roomData.mode = 1;
  roomData.person = 0;
  roomData.id = 0;
  roomData.secret = false;
  roomData.participation = true;
  showMakeRoom.value = false;
}

gameSocketStore.socket.on("roomList", (data: string) => {
  roomList.value = JSON.parse(data);
});

function emitEnterRoom(enterInfo: [number, string]) {
  gameRoomInfo.data.mode = 1;
  gameSocketStore.socket.emit("enterRoom", enterInfo);
}

gameSocketStore.socket.on("passSuccess", () => {
  showListInputPass.value = false;
  router.push("battle");
});

gameSocketStore.socket.on("passError", () => {
  invalidPass.value = true;
  setTimeout(() => {
    invalidPass.value = false;
  }, 1000);
});

gameSocketStore.socket.on("noRoom", () => {
  modalAlertStore().alertMsg("해당 방에 들어갈 수 없습니다");
  showListInputPass.value = false;
});

function showInputPass(roomData: [number, string]) {
  enterRoomNum.value = roomData[0];
  enterRoomName.value = roomData[1];
  showListInputPass.value = true;
}

function cancleInputPass() {
  enterRoomNum.value = 0;
  enterRoomName.value = "";
  showListInputPass.value = false;
}

/*
* gameMode
* 0 : rank
* 1 : normal
* 2 : portal
*/
</script>

<template>
  <div class="main">
    <div class="game_btn_box">
      <GameBtnRank />
      <GameBtnNormal @click="clickNomalButton" />
    </div>
    <ul class="game_list no-scrollbar">
      <div v-for="(listArr, index) in roomList" :key="index">
        <GameList
          :roomNum="listArr[0]"
          :roomData="listArr[1]"
          @enter="emitEnterRoom"
          @inputPass="showInputPass"
        />
      </div>
    </ul>
    <Teleport to="body">
      <ModalMakeRoom
        v-if="showMakeRoom"
        :room="roomData"
        @gameMode="setGameMode"
        @submit="submitRoomDataButton"
        @cancle="cancelRoomButton"
      />
      <ModalListInputPass
        v-if="showListInputPass"
        :roomData="[enterRoomNum, enterRoomName]"
        @submit="emitEnterRoom"
        @cancle="cancleInputPass"
        ><div v-if="invalidPass">
          {{ invalidPassString }}
        </div>
      </ModalListInputPass>
    </Teleport>
  </div>
</template>

<style scoped>
.main {
  width: 500px;
  height: 700px;
}
.game_btn_box {
  display: flex;
  justify-content: space-between;
}
.game_list {
  margin-top: 20px;
  height: 532px;
  overflow-y: scroll;
}
</style>
