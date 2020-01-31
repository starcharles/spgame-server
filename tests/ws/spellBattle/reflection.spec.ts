import * as config from "config";

import {EVENTS} from "../../../src/interfaces/events";
import {ISpellAttackedMessage, ISpellResultMessage} from "../../../src/interfaces/message/spell/index";
import {SpellBattleState} from "../../../src/models/battle";
import {UserState} from "../../../src/models/user";
import UserProperty from "../../../src/models/userProperty";
import {BattleRepository} from "../../../src/repository/battleRepository";
import {Repository} from "../../../src/repository/index";
import {UserPropertyRepository} from "../../../src/repository/userPropertyRepository";
import {UserRepository} from "../../../src/repository/userRepository";
import {io, server} from "../../../src/server";
import {SocketConnectionService} from "../../dummyclient/socketConnectionService";
import {initializeDB} from "../../fixture/seed";
import {seedData} from "../../fixture/ws/spell/reflection";
import {getClientsCount, timeout} from "../../testUtil";

jest.setTimeout(10000);

const WAIT_TIME_MS = 400;
describe("reflection", () => {
    const url = "http://localhost:3000/";
    let socket: SocketIOClient.Socket;
    let socket2: SocketIOClient.Socket;
    let socket3: SocketIOClient.Socket;
    let conn1: SocketConnectionService;
    let conn2: SocketConnectionService;
    let conn3: SocketConnectionService;
    let srv: any;
    let userPropRepo: UserPropertyRepository;
    let userRepo: UserRepository;
    let btlRepo: BattleRepository;

    beforeAll(async () => {
        userPropRepo = Repository.getRepository("UserProperty") as UserPropertyRepository;
        userRepo = Repository.getRepository("User") as UserRepository;
        btlRepo = Repository.getRepository("Battle") as BattleRepository;

        srv = server.listen(3000);
    });

    afterAll(async () => {
        srv.close();
        await timeout(WAIT_TIME_MS);
    });

    beforeEach(async () => {
        await initializeDB(seedData);
        conn1 = new SocketConnectionService(url);
        conn2 = new SocketConnectionService(url);
        conn3 = new SocketConnectionService(url);

        socket = await conn1.createConnection({
            userId: 1,
            roomId: 1,
            userName: "user1",
            roomName: "room1",
        });

        socket2 = await conn2.createConnection({
            userId: 2,
            roomId: 1,
            userName: "user2",
            roomName: "room1",
        });

        socket3 = await conn3.createConnection({
            userId: 3,
            roomId: 2,
            userName: "user3",
            roomName: "room2",
        });
        await timeout(200);

    });

    afterEach(async () => {
        conn1.close();
        conn2.close();
        conn3.close();
        await timeout(500);
    });

    describe("in same room", () => {
        it("should succeed attacking by 'Rob' after spell battle is timeout ", async () => {
            expect(await getClientsCount(io.of("/"))).toEqual(3);
            const called = {
                call1: false,
                call2: false,
                call3: false,
            };

            socket2.once(EVENTS.CLIENT.SPELL_ATTACKED, (data: ISpellAttackedMessage) => {
                called.call1 = true;
                console.log("======= socket2  ==================");
                expect(data).toEqual({
                    battleId: 2,
                    userId: 1,
                    message: "spell_attacked",
                    cardNo: 1,
                    spellOption:
                        {
                            targetCardNo: 4,
                        },
                });
            });

            socket.once(EVENTS.CLIENT.SPELL_RESULT, (data: ISpellResultMessage) => {
                called.call2 = true;
                console.log("======= socket1  ==================");

                expect(data).toMatchObject({
                    result: "success",
                    cardNo: 1,
                    ownerId: 1,
                });
            });

            socket2.once(EVENTS.CLIENT.SPELL_RESULT, (data: ISpellResultMessage) => {
                called.call3 = true;
                console.log("======= socket2  ================");
                expect(data).toMatchObject({
                    result: "failure",
                    cardNo: 1,
                    ownerId: 1,
                });
            });

            conn1.sendAddUser();
            conn2.sendAddUser();

            conn1.spellBattleStart(1, 2, {
                targetCardNo: 4,
            });
            const battleTimeout = config.get<number>("battleTimeout");
            await timeout(battleTimeout + 1000);

            expect(called.call1).toBeTruthy();
            expect(called.call2).toBeTruthy();
            expect(called.call3).toBeTruthy();

            // battle state
            const btl = await btlRepo.getBattleById(2);

            // user state
            const user1 = await userRepo.getUserById(1);
            const user2 = await userRepo.getUserById(2);

            if (!btl || !user1 || !user2) {
                [btl, user1, user2].forEach((item) => {
                    expect(item).toBeDefined();
                });
                return;
            }
            expect(btl.state).toEqual(SpellBattleState.Finished);
            expect(user1.state).toEqual(UserState.Field);
            expect(user2.state).toEqual(UserState.Field);

            const prop1: UserProperty[] = await userPropRepo.getUserPropertiesByUserIdAndCardNo(1, 4);
            const prop2: UserProperty[] = await userPropRepo.getUserPropertiesByUserIdAndCardNo(2, 4);

            // check owner of cardNo = 4 does changes
            expect(prop1[0]).toBeDefined();
            expect(prop2[0]).not.toBeDefined();

            const rob = await userPropRepo.getUserPropertiesByUserIdAndCardNo(1, 1);
            // check spells deleted after used.
            expect(rob[0]).not.toBeDefined();
        });

        it("should reverse attack target by 'Reflection'", async () => {
            // expect(await getClientsCount(io.of("/"))).toEqual(3);
            const called = {
                call1: false,
                call2: false,
                call3: false,
            };

            socket2.once(EVENTS.CLIENT.SPELL_ATTACKED, (data: ISpellAttackedMessage) => {
                called.call1 = true;
                console.log("======= socket2  ==================");
                expect(data).toEqual({
                    battleId: 2,
                    userId: 1,
                    message: "spell_attacked",
                    cardNo: 1,
                    spellOption:
                        {
                            targetCardNo: 6,
                        },
                });
            });

            socket.once(EVENTS.CLIENT.SPELL_RESULT, (data: ISpellResultMessage) => {
                called.call2 = true;
                console.log("======= socket1  ==================");
                expect(data).toMatchObject({
                    result: "failure",
                    message: "spell failed by defense",
                });
            });

            socket2.once(EVENTS.CLIENT.SPELL_RESULT, (data: ISpellResultMessage) => {
                called.call3 = true;
                console.log("======= socket2  ================");
                expect(data).toMatchObject({
                    message: "spell defensed",
                    result: "success",
                });
            });

            conn1.sendAddUser();
            conn2.sendAddUser();

            // await timeout(500);
            conn1.spellBattleStart(1, 2, {
                targetCardNo: 6,
            });

            await timeout(200);
            // await timeout(500);

            conn2.spellResponse(2, 3, {});

            await timeout(200);
            expect(called.call1).toBeTruthy();
            expect(called.call2).toBeTruthy();
            expect(called.call3).toBeTruthy();

            // battle state
            const battle = await btlRepo.getBattleById(2);
            // user state
            const user1 = await userRepo.getUserById(1);
            const user2 = await userRepo.getUserById(2);

            if (!battle || !user1 || !user2) {
                [battle, user1, user2].forEach((item) => {
                    expect(item).toBeDefined();
                });
                return;
            }
            expect(battle.state).toEqual(SpellBattleState.Finished);
            expect(user1.state).toEqual(UserState.Field);
            expect(user2.state).toEqual(UserState.Field);

            const attackerUProperty = await userPropRepo.getUserPropertiesByUserId(1);
            const defenserUProperty = await userPropRepo.getUserPropertiesByUserId(2);

            const cardNos1 = attackerUProperty.map((uprop) => {
                return uprop.cardNo;
            });

            const cardNos2 = defenserUProperty.map((uprop) => {
                return uprop.cardNo;
            });

            // check owner of cardNo = 4 does not change
            expect(cardNos1).not.toEqual(expect.arrayContaining([6]));
            expect(cardNos2).toEqual(expect.arrayContaining([6, 6]));

            // check spells deleted after used.
            expect(cardNos1).not.toEqual(expect.arrayContaining([1]));
            expect(cardNos2).not.toEqual(expect.arrayContaining([3]));
        });
        it("should fail to reverse attack if there is not target card.", async () => {

            conn1.sendAddUser();
            conn2.sendAddUser();

            // await timeout(500);
            conn1.spellBattleStart(1, 2, {
                targetCardNo: 7,
            });

            await timeout(200);
            // await timeout(500);

            conn2.spellResponse(2, 3, {});

            await timeout(200);
            // battle state
            const battle = await btlRepo.getBattleById(2);
            // user state
            const user1 = await userRepo.getUserById(1);
            const user2 = await userRepo.getUserById(2);

            if (!battle || !user1 || !user2) {
                [battle, user1, user2].forEach((item) => {
                    expect(item).toBeDefined();
                });
                return;
            }
            expect(battle.state).toEqual(SpellBattleState.Finished);
            expect(user1.state).toEqual(UserState.Field);
            expect(user2.state).toEqual(UserState.Field);

            const attackerUProperty = await userPropRepo.getUserPropertiesByUserId(1);
            const defenserUProperty = await userPropRepo.getUserPropertiesByUserId(2);

            const cardNos1 = attackerUProperty.map((uprop) => {
                return uprop.cardNo;
            });

            const cardNos2 = defenserUProperty.map((uprop) => {
                return uprop.cardNo;
            });

            // check owner of cardNo = 4 does not change
            // expect(cardNos1).not.toEqual(expect.arrayContaining([6]));
            // expect(cardNos2).toEqual(expect.arrayContaining([6, 6]));

            // check spells deleted after used.
            expect(cardNos1).not.toEqual(expect.arrayContaining([1]));
            expect(cardNos2).not.toEqual(expect.arrayContaining([3]));

        });
    });
});
