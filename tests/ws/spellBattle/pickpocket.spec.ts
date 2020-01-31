import {EVENTS} from "../../../src/interfaces/events";
import {ISpellAttackedMessage, ISpellResultMessage} from "../../../src/interfaces/message/spell";
import {SpellBattleState} from "../../../src/models/battle";
import {UserState} from "../../../src/models/user";
import UserProperty from "../../../src/models/userProperty";
import {Repository} from "../../../src/repository";
import {BattleRepository} from "../../../src/repository/battleRepository";
import {UserPropertyRepository} from "../../../src/repository/userPropertyRepository";
import {UserRepository} from "../../../src/repository/userRepository";
import {io, server} from "../../../src/server";
import {SocketConnectionService} from "../../dummyclient/socketConnectionService";
import {initializeDB} from "../../fixture/seed";
import {seedData} from "../../fixture/ws/spell/pickpocket";
import {getClientsCount, timeout} from "../../testUtil";

jest.setTimeout(30000);

const WAIT1 = 200;
const WAIT2 = 1000;
describe("spell: PickPocket test", () => {
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
    let connections: SocketIOClient.Socket[] = [];

    beforeAll(async () => {
        userPropRepo = Repository.getRepository("UserProperty") as UserPropertyRepository;
        userRepo = Repository.getRepository("User") as UserRepository;
        btlRepo = Repository.getRepository("Battle") as BattleRepository;

        srv = server.listen(3000);

        await timeout(1000);
    });
    //
    afterAll(async () => {
        srv.close();
        await timeout(1000);
        await timeout(WAIT2);
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
        if (!socket || !socket2 || !socket3) {
            return;
        }
        connections.push(socket);
        connections.push(socket2);
        connections.push(socket3);
        await timeout(WAIT1);

    });

    afterEach(async () => {
        connections.forEach((conn) => {
            conn.disconnect();
        });
        connections = [];
    });

    describe("different room", () => {
        it("should not attack user in the different roomId ", async () => {
            expect(await getClientsCount(io.of("/"))).toEqual(3);

            let called = false;
            conn1.sendAddUser();
            conn2.sendAddUser();
            conn3.sendAddUser();

            if (!socket) {
                expect(socket).toBeDefined();
                return;
            }
            socket.once(EVENTS.CLIENT.SPELL_RESULT, async (data: ISpellResultMessage) => {
                called = true;
                expect(data).toEqual({
                    result: "failure",
                    message: "room is not the same",
                });
            });

            await timeout(100);
            conn1.spellBattleStart(1, 3, {
                targetCardNo: 3,
            });
            await timeout(3000);

            expect(called).toBeTruthy();
        });
    });

    describe("in same room", () => {
        it("should succeed attacking by 'PickPocket' after spell battle is timeout ", async () => {
            expect(await getClientsCount(io.of("/"))).toEqual(3);

            const called = {
                call1: false,
                call2: false,
                call3: false,
            };

            if (!socket) {
                expect(socket).toBeDefined();
                return;
            }
            if (!socket2) {
                expect(socket2).toBeDefined();
                return;
            }
            socket2.once(EVENTS.CLIENT.SPELL_ATTACKED, (data: ISpellAttackedMessage) => {
                called.call1 = true;
                console.log("======= socket2  ==================");
                expect(data).toEqual({
                    battleId: 2,
                    userId: 1,
                    message: "spell_attacked",
                    cardNo: 7, // pickpocket
                    spellOption: {},
                });
            });

            socket.once(EVENTS.CLIENT.SPELL_RESULT, (data: ISpellResultMessage) => {
                called.call2 = true;
                console.log("======= socket1  ==================");

                expect(data).toMatchObject({
                    result: "success",
                });
            });

            socket2.once(EVENTS.CLIENT.SPELL_RESULT, (data: ISpellResultMessage) => {
                called.call3 = true;
                console.log("======= socket2  ================");
                expect(data).toMatchObject({
                    result: "failure",
                });
            });

            const before1: UserProperty[] = await userPropRepo.getUserPropertiesByUserId(1);
            const before2: UserProperty[] = await userPropRepo.getUserPropertiesByUserId(2);

            conn1.sendAddUser();
            conn2.sendAddUser();

            await timeout(500);

            conn1.spellBattleStart(7, 2, {});

            await timeout(2500);

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

            const after1: UserProperty[] = await userPropRepo.getUserPropertiesByUserId(1);
            const after2: UserProperty[] = await userPropRepo.getUserPropertiesByUserId(2);

            expect(after1.length - before1.length).toEqual(0);
            expect(after2.length - before2.length).toEqual(-1);

            const pickpocket: UserProperty[] = await userPropRepo.getUserPropertiesByUserIdAndCardNo(1, 7);
            // check spells deleted after used.
            expect(pickpocket[0]).not.toBeDefined();

            const cardNos1 = after1.map((uprop) => {
                return uprop.cardNo;
            });

            // check spells deleted after used.
            expect(cardNos1).not.toEqual(expect.arrayContaining([7]));
        });

        it("should fail attacking by 'PickPocket' when spell battle is defensed ", async () => {
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
                    message: EVENTS.CLIENT.SPELL_ATTACKED,
                    cardNo: 7,
                    spellOption:
                        {},
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

            const before1: UserProperty[] = await userPropRepo.getUserPropertiesByUserId(1);
            const before2: UserProperty[] = await userPropRepo.getUserPropertiesByUserId(2);

            await timeout(WAIT1);
            conn1.sendAddUser();
            conn2.sendAddUser();

            await timeout(WAIT1);
            conn1.spellBattleStart(7, 2, {});

            await timeout(WAIT1);

            conn2.spellResponse(2, 2, {});

            await timeout(WAIT1);

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

            const after1: UserProperty[] = await userPropRepo.getUserPropertiesByUserId(1);
            const after2: UserProperty[] = await userPropRepo.getUserPropertiesByUserId(2);

            expect(after1.length - before1.length).toEqual(-1);
            expect(after2.length - before2.length).toEqual(-1);

            // check spells deleted after used.
            expect(cardNos1).not.toEqual(expect.arrayContaining([7]));
            expect(cardNos2).not.toEqual(expect.arrayContaining([2]));
        });
    });
});
