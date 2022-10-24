import axios, { type AxiosResponse } from "axios";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export async function login(code: string): Promise<AxiosResponse<any>> {
  const response = await axios.post("/api/users/login", { code: code });
  return response;
}

export async function getSelf() {
  const response = await axios.get("/api/users", {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function getUserById(id: string) {
  const response = await axios.get("/api/users/id?id=" + id, {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function updateNickname(nickname: string): Promise<boolean> {
  let result = false;
  await axios
    .post(
      "/api/users/nickname",
      { nickname: nickname },
      {
        headers: {
          Authorization: `Bearer ` + cookies.get("jwt"),
        },
      }
    )
    .then(() => {
      result = true;
    })
    .catch(() => {
      result = false;
    });
  return result;
}

export async function getLoginUser() {
  const response = await axios.get("/api/users/login-user", {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function getFriends() {
  const response = await axios.get("/api/users/friends", {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function getRankingList() {
  const response = await axios.get("/api/users/RankingList", {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function changeDefaultAvatar(
  number: number
): Promise<AxiosResponse<any>> {
  const response = await axios.post(
    "/api/users/avatar/default",
    {
      number: number,
    },
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function updateAvatar(form: FormData) {
  const res = await axios.post("/api/users/avatar", form, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return res;
}

export async function getUserByNickname(nickname: string) {
  const response = await axios.get("/api/users/nickname?nickname=" + nickname, {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function getHistory(nickname: string) {
  const response = await axios.get("/api/MatchHistory/" + nickname, {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function addFriend(id: string) {
  const response = await axios.post(
    "/api/users/friends",
    {
      id: id,
    },
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function delRelation(id: string) {
  const response = await axios.delete("/api/users/friends/" + id, {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function setBlock(id: string) {
  const response = await axios.post(
    "/api/users/block",
    {
      id: id,
    },
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function getBlock() {
  const response = await axios.get("/api/users/block", {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function getDm(id: string) {
  const response = await axios.get("/api/users/dm/?id=" + id, {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}
