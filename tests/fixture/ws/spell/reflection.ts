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
        roomId: 1,
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
        cardNo: 1,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 1,
        cardNo: 2,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 1,
        cardNo: 3,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 1,
        cardNo: 4,
        pocketType: PocketType.Normal,
        isFake: false,
    },
    {
        userId: 1,
        cardNo: 5,
        pocketType: PocketType.Normal,
        isFake: false,
    },
    {
        userId: 1,
        cardNo: 6,
        pocketType: PocketType.Special,
        isFake: false,
    },
    // user2
    {
        userId: 2,
        cardNo: 1,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 2,
        cardNo: 2,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 2,
        cardNo: 3,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 2,
        cardNo: 4,
        pocketType: PocketType.Normal,
        isFake: false,
    },
    {
        userId: 2,
        cardNo: 5,
        pocketType: PocketType.Normal,
        isFake: false,
    },
    {
        userId: 2,
        cardNo: 6,
        pocketType: PocketType.Special,
        isFake: false,
    },
    {
        userId: 2,
        cardNo: 7,
        pocketType: PocketType.Special,
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
        cardNo: 1,
        rank: CardRank.B,
        cardType: CardType.Spell,
        limit: 100,
        isFake: false,
    }, {
        name: "defensiveWall",
        nameJa: "防壁",
        cardNo: 2,
        rank: CardRank.D,
        cardType: CardType.Spell,
        limit: 100,
        isFake: false,
    }, {
        name: "reflection",
        nameJa: "反射",
        cardNo: 3,
        rank: CardRank.E,
        cardType: CardType.Spell,
        limit: 120,
        isFake: false,
    },
    {
        cardNo: 4,
        name: "stone",
        nameJa: "石ころ",
        rank: CardRank.Z,
        cardType: CardType.Item,
        limit: 100000,
        isFake: false,
    },
    {
        cardNo: 5,
        name: "garbage",
        nameJa: "ゴミクズ",
        rank: CardRank.Z,
        cardType: CardType.Item,
        limit: 100000,
        isFake: false,
    },
    {
        cardNo: 6,
        name: "mitsurin",
        nameJa: "一坪の密林",
        rank: CardRank.SS,
        cardType: CardType.Item,
        limit: 3,
        isFake: false,
    },
];

const spellCards = [
    {
        cardNo: 1,
        spellType: SpellType.Attack,
        targetType: TargetType.Short,
        isInteractive: true,
        isMultipleTarget: false,
    },
    {
        cardNo: 2,
        spellType: SpellType.Defense,
        targetType: TargetType.Short,
        isInteractive: true,
        isMultipleTarget: false,
    },
    {
        cardNo: 3,
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
