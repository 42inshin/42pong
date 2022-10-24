<script setup lang="ts">
import UserListLine from "@/components/home/UserListLine.vue";
import { modalProfileStore } from "@/stores/modal";
import { useUserStore } from "@/stores/user";
import { ChatStore } from "@/stores/chatting";

const self = useUserStore();
const chatStore = ChatStore();

const modalProfile = modalProfileStore();

async function clickUserList($event: MouseEvent, id: string) {
  const li = $event.currentTarget as HTMLLIElement;
  if (id === self.data.id) return;
  li.classList.add("active");
  modalProfile.clickUser(id);
}

function checkOnwer(user_id: string) {
  if (chatStore.data.category !== "channel") return false;
  if (user_id === chatStore.data.chat.owner.id) return true;
}
</script>

<template>
  <ul class="user_list no-scrollbar">
    <UserListLine
      v-for="(user, index) in chatStore.data.participants"
      :key="index"
      @click="clickUserList($event, user.id)"
      :user="user"
      :class="{ owner: checkOnwer(user.id) }"
    />
    <div class="ban_box">
      <div class="ban_title" v-if="chatStore.data.banList.length > 0">
        벤 목록
      </div>
      <UserListLine
        v-for="(user, index) in chatStore.data.banList"
        :key="index"
        @click="clickUserList($event, user.id)"
        :user="user"
        class="ban"
      />
    </div>
  </ul>
</template>

<style scoped>
.user_list {
  width: 100%;
  height: 630px;
  overflow-x: hidden;
  padding: 15px;
  position: relative;
}

.owner {
  color: var(--gold);
}

.ban_box {
  margin-top: 20px;
}

.ban_title {
  color: var(--white);
  font-size: 14px;
  padding: 10px 16px 8px 5px;
  font-weight: 700;
  cursor: pointer;
}
</style>
