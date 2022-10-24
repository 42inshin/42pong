import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { useCookies } from "vue3-cookies";
import type {
  User,
  Dm,
  ChannelParticipant,
  JoinUser,
} from "@/interface/interface";
import { ChatStore } from "@/stores/chatting";
import { DmStore } from "@/stores/dm";
import { modalRecvBattleStore, modalAlertStore } from "@/stores/modal";
import { useUserStore } from "@/stores/user";
import { GameSocketStore } from "@/stores/gameSocket";
import { getFriends, getLoginUser, getBlock } from "@/api/UserService";

export const UserListStore = defineStore({
  id: "UserListStore",
  state: () => ({
    onAll: true,
    socket: io("http://localhost:5000/", socketOptions),
    allList: Array<User>(),
    friendList: Array<User>(),
    blockList: Array<User>(),
    viewList: Array<User>(),
  }),
  getters: {},
  actions: {
    allBtnClick() {
      sortNickname(this.allList);
      this.viewList = this.allList;
    },
    friendBtnClick() {
      sortNickname(this.friendList);
      this.viewList = this.friendList;
    },
    showViewList() {
      viewUserList();
    },
    disConnect() {
      this.socket.disconnect();
    },
    isblocked(userId: string) {
      const findIndex = this.blockList.findIndex(
        (element: User) => element.id === userId
      );
      if (findIndex === -1) return false;
      return true;
    },
  },
});

const { cookies } = useCookies();
const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: "Bearer " + cookies.get("jwt"),
      },
    },
  },
};

const userListStore = UserListStore();

function sortNickname(items: User[]) {
  items.sort(function (a, b) {
    const nameA = a.nickname.toUpperCase();
    const nameB = b.nickname.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // 이름이 같을 경우
    return 0;
  });
}

function viewUserList() {
  if (userListStore.onAll) {
    userListStore.allBtnClick();
  } else {
    userListStore.friendBtnClick();
  }
}

function delDataUserList(list: User[], data: User) {
  const findIndex = findUserIndexById(list, data);
  if (findIndex !== -1) {
    list.splice(findIndex, 1);
  }
}

function findUserIndexById(
  list: User[] | ChannelParticipant[],
  data: User | JoinUser
) {
  return list.findIndex((element) => element.id === data.id);
}

function pushDataUserList(list: User[], data: User) {
  const findIndex = findUserIndexById(list, data);
  if (findIndex === -1) {
    list.push(data);
  }
}

function changeStatus(list: User[] | ChannelParticipant[], data: JoinUser) {
  const findIndex = findUserIndexById(list, data);
  if (findIndex !== -1) {
    list[findIndex].status = data.status;
  }
}

function changeAvata(
  list: User[] | ChannelParticipant[],
  data: User | JoinUser
) {
  const findIndex = findUserIndexById(list, data);
  if (findIndex !== -1) {
    list[findIndex].avatarPath = data.avatarPath;
  }
}

function changeNickname(
  list: User[] | ChannelParticipant[],
  data: User | JoinUser
) {
  const findIndex = findUserIndexById(list, data);
  if (findIndex !== -1) {
    list[findIndex].nickname = data.nickname;
  } else {
    pushDataUserList(userListStore.allList, data as User);
  }
}

function changeUserStatus(
  list: User[] | ChannelParticipant[],
  data: User | JoinUser
) {
  const findIndex = findUserIndexById(list, data);
  if (findIndex !== -1) {
    list[findIndex].status = data.status;
  }
}

UserListStore().socket?.on("connect", async () => {
  console.log("socket connected");
  userListStore.allList = await getLoginUser();
  userListStore.friendList = await getFriends();
  userListStore.blockList = await getBlock();
  userListStore.showViewList();
});

// 로그인
userListStore.socket?.on("login", (data: User) => {
  // console.log(`new user join : ${data.nickname}`);
  // console.log(data);
  changeUserStatus(userListStore.allList, data);
  changeUserStatus(userListStore.friendList, data);
  viewUserList();
  changeUserStatus(ChatStore().data.participants, data);
});

// 로그아웃
userListStore.socket?.on("logout", (data: User) => {
  // console.log("leave");
  // console.log(data); // 3개 {id, nickname, status}
  changeUserStatus(userListStore.allList, data);
  changeUserStatus(userListStore.friendList, data);
  viewUserList();
  changeUserStatus(ChatStore().data.participants, data);
});

userListStore.socket?.on("change_avatar", (data: JoinUser) => {
  console.log("user change_avatar");
  console.log(data);
  changeAvata(userListStore.allList, data);
  changeAvata(userListStore.friendList, data);
  changeAvata(ChatStore().data.participants, data);
  viewUserList();
  if (data.id === useUserStore().data.id)
    useUserStore().data.avatarPath = data.avatarPath;
});

userListStore.socket?.on("change_nickname", (data: JoinUser) => {
  console.log("user change_nickname");
  console.log(data);
  changeNickname(userListStore.allList, data);
  changeNickname(userListStore.friendList, data);
  changeNickname(ChatStore().data.participants, data);
  viewUserList();
  DmStore().updateDms(data);
});

userListStore.socket?.on("change_status", (data: JoinUser) => {
  console.log("user change_status");
  console.log(data);
  changeStatus(userListStore.allList, data);
  changeStatus(userListStore.friendList, data);
  viewUserList();
  changeStatus(ChatStore().data.participants, data);
});

userListStore.socket?.on("add_friend", (data: User) => {
  // console.log("add_friend");
  // console.log(data); // 4개 {id, nickname, avatarPath, status}
  pushDataUserList(userListStore.friendList, data);
  delDataUserList(userListStore.blockList, data);
  viewUserList();
});

userListStore.socket?.on("del_friend", (data: User) => {
  // console.log("del_friend");
  // console.log(data);
  delDataUserList(userListStore.friendList, data);
  delDataUserList(userListStore.blockList, data);
  viewUserList();
});

userListStore.socket?.on("add_block", (data: User) => {
  // console.log("add_block");
  // console.log(data);
  delDataUserList(userListStore.friendList, data);
  pushDataUserList(userListStore.blockList, data);
  viewUserList();
});

function addLocalStorage(msg: Dm) {
  const dmList: Dm[] = JSON.parse(localStorage.getItem(DmStore().KEY) || "[]");
  dmList.push(msg);
  localStorage.setItem(DmStore().KEY, JSON.stringify(dmList));
}

// DM 받는 소켓
UserListStore().socket?.on("dm", async (msg: Dm) => {
  if (UserListStore().isblocked(msg.sender.id)) return;
  await DmStore().createDm(msg.to.toString());
  const dmIndex = DmStore().dms.findIndex((el) => el.id === msg.to);
  if (dmIndex !== -1) {
    DmStore().dms[dmIndex].messages.push(msg);
    addLocalStorage(msg);
    DmStore().dms[dmIndex].newMsgCount += 1;
  }
  // console.log(data.to);
});

/**대결신청 이벤트 수신 수락, 거절 */
userListStore.socket?.on(
  "recvBattle",
  (data: { id: string; nickname: string }) => {
    if (userListStore.isblocked(data.id)) {
      modalAlertStore().alertMsg(
        `차단한 ${data.nickname}님이 대결신청을 보냈습니다`
      );
      setTimeout(() => {
        GameSocketStore().socket?.emit("rejectBattle");
      }, 2000);
      return;
    }

    modalRecvBattleStore().onModal = true;
    modalRecvBattleStore().opponentNick = data.nickname;
  }
);
