<script setup lang="ts">
import { ChatStore } from "@/stores/chatting";
const chatStore = ChatStore();

// const props = defineProps({
//   index: {
//     type: Number,
//     default: () => {
//       return -1;
//     },
//   },
// });
</script>

<template>
  <div class="title text_nowrap">
    <span v-if="chatStore.data.category === 'dm'">👤</span>
    <span v-else-if="chatStore.data.type == 'private'">🔒</span>
    <span v-else-if="chatStore.data.type == 'game'">🏓</span>
    <span v-else>＃</span>
    {{ chatStore.data.title }}
  </div>
</template>

<style scoped>
.title {
  font-size: 18px;
  max-width: 210px;
  line-height: 30px;
}
</style>
