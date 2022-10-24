<script setup lang="ts">
import { getUserByNickname } from "@/api/UserService";
import GameResult from "@/components/info/GameResult.vue";
import InfoProfile from "@/components/info/InfoProfile.vue";
import InfoScoreBar from "@/components/info/InfoScoreBar.vue";
import Profile from "@/components/home/LeftSidebarProfile.vue";
import { onBeforeMount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { getSelf } from "@/api/UserService";
import type { User } from "@/interface/interface";

const self = useUserStore();
const currentRoute = useRoute();
const user = ref<User>();

watch(currentRoute, async () => {
  if (currentRoute.query.nickname) {
    user.value = await getUserByNickname(String(currentRoute.query.nickname));
  }
});

onBeforeMount(async () => {
  self.data = await getSelf();
  if (currentRoute.query.nickname) {
    user.value = await getUserByNickname(String(currentRoute.query.nickname));
  }
});
</script>

<template>
  <div>
    <div v-if="!currentRoute.query.nickname">
      <InfoProfile />
      <InfoScoreBar :user="self.data" />
      <GameResult :nickname="self.data.nickname" />
    </div>
    <div v-else-if="user && user.nickname !== ''">
      <Profile :user="user" />
      <InfoScoreBar :user="user" />
      <GameResult :nickname="user.nickname" />
    </div>
    <div v-else>잠시만 기다려주세요</div>
  </div>
</template>

<style scoped></style>
