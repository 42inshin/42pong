<script setup lang="ts">
import LogoName from "@/components/login/LogoName.vue";
import Profile from "./LeftSidebarProfile.vue";
import UserList from "./LeftSidebarUserList.vue";
import { useUserStore } from "@/stores/user";

const store = useUserStore();
</script>

<template>
  <div class="left_sidebar">
    <LogoName />
    <Profile :user="store.data" />
    <UserList />
  </div>
</template>

<style scoped>
.logo {
  padding: 15px 15px;
}
.left_sidebar {
  width: 397px;
  height: 100%;
  padding: 30px 30px 30px 45px;
  background: var(--main-bg);
  transition: all 0.5s;
}
</style>
