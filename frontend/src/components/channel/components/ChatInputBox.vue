<script setup lang="ts">
import { ChatStore } from "@/stores/chatting";
import { useUserStore } from "@/stores/user";
import { UserListStore } from "@/stores/userList";
import { gameRoomInfoStore } from "@/stores/game";
import { modalAlertStore } from "@/stores/modal";
import { ref, onUnmounted } from "vue";

const chatMsg = ref("");
const chatCount = ref(0);
const startInterval = ref(true);
const chatStore = ChatStore();
const self = useUserStore();
const userListStore = UserListStore();
const gameRoomInfo = gameRoomInfoStore();
let interval: ReturnType<typeof setInterval>;

onUnmounted(() => {
  clearInterval(interval);
});

function sendMessage() {
  if (chatMsg.value == "") return;
  if (chatMsg.value.length > 100) {
    modalAlertStore().alertMsg("메시지를 100자 이하로 적어주세요");
    return;
  } else if (chatCount.value > 2) {
    modalAlertStore().alertMsg(
      `도배 금지! ${chatCount.value - 2}초 후 메시지를 보낼 수 있습니다`
    );
  } else if (chatStore.data.category === "channel") {
    chatStore.sendMessage(chatStore.data.chat.id, chatMsg.value);
  } else if (chatStore.data.category === "dm") {
    const dmUser = chatStore.data.participants.find(
      (el) => el.id != self.data.id
    );
    if (dmUser && dmUser.status > 0)
      userListStore.socket.emit("dm", {
        nickname: chatStore.data.title,
        message: chatMsg.value,
      });
    else
      modalAlertStore().alertMsg(
        `${chatStore.data.title}님이 오프라인이므로 메시지 전송에 실패했습니다`
      );
  } else if (chatStore.data.category === "game") {
    gameRoomInfo.socket.emit("gameChat", {
      channel_id: gameRoomInfo.data.roomNum,
      message: chatMsg.value,
      sender: {
        id: self.data.id,
        nickname: self.data.nickname,
        avatarPath: self.data.avatarPath,
      },
      createdAt: new Date(),
    });
  }
  chatMsg.value = "";
  chatCount.value++;
  if (chatCount.value == 2 && startInterval.value) {
    interval = setInterval(() => {
      startInterval.value = false;
      if (chatCount.value <= 0) {
        clearInterval(interval);
        startInterval.value = true;
        return;
      }
      chatCount.value--;
      console.log("count: ", chatCount.value);
    }, 1000);
  }
}
</script>

<template>
  <div class="chat_input_box">
    <input
      v-model="chatMsg"
      type="text"
      placeholder="메시지 보내기"
      @keyup.enter="sendMessage"
      v-focus
    />
    <button class="send_btn" @click="sendMessage">
      <img src="@/assets/image/send.svg" alt="" />
    </button>
  </div>
</template>

<style scoped>
.chat_input_box {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: #2f3153;
  padding: 20px 22px 30px;
  display: flex;
  align-items: center;
}
.chat_input_box input {
  width: 190px;
  height: 24px;
  background: #3a3c5e;
  border-radius: 50px;
  text-align: left;
  padding: 2px 12px;
}
.chat_input_box button {
  width: 30px;
  height: 30px;
  margin-left: 5px;
  background: var(--game);
  border-radius: 50%;
  padding: 6px;
}

.send_btn img {
  height: auto;
}
</style>
