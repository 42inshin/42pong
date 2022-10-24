<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { ChatStore } from "@/stores/chatting";
import ChatList from "./ChatList.vue";
const chatStore = ChatStore();

const chatUl = ref<HTMLElement | null>(null);
const onDownBtn = ref(false);
const downBtnClass = ref(false);

onMounted(() => {
  if (chatUl.value) {
    chatUl.value.scrollTop = chatUl.value.scrollHeight;
  }
});

function autoScroll() {
  if (chatUl.value) {
    chatUl.value.scrollTo({
      top: chatUl.value.scrollHeight,
      behavior: "smooth",
    });
  }
}

watch(
  () => chatStore.data?.messages.length,
  () => {
    if (!onDownBtn.value) setTimeout(autoScroll, 100);
    else downBtnClass.value = true;
  }
);

function downBtnHandler() {
  const nowScrollTop = chatUl.value?.scrollTop;
  const nowScrollHeight = chatUl.value?.scrollHeight;
  const nowClientHeight = chatUl.value?.clientHeight;
  if (nowScrollTop && nowScrollHeight && nowClientHeight) {
    if (nowScrollHeight < nowScrollTop + nowClientHeight + 120) {
      onDownBtn.value = false;
      downBtnClass.value = false;
    } else {
      onDownBtn.value = true;
    }
  }
}
</script>

<template>
  <div>
    <ul ref="chatUl" class="chat_box no-scrollbar" @scroll="downBtnHandler">
      <ChatList />
    </ul>
    <div
      v-show="onDownBtn"
      :class="{ new_msg: downBtnClass }"
      @click="autoScroll"
      class="down_btn box"
    >
      <span></span>
    </div>
  </div>
</template>

<style scoped>
.chat_box {
  position: absolute;
  bottom: 80px;
  left: 0;
  max-height: 600px;
  width: 100%;
  overflow-x: hidden;
}

.down_btn {
  position: absolute;
  left: 50%;
  bottom: 90px;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--active);
  overflow: hidden;
  cursor: pointer;
  opacity: 0.8;
}

.down_btn > span {
  display: inline-block;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -70%) rotate(45deg);
  border-right: 2px solid var(--offline);
  border-bottom: 2px solid var(--offline);
}
.new_msg {
  background-color: var(--notice2);
  opacity: 1;
}
.new_msg > span {
  border-right: 2px solid var(--white);
  border-bottom: 2px solid var(--white);
}
</style>
