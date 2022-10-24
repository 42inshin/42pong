<script setup lang="ts">
import { ref } from "vue";
import { makeChannel } from "@/api/ChannelService";
import { useUserStore } from "@/stores/user";
import { modalMakeStore } from "@/stores/modal";

const makeModal = modalMakeStore();
const isFocus = ref(false);
const errorMsg = ref(false);
// arrErrorMsg[0] 이 메세지 출력 조건임
const arrErrorMsg = [
  0,
  "채널 이름을 입력하세요",
  "채널 이름을 20자 이하로 입력하세요",
  "비밀 번호를 20자 이하로 입력하세요",
];

function alertMsg() {
  errorMsg.value = true;
  setTimeout(() => {
    errorMsg.value = false;
    arrErrorMsg[0] = 0;
  }, 2000);
}

// makeModal 스토어 리셋: onModal 빼고
function resetMakeModal(): void {
  makeModal.data.title = "";
  makeModal.data.type = "public";
  makeModal.data.password = "";
}

// max 길이 시 에러처리 캡슐화
function funcMaxLengthErr(setMsg: number) {
  arrErrorMsg[0] = setMsg;
  alertMsg();
  resetMakeModal();
}

// 인자값이 스페이스로만 이뤄져 있으면 true, 아니면 false 반환
function checkOnlySpaceInput(input: string): boolean {
  for (let i = 0; i < input.length; ++i) {
    if (input[i] !== " ") return false;
  }
  return true;
}

// 인자값 길이가 너무 길면 true, 아니면 false 반환
function checkMaxLengthTitle(title: string): boolean {
  if (title.length > 14) return true;
  return false;
}
function checkMaxLengthPass(title: string, pass: string): boolean {
  if (title.length > 0 && pass.length > 20) return true;
  return false;
}

async function MakeChannelOkayBtn() {
  if (checkOnlySpaceInput(makeModal.data.title)) funcMaxLengthErr(0);
  else if (checkMaxLengthTitle(makeModal.data.title)) funcMaxLengthErr(1);
  else if (checkMaxLengthPass(makeModal.data.title, makeModal.data.password))
    funcMaxLengthErr(2);
  else {
    const store = useUserStore();
    if (makeModal.data.password.length > 0) {
      makeModal.data.type = "private";
    }
    if (makeModal.data.title.length > 0) {
      await makeChannel(
        makeModal.data.title,
        makeModal.data.type,
        makeModal.data.password,
        store.data.id
      );
    }
    makeModal.$reset();
  }
}

function MakeChannelCancelBtn() {
  makeModal.$reset();
}
</script>

<template>
  <div class="modal_box">
    <div class="modal box">
      <h2 class="modal_title">채널 만들기</h2>
      <p class="modal_error" :class="{ on: errorMsg }">
        {{
          arrErrorMsg[0] === 0
            ? arrErrorMsg[1]
            : arrErrorMsg[0] === 1
            ? arrErrorMsg[2]
            : arrErrorMsg[3]
        }}
      </p>
      <div class="input_box">
        <label for="input_channel">채널 이름</label>
        <input
          @keyup.enter="MakeChannelOkayBtn"
          @keydown.esc="MakeChannelCancelBtn"
          v-model="makeModal.data.title"
          type="text"
          id="input_channel"
          required
          v-focus
        />
      </div>
      <div class="input_box password">
        <label
          :class="{ focus: isFocus || makeModal.data.password.length > 0 }"
          for="input_password"
        >
          비밀 번호
        </label>
        <input
          @keyup.enter="MakeChannelOkayBtn"
          @keydown.esc="MakeChannelCancelBtn"
          v-model="makeModal.data.password"
          :class="{ focus: isFocus || makeModal.data.password.length > 0 }"
          type="password"
          id="input_password"
          @focus="isFocus = true"
          @blur="isFocus = false"
        />
      </div>
      <div class="confirm_btn">
        <button
          @click="MakeChannelOkayBtn"
          :disabled="makeModal.data.title.length == 0"
          class="okay_btn"
          type="button"
        >
          확 인
        </button>
        <button @click="MakeChannelCancelBtn" class="cancel_btn" type="button">
          취 소
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal_box {
  position: absolute;
  left: 0;
  right: 0;
  background: var(--modal-bg);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: var(--modal);
  max-width: 544px;
  padding: 40px 45px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.modal_title {
  font-size: 36px;
  font-family: "Do Hyeon";
  margin-bottom: 20px;
}
.modal_error {
  color: var(--yellow);
  opacity: 0;
}
.modal_error.on {
  opacity: 1;
}
.input_box {
  margin-bottom: 10px;
}

.input_box label {
  display: block;
  font-size: 14px;
  text-indent: 10px;
  margin-bottom: 5px;
}
.input_box input {
  height: 40px;
  background: var(--active);
  border-radius: 20px;
  width: 450px;
}

.password label {
  color: #666;
}
.password input {
  background: #2b2b46;
}
.password label.focus {
  color: var(--white);
}
.password input.focus {
  background: var(--active);
}
.confirm_btn {
  width: 334px;
  display: flex;
  justify-content: space-between;
  margin-top: 23px;
}
.confirm_btn button {
  width: 160px;
  height: 50px;
  border-radius: 15px;
  background: var(--active);
  font-size: 20px;
  font-weight: 700;
}
.confirm_btn button.okay_btn {
  background: var(--notice);
}
.confirm_btn button.okay_btn:disabled {
  background: var(--offline);
}
</style>
