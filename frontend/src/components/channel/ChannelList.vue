<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import ChannelChat from "@/components/channel/ChannelChat.vue";
import {
  joinChannel,
  getChannelUser,
  getBannedList,
} from "@/api/ChannelService";
import CommonBtn from "@/components/channel/components/CommonBtn.vue";
import PassModal from "./ChannelListPassModal.vue";
import EditModal from "./ChannelListEditModal.vue";
import MakeChannelModal from "./ChannelListMakeModal.vue";
import {
  modalMakeStore,
  modalPassStore,
  modalEditStore,
  modalAlertStore,
} from "@/stores/modal";
import { useUserStore } from "@/stores/user";
import { UserListStore } from "@/stores/userList";
import { ChatStore } from "@/stores/chatting";
import { DmStore } from "@/stores/dm";
import type { User, Channel, ModalStore } from "@/interface/interface";

const self = useUserStore();
const userList = UserListStore();
const chatStore = ChatStore();
const makeModal = modalMakeStore();
const passModal = modalPassStore();
const editModal = modalEditStore();
const alertModal = modalAlertStore();
const dmStore = DmStore();

function scrollDown(this: HTMLElement) {
  const scrollTarget = document.getElementById("scroll_target");
  if (scrollTarget)
    scrollTarget.scrollTo({
      top: scrollTarget.scrollHeight,
      behavior: "smooth",
    });
}

onMounted(async () => {
  await dmStore.makeDms();
  const scrollTarget = document.getElementById("scroll_target");
  const scrollBtn = document.getElementById("scroll_btn");
  if (scrollTarget) chatStore.onScroll();
  if (scrollBtn) scrollBtn.addEventListener("click", scrollDown);
});

onBeforeUnmount(async () => {
  chatStore.disConnected();
});

function editChannel(channel: Channel, index: number) {
  inputModalStore(editModal, channel, index);
  editModal.onModal = true;
}

function inputModalStore(modal: ModalStore, channel: Channel, index: number) {
  modal.data.id = channel.id;
  modal.data.title = channel.name;
  modal.data.index = index;
  modal.data.type = channel.type;
}

async function join(channel: Channel, index: number) {
  console.log("join");
  const tf = await joinChannel(channel.id, "");
  if (tf === "ban") {
    alertModal.alertMsg("해당 채널에 들어갈 수 없습니다");
  } else if (tf === true) {
    const findIndex = chatStore.myChannels.findIndex(
      (element: number) => element === channel.id
    );
    if (findIndex === -1) {
      chatStore.myChannels.push(channel.id);
    }
    chatStore.data.chat = channel;
    chatStore.data.category = "channel";
    chatStore.data.title = channel.name;
    chatStore.data.type = channel.type;
    chatStore.data.messages = channel.messages;
    chatStore.channels[index].participants = await getChannelUser(channel.id);
    chatStore.data.participants = chatStore.channels[index].participants;
    chatStore.data.owner = channel.owner.id;
    if (self.data.id === channel.owner.id)
      chatStore.data.banList = await getBannedList(channel.id.toString());
    console.log("ban: ", chatStore.data.banList);
    chatStore.data.chat.newMsgCount = 0;
    chatStore.onChat = true;
  } else {
    inputModalStore(passModal, channel, index);
    passModal.onModal = true;
  }
}

async function clickDm(dmIndex: number) {
  chatStore.data.category = "dm";
  const dmData = DmStore().dms[dmIndex];
  chatStore.data.title = dmData.title;
  const dmUserList: User[] = userList.allList.filter((user) => {
    if (user.id === dmData.id || user.id === self.data.id) return true;
  });
  chatStore.data.participants = dmUserList;
  chatStore.data.chat = dmData;
  chatStore.data.messages = dmData.messages;
  chatStore.data.chat.newMsgCount = 0;
  chatStore.onChat = true;
}

const allToggle = ref(true);

function clickTitle() {
  allToggle.value = !allToggle.value;
}

function checkJoinChannel(channel_id: number) {
  const findIndex = chatStore.myChannels.findIndex((id) => {
    return id === channel_id;
  });
  if (findIndex !== -1) return true;
  return false;
}
</script>

<template>
  <div class="right_sidebar">
    <div class="channel_nav">
      <div class="title">Message</div>
      <CommonBtn @click="makeModal.onModal = true" class="option_btn plus" />
    </div>
    <ul class="channel_list no-scrollbar" id="scroll_target">
      <div v-if="allToggle" @click="clickTitle" class="category click">
        <span class="ch_type">▾</span> All Channels
      </div>
      <div v-else @click="clickTitle" class="category click">
        <span class="ch_type">▸</span> Joined Channels
      </div>
      <li
        v-for="(channel, index) in chatStore.channels"
        :key="index"
        v-show="allToggle || checkJoinChannel(channel.id)"
      >
        <div class="channel_li">
          <div
            class="channel_title text_nowrap"
            :class="{ new_msg: channel.newMsgCount > 0 }"
            @click="join(channel, index)"
          >
            <span class="ch_type" v-if="channel.type == 'private'">🔒</span>
            <span class="ch_type" v-else>＃</span>
            {{ channel.name }}
            <span class="msg_count" v-show="channel.newMsgCount">
              {{ channel.newMsgCount }}
            </span>
          </div>
          <button
            v-if="
              chatStore.ownerChannels &&
              chatStore.ownerChannels.indexOf(channel.id) !== -1
            "
            class="more_btn"
            @click="editChannel(channel, index)"
          >
            <img src="@/assets/image/more.svg" alt="more" />
          </button>
        </div>
      </li>
      <ChannelChat v-if="chatStore.onChat" />
      <div v-if="dmStore.dms.length > 0" class="category">Direct Message</div>
      <li v-for="(dm, index) in dmStore.dms" :key="index">
        <div class="channel_li">
          <div
            class="channel_title text_nowrap"
            :class="{ new_msg: dm.newMsgCount > 0 }"
            @click="clickDm(index)"
          >
            👤 {{ dm.title }}
            <span class="msg_count" v-show="dm.newMsgCount">{{
              dm.newMsgCount
            }}</span>
          </div>
        </div>
      </li>
    </ul>
    <div v-show="chatStore.isScroll" id="scroll_btn" class="scroll_btn">▾</div>
  </div>
  <MakeChannelModal v-if="makeModal.onModal" />
  <PassModal v-if="passModal.onModal" />
  <EditModal v-if="editModal.onModal" />
</template>

<style scoped>
.right_sidebar {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 293px;
  height: 730px;
  background: var(--main-bg);
  border-radius: 30px 0 0 30px;
  box-shadow: -10px 10px 30px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.channel_nav {
  position: relative;
  height: 50px;
  padding: 20px 20px 12px;
  display: flex;
  align-items: center;
}

.channel_nav .title {
  text-indent: 18px;
  font-size: 18px;
  line-height: 30px;
}

.channel_list {
  padding: 10px 20px;
  height: 637px;
  overflow-x: hidden;
}

.channel_list .category {
  color: var(--white);
  font-size: 14px;
  padding: 10px 16px 8px;
  font-weight: 700;
  cursor: pointer;
}

.channel_list li .channel_li {
  display: block;
  height: 32px;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
}

.channel_list li .channel_li:hover {
  background: var(--main);
}

.channel_list li .channel_title {
  padding: 6px 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  height: 32px;
  color: var(--offline);
}

.channel_list .channel_title.new_msg {
  color: var(--white) !important;
}

.ch_type {
  margin-right: 5px;
}

.channel_list li .channel_title .msg_count {
  display: inline-block;
  padding: 3px 6px;
  min-width: 20px;
  text-align: center;
  font-size: 12px;
  background: var(--notice3);
  border-radius: 10px;
}

.channel_list .more_btn {
  background: none;
  opacity: 0;
  width: 35px;
  height: 30px;
  margin: 2px;
}

.channel_list .channel_li:hover .more_btn {
  opacity: 1;
  z-index: 1;
  border-radius: 15px;
}

.channel_list .more_btn:hover {
  background: var(--main-bg);
}

.scroll_btn {
  text-align: center;
  padding: 10px 0 20px;
  cursor: pointer;
}
.scroll_btn:hover {
  opacity: 0.8;
  background: var(--active);
}
</style>
