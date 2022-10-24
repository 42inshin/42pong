<script setup lang="ts">
import { gameMyselfStore, gameRoomInfoStore } from "@/stores/game";

const props = defineProps({
  result: Boolean,
  myPaddle: Number,
  winner: String,
});

const gameInfo = gameRoomInfoStore();
const mySelf = gameMyselfStore();

function calculateRating(isWin: boolean): number {
  if (isWin) return mySelf.data.lating;
  return mySelf.data.lating;
}

const emit = defineEmits(["restart", "stop", "close"]);

function restartGame() {
  emit("restart");
}

function stopGame() {
  emit("stop");
}

function closeResult() {
  emit("close");
}
</script>

<template>
  <div
    :class="{ win: myPaddle !== 3 ? result : true }"
    class="game_result_window"
  >
    <div v-if="myPaddle === 3" class="game_result_modal">
      <div class="outcome">승 리</div>
      <div class="result_info">
        <div v-if="gameInfo.data.mode === 0" class="battle_icon">🏆</div>
        <div v-else class="battle_icon">🏓</div>
        <div class="change change_winner">{{ winner }}</div>
      </div>
      <div class="btn">
        <button
          v-if="gameInfo.data.mode !== 0"
          @click="closeResult"
          class="up_button"
        >
          닫 기
        </button>
        <button
          @click="stopGame"
          class="down_button"
          :class="{ keep_distance: gameInfo.data.mode === 0 }"
        >
          나가기
        </button>
      </div>
    </div>
    <div v-else class="game_result_modal">
      <div v-if="result" class="outcome">승 리</div>
      <div v-else class="outcome">패 배</div>
      <div v-if="gameInfo.data.mode === 0" class="result_info">
        <div class="battle_icon">🏆</div>
        <div>{{ calculateRating(result) }}</div>
        <div v-if="result" class="change change_winner">+15</div>
        <div v-else class="change change_loser">-10</div>
      </div>
      <div v-else class="result_info">
        <div class="battle_icon">🏓</div>
        <div v-if="result" class="change change_winner">+1승</div>
        <div v-else class="change change_loser">+1패</div>
      </div>
      <div class="btn">
        <button @click="restartGame" class="up_button">다시하기</button>
        <button @click="stopGame" class="down_button">그만하기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game_result_window {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    116.82deg,
    rgba(184, 48, 44, 0.8) 0%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;
}
div.win {
  background: linear-gradient(
    116.82deg,
    rgba(62, 128, 188, 0.8) 0%,
    rgba(9, 10, 22, 0.8) 100%
  );
}
.game_result_modal {
  width: 300px;
  height: 400px;
  background: var(--main-bg);
  box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 30px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.outcome {
  margin-bottom: 20px;
  width: 180px;
  font-family: var(--font-game);
  font-weight: 400;
  font-size: 54px;
  text-align: center;
}
.result_info {
  height: 91px;
  font-family: var(--font-family);
  font-weight: 400;
  font-size: 28px;
  text-align: center;
}
.battle_icon {
  margin-bottom: 5px;
}
.result_info > .change {
  margin-top: 10px;
  font-size: 20px;
}
.change_winner {
  color: #00babc;
}
.change_loser {
  color: var(--notice3);
}
.btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btn > button {
  width: 160px;
  height: 48px;
  border-radius: 15px;

  font-family: var(--font-family);
  font-weight: 700;
  font-size: 20px;
  text-align: center;
}
.up_button {
  margin-top: 28px;
  background: var(--active);
}
.down_button {
  margin-top: 12px;
  background: var(--notice3);
}
.keep_distance {
  margin-top: 28px;
}
</style>
