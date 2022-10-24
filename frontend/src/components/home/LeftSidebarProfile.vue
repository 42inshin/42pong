<script setup lang="ts">
const props = defineProps({
  user: {
    type: Object,
    default: () => {
      return {
        avatarPath: "",
        id: "",
        ladder_lose: 0,
        ladder_win: 0,
        lating: 0,
        lose: 0,
        nickname: "",
        status: 0,
        win: 0,
      };
    },
  },
});
</script>

<template>
  <div class="profile_box box">
    <div class="profile">
      <p class="level fz12">lv. {{ props.user.lating }}</p>
      <p class="nickname fz20">{{ props.user.nickname }}</p>
      <div class="profile_contents">
        <div class="score_box">
          <div class="rank_score">
            <p class="game_type fz12"><span class="score_icon">🏆</span>랭크</p>
            <p class="score">
              <span
                ><span class="fz12">승</span> {{ props.user.ladder_win }}</span
              >
              <span
                ><span class="fz12"> 패</span>
                {{ props.user.ladder_lose }}</span
              >
            </p>
          </div>
          <div class="normal_score">
            <p class="game_type fz12"><span class="score_icon">🏓</span>일반</p>
            <p class="score">
              <span><span class="fz12">승</span> {{ props.user.win }}</span>
              <span><span class="fz12"> 패</span> {{ props.user.lose }}</span>
            </p>
          </div>
        </div>
        <div class="profile_img">
          <img :src="props.user.avatarPath" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile_box {
  position: relative;
  width: 100%;
  height: 200px;
  padding: 30px 42px;
  background: var(--main);
}
.profile .level {
  color: var(--gold);
  font-weight: 700;
}
.profile .nickname {
  font-weight: 700;
  margin-top: 4px;
}
.profile .profile_contents {
  display: flex;
  justify-content: space-between;
}
.profile .score_box {
  margin-top: 20px;
}
.profile .game_type {
  color: #ddd;
}
.profile .game_type .score_icon {
  margin-right: 4px;
}
.profile .score {
  margin-top: 4px;
  margin-bottom: 10px;
  max-width: 130px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.profile .profile_img {
  width: 100px;
  height: 100px;
  border: 2px solid var(--white);
  border-radius: 50%;
  overflow: hidden;
  background: var(--main);
}
</style>
