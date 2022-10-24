<script setup lang="ts">
const props = defineProps({
  user: Object,
  ready: Boolean,
});
</script>

<template>
  <div class="profile_box box" :class="{ on: ready }">
    <div class="profile">
      <div class="profile_img">
        <img :src="user?.data.avatarPath" alt="" />
      </div>
      <div class="user_name">
        <p class="level fz12">lv. {{ user?.data.lating }}</p>
        <p class="nickname fz20">{{ user?.data.nickname }}</p>
      </div>
      <div class="profile_contents">
        <div class="score_box">
          <div class="rank_score">
            <p class="game_type fz12">랭크</p>
            <p class="score">
              <span class="score_icon">🏆</span>
              <span
                ><span class="fz12">승</span> {{ user?.data.ladder_win }}</span
              >
              <span
                ><span class="lose fz12">패</span>
                {{ user?.data.ladder_lose }}</span
              >
            </p>
          </div>
          <div class="normal_score">
            <p class="game_type fz12">일반</p>
            <p class="score">
              <span class="score_icon">🏓</span>
              <span><span class="fz12">승</span> {{ user?.data.win }}</span>
              <span
                ><span class="lose fz12">패</span> {{ user?.data.lose }}</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile_box {
  position: relative;
  width: 248px;
  height: 351px;
  padding: 30px 42px;
  background: var(--active);
}
.on {
  box-shadow: 0 0 0 5px #6434ff;
  border-radius: 30px;
}
.profile {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.user_name {
  margin-top: 16px;
  width: 130px;
}
.profile .level {
  color: var(--gold);
  font-weight: 700;
  font-size: 12px;
  width: 45px;
  height: 16px;
}
.profile .nickname {
  font-weight: 700;
  font-size: 20px;
  margin-top: 1px;
  width: 61px;
  height: 28px;
}
.profile .profile_contents {
  width: 130px;
}
.profile .score_box {
  margin-top: 10px;
}
.profile .game_type {
  color: #ddd;
}
.profile .game_type {
  margin-right: 4px;
}
.score_icon {
  display: inline-block;
  width: 26px;
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
  width: 140px;
  height: 140px;
  box-shadow: 0 0 0 2px #fff;
  border-radius: 50%;
  overflow: hidden;
  background: var(--main);
}
.lose {
  margin-left: 7px;
}
</style>
