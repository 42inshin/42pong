<script setup lang="ts">
import Profile from "@/components/game/GameWaitingProfile.vue";
import NonProfile from "@/components/game/GameNonProfile.vue";
import {
  gameMyselfStore,
  gameOpponentStore,
  gameRoomInfoStore,
} from "@/stores/game";
import { watch, ref } from "vue";

const props = defineProps({
  players: {
    type: Array,
    default: () => {
      return [false, false];
    },
  },
  readyPlayers: {
    type: Array,
    default: () => {
      return [false, false];
    },
  },
});

const myself = gameMyselfStore();
const opponent = gameOpponentStore();
const gameInfo = gameRoomInfoStore();
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

const emit = defineEmits(["leave"]);

function leaveObserverRoom() {
  emit("leave", false);
}
</script>

<template>
  <div class="wrapper">
    <button class="mode_text" :class="{ flash: changed === true }">
      {{
        gameInfo.data.mode === 0
          ? gameInfo.data.rank
          : gameInfo.data.mode === 1
          ? gameInfo.data.normal
          : gameInfo.data.portal
      }}
    </button>
    <div class="waiting_msg">잠시후 게임이 시작됩니다</div>
    <div class="user">
      <!-- 왼쪽에 보이는 프로필 위치 -->
      <NonProfile v-if="players[0] === false" />
      <Profile
        v-else
        :user="myself"
        :ready="(readyPlayers[0] as boolean || !gameInfo.data.mode)"
      />
      <div class="slot_style"><slot>vs</slot></div>
      <!-- 오른쪽에 보이는 프로필 위치 -->
      <NonProfile v-if="players[1] === false" />
      <Profile
        v-else
        :user="opponent"
        :ready="(readyPlayers[1] as boolean || !gameInfo.data.mode)"
      />
    </div>
    <button @click="leaveObserverRoom" class="leave_button" type="button">
      나가기
    </button>
  </div>
</template>

<style scoped>
.mode_text {
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
.leave_button {
  margin-top: 32px;
  width: 160px;
  height: 48px;

  border-radius: 15px;
  background: var(--active);
  font-weight: 700;
  font-size: 20px;
  font-family: var(--font-family);
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
