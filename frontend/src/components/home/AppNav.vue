<script setup lang="ts">
import router from "@/router";
import { useCookies } from "vue3-cookies";
import { GameSocketStore } from "@/stores/gameSocket";

const { cookies } = useCookies();

function logOut() {
  GameSocketStore().disConnected();
  cookies.remove("jwt");
  router.push("/login");
}
</script>

<template>
  <header>
    <ul class="nav">
      <li>
        <RouterLink to="/">
          <div><img src="@/assets/image/game.svg" alt="game" />game</div>
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/info">
          <div>
            <img src="@/assets/image/user_icon.svg" alt="user infomation" />info
          </div>
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/rank">
          <div><img src="@/assets/image/rank.svg" alt="ranking" />rank</div>
        </RouterLink>
      </li>
      <li>
        <div @click="logOut">
          <div><img src="@/assets/image/logout.svg" alt="logout" />logout</div>
        </div>
      </li>
    </ul>
  </header>
</template>

<style scoped>
.nav {
  z-index: 5;
  width: 240px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 30px;
  right: 32px;
}
.nav li {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
}
.nav li a {
  display: inline-block;
  width: 46px;
  height: 46px;
}
.nav li:nth-child(1) {
  background: var(--game);
}
.nav li:nth-child(1) a div {
  width: 42px;
  margin: 0 auto;
  margin-top: -3px;
  color: var(--game);
}

.nav li:nth-child(2) {
  background: var(--notice);
}
.nav li:nth-child(2) a div {
  width: 34px;
  margin: 0 auto;
  margin-top: 7px;
  color: var(--notice);
}

.nav li:nth-child(3) {
  background: var(--notice2);
}
.nav li:nth-child(3) a div {
  width: 44px;
  margin: 0 auto;
  color: var(--notice2);
}

.nav li:nth-child(4) {
  background: var(--notice3);
}
.nav li:nth-child(4) > div > div {
  width: 32px;
  margin: 0 auto;
  margin-top: 7px;
  color: var(--notice3);
  cursor: pointer;
}
</style>
