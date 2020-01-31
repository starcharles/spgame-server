import * as express from "express";

import Card from "../models/card";
import SpellCard from "../models/spellCard";
import {default as UserProperty, PocketType} from "../models/userProperty";
import {Repository} from "../repository";
import {CardRepository} from "../repository/cardRepository";
import {UserPropertyRepository} from "../repository/userPropertyRepository";
import {UserRepository} from "../repository/userRepository";

type postMintRequest = {
  cardNo: number;
  addressIndex: number;
  tokenURI: string; // metadataのURL spgame-serverに作る?
};

async function postSpell(req: express.Request, res: express.Response, next: express.NextFunction) {
  const userRepo = Repository.getRepository("User") as UserRepository;
  // const userId = 1;
  const userId = (req as any).user.id;
  const spells = req.body.spells;
  console.log("spells", spells);

  const user = await userRepo.getUserById(userId);
  if (!user) {
    throw new Error("user not found");
  }

  const props: UserProperty[] = [];
  for (const sp of spells) {
    props.push(({
      userId,
      cardNo: sp.cardNo,
      pocketType: sp.pocketType,
      isFake: false,
    } as UserProperty));
  }

  const newProps = await UserProperty.bulkCreate(props);

  res.json({
    spells: newProps,
  });
}

async function postSpellGacha(req: express.Request, res: express.Response, next: express.NextFunction) {
  const userRepo = Repository.getRepository("User") as UserRepository;
  const userId = (req as any).user.id;

  const user = await userRepo.getUserById(userId);
  if (!user) {
    throw new Error("user not found");
  }
  const randomNum = Math.floor(Math.random() * 5) + 1; // 1-5
  console.log(randomNum);
  const spellCard = await SpellCard.findOne({
    where: {
      id: randomNum,
    },
    include: [Card],
  });
  if (spellCard) {
    const uprop = UserProperty.build({
      userId: user.id,
      cardNo: spellCard.cardNo,
      pocketType: PocketType.Spell,
      isFake: false,
    });
    const newUprop = await uprop.save();
    res.json(newUprop.toJSON());
  }
  throw new Error("card not found");

}

export {
  postSpell,
  postSpellGacha,
};
