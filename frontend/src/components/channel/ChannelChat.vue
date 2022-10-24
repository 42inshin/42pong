<script setup lang="ts">
import UserListBox from "@/components/channel/components/UserListBox.vue";
import ChatInputBox from "@/components/channel/components/ChatInputBox.vue";
import ChatBox from "@/components/channel/components/ChatBox.vue";
import ChatNav from "@/components/channel/components/ChatNav.vue";
import { onUnmounted } from "vue";
import { ChatStore } from "@/stores/chatting";

onUnmounted(() => {
  ChatStore().dataReset();
});
</script>

<template>
  <div id="chat" class="right_sidebar">
    <ChatNav />
    <ChatBox />
    <ChatInputBox />
    <UserListBox />
  </div>
</template>

<style scoped></style>
