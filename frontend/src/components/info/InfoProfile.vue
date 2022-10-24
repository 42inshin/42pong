<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { nextTick, onBeforeMount, ref, watch } from "vue";
import { useCookies } from "vue3-cookies";
import QrcodeVue from "qrcode.vue";
import {
  updateNickname,
  changeDefaultAvatar,
  updateAvatar,
} from "@/api/UserService";
import { modalAlertStore } from "@/stores/modal";

const alertModal = modalAlertStore();
const store = useUserStore();
const selectFile = ref();
const nickname = ref();
const showQrcode = ref(false);
const qrValue = ref();
const qrCodeText = ref("");
const { cookies } = useCookies();
const onClickName = ref(false);
const defaultAvatarNum = ref(0);

onBeforeMount(async () => {
  if (store.data.isTwoFactorAuthenticationEnabled) {
    nickname.value = store.data.nickname;
  }
});

function inputValid() {
  const nicknameRegExp = /^[a-z|A-Z|가-힣|0-9|]+$/;
  const lengthRegExp = /^.{0,10}$/;
  if (!nicknameRegExp.test(nickname.value)) {
    alertModal.alertMsg("사용할 수 없는 문자입니다");
    return false;
  } else if (!lengthRegExp.test(nickname.value)) {
    alertModal.alertMsg("글자 길이 10이하 입니다");
    return false;
  }
  return true;
}

async function updateUserData() {
  if (nickname.value === store.data.nickname) {
    onClickName.value = false;
    return;
  }
  if (!inputValid()) {
    onClickName.value = false;
    return;
  }
  const tf = await updateNickname(nickname.value);
  if (tf) {
    console.log("send updateUserData Succcess");
    store.data.nickname = nickname.value;
  } else {
    console.log("update nickname fail");
    alertModal.alertMsg("유효하지 않은 닉네임입니다");
  }
  onClickName.value = false;
}

async function updateAvatarImg() {
  if (selectFile.value.files[0]) {
    // Form 필드 생성
    const form = new FormData();
    form.append("file", selectFile.value.files[0]); // api file name
    await updateAvatar(form);
    (document.getElementById("fileUpload") as HTMLFormElement).value = null;
  } else {
    alert("파일을 선택해 주세요.");
  }
}

async function twoFAClick() {
  console.log(`twoFactorValue = ${showQrcode.value}`);
  if (!showQrcode.value) {
    axios
      .get("/api/users/generate", {
        headers: {
          Authorization: `Bearer ` + cookies.get("jwt"),
        },
      })
      .then((res) => {
        qrValue.value = res.data;
        showQrcode.value = true;
      })
      .catch((error) => {
        console.log(error);
        console.log(`api /users/generate error`);
      });
  } else {
    showQrcode.value = false;
  }
}

function twoFactorCancel() {
  showQrcode.value = false;
  axios.post(
    "/api/users/turn-off",
    { code: qrCodeText.value },
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  store.data.isTwoFactorAuthenticationEnabled = false;
  alertModal.alertMsg("2차 인증을 취소하였습니다");
}

async function twoFactorAuthentication() {
  console.log(`two authen`);
  console.log(localStorage.getItem("accesstoken"));
  if (qrCodeText.value === "") {
    alertModal.alertMsg("2차 인증번호를 입력해주세요");
    return;
  }
  axios
    .post(
      "/api/users/turn-on",
      { code: qrCodeText.value },
      {
        headers: {
          Authorization: `Bearer ` + cookies.get("jwt"),
        },
      }
    )
    .then(() => {
      store.data.isTwoFactorAuthenticationEnabled = true;
      showQrcode.value = false;
      alertModal.alertMsg("2차 인증 설정 완료", "ok");
    })
    .catch(() => {
      alertModal.alertMsg("2차 인증번호가 올바르지 않습니다");
      console.log(`api /users/turn-on error`);
    });
  qrCodeText.value = "";
}

const focusMe = ref();
async function clickNickname() {
  nickname.value = store.data.nickname;
  onClickName.value = true;
  await nextTick(() => focusMe.value.focus());
}

async function changeDefault() {
  store.data.avatarPath = await changeDefaultAvatar(defaultAvatarNum.value);
  defaultAvatarNum.value++;
  if (defaultAvatarNum.value > 3) {
    defaultAvatarNum.value = 0;
  }
}

function calcPercent(win: number, lose: number): number {
  if (lose === 0) {
    return 100;
  } else {
    return Number(((win / (win + lose)) * 100).toFixed(1));
  }
}
</script>

<template>
  <div class="profile_box box">
    <div class="profile">
      <div class="profile_img_box">
        <div class="profile_img">
          <img :src="store.data.avatarPath" alt="" />
          <input
            @change="updateAvatarImg"
            type="file"
            id="fileUpload"
            ref="selectFile"
          />
        </div>
        <button @click="changeDefault">X</button>
      </div>
      <div class="profile_contents">
        <p class="level fz12">lv. {{ store.data.lating }}</p>
        <p @click="clickNickname" v-if="!onClickName" class="nickname fz20">
          {{ store.data.nickname }}
        </p>
        <input
          v-model="nickname"
          class="nickname_input"
          @blur="onClickName = false"
          @keyup.enter="updateUserData"
          v-else-if="onClickName"
          type="text"
          :placeholder="store.data.nickname"
          ref="focusMe"
          required
        />
        <div class="score_box">
          <div class="rank_score">
            <p class="game_type fz12">
              <span class="score_icon">🏆</span>랭크
              <span>
                {{
                  calcPercent(
                    Number(store.data.ladder_win),
                    Number(store.data.ladder_lose)
                  ) || 0
                }}%</span
              >
            </p>
            <p class="score">
              <span
                ><span class="fz12">승</span> {{ store.data.ladder_win }}</span
              >
              <span
                ><span class="fz12"> 패</span>
                {{ store.data.ladder_lose }}</span
              >
            </p>
          </div>
          <div class="normal_score">
            <p class="game_type fz12">
              <span class="score_icon">🏓</span>일반
              <span>
                {{
                  calcPercent(
                    Number(store.data.win),
                    Number(store.data.lose)
                  ) || 0
                }}%</span
              >
            </p>
            <p class="score">
              <span><span class="fz12">승</span> {{ store.data.win }}</span>
              <span><span class="fz12"> 패</span> {{ store.data.lose }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="qrcode">
      <div v-show="store.data.isTwoFactorAuthenticationEnabled">인증 완료</div>
      <button
        v-show="!store.data.isTwoFactorAuthenticationEnabled"
        class="qrcode_btn"
        :class="{ on: showQrcode }"
        @click="twoFAClick"
      >
        <div v-show="!showQrcode">2차 인증</div>
        <div v-show="showQrcode">
          <qrcode-vue :value="qrValue"></qrcode-vue>
        </div>
      </button>
      <div
        class="qr_send"
        v-if="!store.data.isTwoFactorAuthenticationEnabled && showQrcode"
      >
        <input
          class="qr_send_text"
          type="text"
          v-model="qrCodeText"
          @keyup.enter="twoFactorAuthentication"
          v-focus
        />
        <input
          class="qr_send_submit"
          type="button"
          value="확인"
          @click="twoFactorAuthentication"
        />
      </div>
      <input
        v-if="store.data.isTwoFactorAuthenticationEnabled"
        class="qr_send_submit cancel"
        type="button"
        value="취소"
        @click="twoFactorCancel"
      />
    </div>
  </div>
</template>

<style scoped>
.profile_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  background: var(--main);
}
.profile {
  width: 100%;
  min-width: 300px;
  height: 200px;
  display: flex;
  padding: 28px 20px 28px 30px;
}
.profile_img_box {
  position: relative;
}
.profile .profile_img {
  position: relative;
  width: 140px;
  height: 140px;
  border: 2px solid var(--white);
  border-radius: 50%;
  overflow: hidden;
  background: var(--main);
  cursor: pointer;
}
.profile_img input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 9;
  cursor: pointer;
}
.profile_img_box button {
  position: absolute;
  right: -4px;
  top: -4px;
  width: 24px;
  height: 24px;
  z-index: 99;
  background: var(--notice3);
  border-radius: 12px;
  display: none;
}
.profile_img_box:hover button {
  display: block;
}
.profile .profile_img:hover::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: var(--main-bg);
  opacity: 0.5;
}
.profile .profile_img:hover::after {
  content: "아바타 변경";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
}

.profile .profile_contents {
  margin-left: 30px;
  position: relative;
}
.profile .profile_contents .level {
  color: var(--gold);
  font-weight: 700;
}
.profile .profile_contents .nickname {
  font-weight: 700;
  margin-top: 4px;
  height: 22px;
  cursor: pointer;
  position: relative;
}
.profile .profile_contents .nickname:hover {
  color: var(--offline);
  background: var(--main-bg);
  border-radius: 5px;
}

.profile .profile_contents .nickname:hover::after {
  position: absolute;
  content: "";
  right: -28px;
  top: -10px;
  width: 24px;
  height: 24px;
  z-index: 9;
  background: var(--notice) url("@/assets/image/pen.svg") no-repeat 5px;
  border-radius: 12px;
}

.profile .profile_contents .nickname_input {
  margin-top: 4px;
  background: var(--main-bg);
  width: 100px;
  height: 20px;
  border-radius: 5px;
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

.qrcode {
  position: absolute;
  right: 30px;
  bottom: 0;
  height: 200px;
  min-width: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.qrcode_btn {
  background: var(--notice);
  border-radius: 10px;
  font-size: 14px;
  padding: 10px 30px 8px;
  font-weight: 700;
}
.qrcode_btn.on {
  padding: 14px 14px 10px;
  background: var(--white);
}
.qr_send {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.qr_send_text {
  width: 64px;
  background: var(--main-bg);
  border-radius: 5px;
  font-size: 14px;
  padding: 5px 10px;
}
.qr_send_submit {
  background: var(--notice);
  font-size: 14px;
  border-radius: 5px;
  margin-left: 5px;
  padding: 5px 8px;
  cursor: pointer;
}
.qr_send_submit.cancel {
  margin-top: 20px;
  margin-left: 0;
}
</style>
