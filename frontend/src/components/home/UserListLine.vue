<script setup lang="ts">
import { useUserStore } from "@/stores/user";
const self = useUserStore();

const props = defineProps({
  user: {
    type: Object,
    default: () => {
      return {
        nickname: "",
        avatarPath: "",
        id: "",
      };
    },
  },
});

function isOffline() {
  if (props.user.status === 0) {
    return true;
  }
  return false;
}

function isPlay() {
  if (props.user.status === 2) {
    return true;
  }
  return false;
}
</script>

<template>
  <li class="online" :class="{ offline: isOffline(), play: isPlay() }">
    <div>
      <div class="profile_img">
        <img :src="props.user.avatarPath" alt="profile" />
      </div>
      <p class="nickname">
        {{ props.user.nickname }}
        <span
          v-if="props.user.nickname === self.data.nickname"
          style="color: var(--offline)"
        >
          나</span
        >
      </p>
    </div>
  </li>
</template>

<style scoped>
.user_list li {
  height: 36px;
  border-radius: 50px;
}

.user_list li:hover {
  background: rgba(255, 255, 255, 0.05);
}

.user_list li.active {
  background: var(--notice);
}

.user_list li.block .nickname {
  color: var(--notice3);
}
.user_list li.ban .nickname {
  color: var(--offline);
}

.user_list li > div {
  padding: 3px 5px;
  display: flex;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
}

.profile_img {
  display: inline-block;
  position: relative;
  width: 30px;
  height: 30px;
  border: 1px solid var(--white);
  border-radius: 50%;
  overflow: hidden;
  background: var(--main);
}

.nickname {
  margin-left: 12px;
  position: relative;
  display: inline-block;
}

.nickname::before {
  content: "";
  position: absolute;
  left: -22px;
  top: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--active);
}

.nickname::after {
  content: "";
  position: absolute;
  left: -20px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.user_list li.online .nickname::after {
  background: var(--online);
}

.user_list li.play .nickname::after {
  background: var(--play);
}

.user_list li.offline {
  opacity: 0.5;
}

.user_list li.offline .nickname::after {
  background: var(--offline);
}
</style>
