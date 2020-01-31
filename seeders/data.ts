import Battle, {BattleType, SpellBattleState} from "../src/models/battle";
import {CardRank, CardType, default as Card} from "../src/models/card";
import {SpellType, TargetType} from "../src/models/spellCard";
import User, {UserState} from "../src/models/user";
import UserProperty, {PocketType} from "../src/models/userProperty";

const rooms = [
    {
        name: "room1",

    }, {
        name: "room2",
    },
];

const users = [
    {
        id: 1,
        name: "ニッグ",
        roomId: 1,
        socketId: "",
        state: UserState.Field,
        location: "aaa",
        uid: "08skN5tkoQbSYaKWPrSPSYg3dPp2",
        online: false,
        isAdmin: true,
    },
    {
        id: 2,
        name: "バッテラ",
        roomId: 1,
        socketId: "",
        state: UserState.Field,
        location: "aaa",
        online: false,
        uid: "wP0GRlBOCbcGXJod4wBQDjW8yhA3",
        isAdmin: true,
    },
    {
        id: 3,
        name: "Kuroro",
        roomId: 1,
        socketId: "",
        state: UserState.Field,
        location: "aaa",
        online: false,
        uid: "ccccccc",
    },
    // {
    //     id: 4,
    //     name: "キルア",
    //     roomId: 1,
    //     socketId: "",
    //     state: UserState.Field,
    //     location: "aaa",
    //     online: true,
    // },
    // {
    //     id: 5,
    //     name: "ゲンスルー",
    //     socketId: "",
    //     state: UserState.Field,
    //     location: "aaa",
    //     online: false,
    // },
    // {
    //     name: "user1",
    //     state: UserState.Field,
    //     location: "somewhere",
    //     online: false,
    // },
    // {
    //     name: "user2",
    //     state: UserState.Field,
    //     location: "somewhere",
    //     online: false,
    //
    // },
    // {
    //     name: "user3",
    //     state: UserState.Field,
    //     location: "somewhere",
    //     online: false,
    // },
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
        cardNo: 1004,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 1,
        cardNo: 1018,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 1,
        cardNo: 1006,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 1,
        cardNo: 1500,
        pocketType: PocketType.Normal,
        isFake: false,
    },
    {
        userId: 1,
        cardNo: 1501,
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
        cardNo: 1004,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 2,
        cardNo: 1018,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 2,
        cardNo: 1006,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 2,
        cardNo: 1,
        pocketType: PocketType.Special,
        isFake: false,
    },
    // user3
    {
        userId: 3,
        cardNo: 1021,
        pocketType: PocketType.Spell,
        isFake: false,
    },
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
        cardNo: 1004,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 3,
        cardNo: 1018,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 3,
        cardNo: 1006,
        pocketType: PocketType.Spell,
        isFake: false,
    },
    {
        userId: 3,
        cardNo: 1,
        pocketType: PocketType.Special,
        isFake: false,
    },
];

const battles = [
    {
        type: BattleType.Spell,
        state: SpellBattleState.Finished,
        action: "rob",
    },
    // {
    //     type: BattleType.Spell,
    //     state: SpellBattleState.WaitResponse,
    //     action: "rob",
    // },
];

export const seedData = {
    rooms,
    users,
    // cards,
    // spellCards,
    userProperty,
    battles,
};
