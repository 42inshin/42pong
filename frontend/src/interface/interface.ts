export interface User {
  avatarPath: string;
  id: string;
  nickname: string;
  lating: number;
  ladder_lose: number;
  ladder_win: number;
  win: number;
  lose: number;
  status: number;
}

export interface JoinUser {
  channel_id: number;
  id: string;
  nickname: string;
  avatarPath: string;
  status: number;
}

export interface ChannelMessage {
  channel_id: number;
  sender: JoinUser;
  channel: Channel;
  message: string;
  createdAt: Date;
  notice: boolean;
}

export interface ChannelParticipant {
  id: string;
  nickname: string;
  avatarPath: string;
  status: number;
}

export interface Channel {
  id: number;
  name: string;
  type: string;
  participants: Array<ChannelParticipant>;
  owner: User;
  messages: Array<ChannelMessage>;
  newMsgCount: number;
}

export interface ModalStore {
  onModal: boolean;
  data: {
    index: number;
    id: number;
    title: string;
    password: string;
    type: string;
  };
}

export interface Dms {
  id: string;
  title: string;
  messages: Array<Dm>;
  newMsgCount: number;
}

export interface Dm {
  id: number;
  to: string;
  message: string;
  createdAt: Date;
  sender: {
    id: string;
    avatarPath: string;
    nickname: string;
  };
  notice: boolean;
}

export interface GameChat {
  message: string;
  createdAt: Date;
  sender: {
    id: string;
    avatarPath: string;
    nickname: string;
  };
  notice: boolean;
}

export interface GameData {
  left_user: number;
  right_user: number;
  ball_x: number;
  ball_y: number;
  ball_vec_x: number;
  ball_vec_y: number;
  ball_speed: number;
  score: [number, number];
  mode: number;
  hitPlayer: number;
  onGame: boolean;
}

export interface GameUser {
  avatarPath: string;
  lating: number;
  nickname: string;
  ladder_win: number;
  ladder_lose: number;
  win: number;
  lose: number;
}

export interface ApiUser extends GameUser {
  id: string;
  admin: boolean;
  status: number;
  twoFactorAuthenticationSecret: string;
  isTwoFactorAuthenticationEnabled: boolean;
}

export interface roomData {
  nicks: [string, string];
  roomNum: number;
  users: [ApiUser, ApiUser];
}

export interface UserList {
  data: Array<ApiUser>;
}

export interface GameResult {
  createdAt: Date;
  gameMode: string;
  id: number;
  player1: ApiUser;
  player1Score: number;
  player2: ApiUser;
  player2Score: number;
}
