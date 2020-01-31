import * as express from "express";

import UserProperty, {PocketType} from "../models/userProperty";
import {Repository} from "../repository";
import {CardRepository} from "../repository/cardRepository";
import {UserPropertyRepository} from "../repository/userPropertyRepository";
import {UserRepository} from "../repository/userRepository";

async function postHunt(req: express.Request, res: express.Response, next: express.NextFunction) {
  const userRepo = Repository.getRepository("User") as UserRepository;
  const cardRepo = Repository.getRepository("Card") as CardRepository;
  const userId = (req as any).user.id;

  const user = await userRepo.getUserById(userId);
  if (!user) {
    throw new Error("user not found");
  }
  if (user.hp <= 0) {
    throw new Error("user can not hunt");
  }
  const randomNum = Math.floor(Math.random() * 5) + 1; // 1-5
  console.log(randomNum);
  const card = await cardRepo.getCardByNo(randomNum);
  if (card) {
    const uprop = UserProperty.build({
      userId: user.id,
      cardNo: card.cardNo,
      pocketType: PocketType.Special,
      isFake: false,
    });
    const newUprop = await uprop.save();

    // HP: -10
    user.hp = user.hp - 10;
    await user.save();

    res.json(newUprop.toJSON());
  }
  throw new Error("card not found");
}

export {
  postHunt,
};
