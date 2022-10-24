<script setup lang="ts"></script>

<template>
  <div class="user_box box">
    <div class="waiting_circle">
      <div class="waiting_text">대기중</div>
    </div>
  </div>
</template>

<style scoped>
.user_box {
  position: relative;
  width: 248px;
  height: 351px;
  padding: 30px 42px;
  background: var(--active);

  display: flex;
  justify-content: center;
  align-items: center;
}
.waiting_circle {
  width: 140px;
  height: 140px;
  box-shadow: 0 0 0 2px #fff;
  border-radius: 50%;
  overflow: hidden;
  background: var(--main-bg);

  display: flex;
  align-items: center;
}
.waiting_text {
  text-align: center;
  margin-left: auto;
  margin-right: auto;

  font-weight: 700;
  font-size: 24px;
  font-family: var(--font-family);
}
</style>
