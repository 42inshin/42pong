<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';


const props = defineProps({
    user : {
        type: Object,
        default: () => {
            null;
        }
    }
});

let percent = ref("");
let user = ref();
let total_win;
let total_lose;
onBeforeMount(async () => {
    user.value = props.user;
    total_win = user.value.win + user.value.ladder_win;
    total_lose = user.value.lose + user.value.ladder_lose;
    percent.value = ((total_win) / (total_win + total_lose)) * 100 + "%";
    console.log(props.user);
})
</script>

<!-- Use preprocessors via the lang attribute! e.g. <template lang="pug"> -->
<template>
    <div class="progressBar">
       <span id="bar" class="winbar" :style="{width : percent }">{{props.user.win}}W</span>
       <span id="bar" class="losebar" :style="{width : percent }">{{props.user.lose}}L</span>
       <span class="percent">{{percent}}</span>
    </div>
</template>

<!-- Use preprocessors via the lang attribute! e.g. <style lang="scss"> -->
<style>

.progressBar {
  max-width: 450px;
  width: 90%;
  margin: 5px auto;
  height: 25px;
  border-radius: 3px;
  display: flex;
  background: linear-gradient(#0000006c, #00000054);
}

.winbar {
  max-width: 330px;
  text-align: right;
  height: 25px; /* same as #progressBar height if we want text middle aligned */
  border-radius: 3px;
  background: linear-gradient(#1c09c7, #2a09c2);
}
.losebar {
  max-width: 330px;
  text-align: right;
  height: 25px; /* same as #progressBar height if we want text middle aligned */
  border-radius: 3px;
  background: linear-gradient(#e20404, #c90707);
}

.percent {
    width: 10px;
}
</style>