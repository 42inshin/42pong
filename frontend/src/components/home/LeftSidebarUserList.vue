<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from "vue";
import UserLine from "./UserListLine.vue";
import { modalProfileStore } from "@/stores/modal";
import { useUserStore } from "@/stores/user";
import { UserListStore } from "@/stores/userList";
import type { User } from "@/interface/interface";
import {
  getFriends,
  getLoginUser,
  getBlock,
  getUserById,
} from "@/api/UserService";

const searchText = ref("");
const inputToggle = ref(false);
const searchList: Array<User> = [];
const userListStore = UserListStore();
const self = useUserStore();

// onMounted(async () => {
// userListStore.allList = await getLoginUser();
// userListStore.friendList = await getFriends();
// userListStore.blockList = await getBlock();
// userListStore.showViewList();
// });

onBeforeUnmount(() => {
  userListStore.socket.disconnect();
});

function allBtnClick() {
  userListStore.onAll = true;
  userListStore.allBtnClick();
}

function friendBtnClick() {
  userListStore.onAll = false;
  userListStore.friendBtnClick();
}

function searchFilter() {
  searchList.length = 0;
  if (userListStore.onAll) userListStore.viewList = userListStore.allList;
  else userListStore.viewList = userListStore.friendList;
  if (searchText.value.length != 0) {
    userListStore.viewList.forEach((user: User) => {
      if (user.nickname.includes(searchText.value)) {
        searchList.push(user);
      }
      userListStore.viewList = searchList;
    });
  }
}
function searchBtnClick() {
  inputToggle.value = !inputToggle.value;
  searchText.value = "";
  searchFilter();
}

const modalProfile = modalProfileStore();

async function clickUserList($event: MouseEvent, id: string) {
  const li = $event.currentTarget as HTMLLIElement;
  if (id === self.data.id) return;
  li.classList.add("active");
  modalProfile.data = await getUserById(id);
  modalProfile.onChat = false;
  modalProfile.onModal = true;
}
</script>

<template>
  <div class="user_list_wrap">
    <div class="user_list_btn">
      <button
        @click="allBtnClick"
        class="btn15"
        :class="{ on: userListStore.onAll }"
      >
        ALL
      </button>
      <button
        @click="friendBtnClick"
        class="btn15"
        :class="{ on: !userListStore.onAll }"
      >
        FRIEND
      </button>
    </div>
    <div class="user_list_box box">
      <ul class="user_list">
        <UserLine
          v-for="(user, index) in userListStore.viewList"
          v-show="
            user.nickname.length > 0 &&
            (!userListStore.onAll || user.status > 0)
          "
          @click="clickUserList($event, user.id)"
          :key="index"
          :user="user"
          :class="{
            block:
              userListStore.blockList.findIndex((i) => i.id == user.id) !== -1,
          }"
        />
      </ul>
      <div class="search_box">
        <input
          v-if="inputToggle"
          v-model="searchText"
          @keyup="searchFilter"
          @keyup.enter="searchBtnClick"
          @keydown.esc="searchBtnClick"
          placeholder="닉네임을 적어주세요"
          v-focus
        />
        <button @click="searchBtnClick" class="search_btn">
          <div class="search_img">
            <img src="@/assets/image/search.svg" alt="search icon" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user_list_wrap {
  margin-top: 30px;
}

.user_list_btn {
  margin-bottom: 12px;
}

.user_list_btn button {
  font-size: 18px;
  padding: 10px 20px;
  background: var(--main);
}

.user_list_btn button:first-child {
  margin-left: 20px;
  margin-right: 10px;
}

.user_list_btn button.on {
  background: var(--notice2);
}

.user_list_box {
  position: relative;
  background: var(--main);
  width: 310px;
  height: 420px;
  padding: 30px 30px 35px;
}

.search_box {
  position: absolute;
  bottom: 35px;
  left: 30px;
  width: 250px;
  height: 50px;
  display: flex;
  align-items: center;
}

.search_box input {
  background: #454768;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 300;
  width: 185px;
  height: 30px;
  display: flex;
}

.search_box input.on {
  display: block;
}

.search_btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--notice);
  width: 50px;
  height: 50px;
  border-radius: 15px;
}

.search_img {
  width: 32px;
  margin: 0 auto;
}
</style>
