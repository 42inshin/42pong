<script setup lang="ts">
import ChannelTitle from "@/components/channel/components/ChannelTitle.vue";
import CommonBtn from "@/components/channel/components/CommonBtn.vue";
import { ChatStore } from "@/stores/chatting";

const chatStore = ChatStore();
</script>

<template>
  <div class="channel_nav">
    <CommonBtn
      v-if="chatStore.data.category !== 'game'"
      class="angle"
      @click="chatStore.chatClose()"
    />
    <ChannelTitle />
    <CommonBtn class="option_btn burger" @click="chatStore.onBurger = true" />
  </div>
</template>

<style scoped>
.channel_nav {
  position: relative;
  height: 50px;
  padding: 20px 20px 12px;
  display: flex;
  align-items: center;
}
</style>
