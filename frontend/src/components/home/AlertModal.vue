<script setup lang="ts">
import { modalAlertStore } from "@/stores/modal";

const modalAlert = modalAlertStore();
</script>

<template>
  <div
    class="alert_modal box"
    :class="{ green: modalAlert.color === 'ok' }"
    v-if="modalAlert.onModal"
  >
    {{ modalAlert.message }}
  </div>
</template>

<style scoped>
.alert_modal {
  position: absolute;
  top: 30px;
  left: 50%;
  min-width: 220px;
  padding: 15px;
  background-color: var(--notice3);
  text-align: center;
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 99;
}
.alert_modal.green {
  background-color: var(--game);
}
</style>
