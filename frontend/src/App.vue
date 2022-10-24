<script setup lang="ts">
// import { onBeforeMount } from "@vue/runtime-core";
import axios from "axios";
import { RouterView } from "vue-router";
import router from "./router";
// import { useUserStore } from "./stores/user";
// import Chat from "./components/Chat.vue";

// const store = useUserStore();
</script>

<template>
  <!-- <div v-if="store.data.nickname">{{ store.data.nickname }} 님 환영합니다!</div> -->
  <RouterView />
</template>

<style>
@import "@/assets/css/reset.css";
@import "@/assets/css/default.css";
</style>
