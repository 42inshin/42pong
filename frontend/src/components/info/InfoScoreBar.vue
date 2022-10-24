<script setup lang="ts">
const props = defineProps({
  user: {
    type: Object,
    default: () => {
      return {
        avatarPath: "",
        id: "",
        ladder_lose: 0,
        ladder_win: 0,
        lating: 0,
        lose: 0,
        nickname: "",
        status: 0,
        win: 0,
      };
    },
  },
});

function calcPercent(win: number, lose: number): number {
  if (lose === 0) {
    return 100;
  } else {
    return Number(((win / (win + lose)) * 100).toFixed(1));
  }
}

function calcWidth(win: number, lose: number): string {
  const width = calcPercent(win, lose);
  return `${Math.round(width)}%`;
}
</script>

<template>
  <div class="score_bar">
    <div class="lose_bar">
      <div
        class="win_bar"
        :style="{
          width: calcWidth(
            Number(props.user.ladder_win),
            Number(props.user.ladder_lose)
          ),
        }"
      ></div>
      <span class="win">{{ props.user.ladder_win }}W</span>
      <span class="lose">{{ props.user.ladder_lose }}L</span>
      <span class="percent"
        >{{
          calcPercent(
            Number(props.user.ladder_win),
            Number(props.user.ladder_lose)
          ) || 0
        }}%</span
      >
    </div>
  </div>
</template>

<style scoped>
.score_bar {
  display: flex;
  align-items: center;
  font-family: var(--font-game);
  margin: 15px 0;
}
.lose_bar {
  position: relative;
  height: 20px;
  width: 100%;
  background: var(--notice3);
  border-radius: 10px;
  overflow: hidden;
}
.win_bar {
  height: 20px;
  background: var(--notice);
}

.win {
  position: absolute;
  left: 20px;
  top: 3px;
}
.lose {
  position: absolute;
  right: 20px;
  top: 3px;
}

.percent {
  position: absolute;
  left: 50%;
  top: 3px;
  transform: translateX(-50%);
}
</style>
