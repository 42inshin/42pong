<script setup lang="ts">
import UserList from "@/components/channel/components/UserList.vue";
import CommonBtn from "@/components/channel/components/CommonBtn.vue";
import { deleteChannel } from "@/api/ChannelService";
import { ChatStore } from "@/stores/chatting";
import { DmStore } from "@/stores/dm";

const chatStore = ChatStore();
const dmStore = DmStore();

async function exitChannel() {
  if (chatStore.data.category === "channel") {
    await deleteChannel(chatStore.data.chat.id);
  } else if (chatStore.data.category === "dm") {
    dmStore.deleteDm(chatStore.data.title);
  }
  chatStore.chatClose();
}
</script>

<template>
  <div class="user_list_box" v-show="chatStore.onBurger">
    <div class="channel_nav">
      <div class="title fz18">유저 목록</div>
      <CommonBtn @click="chatStore.onBurger = false" class="option_btn close" />
    </div>
    <UserList />
    <div class="btn_box" v-if="chatStore.data.category !== 'game'">
      <button class="exit_btn" @click="exitChannel">
        <img src="@/assets/image/exit.svg" alt="나가기 버튼" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.user_list_box {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 254px;
  height: 730px;
  background-color: var(--active);
  border-radius: 30px 0 0 30px;
  z-index: 1;
  overflow: hidden;
}

.channel_nav {
  position: relative;
  height: 50px;
  padding: 20px 20px 12px;
  display: flex;
  align-items: center;
}

.btn_box {
  height: 50px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn_box .exit_btn {
  background: none;
  border-radius: 4px;
  width: 24px;
  padding: 3px;
}
</style>
