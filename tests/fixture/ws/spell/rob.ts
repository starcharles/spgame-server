import Battle, {BattleType, SpellBattleState} from "../../../../src/models/battle";
import {CardRank, CardType, default as Card} from "../../../../src/models/card";
import {SpellType, TargetType} from "../../../../src/models/spellCard";
import User, {UserState} from "../../../../src/models/user";
import UserProperty, {PocketType} from "../../../../src/models/userProperty";

const rooms = [
    {
        name: "room1",

    }, {
        name: "room2",
    },
];

const users = [
    {
        name: "user1",
        roomId: 1,
        socketId: "",
        state: UserState.Field,
        location: "aaa",
        online: false,
    },
    {
        name: "user2",
        roomId: 1,
        socketId: "",
        state: UserState.Field,
        location: "somewhere",
        online: false,

    },
    {
        name: "user3",
        roomId: 2,
        socketId: "",
        state: UserState.Field,
        location: "somewhere",
        online: false,
    },
];

const userProperty = [
    // user1
    {
        userId: 1,
        cardNo: 1021,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 1,
        cardNo: 1003,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 1,
        cardNo: 10000,
        pocketType: PocketType.Normal,
        isFake: false,
    },
    {
        userId: 1,
        cardNo: 1003,
        pocketType: PocketType.Normal,
        isFake: false,
    },
    // user2
    {
        userId: 2,
        cardNo: 1021,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 2,
        cardNo: 1003,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 2,
        cardNo: 10000,
        pocketType: PocketType.Normal,
        isFake: false,
    },
    {
        userId: 2,
        cardNo: 10001,
        pocketType: PocketType.Normal,
        isFake: false,
    },
    // user2
    {
        userId: 3,
        cardNo: 1021,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 3,
        cardNo: 1003,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 3,
        cardNo: 10000,
        pocketType: PocketType.Normal,
        isFake: false,
    },
    {
        userId: 3,
        cardNo: 10001,
        pocketType: PocketType.Normal,
        isFake: false,
    },
];

const battles = [
    {
        type: BattleType.Spell,
        state: SpellBattleState.BattleStart,
        action: "Rob",
    },
];

const cards = [
    {
        name: "rob",
        nameJa: "強奪",
        cardNo: 1021,
        rank: CardRank.B,
        cardType: CardType.Spell,
        limit: 100,
        isFake: false,
    }, {
        name: "defensiveWall",
        nameJa: "防壁",
        cardNo: 1003,
        rank: CardRank.D,
        cardType: CardType.Spell,
        limit: 100,
        isFake: false,
    },
    {
        name: "stone",
        nameJa: "石ころ",
        rank: CardRank.Z,
        cardNo: 10000,
        cardType: CardType.Item,
        limit: 100000,
        isFake: false,
    },
    {
        name: "garbage",
        nameJa: "ゴミクズ",
        rank: CardRank.Z,
        cardNo: 10001,
        cardType: CardType.Item,
        limit: 100000,
        isFake: false,
    },
];

const spellCards = [
    {
        cardNo: 1021,
        spellType: SpellType.Attack,
        targetType: TargetType.Short,
        isInteractive: true,
        isMultipleTarget: false,
    },
    {
        cardNo: 1003,
        spellType: SpellType.Defense,
        targetType: TargetType.Short,
        isInteractive: true,
        isMultipleTarget: false,
    },
];

export const seedData = {
    rooms,
    users,
    cards,
    spellCards,
    userProperty,
    battles,
};
