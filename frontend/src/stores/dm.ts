import { defineStore } from "pinia";
import type { Dm, Dms, JoinUser } from "@/interface/interface";
import { getUserById } from "@/api/UserService";
import { useUserStore } from "@/stores/user";
import { ChatStore } from "@/stores/chatting";

export const DmStore = defineStore({
  id: "DmStore",
  state: () => ({
    KEY: "dm_key",
    dms: Array<Dms>(),
  }),
  actions: {
    async createDm(id: string) {
      const dmIndex = this.dms.findIndex((el) => el.id === id);
      if (dmIndex === -1) {
        const newDm = {
          id: id,
          title: await getUserById(id).then((user) => user.nickname),
          messages: [],
          newMsgCount: 0,
        };
        this.dms.push(newDm);
        ChatStore().onScroll();
      }
    },
    findDm(id: string) {
      const dmIndex = this.dms.findIndex((el) => el.id === id);
      if (dmIndex !== -1) {
        ChatStore().data.chat = this.dms[dmIndex];
        ChatStore().data.messages = this.dms[dmIndex].messages;
      }
    },
    deleteDm(nickname: string) {
      if (ChatStore().data.category !== "dm") return;
      const dmIndex = this.dms.findIndex((el) => el.title === nickname);
      if (dmIndex !== -1) {
        deleteLocalStorage(dmIndex);
        this.dms.splice(dmIndex, 1);
      }
    },
    async makeDms() {
      await makeDmList();
    },
    updateDms(data: JoinUser) {
      if (
        ChatStore().data.category === "dm" &&
        useUserStore().data.id !== data.id
      ) {
        ChatStore().data.title = data.nickname;
      }
      const dmIndex = this.dms.findIndex((el) => el.id === data.id);
      if (dmIndex !== -1) {
        DmStore().dms[dmIndex].title = data.nickname;
      }
      // updateDmList(data);
      // updateLocalStorage(data);
    },
  },
});

async function makeDmList() {
  const dmList: Dm[] = JSON.parse(localStorage.getItem(DmStore().KEY) || "[]");
  for (let i = 0; i < dmList.length; i++) {
    const findIndex = DmStore().dms.findIndex((el) => el.id === dmList[i].to);
    if (findIndex === -1) {
      const newDm = {
        id: dmList[i].to,
        title: await getUserById(dmList[i].to).then((user) => user.nickname),
        messages: [],
        newMsgCount: 0,
      };
      DmStore().dms.push(newDm);
      ChatStore().onScroll();
    }
    const dmIndex = DmStore().dms.findIndex((el) => el.id === dmList[i].to);
    const dm = DmStore().dms[dmIndex];
    if (dm.messages) {
      dm.messages.push(dmList[i]);
    }
  }
}

function deleteLocalStorage(findIndex: number) {
  const dmList: Dm[] = JSON.parse(localStorage.getItem(DmStore().KEY) || "[]");
  for (let i = 0; i < DmStore().dms[findIndex].messages.length; i++) {
    const index = dmList.findIndex(
      (el) => el.id === DmStore().dms[findIndex].messages[i].id
    );
    dmList.splice(index, 1);
  }
  localStorage.setItem(DmStore().KEY, JSON.stringify(dmList));
  JSON.parse(localStorage.getItem(DmStore().KEY) || "[]");
}

// function updateLocalStorage(user: JoinUser) {
//   const dmList: Dm[] = JSON.parse(localStorage.getItem(DmStore().KEY) || "[]");
//   for (let i = 0; i < dmList.length; i++) {
//     if (user.id === dmList[i].sender.id) {
//       dmList[i].sender.nickname = user.nickname;
//       dmList[i].sender.avatarPath = user.avatarPath;
//     }
//   }
//   localStorage.setItem(DmStore().KEY, JSON.stringify(dmList));
//   JSON.parse(localStorage.getItem(DmStore().KEY) || "[]");
// }

// function updateDmList(user: JoinUser) {
//   const dmIndex = DmStore().dms.findIndex((el) => el.id === user.id);
//   if (dmIndex === -1) return;
//   DmStore().dms[dmIndex].title = user.nickname;
//   DmStore().dms[dmIndex].messages.map((msg) => {
//     if (user.id === msg.sender.id) {
//       msg.sender.nickname = user.nickname;
//       msg.sender.avatarPath = user.avatarPath;
//     }
//   });
// }
