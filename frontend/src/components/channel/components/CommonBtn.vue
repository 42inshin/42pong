<script setup lang="ts"></script>

<template>
  <button>
    <span></span>
    <span></span>
    <span></span>
  </button>
</template>

<style scoped>
button {
  position: relative;
  width: 18px;
  height: 18px;
  background: none;
  cursor: pointer;
}
button.angle span {
  position: absolute;
  left: 5px;
  top: 0px;
  display: block;
  width: 2px;
  height: 12px;
  background: var(--white);
}
button.angle span:nth-child(1) {
  transform: rotate(45deg);
}
button.angle span:nth-child(2) {
  transform: rotate(-45deg);
  top: 8px;
}
button.angle span:nth-child(3) {
  opacity: 0;
}

button.option_btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 18px;
  height: 18px;
}

button.option_btn span {
  position: absolute;
  top: 8px;
  right: 0;
  display: block;
  width: 18px;
  height: 2px;
  background: var(--white);
  transition: transform 1s;
}

/* burger btn */
button.burger span:nth-child(1) {
  top: 2px;
}
button.burger span:nth-child(2) {
  top: 8px;
}
button.burger span:nth-child(3) {
  top: 14px;
}

/* plus btn */
button.plus span:nth-child(1) {
  top: 8px;
  transform: rotate(-180deg);
}
button.plus span:nth-child(2) {
  opacity: 0;
}
button.plus span:nth-child(3) {
  top: 8px;
  transform: rotate(270deg);
}

/* close btn */
button.close span:nth-child(1) {
  top: 8px;
  transform: rotate(-225deg);
}
button.close span:nth-child(2) {
  opacity: 0;
}
button.close span:nth-child(3) {
  top: 8px;
  transform: rotate(225deg);
}
</style>
