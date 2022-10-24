<script setup lang="ts">
import ScoreBar from "./ScoreBar.vue";
const props = defineProps({
  user: Object,
  index: Number,
});
function onIndex(index: number): boolean {
  if (index < 4) return true;
  return false;
}
</script>

<template>
  <td class="rank" :class="{ rank_color: onIndex(Number(props.index)) }">
    {{ props.index }}
  </td>
  <td class="nickname">
    <RouterLink :to="{ name: 'info', query: { nickname: user?.nickname } }">
      {{ user?.nickname }}
    </RouterLink>
  </td>
  <td class="tier">{{ user?.tier }}</td>
  <td class="lating">{{ user?.lating }}</td>
  <td class="ladder">
    <ScoreBar :win="user?.ladder_win" :lose="user?.ladder_lose" />
  </td>
  <td class="normal">
    <ScoreBar :win="user?.win" :lose="user?.lose" />
  </td>
</template>

<style scoped>
td {
  background-color: var(--active);
  vertical-align: middle;
}

.rank {
  text-indent: 15px;
}
.rank_color {
  color: var(--gold);
}

.getMore {
  background-color: #343868;
  padding-top: 5px;
  padding-left: 16px;
  text-align: left;
  height: 100px;
}
</style>
