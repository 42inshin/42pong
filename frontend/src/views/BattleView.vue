<script setup lang="ts">
import Logo from "@/components/login/LogoName.vue";
import WaitingRoom from "@/components/game/GameWaitingRoom.vue";
import ObserverRoom from "@/components/game/GameObserverRoom.vue";
import Canvas from "@/components/game/GameCanvas.vue";
import Result from "@/components/game/GameResultWindow.vue";
import LeaveObserverRoom from "@/components/game/ModalDeleteObserverRoom.vue";

import { io, Socket } from "socket.io-client";
import Pong from "@/stores/pong";
import { ref, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import { modalAlertStore } from "@/stores/modal";

import { useUserStore } from "@/stores/user";
import {
  gameMyselfStore,
  gameOpponentStore,
  gameRoomInfoStore,
  gameWatchStore
} from "@/stores/game";
import { ChatStore } from "@/stores/chatting";
import { getUserByNickname } from "@/api/UserService";
import { getSelf } from "@/api/UserService";

import type {
  GameChat,
  GameData,
  GameUser,
  ApiUser,
  roomData,
  UserList,
} from "@/interface/interface";

const { cookies } = useCookies();
const chatStore = ChatStore();
const router = useRouter();
const gameRoomInfo = gameRoomInfoStore();
const paddleSide = ref(0);
const playerNickName = ref(["", ""]);
const homeViewProfile = useUserStore();
const gameMyself = gameMyselfStore();
const gameOpponent = gameOpponentStore();
const watchBattle = gameWatchStore();

const isUsersSet = ref(false); // 유저 2명인지 set 판단
const isPlayersSet = ref([false, false]); // 플레이어 2명 배열로 있는지 판단
const isUsersReady = ref([false, false]); // 유저 2명 배열로 ready set 판단
const allUserReady = ref(false); // 유저 2명 모두 준비완료 되었다는 최종 신호

const score = ref([0, 0]);
const gameResult = ref([false, false]);
const unavailableBTN = ref(false);

const showWaitRoom = ref(true);
const showGameResult = ref(false);
const showLeaveObserver = ref(false);
const timerString = ref("5");
const timer = ref(5);
const isGameStart = ref(false);
const checkFinished = ref(false);
const timerAmimation = ref(false);

const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: "Bearer " + cookies.get("jwt"),
      },
    },
  },
};

function setGameUser(where: GameUser, what: ApiUser) {
  where.avatarPath = what?.avatarPath;
  where.lating = what?.lating;
  where.nickname = what?.nickname;
  where.ladder_win = what?.ladder_win;
  where.ladder_lose = what?.ladder_lose;
  where.win = what?.win;
  where.lose = what?.lose;
}

const socket: Socket = io("http://localhost:5000/game", socketOptions);
socket.on("connect", () => {
  gameRoomInfo.socket = socket;
  if (chatStore.data.chat) {
    chatStore.chatClose();
  }
  chatStore.data.category = "game";
  chatStore.data.title = "Game";
  chatStore.data.messages = gameRoomInfo.messages;
  chatStore.data.type = "game";
  chatStore.onChat = true;

  if (watchBattle.data.isWatch === false) {
    if (gameRoomInfo.data.mode === -1) {
      router.go(-1);
    } else if (gameRoomInfo.data.mode === 0) {
      socket.emit("rankBattle");
    } else {
      socket.emit("normalBattle");
    }
  } else {
    if (gameRoomInfo.data.mode === -1)
      router.go(-1);
    /**오로지 관전을 위한 이벤트 추가. */
    else socket.emit("watchBattle");
  }
});

onBeforeUnmount(async () => {
  console.log("onBeforeUnmount");
  socket.disconnect();
});

onUnmounted(async () => {
  console.log("onUnmounted");
  const self = await getSelf();
  homeViewProfile.data = self;
  gameMyself.$reset();
  gameOpponent.$reset();
  gameRoomInfo.$reset();
  chatStore.onChat = false;
});

socket.on("AllUserList", (data: UserList) => {
  chatStore.data.participants = data.data;
});

socket.on("message", (data: GameChat) => {
  gameRoomInfo.messages.push(data);
});

socket.on("getPaddle", async (data: [number, number, number]) => {
  paddleSide.value = data[0];
  gameRoomInfo.data.roomNum = data[1];
  gameRoomInfo.data.mode = data[2];
  if (paddleSide.value !== 3) {
    const temp: ApiUser = await getUserByNickname(
      homeViewProfile.data.nickname
    );
    setGameUser(gameMyself.data, temp);
  }
});

socket.on("getPlayers", async (playersNickInfo: [string, string]) => {
  console.log("닉네임-> " + playersNickInfo);
  playerNickName.value = playersNickInfo;
  if (paddleSide.value === 3) {
    const left: ApiUser = await getUserByNickname(playersNickInfo[0]);
    const right: ApiUser = await getUserByNickname(playersNickInfo[1]);
    setGameUser(gameMyself.data, left);
    setGameUser(gameOpponent.data, right);
  } else {
    let opponent: ApiUser;
    if (paddleSide.value === 1)
      opponent = await getUserByNickname(playersNickInfo[1]);
    else opponent = await getUserByNickname(playersNickInfo[0]);
    setGameUser(gameOpponent.data, opponent);
  }
});

let paddlePos: number;
paddlePos = 200;
let game: Pong;
let canvas: HTMLCanvasElement;
onMounted(() => {
  canvas = document.getElementById("pong") as HTMLCanvasElement;
  if (!canvas) return console.error("canvas is undefined");
  game = new Pong(canvas);
  canvas.addEventListener("mousemove", getMousePos);
  function getMousePos(evt: MouseEvent): void {
    const rect = canvas.getBoundingClientRect();

    const scaleY = canvas.height / rect.height;
    paddlePos = (evt.clientY - rect.top) * scaleY - 50;
  }
});

async function setResultInfo() {
  if (gameRoomInfo.data.mode !== 0) {
    if (paddleSide.value === 3) {
      if (gameResult.value[0]) {
        gameMyself.data.win += 1;
        gameOpponent.data.lose += 1;
      } else {
        gameMyself.data.lose += 1;
        gameOpponent.data.win += 1;
      }
    } else {
      if (gameResult.value[paddleSide.value - 1]) {
        gameMyself.data.win += 1;
        gameOpponent.data.lose += 1;
      } else {
        gameMyself.data.lose += 1;
        gameOpponent.data.win += 1;
      }
    }
  } else {
    if (gameResult.value[paddleSide.value - 1]) {
      gameMyself.data.lating += 15;
      gameOpponent.data.lating -= 10;
      gameMyself.data.ladder_win += 1;
      gameOpponent.data.ladder_lose += 1;
    } else {
      gameMyself.data.lating -= 10;
      gameOpponent.data.lating += 15;
      gameMyself.data.ladder_lose += 1;
      gameOpponent.data.ladder_win += 1;
    }
  }
  unavailableBTN.value = false;
  isUsersReady.value[0] = false;
  isUsersReady.value[1] = false;
  timer.value = 5;
  paddlePos = 200;
  showWaitRoom.value = true;
  isGameStart.value = false;
}

//data = playerNickName[left, right], roomNum
let interval: ReturnType<typeof setInterval>;
socket.on("startBattle", (data: roomData) => {
  checkFinished.value = false;
  if (paddleSide.value === 3 && showWaitRoom.value === true)
    showWaitRoom.value = false;
  playerNickName.value[0] = data.nicks[0];
  playerNickName.value[1] = data.nicks[1];
  console.log("nick: " + playerNickName.value);
  console.log("room" + data.roomNum);
  interval = setInterval(() => {
    if (paddleSide.value !== 3) {
      socket.emit("paddleDeliver", {
        paddleSide: paddleSide.value,
        paddlePos: paddlePos,
        roomNum: data.roomNum.toString(),
        roomIntNum: data.roomNum,
      });
    }
  }, 30);
});

socket.on("finished", async (result: [number, number]) => {
  checkFinished.value = true;
  clearInterval(interval);
  clearInterval(decreaseTimer);
  score.value[0] = result[0];
  score.value[1] = result[1];
  if (result[0] > result[1]) {
    gameResult.value[0] = true;
    gameResult.value[1] = false;
  } else {
    gameResult.value[0] = false;
    gameResult.value[1] = true;
  }
  await setResultInfo();
  showWaitRoom.value = true;
  showGameResult.value = true;
  score.value = [0, 0];
  allUserReady.value = false;
});

socket.on("gameData", (data: GameData) => {
  game?.game(data);
  score.value = data.score;
  if (paddleSide.value === 3 && isGameStart.value === false) {
    showWaitRoom.value = false;
    isGameStart.value = true;
  }
});

function emitReadyStatus() {
  socket.emit("setReady", gameRoomInfo.data.roomNum);
}

function emitCancleReady() {
  unavailableBTN.value = false;
  socket.emit("cancleReady", gameRoomInfo.data.roomNum);
}

let decreaseTimer: ReturnType<typeof setInterval>;
async function countDown() {
  unavailableBTN.value = true;
  timerString.value = "5";
  timerAmimation.value = true;
  decreaseTimer = setInterval(() => {
    --timer.value;
    if (timer.value === 0) {
      timerString.value = "0";
      showWaitRoom.value = false;
      clearInterval(decreaseTimer);
      timerAmimation.value = false;
      socket.emit("startGame", [gameRoomInfo.data.roomNum, paddleSide.value]);
    } else timerString.value = timer.value.toString();
  }, 1000);
}

async function emitStartGame() {
  allUserReady.value = true;
  await countDown();
}

// 게임방에 유저 2명 접속
socket.on("allUserSet", async (data: [boolean, boolean]) => {
  isPlayersSet.value[0] = data[0];
  isPlayersSet.value[1] = data[1];
  if (data[0] && data[1]) {
    isUsersSet.value = true;
    if (gameRoomInfo.data.mode === 0 && paddleSide.value !== 3)
      await emitStartGame();
  } else if (!data[0] || !data[1]) {
    isUsersSet.value = false;
  }
  if (isUsersSet.value === false) {
    allUserReady.value = false;
    if (paddleSide.value !== 3) gameOpponent.$reset();
  }
  if (
    paddleSide.value === 3 &&
    !showGameResult.value &&
    !isPlayersSet.value[0] &&
    !isPlayersSet.value[1]
  )
    showLeaveObserver.value = true;
});

// 게임방 각각 유저 ready 파악
socket.on("usersReadySet", (set: [boolean, boolean]) => {
  isUsersReady.value[0] = set[0];
  isUsersReady.value[1] = set[1];
});

// 유저 모두 레디
socket.on("allReady", async () => {
  await emitStartGame();
});

async function leaveGame(flag: number) {
  if (flag === 1) showGameResult.value = false;
  else if (flag === 2) socket.emit("giveUpGame", gameRoomInfo.data.roomNum);
  else showLeaveObserver.value = false;
  gameRoomInfo.data.mode = -1;
  watchBattle.data.isWatch = false;
  router.push("/");
}

async function restartGame() {
  if (gameRoomInfo.data.mode === 0) {
    // Rank
    setResultInfo();
    playerNickName.value = ["", ""];
    isPlayersSet.value = [false, false];
    isUsersSet.value = false;

    gameMyself.$reset();
    gameOpponent.$reset();
    socket.disconnect();
    socket.connect();
  }
  score.value = [0, 0];
  gameResult.value = [false, false];
  allUserReady.value = false;
  showGameResult.value = false;
}

function closeObserverResult() {
  score.value = [0, 0];
  showGameResult.value = false;
  if (isPlayersSet.value[0] === false && isPlayersSet.value[1] === false) {
    showLeaveObserver.value = true;
  }
}

/**battleVue에서 받을지 homeVue에서 받을지 정할 필요 있을 것 같음. store에서 받으면 라우터 이동이 힘들어 보임. */
socket.on("noticeRejectBattle", () => {
  console.log("noticeRejectBattle");
  modalAlertStore().alertMsg("대전신청이 거절되었습니다");
  router.push("/");
  /**거절시 이벤트. battleVue로 이동된 client 라우터 이동 필요. */
});

function emitChangeMode(gameMode: number) {
  gameRoomInfo.data.mode = gameMode;
  socket.emit("changeMode", [gameRoomInfo.data.roomNum, gameMode]);
  console.log("change gamMode: ", gameRoomInfo.data.mode);
}

socket.on("modeChanged", (gameMode: number) => {
  if (paddleSide.value !== 1) {
    gameRoomInfo.data.mode = gameMode;
    console.log("recv gamMode: ", gameRoomInfo.data.mode);
  }
});
</script>

<template>
  <div>
    <Logo />
    <div class="wrapper">
      <!-- 게임 대기실 -->
      <div v-show="checkFinished || showWaitRoom" class="wait_room">
        <ObserverRoom
          v-if="paddleSide === 3"
          :players="isPlayersSet"
          :readyPlayers="isUsersReady"
          @leave="leaveGame(1)"
        >
          <div
            v-if="allUserReady"
            class="timer"
            :class="{ on: timerAmimation }"
          >
            {{ timerString }}
          </div>
        </ObserverRoom>
        <WaitingRoom
          v-else
          :unavailable="unavailableBTN"
          :myPaddle="paddleSide"
          :setUsers="isUsersSet"
          :readyUsers="isUsersReady"
          :allReady="allUserReady"
          @leave="leaveGame(1)"
          @ready="emitReadyStatus"
          @cancle="emitCancleReady"
          @change="emitChangeMode"
        >
          <div
            v-if="allUserReady"
            class="timer"
            :class="{ on: timerAmimation }"
          >
            {{ timerString }}
          </div>
        </WaitingRoom>
      </div>
      <!-- 게임 (캔버스) -->
      <div v-show="!showWaitRoom" class="ping_pong">
        <Canvas
          :leftNick="playerNickName[0]"
          :rightNick="playerNickName[1]"
          :leftScore="score[0]"
          :rightScore="score[1]"
          :myPaddle="paddleSide"
          @giveUp="leaveGame(2)"
          @leave="leaveGame(1)"
        ></Canvas>
      </div>
    </div>
    <!-- 게임 결과창 -->
    <Teleport to="body">
      <Result
        v-show="showGameResult"
        :result="paddleSide === 1 ? gameResult[0] : gameResult[1]"
        :myPaddle="paddleSide"
        :winner="gameResult[0] === true ? playerNickName[0] : playerNickName[1]"
        @restart="restartGame"
        @stop="leaveGame(1)"
        @close="closeObserverResult"
      ></Result>
      <LeaveObserverRoom v-show="showLeaveObserver" @leave="leaveGame(3)" />
    </Teleport>
  </div>
</template>

<style scoped>
.timer {
  font-weight: 400;
  font-size: 40px;
  font-family: var(--font-game);
  text-align: center;
}
.on {
  animation: bounce 1s ease-in infinite alternate;
}
@keyframes bounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(3);
  }
  100% {
    transform: scale(1);
  }
}
.logo {
  margin-bottom: 30px;
}
.wait_room {
  position: absolute;
  width: 860px;
  height: 640px;
  left: 0;
  top: 0;
}
.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 860px;
  height: 640px;

  background: var(--main-bg);
  box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 30px;
}
</style>
