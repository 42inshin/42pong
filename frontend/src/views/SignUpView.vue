<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useCookies } from "vue3-cookies";
import LogoName from "@/components/login/LogoName.vue";
import { modalAlertStore } from "@/stores/modal";
import AlertModal from "@/components/home/AlertModal.vue";
import { getSelf } from "@/api/UserService";
const message = ref("");
const checkMsg = ref("공백, 특수문자 사용불가");
const nickError = ref(false);
const { cookies } = useCookies();

onMounted(async () => {
  const self = await getSelf();
  useUserStore().data = self;
  if (cookies.get("jwt") && useUserStore().data.nickname.length > 0) {
    router.push("/login");
  }
});

async function checkValid() {
  if (nickError.value) return;
  await axios
    .post(
      "/api/users/nickname",
      { nickname: message.value },
      {
        headers: {
          Authorization: `Bearer ` + cookies.get("jwt"),
        },
      }
    )
    .then((res) => {
      console.log(res);
      useUserStore().data.nickname = message.value;
      router.push("/");
    })
    .catch((error) => {
      console.log(error);
      nickError.value = false;
      checkMsg.value = "공백, 특수문자 사용불가";
      modalAlertStore().alertMsg("사용할 수 없는 닉네임입니다");
      message.value = "";
    });
}

function inputValid() {
  const nicknameRegExp = /^[a-z|A-Z|가-힣|0-9|]+$/;
  const lengthRegExp = /^.{0,10}$/;
  if (message.value === "") {
    nickError.value = false;
    checkMsg.value = "공백, 특수문자 사용불가";
  } else if (!nicknameRegExp.test(message.value)) {
    nickError.value = true;
    checkMsg.value = "사용할 수 없는 문자입니다.";
  } else if (!lengthRegExp.test(message.value)) {
    nickError.value = true;
    checkMsg.value = "글자 길이 10이하 입니다.";
  } else {
    nickError.value = false;
    checkMsg.value = "공백, 특수문자 사용불가";
  }
}
</script>

<template>
  <AlertModal />
  <div class="wrapper login_component">
    <LogoName />
    <div class="profile">
      <img :src="useUserStore().data.avatarPath" alt="LOGO" />
    </div>
    <div class="name_input">
      <input
        v-model="message"
        @keyup="inputValid"
        type="text"
        placeholder="NICKNAME"
        @keyup.enter="checkValid"
      />
      <p class="alert" :class="{ re: nickError }">
        {{ checkMsg }}
      </p>
    </div>
    <button
      class="login-btn"
      v-bind:disabled="message.length < 1 || nickError"
      @click="checkValid"
    >
      확인
    </button>
  </div>
</template>

<style scoped>
.logo {
  padding: 12px 0;
}
.login_component {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 320px;
  height: 480px;
  padding: 60px;
}

.login-btn {
  width: 172px;
  height: 60px;
  font-size: 24px;
  border-radius: 30px;
  background: var(--btn-red);
}
.login-btn:disabled {
  background: var(--offline);
}

.name_input {
  margin: 15px 0;
  width: 160px;
}
.name_input input {
  width: 100%;
  height: 30px;
  background: none;
  border-bottom: 2px solid var(--white);
}

.alert {
  width: 100%;
  height: 30px;
  font-size: 13px;
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
  color: var(--offline);
}

.alert.re {
  color: var(--yellow);
}

.profile {
  border-radius: 50%;
  border: 2px solid var(--white);
}
</style>
