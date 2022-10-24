<script setup lang="ts">
const emit = defineEmits(["leave"]);

function leaveObserverRoom() {
  emit("leave", false);
}
</script>

<template>
  <div class="leave_observer_window">
    <div class="leave_modal">
      <div class="leave_message">방이 삭제되었습니다</div>
      <button @click="leaveObserverRoom" class="leave_button">나가기</button>
    </div>
  </div>
</template>

<style scoped>
.leave_observer_window {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    116.82deg,
    rgba(62, 128, 188, 0.8) 0%,
    rgba(9, 10, 22, 0.8) 100%
  );
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;
}
.leave_modal {
  width: 400px;
  padding: 40px 0 35px;
  background: var(--main-bg);
  box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 30px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.leave_message {
  margin-bottom: 18px;
  font-family: var(--font-game);
  font-weight: 400;
  font-size: 36px;
  text-align: center;
}
.leave_button {
  width: 160px;
  height: 48px;
  border-radius: 15px;

  font-family: var(--font-family);
  font-weight: 700;
  font-size: 20px;
  text-align: center;

  margin-top: 16px;
  background: var(--active);
}
</style>
