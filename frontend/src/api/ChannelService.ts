import axios, { type AxiosResponse } from "axios";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export async function getChennelList() {
  const response = await axios.get("/api/channels/list", {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function getJoinedChannel() {
  const response = await axios.get("/api/channels/joinedChannel", {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function getCheckPassword(channel_id: string, password: string) {
  const response = await axios.get(
    "/api/channels/checkpassword?channel_id=" +
      channel_id +
      "&password=" +
      password,
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function makeChannel(
  name: string,
  type: string,
  password: string,
  ownerId: string
) {
  const response = await axios.post(
    "/api/channels",
    {
      name: name,
      type: type,
      password: password,
      ownerId: ownerId,
    },
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function deleteChannel(channel_id: number) {
  const response = await axios.delete(
    "/api/channels?channel_id=" + channel_id,
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function getChannelUser(channel_id: number) {
  const response = await axios.get(
    "/api/channels/participants/all/" + channel_id,
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function getParticipant(channel_id: number) {
  const response = await axios.get("/api/channels/participant/" + channel_id, {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function joinChannel(channel_id: number, password: string) {
  const response = await axios
    .post(
      "/api/channels/participant",
      {
        channel_id: channel_id,
        password: password,
      },
      {
        headers: {
          Authorization: `Bearer ` + cookies.get("jwt"),
        },
      }
    )
    .catch((error) => {
      console.log(error.response.data.statusCode);
    });
  return response ? response.data : "ban";
}

export async function getMyChannel() {
  const response = await axios.get("/api/channels/ownerChannel", {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function changePassword(channel_id: number, password: string) {
  const response = await axios.post(
    "/api/channels/password/",
    {
      channel_id: channel_id,
      password: password,
    },
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function deletePassword(channel_id: number) {
  const response = await axios.delete("/api/channels/password/" + channel_id, {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}

export async function patchPassword(channel_id: number, password: string) {
  const response = await axios.patch(
    "/api/channels/password/",
    {
      channel_id: channel_id,
      password: password,
    },
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function giveMuted(
  user_id: string,
  channel_id: number,
  value: boolean
) {
  const response = await axios.post(
    "/api/channels/muted",
    {
      user_id: user_id,
      channel_id: channel_id,
      value: value,
    },
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function kick(channel_id: number, id: string) {
  const response = await axios.delete(
    "/api/channels/kick/?channel_id=" + channel_id + "&id=" + id,
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function checkBan(channel_id: number, id: string) {
  const response = await axios.get(
    "/api/channels/ban/?channel_id=" + channel_id + "&id=" + id,
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function addBan(channel_id: number, id: string) {
  const response = await axios.post(
    "/api/channels/ban/",
    { channel_id: channel_id, id: id },
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function deleteBan(channel_id: number, id: string) {
  const response = await axios.delete(
    "/api/channels/ban/?channel_id=" + channel_id + "&id=" + id,
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function patchChannel(
  channel_id: number,
  name: string,
  password: string
) {
  const response = await axios.patch(
    "/api/channels/" + channel_id,
    {
      name: name,
      password: password,
    },
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function changeAdmin(user_id: string, channel_id: string) {
  const response = await axios.post(
    "/api/channels/admin",
    {
      user_id: user_id,
      channel_id: channel_id,
    },
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function checkAdmin(channel_id: number, user_id: string) {
  const response = await axios.get(
    "/api/channels/admin/?channel_id=" + channel_id + "&user_id=" + user_id,
    {
      headers: {
        Authorization: `Bearer ` + cookies.get("jwt"),
      },
    }
  );
  return response.data;
}

export async function getBannedList(channel_id: string) {
  const response = await axios.get("/api/channels/bannedList/" + channel_id, {
    headers: {
      Authorization: `Bearer ` + cookies.get("jwt"),
    },
  });
  return response.data;
}
