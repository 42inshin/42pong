import { HttpException } from "@nestjs/common";

export interface TMP {
	id?: string;
}

export const imageFileFilter = (req, file, callback) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return callback(
			new HttpException("Only image files are allowed!", 409),
			false
		);
	}
	callback(null, true);
};

export enum UserRelationType {
	FRIEND,
	BLOCK,
}

export enum UserStatusType {
	OFFLINE,
	ONLINE,
	GAME,
}

export enum CommandType {
	GAME,
	PROFILE,
}

export class CurrentUserDto {
	id: string;
	nickname: string;
	avatarPath: string;
	status: number;
}

export class RankListDto {
	nickname: string;
	lating: number;
	ladder_win: number;
	ladder_lose: number;
	win: number;
	lose: number;
	tier: string;
}
