import {Sequelize} from "sequelize-typescript";

import {SpellOption} from "../../src/interfaces/message/spell";
import {BattleType, default as Battle, SpellBattleState} from "../../src/models/battle";
import {CardRank, CardType, default as Card} from "../../src/models/card";
import Room from "../../src/models/room";
import {default as SpellCard, SpellType, TargetType} from "../../src/models/spellCard";
import User, {UserState} from "../../src/models/user";
import UserProperty, {PocketType} from "../../src/models/userProperty";
import {Repository} from "../../src/repository";
import {UserPropertyRepository} from "../../src/repository/userPropertyRepository";
import {UserRepository} from "../../src/repository/userRepository";
import {SpellExecutor} from "../../src/service/spellExecutor";
import {SpellResultLogger} from "../../src/service/spellResultLogger";
import {seedData as levyData} from "../fixture/levy";
import {clean, initializeDB} from "../fixture/seed";

// const mockSaveResult = jest.fn()
//     .mockImplementation(() => {
//         return true;
//     });

jest.mock("../../src/service/spellResultLogger");

describe("SpellExecutor test", () => {
    describe("Spell: Rob", () => {
        let users: User[];
        let sequelize: Sequelize;
        const userPropertyRepo = Repository.getRepository("UserProperty") as UserPropertyRepository;

        beforeEach(async () => {
            // SpellResultLogger.mockImplementation(() => {
            //     return {
            //         saveResult: () => {
            //             return true;
            //         },
            //     };
            // });

        });

        beforeEach(async () => {
            sequelize = await clean();
            if (process.env.NODE_ENV === "sqlite") {
                await sequelize.query("PRAGMA foreign_keys = false;");
            } else {
                await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
            }

            await Room.bulkCreate([
                {name: "room1"},
            ]);
            users = await User.bulkCreate([
                {roomId: 1, socketId: "", name: "user1", state: UserState.Field, location: "somewhere", online: false},
                {roomId: 1, socketId: "", name: "user2", state: UserState.Field, location: "somewhere", online: false},
            ]);

            await Card.bulkCreate([
                {name: "rob", cardNo: 1021, rank: CardRank.B, cardType: CardType.Spell, limit: 100, isFake: false},
                {
                    name: "defensiveWall",
                    cardNo: 1003,
                    rank: CardRank.D,
                    cardType: CardType.Spell,
                    limit: 100,
                    isFake: false,
                },
                {name: "item1", cardNo: 1100, rank: CardRank.D, cardType: CardType.Item, limit: 100, isFake: false},
            ]);

            await SpellCard.bulkCreate([
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
                }]);

            await UserProperty.bulkCreate([{
                userId: 1,
                cardNo: 1021,
                pocketType: PocketType.Spell,
                isFake: false,
            }, {
                userId: 2,
                cardNo: 1003,
                pocketType: PocketType.Spell,
                isFake: false,
            }, {
                userId: 2,
                cardNo: 3,
                pocketType: PocketType.Item,
                isFake: false,
            }]);
            if (process.env.NODE_ENV === "sqlite") {
                await sequelize.query("PRAGMA foreign_keys = false;");

            } else {
                await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
            }

        });

        afterEach(async () => {
            // await clean();
            await sequelize.close();
        });

        it("should fail Rob with non-existing target cardNo", async () => {
            const attacker = users[0];
            const targetUser = users[1];
            const up = await userPropertyRepo.getUserPropertyById(3) as UserProperty;

            expect(up).not.toBeNull();
            expect(up!.userId).toEqual(targetUser.id);

            const btl = new Battle({
                roomId: 1,
                type: 1,
                state: 1,
                action: "aaa",
                attackerId: attacker.id,
            });
            const resultLogger = new SpellResultLogger(btl, up.card);
            const spellExecutor = new SpellExecutor(attacker, [targetUser], resultLogger);
            const spellOption: SpellOption = {
                targetCardNo: 4,
            };

            // spellId:1 name: rob
            await spellExecutor.setAttack(1021, spellOption);
            await spellExecutor.run();

            const up2 = await userPropertyRepo.getUserPropertyById(3);
            expect(up2).not.toBeNull();
            expect(up2!.userId).toEqual(targetUser.id);
        });

        it("should execute Rob without defense", async () => {
            const up = await userPropertyRepo.getUserPropertyById(3) as UserProperty;
            const user1 = users[0];
            const targetUser = users[1];

            expect(up).not.toBeNull();
            expect(up!.userId).toEqual(targetUser.id);

            const btl = new Battle({
                roomId: 1,
                type: 1,
                state: 1,
                action: "aaa",
                attackerId: user1.id,
            });
            const resultLogger = new SpellResultLogger(btl, up.card);
            const spellExecutor = new SpellExecutor(user1, [targetUser], resultLogger);
            const spellOption: SpellOption = {
                targetCardNo: 3,
            };

            // cardNo:1021 name: rob
            await spellExecutor.setAttack(1021, spellOption);
            await spellExecutor.run();

            const up2 = await userPropertyRepo.getUserPropertyById(3);
            expect(up2).not.toBeNull();
            expect(up2!.userId).toEqual(user1.id);
            // used card sholud be deleted.
            const up3 = await userPropertyRepo.getUserPropertyById(1);
            expect(up3).toBeNull();
        });

        it("should not execute Rob with DefensiveWall", async () => {
            const up = await userPropertyRepo.getUserPropertyById(3) as UserProperty;
            const user1 = users[0];
            const targetUser = users[1];

            expect(up).not.toBeNull();
            expect(up!.userId).toEqual(targetUser.id);

            const btl = new Battle({
                roomId: 1,
                type: 1,
                state: 1,
                action: "aaa",
                attackerId: user1.id,
            });
            const resultLogger = new SpellResultLogger(btl, up.card);
            const spellExecutor = new SpellExecutor(user1, [targetUser], resultLogger);
            const spellOption: SpellOption = {
                targetCardNo: 3,
            };

            // cardNo:1021 name: rob
            await spellExecutor.setAttack(1021, spellOption);
            // cardNo:1003 name: defensiveWall
            await spellExecutor.setDefense(1003);
            await spellExecutor.run();

            const up2 = await userPropertyRepo.getUserPropertyById(3);
            expect(up2).not.toBeNull();
            expect(up2!.userId).toEqual(targetUser.id);
            const up3 = await userPropertyRepo.getUserPropertyById(1);
            expect(up3).toBeNull();
            const up4 = await userPropertyRepo.getUserPropertyById(2);
            expect(up4).toBeNull();
        });
    });

    describe("Spell: Levy", () => {
        let sequelize: Sequelize;
        let userPropertyRepo: UserPropertyRepository;
        let userRepo: UserRepository;

        beforeEach(async () => {
            userPropertyRepo = Repository.getRepository("UserProperty");
            userRepo = Repository.getRepository("User");
            sequelize = await initializeDB(levyData);
        });

        afterEach(async () => {
            await sequelize.close();
        });

        it("should execute Levy", async () => {
            // attacker has Levy
            const attacker = await userRepo.getUserById(1) as User;
            const up1 = attacker.userProperties;

            expect(up1).not.toBeNull();
            expect(up1.length).toBe(7);
            const levy = up1.filter((up) => {
                // Levy is cardNo = 8
                return up.cardNo === 8;
            });
            expect(levy.length).toBe(1);

            const allUsers = levyData.users;
            expect(allUsers.length).toBe(5);

            // online users
            // noinspection TypeScriptValidateTypes
            const onlines = await User.findAll({
                where: {
                    online: true,
                },
                include: [{
                    model: UserProperty,
                }],
            });

            expect(onlines.length).toBe(4);

            const attacked = onlines.filter((user) => {
                return user.id !== attacker!.id;
            });
            const ids = attacked.map((user) => {
                return user.id;
            });
            expect(attacked.length).toEqual(3);
            expect(ids).not.toContain(1);

            const btl = new Battle({
                roomId: 1,
                type: 1,
                state: 1,
                action: "aaa",
                attackerId: attacker!.id,
            });
            const resultLogger = new SpellResultLogger(btl, levy[0].card);
            const spellExecutor = new SpellExecutor(attacker, attacked, resultLogger);
            // const spellOption: SpellOption = {};
            //
            // // cardNo:8 levy in fixture
            await spellExecutor.setAttack(8, null);
            await spellExecutor.run();
            //
            const attackerAfterRunSpell = await userRepo.getUserById(1) as User;
            const props = attackerAfterRunSpell.userProperties;

            // Levy disappears after spell ran
            expect(props).not.toBeNull();
            expect(props.length).toBe(7 - 1 + 3);
            const levy2 = props.filter((up) => {
                // Levy is cardNo = 8
                return up.cardNo === 8;
            });
            expect(levy2.length).toBe(0);

            // user2
            const user2 = await userRepo.getUserById(2);
            expect(user2.userProperties.length).toBe(5);
            // user3
            const user3 = await userRepo.getUserById(3);
            expect(user3.userProperties.length).toBe(2);

            // user4
            const user4 = await userRepo.getUserById(4);
            expect(user4.userProperties.length).toBe(2);

            // user5 is not affected.
            const user5 = await userRepo.getUserById(5);
            expect(user5.userProperties.length).toBe(3);
        });
    });
});
