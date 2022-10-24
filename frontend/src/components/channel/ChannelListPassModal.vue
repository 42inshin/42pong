<script setup lang="ts">
import { ref } from "vue";
import { modalPassStore, modalAlertStore } from "@/stores/modal";
import { joinChannel } from "@/api/ChannelService";
import { ChatStore } from "@/stores/chatting";

const alertModal = modalAlertStore();
const passModal = modalPassStore();
const chatStore = ChatStore();

const errorMsg = ref(false);

function alertMsg() {
  errorMsg.value = true;
  setTimeout(() => {
    errorMsg.value = false;
  }, 1000);
}

async function passModalOkayBtn() {
  console.log(passModal.data.password);
  const isOk = await joinChannel(passModal.data.id, passModal.data.password);
  if (isOk === "ban") {
    passModal.onModal = false;
    alertModal.alertMsg("해당 채널에 들어갈 수 없습니다");
    passModal.$reset();
  } else if (isOk === true) {
    chatStore.myChannels.push(passModal.data.id);
    passModal.onModal = false;
    chatStore.onChat = true;
    chatStore.data.chat = chatStore.channels[passModal.data.index];
    chatStore.data.category = "channel";
    chatStore.data.title = passModal.data.title;
    chatStore.data.type = passModal.data.type;
    chatStore.data.messages = chatStore.data.chat.messages;
    chatStore.data.participants = chatStore.data.chat.participants;
    chatStore.data.chat.newMsgCount = 0;
    passModal.$reset();
  } else {
    passModal.data.password = "";
    alertMsg();
  }
}

function passModalCancelBtn() {
  passModal.onModal = false;
  errorMsg.value = false;
  passModal.$reset();
}
</script>

<template>
  <div class="modal_box">
    <div class="modal box">
      <h2 class="modal_title">🔒 {{ passModal.data.title }}</h2>
      <p class="modal_error" :class="{ on: errorMsg }">
        비밀번호가 맞지 않습니다
      </p>
      <div class="input_box password">
        <label for="passmodal_password" class="focus"> 비밀 번호 </label>
        <input
          @keyup.enter="passModalOkayBtn"
          @keydown.esc="passModalCancelBtn"
          v-model="passModal.data.password"
          type="password"
          id="passmodal_password"
          class="focus"
          v-focus
        />
      </div>
      <div class="confirm_btn">
        <button @click="passModalOkayBtn" class="okay_btn" type="button">
          확 인
        </button>
        <button @click="passModalCancelBtn" class="cancel_btn" type="button">
          취 소
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal_box {
  position: absolute;
  left: 0;
  right: 0;
  background: var(--modal-bg);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: var(--modal);
  max-width: 544px;
  padding: 40px 45px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.modal_title {
  font-size: 36px;
  font-family: "Do Hyeon";
  margin-bottom: 20px;
  word-wrap: break-word;
  width: 100%;
  text-align: center;
}

.modal_error {
  color: var(--yellow);
  opacity: 0;
}

.modal_error.on {
  opacity: 1;
}

.input_box {
  margin-bottom: 10px;
}

.input_box label {
  display: block;
  font-size: 14px;
  text-indent: 10px;
  margin-bottom: 5px;
}
.input_box input {
  height: 40px;
  background: var(--active);
  border-radius: 20px;
  width: 450px;
}

.password label {
  color: #666;
}
.password input {
  background: #2b2b46;
}
.password label.focus {
  color: var(--white);
}
.password input.focus {
  background: var(--active);
}
.confirm_btn {
  width: 334px;
  display: flex;
  justify-content: space-between;
  margin-top: 23px;
}
.confirm_btn button {
  width: 160px;
  height: 50px;
  border-radius: 15px;
  background: var(--active);
  font-size: 20px;
  font-weight: 700;
}
.confirm_btn button.okay_btn {
  background: var(--notice);
}
</style>
