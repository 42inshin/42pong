<script setup lang="ts"></script>

<template>
  <tr class="thead">
    <th class="rank">#</th>
    <th class="nickname">닉네임</th>
    <th class="tier">티어</th>
    <th class="lating">LP</th>
    <th class="ladder">랭크 승률</th>
    <th class="normal">일반 승률</th>
  </tr>
</template>

<style scoped>
.thead {
  width: 860px;
  background: var(--main-bg);
  height: 35px;
  padding-top: 5px;
  padding-left: 16px;
  text-align: left;
  color: var(--offline);
}

th {
  background: var(--main-bg);
  vertical-align: middle;
}

.rank {
  width: 50px;
  text-indent: 15px;
}

.nickname {
  width: 270px;
}

.tier {
  width: 130px;
}

.lating {
  width: 100px;
}

.ladder {
  width: 155px;
}

.normal {
  width: 155px;
}
</style>
