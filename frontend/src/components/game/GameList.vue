<script setup lang="ts">
const props = defineProps({
  roomNum: Number,
  roomData: {
    type: Object,
    default: () => {
      return {
        name: "",
        pass: "",
        mode: -1,
        person: 0,
        id: 0,
        secret: false,
        participation: true,
      };
    },
  },
});

const emit = defineEmits(["enter", "inputPass"]);

function enterRoom() {
  emit("enter", [props.roomNum, ""]);
}

function showInputPass() {
  emit("inputPass", [props.roomNum, props.roomData.name]);
}
</script>

<template>
  <li class="game_li">
    <h2 class="title">{{ roomData.name }}</h2>
    <div class="game_info">
      <span v-if="roomData.secret === true" class="private">🔒</span>
      <span class="user_num">{{ roomData.person }}명</span>
      <div v-if="roomData.secret === false" class="no_pass">
        <button
          v-if="roomData.participation === true"
          @click="enterRoom"
          type="button"
        >
          입장
        </button>
        <button v-else @click="enterRoom" class="observe" type="button">
          관전
        </button>
      </div>
      <div v-else>
        <button
          v-if="roomData.participation === true"
          @click="showInputPass"
          type="button"
        >
          입장
        </button>
        <button v-else @click="showInputPass" class="observe" type="button">
          관전
        </button>
      </div>
    </div>
  </li>
</template>

<style scoped>
.title label {
  color: #666;
}
.game_li {
  background: var(--active);
  border: 2px solid #2f3257;
  border-radius: 10px;
  height: 50px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-family: "Do Hyeon";
}
.title {
  font-size: 18px;
  max-width: 300px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-top: 4px;
}
.game_info > span {
  margin-right: 15px;
}
.user_num {
  margin-top: 4px;
  display: inline-block;
  min-width: 40px;
  text-align: right;
}
.game_info {
  height: 50px;
  display: flex;
  align-items: center;
}
button {
  font-family: "Do Hyeon";
  background-color: var(--game);
  width: 46px;
  height: 30px;
  border-radius: 6px;
  font-size: 16px;
  padding-top: 4px;
}
.observe {
  background-color: var(--notice);
}
</style>
