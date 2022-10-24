<script setup lang="ts">
const props = defineProps({
  leftNick: String,
  rightNick: String,
  leftScore: Number,
  rightScore: Number,
  myPaddle: Number,
});

const emit = defineEmits(["giveUp", "leave"]);

function giveUpGame() {
  emit("giveUp");
}

function leaveGame() {
  emit("leave");
}
</script>

<template>
  <div class="game_canvas">
    <div class="pong_info">
      <div>
        <span class="nick">{{ leftNick || "" }}</span>
        <span class="score">{{ leftScore || 0 }}</span>
      </div>
      <div>
        <span class="score">{{ rightScore || 0 }}</span>
        <span class="nick">{{ rightNick || "" }}</span>
      </div>
    </div>
    <div class="pong_canvas">
      <canvas id="pong" width="700" height="500"></canvas>
      <p>
        {{ $route.query.mode }}
      </p>
    </div>
    <!-- 할 일 -->
    <!-- 기권하기는 결과 처리하는 부분 있어야 함 -->
    <button
      v-if="myPaddle !== 3"
      @click="giveUpGame"
      class="btn give_up"
      type="button"
    >
      기권하기
    </button>
    <!-- 관전자에 한 함 : 채팅에서도 잘 나가지나..? -->
    <button v-else @click="leaveGame" class="btn leave" type="button">
      나가기
    </button>
  </div>
</template>

<style scoped>
.game_canvas {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btn {
  margin-top: 22px;
  width: 100px;
  height: 32px;
  background: var(--notice3);
  border-radius: 15px;

  font-family: var(--font-family);
  font-weight: 500;
  font-size: 16px;
  padding: 2px 0 2px;
}
.pong_info {
  display: flex;
  height: 32px;
  width: 700px;
  margin-bottom: 16px;
  justify-content: space-between;
  align-items: center;
}
.pong_info > div {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 350px;
  height: 40px;
}
.pong_info .score span {
  width: 100px;
}
.pong_info > div:first-child > .score {
  margin-right: 16px;
  text-align: right;
}
.pong_info > div:last-child > .score {
  margin-left: 16px;
}
span.nick {
  display: inline-block;
  width: 250px;
  font-size: 24px;
  line-height: 32px;
  font-family: var(--font-game);
}
span.nick:last-child {
  text-align: right;
}
span.score {
  font-size: 36px;
  font-family: var(--font-game-score);
}
.pong_canvas {
  display: inline-block;
  box-shadow: 0 0 0 8px #fff;
  width: 700px;
  height: 500px;
}
</style>
