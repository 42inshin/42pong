<script setup lang="ts">
import AuthBtn from "@/components/login/AuthBtn.vue";
import LogoName from "@/components/login/LogoName.vue";
import LogoImg from "@/components/login/LogoImg.vue";
</script>

<template>
  <div class="wrapper login_component">
    <LogoName />
    <LogoImg />
    <AuthBtn />
  </div>
</template>

<style scoped>
.logo {
  padding: 12px 0;
}
.login_component {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 320px;
  height: 480px;
  padding: 60px;
}
.login-btn {
  width: 172px;
  height: 60px;
  font-size: 24px;
  border-radius: 30px;
  background: var(--btn-red);
}
</style>
