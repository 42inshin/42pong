<script setup lang="ts">
import { modalProfileStore } from "@/stores/modal";
import { useUserStore } from "@/stores/user";
import { ChatStore } from "@/stores/chatting";

const self = useUserStore();
const chatStore = ChatStore();
const modalProfile = modalProfileStore();

function isOffline(message: any) {
  if (message.status == 0) {
    return true;
  }
  return false;
}

async function modalOn(id: string) {
  if (self.data.id === id) return;
  modalProfile.clickUser(id);
}

function getKorTime(time: Date): string {
  const nowDay = new Date().getDate();

  const date = new Date(time);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = checkTime(date.getHours()); // 시
  const minutes = checkTime(date.getMinutes()); // 분
  if (nowDay !== day) {
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function checkTime(time: number) {
  let temp = String(time);
  if (time < 10) {
    temp = `0${temp}`;
  }
  return temp;
}

function findUser(id: string) {
  const user = chatStore.data.participants.find((user) => user.id === id);
  return user;
}
</script>

<template>
  <li
    v-for="(message, index) in chatStore.data.messages"
    :key="index"
    :class="{ offline: isOffline(message) }"
  >
    <div v-if="!message.notice">
      <div class="img_box" @click="modalOn(message.sender.id)">
        <img
          :src="
            findUser(message.sender.id)?.avatarPath || message.sender.avatarPath
          "
          alt="profile image"
        />
      </div>
      <div class="chat_info">
        <span class="nickname">{{
          findUser(message.sender.id)?.nickname || message.sender.nickname
        }}</span>
        <span class="time">{{ getKorTime(message.createdAt) }}</span>
        <p class="text">{{ message.message }}</p>
      </div>
    </div>
    <p v-else class="notice">{{ message.message }}</p>
  </li>
</template>

<style scoped>
.chat_box li {
  padding: 6px 20px;
}
.chat_box li > div {
  display: flex;
}
.chat_box li:hover {
  background: var(--main);
}
.chat_box .img_box {
  width: 40px;
  height: 40px;
  border: 2px solid var(--white);
  border-radius: 20px;
  overflow: hidden;
  background: var(--main);
  cursor: pointer;
}
.chat_box .nickname {
  font-size: 14px;
  font-weight: 700;
  margin-left: 10px;
}
.chat_box .time {
  font-size: 12px;
  color: var(--offline);
  font-weight: 300;
  margin-left: 4px;
}
.chat_box .text {
  width: 200px;
  margin-left: 10px;
  margin-top: 6px;
  font-size: 14px;
  color: #ddd;
  line-height: 18px;
  word-break: break-all;
}

.user_list li.offline {
  opacity: 0.5;
}

.notice {
  width: 100%;
  font-size: 12px;
  color: var(--offline);
  text-align: center;
}
</style>
