<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import loginName from "@/components/login/LogoName.vue";
import { login } from "@/api/UserService";

const currentRoute = useRoute();
const store = useUserStore();

onMounted(async () => {
  try {
    const response = await login(String(currentRoute.query.code));
    if (response.data) {
      store.data = response.data;
      store.data.avatarPath = response.data.avatarPath;
      store.login = true;
      if (response.data.nickname == "") {
        router.push("/signup");
      } else if (response.data.isTwoFactorAuthenticationEnabled) {
        router.push("/twoFactor");
      } else router.push("/");
    }
  } catch {
    router.push("/login");
  }
});
</script>

<template>
  <div class="wrap">
    <div class="scene">
      <div class="bounce">
        <div class="ball"></div>
      </div>
      <div class="shadow"></div>
    </div>
    <div class="bg">
      <loginName />
    </div>
  </div>
</template>

<style scoped>
.wrap {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
  perspective: 300px;
  overflow: hidden;
}

@keyframes bounce {
  0% {
    transform: translate3d(0, 0, 0) scale3d(0.9, 1.05, 1);
  }
  100% {
    transform: translate3d(0, 5vh, 0) scale3d(1.1, 0.95, 1);
  }
}

@keyframes shadow {
  0% {
    transform: scale3d(0.6, 0.6, 1);
    background-color: rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: scale3d(1, 1, 1);
    background-color: rgba(0, 0, 0, 0.3);
  }
}
.scene {
  position: relative;
  height: 10vh;
}

.bounce,
.ball,
.shadow {
  display: block;
  width: 5vh;
  height: 5vh;
}

.bounce {
  position: relative;
  animation: bounce 0.5s ease-in infinite alternate;
}

.ball {
  border-radius: 50%;
  background-color: gold;
  overflow: hidden;
  box-sizing: border-box;
}
.ball::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 5vh;
  height: 5vh;
  width: 100%;
  border-bottom: 1vh solid rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  border-radius: 50%;
}

.shadow {
  height: 1vh;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: -1;
  border-radius: 50%;
  animation: shadow 0.5s ease-in-out infinite alternate;
}

.bg {
  position: absolute;
  margin-top: 10vh;
  background-color: #1d9e9f;
  width: 100%;
  max-width: 1200px;
  height: 50%;
  min-height: 500px;
  border: 10px solid #fff;
  transform: rotateX(40deg);
  z-index: -9;
}

.logo {
  padding: 30px 30px;
}
</style>
