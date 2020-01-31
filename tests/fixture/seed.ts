import {dbInit} from "../../seeders/dbInit";
import Battle from "../../src/models/battle";
import Card from "../../src/models/card";
import Room from "../../src/models/room";
import SpellCard from "../../src/models/spellCard";
import User from "../../src/models/user";
import UserProperty from "../../src/models/userProperty";

// let sequelize = require("../../src/main");

const createRooms = (rooms: Room[]) => {
    return Room.bulkCreate(rooms);
};

const createUsers = async (seedData: any, rooms: Room[]) => {
    const promises: User[] = [];
    const opt = {
        save: false,
    };

    for (const user of seedData.users) {
        const us = User.build(user);
        promises.push(us);
    }

    await promises[0].$set("room", rooms[0], opt);
    await promises[1].$set("room", rooms[0], opt);
    await promises[2].$set("room", rooms[1], opt);

    const users: User[] = [];
    for (const promise of promises) {
        const user = await promise.save();
        users.push(user);
    }
    return users;
};

const createCards = async (seedData: any) => {
    const cards = await Card.bulkCreate(seedData.cards);
    return cards;
};

const createSpellCards = async (seedData: any) => {
    const spells = await SpellCard.bulkCreate(seedData.spellCards);
    return spells;
};

const createUserProperties = async (seedData: any) => {
    return await UserProperty.bulkCreate(seedData.userProperty);
};

const createBattles = async (seedData: any, rooms: Room[], users: User[]) => {
    const btls: Battle[] = [];
    const opt = {
        save: false,
    };

    for (const battle of seedData.battles) {
        const btl = new Battle(battle);
        await btl.save();
        btls.push(btl);
    }

    btls[0].$set("room", rooms[0], opt);
    btls[0].$set("attacker", users[0], opt);
    btls[0].$set("attacked", [users[1]], opt);

    const btls2: Battle[] = [];
    for (const btl2 of btls2) {
        await btl2.save();
        btls2.push(btl2);
    }
    return btls2;
};

export async function initializeDB(data: any) {
    const seedData = data;
    const sequelize = dbInit();

    // 外部キー制約を一時的に解除
    if (process.env.NODE_ENV === "sqlite") {
        await sequelize.query("PRAGMA foreign_keys = false;");
    } else {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    }

    await sequelize.sync({force: true});
    const rooms = await createRooms(seedData.rooms as Room[]);
    const users = await createUsers(seedData, rooms);
    const battles = await createBattles(seedData, rooms, users);
    const cards = await createCards(seedData);
    const spells = await createSpellCards(seedData);
    const uprops = await createUserProperties(seedData);

    // 外部キー制約を戻す
    if (process.env.NODE_ENV === "sqlite") {
        await sequelize.query("PRAGMA foreign_keys = true;");
    } else {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
    }
    return sequelize;
}

export async function clean() {
    const sequelize = dbInit();
    await sequelize.sync({force: true});
    return sequelize;
}
