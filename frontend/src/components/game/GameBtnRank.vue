<script setup lang="ts">
import { gameRoomInfoStore } from "@/stores/game";
import { useRouter } from "vue-router";

const router = useRouter();
const gameRoomInfo = gameRoomInfoStore();

function moveRankBattle() {
  gameRoomInfo.data.mode = 0;
  router.push("battle");
}
</script>

<template>
  <button @click="moveRankBattle">
    <div>🏆</div>
    랭크 게임
  </button>
</template>

<style scoped>
button {
  width: 230px;
  height: 150px;
  border-radius: 30px;
  font-family: "Do Hyeon";
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  font-size: 35px;
  line-height: 44px;
  background: linear-gradient(292.57deg, #a52435 0%, #f25e72 100%);
  box-shadow: 15px 15px 40px rgba(0, 0, 0, 0.2);
}
</style>
