<script setup lang="ts">
import { getHistory } from "@/api/UserService";
import { onBeforeMount, ref, watch } from "vue";
import type { GameResult } from "@/interface/interface";
const props = defineProps({
  nickname: {
    type: String,
    default: () => {
      return "";
    },
  },
});

let historys: [];
const viewList = ref<GameResult[]>([]);
const rowCount = ref(0);
const disableBtn = ref(false);
const firstRowNum = 6; // 처음 보여질 줄 수
const showRowNum = 10; // 더보기 클릭시 보여줄 줄 수

function moreList() {
  for (let i = 0; i < showRowNum; i++) {
    if (historys.length > rowCount.value) {
      viewList.value.push(historys[rowCount.value]);
      rowCount.value++;
      if (historys.length === rowCount.value) {
        disableBtn.value = true;
        return;
      }
    }
  }
}
// watch가 꼭 있어지만 제대로 동작합니다.
watch(
  () => props.nickname,
  async () => {
    if (props.nickname !== "") {
      historys = [];
      viewList.value = [];
      disableBtn.value = false;
      rowCount.value = 0;
      historys = await getHistory(props.nickname);
      historys.reverse();
      for (let i = 0; i < historys.length; i++) {
        if (i == firstRowNum) break;
        viewList.value.push(historys[i]);
        rowCount.value++;
      }
      if (historys.length === rowCount.value) {
        disableBtn.value = true;
        return;
      }
    }
  }
);

onBeforeMount(async () => {
  disableBtn.value = true;
  if (props.nickname !== "") {
    historys = await getHistory(props.nickname);
    historys.reverse();
    for (let i = 0; i < historys.length; i++) {
      if (i == firstRowNum) break;
      viewList.value.push(historys[i]);
      rowCount.value++;
    }
    if (historys.length === rowCount.value) {
      disableBtn.value = true;
      return;
    }
    disableBtn.value = false;
  }
});

function isLose(history: GameResult) {
  if (props.nickname == history.player1.nickname) {
    if (history.player1Score < history.player2Score) {
      return { lose: true };
    }
  } else {
    if (history.player1Score > history.player2Score) {
      return { lose: true };
    }
  }
}

function getKorTime(time: Date): string {
  const dt = new Date(time);
  return dt.toString();
}
</script>

<template>
  <ul class="conatiner no-scrollbar">
    <li
      v-for="history in viewList"
      :key="history.id"
      class="win"
      :class="isLose(history)"
      :title="getKorTime(history.createdAt)"
    >
      <span class="game_type">{{ history.gameMode }}</span>
      <div class="info">
        <div class="name">{{ history.player1.nickname }}</div>
        <div class="score">{{ history.player1Score }}</div>
      </div>
      <div class="info">
        <div class="score">{{ history.player2Score }}</div>
        <div class="name">{{ history.player2.nickname }}</div>
      </div>
    </li>
    <div class="btnwrapper">
      <button @click="moreList" class="getMore" :disabled="disableBtn">
        더보기
      </button>
    </div>
  </ul>
</template>

<style scoped>
.conatiner {
  height: 450px;
  overflow-x: hidden;
}
li {
  margin-bottom: 10px;
  border-radius: 5px;
  height: 60px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-game);
}

li.win {
  border-left: 5px solid var(--notice);
  background: rgba(94, 124, 250, 0.15);
}

li.lose {
  border-left: 5px solid var(--notice3);
  background: rgba(217, 81, 99, 0.15);
}

.game_type {
  position: absolute;
  left: 20px;
  top: 7px;
  font-size: 12px;
  color: var(--yellow);
}
.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  padding: 0 20px;
}
.info > .score {
  font-family: var(--font-game-score);
  font-size: 32px;
}

.btnwrapper {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.getMore {
  width: 140px;
  height: 28px;
  font-size: 12px;
  background: var(--main-bg);
  border-radius: 20px;
}
.getMore:disabled {
  visibility: hidden;
}
</style>
