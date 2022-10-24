<script setup lang="ts">
const authUrl = import.meta.env.VITE_42_AUTH_URL;
</script>

<template>
  <button class="login-btn">
    <a :href="authUrl">42 LOGIN </a>
  </button>
</template>

<style scoped>
.login-btn {
  width: 172px;
  height: 60px;
  font-size: 24px;
  border-radius: 30px;
  background: var(--btn-red);
  overflow: hidden;
  padding: 0;
}
.login-btn a {
  display: inline-block;
  width: 172px;
  height: 60px;
  line-height: 60px;
}
</style>
