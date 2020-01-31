import Battle, {BattleType, SpellBattleState} from "../../../src/models/battle";
import {CardRank, CardType, default as Card} from "../../../src/models/card";
import {SpellType, TargetType} from "../../../src/models/spellCard";
import User, {UserState} from "../../../src/models/user";
import UserProperty, {PocketType} from "../../../src/models/userProperty";

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
        state: UserState.Field,
        location: "somewhere",
        online: false,
    },
    {
        name: "user2",
        state: UserState.Field,
        location: "somewhere",
        online: false,

    },
    {
        name: "user3",
        state: UserState.Field,
        location: "somewhere",
        online: false,
    },
];

const cards = [{
    name: "rob",
    cardNo: 1021,
    rank: CardRank.B,
    cardType: CardType.Spell,
    limit: 100,
    isFake: false,
}, {
    name: "defensiveWall",
    cardNo: 1003,
    rank: CardRank.D,
    cardType: CardType.Spell,
    limit: 100,
    isFake: false,
}];

const spellCards = [
    {
        spellType: SpellType.Attack,
        targetType: TargetType.Short,
        isInteractive: true,
        isMultipleTarget: false,
    },
    {
        spellType: SpellType.Defense,
        targetType: TargetType.Short,
        isInteractive: true,
        isMultipleTarget: false,
    },
];

const userProperty = [{
    userId: 1,
    cardNo: 1021,
    pocketType: PocketType.Spell,
    isFake: false,
}, {
    userId: 2,
    cardNo: 1003,
    pocketType: PocketType.Spell,
    isFake: false,
}];

const battles = [
    {
        type: BattleType.Spell,
        state: SpellBattleState.BattleStart,
        action: "Rob",
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
