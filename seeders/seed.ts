import Battle from "../src/models/battle";
import Card from "../src/models/card";
import Room from "../src/models/room";
import SpellCard from "../src/models/spellCard";
import User, {UserState} from "../src/models/user";
import UserProperty from "../src/models/userProperty";

import * as cardData from "./cards";
import {seedData} from "./data";
import {dbInit} from "./dbInit";

const createRooms = (rooms: Room[]) => {
  return Room.bulkCreate(rooms);
};

const createUsers = async (rooms: Room[]) => {
  const promises: User[] = [];
  const opt = {
    save: false,
  };

  for (const user of seedData.users) {
    const us = User.build(user);
    promises.push(us);
  }

  promises[0].$set("room", rooms[0], opt);
  promises[1].$set("room", rooms[0], opt);
  promises[2].$set("room", rooms[0], opt);

  const users: User[] = [];
  for (const promise of promises) {
    const user = await promise.save();
    users.push(user);
  }
  return users;
};

let createCards: () => Promise<void>;
// @ts-ignore
createCards = async () => {
    // create SpellCards
    // const spcards = cardData.cards.spell;
    const opt = {
        save: false,
    };
    const splCards = await Card.bulkCreate(cardData.cards.spell);

    for (const splCard of splCards) {
        for (const spellCard of cardData.spellCards) {
            if (splCard.cardNo === spellCard.cardNo) {
                console.log(splCard.toJSON());
                console.log(spellCard);
                const spc = new SpellCard(spellCard);
                // console.log(spc.toJSON());
                // spc.$set("card", splCard, opt);
                // console.log(spc.toJSON());
                await spc.save();
            }

        }
    }

    // create OtherCards
    const types = ["normal", "special"];
    for (const type of types) {
        await Card.bulkCreate((cardData.cards as any)[type]);
    }
};

const createUserProperty = async () => {
  return await UserProperty.bulkCreate(seedData.userProperty);
};

const createBattles = async (rooms: Room[], users: User[]) => {
  const battles: Battle[] = [];
  const opt = {
    save: false,
  };

  for (const battle of seedData.battles) {
    const btl = new Battle(battle);
    battles.push(btl);
  }

  battles[0].$set("room", rooms[0], opt);
  battles[0].$set("attacker", users[0], opt);
  await battles[0].save(); // new id
  await battles[0].$add("attacked", users[1]);
  return battles;
};

// @ts-ignore
(async () => {
  const sequelize = dbInit();
  if (process.env.NODE_ENV === "sqlite") {
    sequelize.query("PRAGMA foreign_keys = false;");
  } else {
    sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
  }
  await sequelize.sync({force: true});
  const rooms = await createRooms(seedData.rooms as Room[]);
  const users = await createUsers(rooms);
  const battles = await createBattles(rooms, users);
  const cards = await createCards();
  const uprops = await createUserProperty();
  if (process.env.NODE_ENV === "sqlite") {
    sequelize.query("PRAGMA foreign_keys = false;");
  } else {
    sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
  }
})();
