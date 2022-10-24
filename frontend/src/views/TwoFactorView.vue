<script setup lang="ts">
import router from "../router";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { ref } from "vue";
import { useCookies } from "vue3-cookies";

const qrCodeText = ref();
const { cookies } = useCookies();
const store = useUserStore();

async function twoFactorAuthentication() {
  axios
    .post(
      "/api/auth/two",
      { code: qrCodeText.value },
      {
        headers: {
          Authorization: `Bearer ` + cookies.get("jwt"),
        },
      }
    )
    .then((res) => {
      axios
        .get("/api/users", {
          headers: {
            Authorization: `Bearer ` + cookies.get("jwt"),
          },
        })
        .then((res) => {
          console.log("Auth OK - AuthView");
          const store = useUserStore();
          store.data = res.data;
          store.login = true;
          if (res.data.nickname == "") router.push("/signup");
          else router.push("/");
        })
        .catch((error) => {
          const data = error.response.data;
          if (data.statusCode == 401) {
            router.push("/twoFactor");
          } else {
            store.$reset();
            console.log("/api/users error");
          }
        });
      router.push("/");
    })
    .catch((error) => {
      console.log(error);
      console.log(`api /auth/two error`);
    });
}
</script>

<template>
  <div class="wrapper">
    <h2>2단계 인증</h2>
    <p>Google OTP의 고유 코드를 입력하세요.</p>
    <div class="qr_send">
      <input
        type="text"
        v-model="qrCodeText"
        placeholder="ex) 123456"
        @keyup.enter="twoFactorAuthentication"
        v-focus
      />
      <input type="button" value="확인" @click="twoFactorAuthentication" />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  margin-left: 15px;
  min-width: 170px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 30px;
}

h2 {
  font-size: 24px;
  margin-bottom: 15px;
  font-family: "Do Hyeon";
}

p {
  font-size: 14px;
  margin-bottom: 20px;
}

.qr_send {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.qr_send input:first-child {
  width: 128px;
  background: var(--main-bg);
  border-radius: 5px;
  font-size: 14px;
  padding: 5px 10px;
}
.qr_send input:last-child {
  background: var(--notice);
  font-size: 14px;
  border-radius: 5px;
  margin-left: 10px;
  padding: 5px 8px;
  cursor: pointer;
}
</style>
