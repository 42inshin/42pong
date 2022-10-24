<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  roomData: {
    type: Array,
    default: () => {
      return [0, ""];
    },
  },
});

const inputPassword = ref("");

const emit = defineEmits(["submit", "cancle"]);

function submitPass() {
  const password = inputPassword.value;
  emit("submit", [props.roomData[0], password]);
  inputPassword.value = "";
}

function canclePass() {
  inputPassword.value = "";
  emit("cancle");
}
</script>

<template>
  <div class="enter_pass_modal">
    <div class="enter_pass box">
      <p class="enter_pass_title">🔒 {{ roomData[1] }}</p>
      <p class="enter_error"><slot></slot></p>
      <div class="input_info">
        <div class="input_box">
          <label for="input_pass"> 비밀번호 </label>
          <input
            @keyup.enter="submitPass"
            @keydown.esc="canclePass"
            v-model="inputPassword"
            type="password"
            id="input_pass"
            v-focus
          />
        </div>
      </div>
      <div class="submit_button">
        <button @click="submitPass" class="submit_pass" type="button">
          확 인
        </button>
        <button @click="canclePass" type="button">취 소</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.enter_pass_modal {
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
.enter_pass {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 45px;
  width: 544px;
  background: var(--main-bg);
}
.enter_pass_title {
  font-size: 36px;
  font-family: var(--font-game);
  word-wrap: break-word;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}
.enter_error {
  height: 16px;
  color: var(--yellow);
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
.submit_button {
  margin-top: 23px;
  width: 334px;

  display: flex;
  justify-content: space-between;
}
.submit_button button {
  width: 160px;
  height: 50px;
  border-radius: 15px;
  background: var(--active);
  font-size: 20px;
  font-weight: 700;
}
.submit_button button.submit_pass {
  background: var(--notice);
}
</style>
