import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DM } from "src/Entitys/direct.message.entity";
import { User } from "src/Entitys/user.entity";
import { DMRepository } from "src/repository/DM.repository";

@Injectable()
export class DMService {
  constructor(
    @InjectRepository(DMRepository)
    private dmRepository: DMRepository
  ) {}

  async saveDM(from: User, to: User, message: string): Promise<DM> {
    return await this.dmRepository.saveDM(from, to, message);
  }

  async getDM(user1: User, user2: User) {
    return await this.dmRepository.getDM(user1, user2);
  }
}
