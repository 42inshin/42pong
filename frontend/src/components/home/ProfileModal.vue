<script setup lang="ts">
import { ref, watch } from "vue";
import { modalProfileStore, modalAlertStore } from "@/stores/modal";
import { useUserStore } from "@/stores/user";
import { UserListStore } from "@/stores/userList";
import {
  addFriend,
  setBlock,
  delRelation,
  getUserById,
} from "@/api/UserService";
import {
  giveMuted,
  kick,
  checkBan,
  addBan,
  deleteBan,
  changeAdmin,
  checkAdmin,
} from "@/api/ChannelService";
import type { User } from "@/interface/interface";
import { ChatStore } from "@/stores/chatting";
import { GameSocketStore } from "@/stores/gameSocket";
import { DmStore } from "@/stores/dm";

const chatStore = ChatStore();
const modal = modalProfileStore();
const alert = modalAlertStore();
const self = useUserStore();
const userList = UserListStore();
const dmStore = DmStore();

function closeProfileModal() {
  modal.onModal = false;
  modal.$reset();
  const activeLi: HTMLElement | null = document.querySelector(".active");
  activeLi?.classList.remove("active");
}

const isfriend = ref(false);
const isBlock = ref(false);
const isBan = ref(false);
const isAdmin = ref(false);
const requestMatching = ["대전신청", "관전하기"];

watch(
  () => modal.onModal,
  async () => {
    if (modal.onModal) {
      console.log("modal: ", modal.onModal);
      isfriend.value = isListByUserId(userList.friendList, modal.data.id);
      isBlock.value = isListByUserId(userList.blockList, modal.data.id);
      if (modal.onChat && modal.admin && modal.owner === self.data.id) {
        isAdmin.value = await checkAdmin(modal.channel_id, modal.data.id);
        isBan.value = await checkBan(modal.channel_id, modal.data.id);
      }
    }
  }
);

async function Battle() {
  console.log("Battle");
  const user = await getUserById(modal.data.id);
  if (user.status === 1) {
    GameSocketStore().socket.emit("throwGauntlet", modal.data.id);
  } else if (user.status === 2) {
    GameSocketStore().socket.emit("watchGame", modal.data.id);
  } else if (user.status === 0) {
    alert.alertMsg("상대가 로그인 상태가 아닙니다");
  }
  closeProfileModal();
}

function isListByUserId(list: User[], userId: string) {
  if (list.length === 0) return false;
  const findIndex = list.findIndex((element: User) => element.id === userId);
  if (findIndex === -1) return false;
  return true;
}

async function Friend() {
  try {
    const res = await addFriend(modal.data.id);
    isfriend.value = true;
  } catch (e) {
    console.log("닉네임 추가 실패", isfriend.value);
  }
  closeProfileModal();
}

async function UnFriend() {
  const res = await delRelation(modal.data.id);
  isfriend.value = false;
  console.log(`delFriend is ${res}`);
  closeProfileModal();
}

async function Block() {
  try {
    const res = await setBlock(modal.data.id);
    isBlock.value = true;
    console.log(`Block is ${res}`);
  } catch (e) {
    console.log("차단 실패");
  }
  closeProfileModal();
}

async function UnBlock() {
  await delRelation(modal.data.id);
  isBlock.value = false;
  closeProfileModal();
}

async function Kick(fromBan: boolean) {
  try {
    const res = await kick(modal.channel_id, modal.data.id);
    console.log(`kick is ${res}`);
    if (res) alert.alertMsg("강제 퇴장에 성공했습니다", "ok");
    else alert.alertMsg("강제 퇴장에 실패했습니다");
  } catch (e) {
    console.log("Kick 실패");
    if (!fromBan) alert.alertMsg("채널에 없는 유저입니다");
  }
  closeProfileModal();
}

async function Mute() {
  try {
    const res = await giveMuted(modal.data.id, modal.channel_id, true);
    console.log(res);
  } catch (e) {
    console.log("차단 실패");
    alert.alertMsg("채팅 금지에 실패했습니다");
  }
  closeProfileModal();
}

async function Ban() {
  try {
    const res = await addBan(modal.channel_id, modal.data.id);
    console.log(res);
    isBan.value = true;
    alert.alertMsg("영구 벤에 성공했습니다", "ok");
    Kick(true);
    const findUserIndex = chatStore.data.banList.findIndex(
      (el) => el.id === modal.data.id
    );
    if (findUserIndex === -1) chatStore.data.banList.push(modal.data);
  } catch (e) {
    console.log("벤 실패");
  }
  closeProfileModal();
}
async function UnBan() {
  try {
    const res = await deleteBan(modal.channel_id, modal.data.id);
    console.log(res);
    isBlock.value = false;
    const findUserIndex = chatStore.data.banList.findIndex(
      (el) => el.id === modal.data.id
    );
    if (findUserIndex !== -1) chatStore.data.banList.splice(findUserIndex, 1);
    alert.alertMsg("영구 벤을 취소했습니다", "ok");
  } catch (e) {
    console.log("벤 취소 실패");
  }
  closeProfileModal();
}

async function DM() {
  chatStore.data.category = "dm";
  chatStore.data.title = modal.data.nickname;
  chatStore.data.type = "public";
  await dmStore.createDm(modal.data.id);
  dmStore.findDm(modal.data.id);
  const dmUserList: User[] = userList.allList.filter((user) => {
    if (user.id === modal.data.id || user.id === self.data.id) return true;
  });
  chatStore.data.participants = dmUserList;
  chatStore.onChat = true;
  closeProfileModal();
}

async function toggleAdmin() {
  try {
    await changeAdmin(modal.data.id, String(modal.channel_id));
  } catch {
    console.log("change admin fail");
  }
  isAdmin.value = !isAdmin.value;
  closeProfileModal();
}
</script>

<template>
  <Transition name="modal">
    <div v-if="modal.onModal" class="modal-mask">
      <div @click="closeProfileModal()" class="profile_modal_bg"></div>
      <div class="profile_modal box">
        <div class="profile_box">
          <div class="profile">
            <p class="level fz12">lv. {{ modal.data.lating }}</p>
            <p class="nickname fz20">{{ modal.data.nickname }}</p>
            <div class="profile_contents">
              <div class="score_box">
                <div class="rank_score">
                  <p class="game_type fz12">
                    <span class="score_icon">🏆</span>랭크
                  </p>
                  <p class="score">
                    <span class="fz12">승 </span
                    ><span>{{ modal.data.ladder_win }} </span
                    ><span class="fz12"> 패 </span
                    ><span>{{ modal.data.ladder_lose }}</span>
                  </p>
                </div>
                <div class="normal_score">
                  <p class="game_type fz12">
                    <span class="score_icon">🏓</span>일반
                  </p>
                  <p class="score">
                    <span class="fz12">승 </span
                    ><span>{{ modal.data.win }} </span
                    ><span class="fz12"> 패 </span
                    ><span>{{ modal.data.lose }}</span>
                  </p>
                </div>
              </div>
              <div class="profile_img">
                <img :src="modal.data.avatarPath" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="profile_action_box"
          v-if="chatStore.data.category !== 'game'"
        >
          <ul>
            <li>
              <span @click="Battle">{{
                modal.data.status === 2
                  ? requestMatching[1]
                  : requestMatching[0]
              }}</span>
            </li>
            <li>
              <RouterLink
                @click="closeProfileModal"
                :to="{ name: 'info', query: { nickname: modal.data.nickname } }"
                >전적보기</RouterLink
              >
            </li>
            <li v-if="!isfriend"><span @click="Friend">친구추가</span></li>
            <li v-else><span @click="UnFriend">친구삭제</span></li>
            <li v-if="!isBlock"><span @click="Block">차단하기</span></li>
            <li v-else><span @click="UnBlock">차단해제</span></li>
            <div
              v-if="
                modal.onChat && modal.admin && modal.data.id !== modal.owner
              "
            >
              <li><span @click="Mute">채금(10초)</span></li>
              <li><span @click="Kick(false)">강제퇴장</span></li>
              <div v-if="self.data.id === modal.owner">
                <li v-if="!isBan"><span @click="Ban">영구 벤</span></li>
                <li v-else><span @click="UnBan">벤 취소</span></li>
                <li v-if="!isAdmin">
                  <span @click="toggleAdmin">매니저권한</span>
                </li>
                <li v-else>
                  <span @click="toggleAdmin">매니저해임</span>
                </li>
              </div>
            </div>
          </ul>
          <button @click="DM" class="fz12">
            Message
            <div class="send_img">
              <img src="@/assets/image/send.svg" alt="" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .profile_modal,
.modal-leave-to .profile_modal {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.modal-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  z-index: 999;
}

.profile_modal_bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: var(--modal-bg);
  transition: all 0.3s ease;
}
.profile_modal {
  z-index: 999;
  width: 300px;
  background: var(--notice);
  overflow: hidden;
  transition: all 0.3s ease;
}

.profile_box {
  padding: 30px 35px 10px;
}

.level {
  color: var(--gold);
  font-weight: 700;
}
.nickname {
  font-weight: 700;
  margin-top: 4px;
}
.ben {
  position: absolute;
  top: 30px;
  right: 35px;
  border-bottom: 1px solid var(--white);
  font-size: 14px;
}
.profile_contents {
  display: flex;
  justify-content: space-between;
}
.score_box {
  margin-top: 20px;
}
.game_type {
  color: #ddd;
}
.game_type .score_icon {
  margin-right: 4px;
}

.score {
  margin-top: 4px;
  margin-bottom: 10px;
  max-width: 130px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.profile_img {
  width: 100px;
  height: 100px;
  border: 2px solid var(--white);
  border-radius: 50%;
  overflow: hidden;
  background: var(--main);
}
.profile_action_box {
  position: relative;
  width: 100%;
  min-height: 140px;
  background: var(--main);
  padding: 30px 22px 30px 35px;
  overflow: hidden;
}
.profile_action_box ul {
  position: relative;
  width: 165px;
  height: 100%;
  font-size: 14px;
}
.profile_action_box ul li {
  position: relative;
  width: 50%;
  float: left;
  text-decoration: underline;
  margin-bottom: 8px;
  color: var(--white);
}
.profile_action_box li span,
.profile_action_box li a {
  cursor: pointer;
}

.profile_action_box li span:hover,
.profile_action_box li a:hover {
  color: #ddd;
}

.profile_action_box button {
  position: absolute;
  right: 22px;
  top: 30px;
  width: 80px;
  height: 80px;
  border-radius: 15px;
  background: var(--notice2);
}
.profile_action_box button .send_img {
  width: 36px;
  margin-top: 4px;
  margin-left: 13px;
}
</style>
