<script setup lang="ts">
import Profile from "@/components/game/GameWaitingProfile.vue";
import NonProfile from "@/components/game/GameNonProfile.vue";
import {
  gameRoomInfoStore,
  gameMyselfStore,
  gameOpponentStore,
} from "@/stores/game";
import { watch, ref } from "vue";

const props = defineProps({
  unavailable: Boolean,
  myPaddle: Number,
  setUsers: Boolean,
  readyUsers: {
    type: Array,
    default: () => {
      return [false, false];
    },
  },
  allReady: Boolean,
});

const gameInfo = gameRoomInfoStore();
const myself = gameMyselfStore();
const opponent = gameOpponentStore();
const changed = ref(false);

watch(
  () => gameInfo.data.mode,
  () => {
    changed.value = true;
    setTimeout(() => {
      changed.value = false;
    }, 100);
  }
);

const emit = defineEmits(["leave", "ready", "cancle", "change"]);

function setReady() {
  emit("ready");
}

function leaveWaitRoom() {
  emit("leave", false);
}

function cancleReady() {
  emit("cancle");
}

function changeGameMode(mode: number) {
  emit("change", mode);
}
</script>

<template>
  <div class="wrapper">
    <div v-if="gameInfo.data.mode !== 0" class="mode_box">
      <div
        v-if="myPaddle === 1 && !readyUsers[0] && !readyUsers[1]"
        class="mode_btn"
      >
        <button
          @click="changeGameMode(1)"
          :class="{ on: gameInfo.data.mode === 1 }"
          type="button"
        >
          일반 모드
        </button>
        <button
          @click="changeGameMode(2)"
          :class="{ on: gameInfo.data.mode === 2 }"
          type="button"
        >
          포탈 모드
        </button>
      </div>
      <button v-else class="mode_text" :class="{ flash: changed === true }">
        {{
          gameInfo.data.mode === 1 ? gameInfo.data.normal : gameInfo.data.portal
        }}
      </button>
    </div>
    <div v-else class="mode_box">
      <button class="mode_text">랭크 게임</button>
    </div>
    <div class="waiting_msg">잠시후 게임이 시작됩니다</div>
    <div class="user">
      <!-- 왼쪽에 보이는 프로필 위치 -->
      <div v-if="myPaddle === 0">
        <NonProfile />
      </div>
      <div v-else-if="myPaddle === 1">
        <Profile
          :user="myself"
          :ready="(readyUsers[0] as boolean || !gameInfo.data.mode)"
        />
      </div>
      <div v-else>
        <Profile
          v-if="setUsers"
          :user="opponent"
          :ready="(readyUsers[0] as boolean || !gameInfo.data.mode)"
        />
        <NonProfile v-else />
      </div>
      <div class="slot_style"><slot>vs</slot></div>
      <!-- 오른쪽에 보이는 프로필 위치 -->
      <div v-if="myPaddle === 0">
        <NonProfile />
      </div>
      <div v-else-if="myPaddle === 2">
        <Profile
          :user="myself"
          :ready="(readyUsers[1] as boolean || !gameInfo.data.mode)"
        />
      </div>
      <div v-else>
        <Profile
          v-if="setUsers"
          :user="opponent"
          :ready="(readyUsers[1] as boolean || !gameInfo.data.mode)"
        />
        <NonProfile v-else />
      </div>
    </div>
    <div v-if="!gameInfo.data.mode" class="btn rank">
      <button
        :disabled="unavailable"
        @click="leaveWaitRoom"
        class="leave_button"
        type="button"
      >
        나가기
      </button>
    </div>
    <div v-else class="btn normal">
      <div
        v-if="
          myPaddle === 0
            ? true
            : myPaddle === 1
            ? !readyUsers[0]
            : !readyUsers[1]
        "
        class="ready"
      >
        <button
          @click="setReady"
          :disabled="!setUsers"
          :class="{ on: setUsers }"
          class="ready_button"
          type="button"
        >
          준비하기
        </button>
      </div>
      <div v-else class="cancle_ready">
        <button
          @click="cancleReady"
          :disabled="unavailable"
          class="ready_button"
          type="button"
        >
          준비 취소
        </button>
      </div>
      <button
        @click="leaveWaitRoom"
        :disabled="unavailable"
        class="leave_button"
        type="button"
      >
        나가기
      </button>
    </div>
  </div>
</template>

<style scoped>
.mode_box {
  display: flex;
  justify-content: center;
  width: 100%;
}
.mode_btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.mode_btn > button {
  width: 100%;
  background: var(--active);
  font-size: 20px;
  font-family: var(--font-game);
}
.mode_btn > button:first-child {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}
.mode_btn > button:last-child {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}
.mode_btn > button.on {
  background: var(--game);
}
.mode_text {
  display: block;
  width: 100%;
  border-radius: 15px;
  background: var(--active);
  font-size: 20px;
  font-family: var(--font-game);
  text-align: center;
}
.mode_text.flash {
  background: var(--game);
}
.slot_style {
  width: 45px;
  height: 60px;

  font-family: var(--font-game);
  font-size: 48px;
}
.ready_button {
  width: 160px;
  height: 48px;

  border-radius: 15px;
  font-weight: 700;
  font-size: 20px;
  font-family: var(--font-family);
}
.ready > button.on {
  /* 유저 2명 - 준비하기 활성화 색상 */
  background: var(--notice);
}
button:disabled {
  /* 비활성화 색상*/
  background: var(--offline) !important;
}
.cancle_ready > .ready_button {
  /* 준비 완료 - 준비 취소 비활성화 색상 */
  background: var(--notice2);
}
.leave_button {
  width: 160px;
  height: 48px;

  border-radius: 15px;
  background: var(--active);
  font-weight: 700;
  font-size: 20px;
  font-family: var(--font-family);
}
.normal {
  width: 340px;

  display: flex;
  justify-content: space-between;
}
.waiting_msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 40px;
  font-family: var(--font-game);
  margin: 26px 0 30px;
}
.user {
  width: 620px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn {
  margin-top: 32px;
}
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 860px;
  height: 640px;
  padding: 40px 120px;

  background: var(--main-bg);
  box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 30px;
}
</style>
