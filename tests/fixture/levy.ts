import Battle, {BattleType, SpellBattleState} from "../../src/models/battle";
import {CardRank, CardType, default as Card} from "../../src/models/card";
import {SpellType, TargetType} from "../../src/models/spellCard";
import User, {UserState} from "../../src/models/user";
import UserProperty, {PocketType} from "../../src/models/userProperty";

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
        online: true,
    },
    {
        name: "user2",
        roomId: 1,
        socketId: "",
        state: UserState.Field,
        location: "somewhere",
        online: true,
    },
    {
        name: "user3",
        roomId: 1,
        socketId: "",
        state: UserState.Field,
        location: "somewhere",
        online: true,
    },
    {
        name: "user4",
        roomId: 1,
        socketId: "",
        state: UserState.Battle,
        location: "somewhere",
        online: true,
    },
    {
        name: "user5",
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
    {
        userId: 1,
        cardNo: 8,
        pocketType: PocketType.Spell,
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
    // user3
    {
        userId: 3,
        cardNo: 1,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 3,
        cardNo: 2,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 3,
        cardNo: 3,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    // user4
    {
        userId: 4,
        cardNo: 1,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 4,
        cardNo: 2,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 4,
        cardNo: 3,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    // user5
    {
        userId: 5,
        cardNo: 1,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 5,
        cardNo: 2,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 5,
        cardNo: 3,
        pocketType: PocketType.Spell,
        isFake: false,
    },
];

const battles = [
    {
        id: 1,
        type: BattleType.Spell,
        state: SpellBattleState.Finished,
        action: "Rob",
        attackerId: 1,
    },
];

const cards = [
    {
        // cardNo:1,
        name: "rob",
        nameJa: "強奪",
        cardNo: 1,
        rank: CardRank.B,
        cardType: CardType.Spell,
        limit: 100,
        isFake: false,
    }, {
        // cardNo:2,
        name: "defensiveWall",
        nameJa: "防壁",
        cardNo: 2,
        rank: CardRank.D,
        cardType: CardType.Spell,
        limit: 100,
        isFake: false,
    }, {
        // cardNo:3,
        name: "reflection",
        nameJa: "反射",
        cardNo: 3,
        rank: CardRank.E,
        cardType: CardType.Spell,
        limit: 120,
        isFake: false,
    },
    {
        // cardNo:4,
        name: "stone",
        nameJa: "石ころ",
        rank: CardRank.Z,
        cardNo: 4,
        cardType: CardType.Item,
        limit: 100000,
        isFake: false,
    },
    {
        // cardNo:5,
        name: "garbage",
        nameJa: "ゴミクズ",
        rank: CardRank.Z,
        cardNo: 5,
        cardType: CardType.Item,
        limit: 100000,
        isFake: false,
    },
    {
        // cardNo:6,
        name: "mitsurin",
        nameJa: "一坪の密林",
        rank: CardRank.SS,
        cardNo: 6,
        cardType: CardType.Item,
        limit: 3,
        isFake: false,
    }, {
        // cardNo:7,
        name: "pickPocket",
        nameJa: "掏摸(ピックポケット)",
        cardNo: 7,
        rank: CardRank.F,
        cardType: CardType.Spell,
        limit: 170,
        isFake: false,
    }, {
        // cardNo:8,
        name: "levy",
        nameJa: "Levy",
        cardNo: 8,
        rank: CardRank.F,
        cardType: CardType.Spell,
        limit: 170,
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
    {
        cardNo: 7,
        spellType: SpellType.Attack,
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
