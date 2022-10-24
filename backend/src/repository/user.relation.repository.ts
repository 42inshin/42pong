import { NotFoundException, HttpException } from "@nestjs/common";
import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { UserRelation } from "src/Entitys/user.relaiton.entity";
import { Repository } from "typeorm";
import { User } from "src/Entitys/user.entity";
import { UserRelationType } from "src/util";

@CustomRepository(UserRelation)
export class UserRelationRepository extends Repository<UserRelation> {
  async getFrinedsByUser(user: User) {
    let friends: User[] = [];
    let data = await this.find({
      relations: ["to"],
      where: {
        from: { id: user.id },
      },
    });
    data.forEach((value) => {
      if (value.type == UserRelationType.FRIEND) friends.push(value.to);
    });
    return friends;
  }

  async getBlocksByUser(user: User) {
    let friends: User[] = [];
    let data = await this.find({
      relations: ["to"],
      where: {
        from: { id: user.id },
      },
    });
    data.forEach((value) => {
      if (value.type == UserRelationType.BLOCK) friends.push(value.to);
    });
    return friends;
  }

  async getRelation(from: User, to: User) {
    let relaiton = await this.findOne({
      where: {
        from: { id: from.id },
        to: { id: to.id },
      },
    });
    if (relaiton) return relaiton;
  }

  async setRelaiton(from: User, to: User, type: UserRelationType): Promise<UserRelation> {
    let relation;
    let exist = await this.getRelation(from, to);
    if (exist) {
      relation = exist;
      relation.type = type;
    } else {
      relation = new UserRelation();
      relation.type = type;
      relation.from = from;
      relation.to = to;
    }
    this.save(relation);
    return relation;
  }

  async deleteRelation(from: User, to: User) {
    let exist = await this.getRelation(from, to);
    if (exist) {
      this.delete(exist.id);
    }
  }
}
