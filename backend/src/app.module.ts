import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { ChannelModule } from "./channel/channels.module";
import { typeORMConfig } from "./configs/typeorm.config";
import { TypeOrmExModule } from "./database/typeorm-ex-module";
import { ChattingModule } from "./chatting/chatting.module";
import { MatchHistoryModule } from "./match_history/history.module";
import { UserRepository } from "./repository/user.repository";
import { UsersModule } from "./users/users.module";
import { DMModule } from "./dm/dm.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		AuthModule,
		TypeOrmModule.forRoot(typeORMConfig),
		UsersModule,
		TypeOrmExModule.forCustomRepository([UserRepository]),
		ChattingModule,
		ChannelModule,
		MatchHistoryModule,
		DMModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
