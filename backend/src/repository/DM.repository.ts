import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { DM } from "src/Entitys/direct.message.entity";
import { User } from "src/Entitys/user.entity";

@CustomRepository(DM)
export class DMRepository extends Repository<DM> {
  async saveDM(from: User, to: User, message: string): Promise<DM> {
    let dm = new DM();
    dm.from = from;
    dm.to = to;
    dm.message = message;
    return await this.save(dm);
  }

  async getDM(user1: User, user2: User): Promise<DM[]> {
    let messages = await this.find({
      where: [
        { from: { id: user1.id }, to: { id: user2.id } },
        { from: { id: user2.id }, to: { id: user1.id } },
      ],
    });
    return messages;
  }
}
