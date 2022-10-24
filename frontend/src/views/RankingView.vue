<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { getRankingList } from "../api/UserService";
import Colume from "../components/rank/Colume.vue";
import ListRaw from "../components/rank/ListRaw.vue";

let rankList: [];
const viewList = ref([]);
const firstRowNum = 3; // 처음 보여질 줄 수
const showRowNum = 2; // 더보기 클릭시 보여줄 줄 수
const rowCount = ref(0);
const disableBtn = ref(false);
onBeforeMount(async () => {
  disableBtn.value = true;
  rankList = await getRankingList();
  for (let i = 0; i < rankList.length; i++) {
    if (i == firstRowNum) break;
    viewList.value.push(rankList[i]);
    rowCount.value++;
  }
  if (rankList.length === rowCount.value) {
    disableBtn.value = true;
    return;
  }
  disableBtn.value = false;
});

function moreList() {
  for (let i = 0; i < showRowNum; i++) {
    if (rankList.length > rowCount.value) {
      viewList.value.push(rankList[rowCount.value]);
      rowCount.value++;
      if (rankList.length === rowCount.value) {
        disableBtn.value = true;
        return;
      }
    }
  }
}
</script>

<template>
  <div class="rank_logo">
    <img src="@/assets/image/ranking.svg" alt="Rank" />
  </div>
  <div class="box table_box no-scrollbar">
    <table class="rankingList">
      <Colume />
      <tr v-for="(data, index) in viewList" :key="index">
        <ListRaw :user="data" :index="index + 1" />
      </tr>
    </table>
    <div class="btnwrapper">
      <button @click="moreList" class="getMore" :disabled="disableBtn">
        더보기
      </button>
    </div>
  </div>
</template>

<style scoped>
.rank_logo {
  width: 210px;
  padding: 15px;
  margin-bottom: 20px;
}
.table_box {
  max-height: 687px;
  overflow-x: hidden;
  border-radius: 10px;
}

tr {
  height: 30px;
  border-bottom: 2px solid var(--main);
}

.rankingList {
  box-sizing: border-box;
  width: 860px;
  table-layout: fixed;
  font-size: 12px;
  overflow: hidden;
}

.btnwrapper {
  box-sizing: border-box;
  background: var(--active);
  width: 860px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.getMore {
  width: 140px;
  height: 28px;
  font-size: 12px;
  background: var(--main-bg);
  border-radius: 20px;
}
.getMore:disabled {
  visibility: hidden;
}
</style>
