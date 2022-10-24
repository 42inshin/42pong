<script setup lang="ts">
import { modalRecvBattleStore, modalProfileStore } from "@/stores/modal";
import { GameSocketStore } from "@/stores/gameSocket";

const modalRecvBattle = modalRecvBattleStore();
const modalProfile = modalProfileStore();
const gameSocket = GameSocketStore();

async function acceptBtn() {
  modalRecvBattle.onModal = false;
  modalProfile.onModal = false;
  gameSocket.socket.emit("acceptBattle");
}
async function cancelBtn() {
  modalRecvBattle.onModal = false;
  modalProfile.onModal = false;
  gameSocket.socket.emit("rejectBattle");
}
</script>

<template>
  <div v-if="modalRecvBattle.onModal" class="modal_bg">
    <div class="modal box">
      <h2 class="modal_title">
        {{ modalRecvBattle.opponentNick + "님의 대전신청" }}
      </h2>
      <div class="btn_box">
        <button @click="acceptBtn" class="okay_btn confirm_btn" type="button">
          <p class="modal_text">수 락</p>
        </button>
        <button @click="cancelBtn" class="cancel_btn confirm_btn" type="button">
          <p class="modal_text">거 절</p>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal_bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--modal-bg);
}

.modal {
  min-width: 380px;
  z-index: 9;
  min-height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: var(--main-bg);
  padding: 20px;
  white-space: nowrap;
}

.modal_title {
  font-size: 36px;
  font-family: var(--font-game);
  word-wrap: break-word;
  width: 100%;
  text-align: center;
}
.btn_box {
  display: flex;
  justify-content: space-between;
}

.confirm_btn {
  margin-right: 14px;
  padding: 6px 20px;
  margin-top: 28px;
  border-radius: 10px;
  background: var(--notice);
}

.modal_text {
  font-size: 24px;
  font-family: var(--font-game);
  white-space: nowrap;
}

.cancel_btn {
  margin-left: 14px;
  background: var(--notice3);
}
</style>
