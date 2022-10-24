<script setup lang="ts">
const props = defineProps<{
  win?: number;
  lose?: number;
}>();

function calcPercent(win: number, lose: number): number {
  if (lose === 0) {
    return 100;
  } else {
    return Number(((win / (win + lose)) * 100).toFixed(1));
  }
}

function calcWidth(win: number, lose: number): string {
  const width = calcPercent(win, lose);
  return `${Math.round(width)}px`;
}
</script>

<template>
  <div class="score_bar">
    <div class="lose_bar">
      <div
        class="win_bar"
        :style="{ width: calcWidth(Number(props.win), Number(props.lose)) }"
      ></div>
      <span class="win">{{ props.win }}W</span>
      <span class="lose">{{ props.lose }}L</span>
    </div>
    <span class="percent"
      >{{ calcPercent(Number(props.win), Number(props.lose)) || 0 }}%</span
    >
  </div>
</template>

<style scoped>
.score_bar {
  display: flex;
  align-items: center;
}
.lose_bar {
  position: relative;
  height: 16px;
  width: 100px;
  background: var(--notice3);
  border-radius: 4px;
  overflow: hidden;
}
.win_bar {
  height: 16px;
  background: var(--notice);
}

.win {
  position: absolute;
  left: 4px;
  top: 2px;
}
.lose {
  position: absolute;
  right: 4px;
  top: 2px;
}

.percent {
  margin-left: 5px;
}
</style>
