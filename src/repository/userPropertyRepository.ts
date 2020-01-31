import Card from "../models/card";
import User from "../models/user";
import UserProperty, {PocketType} from "../models/userProperty";

export class UserPropertyRepository {
  public async createUserProperty(user: User, card: Card, pocketType: PocketType, isfake = false): Promise<UserProperty> {
    return UserProperty.create({
      pocketType,
      userId: user.id,
      cardNo: card.cardNo,
      isFake: isfake,
    });
  }

  public async getUserPropertyById(id: number): Promise<UserProperty | null> {
    return await UserProperty.findByPk(id);
  }

  public async getUserPropertiesByUserId(userId: number): Promise<UserProperty[]> {
    return await UserProperty.findAll({
      where: {
        userId,
      },
      include: [Card],
    });
  }

  public async getUserPropertiesByUserIdAndPocketTypes(userId: number, pocketTypes: PocketType[]): Promise<UserProperty[]> {
    return await UserProperty.findAll({
      where: {
        userId,
        pocketType: pocketTypes,
      },
      include: [Card],
    });
  }

  public async getUserPropertiesByUserIdAndCardNo(userId: number, cardNo: number): Promise<UserProperty[]> {
    return await UserProperty.findAll({
      where: {
        userId,
        cardNo,
      },
      include: [Card],
    });
  }

  public async updateOwnerId(up: UserProperty, userId: number): Promise<UserProperty> {
    up.userId = userId;
    return await up.save();
  }

  public async deleteUserProperty(userId: number, cardNo: number, limit?: number) {
    if (!limit) {
      return await UserProperty.destroy({
        where: {
          userId,
          cardNo,
        },
      });
    }

    return await UserProperty.destroy({
      where: {
        userId,
        cardNo,
      },
      limit,
    });
  }
}
