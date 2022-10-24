<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  room: {
    type: Object,
    default: () => {
      return {
        name: "",
        pass: "",
        mode: 1,
        person: 0,
        id: 0,
        secret: false,
      };
    },
  },
});

const clickedbtn = ref(1);
const isFocus = ref(false);
const roomName = ref("");
const roomPass = ref("");

const emit = defineEmits(["gameMode", "submit", "cancle"]);

const clickNormal = () => {
  emit("gameMode", 1);
  clickedbtn.value = 1;
};

const clickPortal = () => {
  emit("gameMode", 2);
  clickedbtn.value = 2;
};

// 인자값이 스페이스로만 이뤄져 있으면 false, 아니면 true 반환
function checkOnlySpaceInput(input: string): boolean {
  for (let i = 0; i < input.length; ++i) {
    if (input[i] !== " ") return true;
  }
  return false;
}

function submitButton() {
  if (!checkOnlySpaceInput(roomName.value)) {
    roomName.value = "";
    roomPass.value = "";
  } else emit("submit", [roomName.value, roomPass.value]);
}

function cancleButton() {
  roomName.value = "";
  roomPass.value = "";
  emit("cancle");
}
</script>

<template>
  <div class="make_room_modal">
    <div class="modalForm box">
      <p class="make_room_title">방 만들기</p>
      <div class="mode_button">
        <button :class="{ clicked: clickedbtn === 1 }" @click="clickNormal">
          <div class="btn_title">일반 모드</div>
          <div class="btn_img">🏓</div>
        </button>
        <button :class="{ clicked: clickedbtn === 2 }" @click="clickPortal">
          <div class="btn_title">포탈 모드</div>
          <div class="btn_img">🕳</div>
        </button>
      </div>
      <div class="input_info">
        <div class="input_box">
          <label for="input_room">방 제목</label>
          <input
            @keyup.enter="submitButton"
            @keydown.esc="cancleButton"
            v-model="roomName"
            type="text"
            id="input_room"
            v-focus
          />
        </div>
        <div class="input_box password">
          <label
            :class="{ focus: isFocus || roomPass.length > 0 }"
            for="make_password"
          >
            비밀번호
          </label>
          <input
            v-model="roomPass"
            :class="{ focus: isFocus || roomPass.length > 0 }"
            type="password"
            id="make_password"
            @keyup.enter="submitButton"
            @keydown.esc="cancleButton"
            @focus="isFocus = true"
            @blur="isFocus = false"
          />
        </div>
      </div>
      <div class="decision_button">
        <button
          :disabled="roomName.length <= 0"
          @click="submitButton"
          class="submit_room"
          type="button"
        >
          확 인
        </button>
        <button @click="cancleButton" class="cancel_room" type="button">
          취 소
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.make_room_modal {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  background: var(--modal-bg);
  border-radius: 30px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.modalForm {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 47px 50px;
  width: 544px;
  height: 496px;
  font-family: var(--font-game);
  background: var(--main-bg);
}
.decision_button {
  margin-top: 23px;
  width: 334px;

  display: flex;
  justify-content: space-between;

  font-family: "Do Hyeon";
}
.decision_button button {
  width: 160px;
  height: 50px;
  border-radius: 15px;
  background: var(--active);
  font-size: 20px;
  font-weight: 700;
}
.decision_button button.submit_room {
  background: var(--notice);
}

.decision_button button.submit_room:disabled {
  background: var(--offline);
}

.input_info {
  margin-top: 13px;
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
.make_room_title {
  font-size: 36px;
  margin-bottom: 30px;
}
.mode_button {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.mode_button > button {
  width: 218px;
  height: 120px;
  background: var(--active);
  border-radius: 30px;

  padding: 16px;
}
.mode_button > button.clicked {
  background-color: var(--notice);
}
.btn_title {
  font-size: 24px;
  font-family: "Do Hyeon";
}
.btn_img {
  font-size: 40px;
}
</style>
