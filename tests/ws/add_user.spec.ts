import {SocketConnectionService} from "../dummyclient/socketConnectionService";

import {initializeDB} from "../fixture/seed";
import {seedData} from "../fixture/ws/data1";
import {runServer, timeout} from "../testUtil";

jest.setTimeout(10000);

describe("Websocket test", () => {
    const url = "http://localhost:3000/";
    let connections: SocketIOClient.Socket[] = [];

    describe("2 user connections", () => {
        let socket: SocketIOClient.Socket;
        let socket2: SocketIOClient.Socket;
        let conn1: SocketConnectionService;
        let conn2: SocketConnectionService;
        let server: any;

        beforeAll(async () => {
            await initializeDB(seedData);
            // await timeout(1000);
            conn1 = new SocketConnectionService(url);
            conn2 = new SocketConnectionService(url);

            server = await runServer(3000);
        });

        afterAll(async () => {
            for (const conn of connections) {
                conn.close();
            }
            connections = [];
            server.close();
        });

        it("should notify login, user_joined", async () => {
            socket = await conn1.createConnection({
                userId: 1,
                roomId: 1,
                userName: "user1",
                roomName: "room1",
            });
            connections.push(socket);
            conn1.sendAddUser();

            socket.once("connect", () => {
                console.log(socket.id);
                expect(socket).toBeDefined();
            });

            socket.once("user_joined", (data) => {
                console.log(data);
                expect(data).toEqual({
                        userId: 1,
                        userName: "user1",
                    });
            });

            await timeout(500);
        });

        it("should notify 2 users' login, user_joined", async () => {
            socket2 = await conn2.createConnection({
                userId: 2,
                roomId: 1,
                userName: "user2",
                roomName: "room1",
            });
            connections.push(socket2);

            conn1.sendAddUser();
            conn2.sendAddUser();

            socket.once("user_joined", (data) => {
                console.log(data);
                expect(data).toEqual({
                    userId: 1,
                    userName: "user1",
                });
            });

            socket2.once("user_joined", (data) => {
                console.log(data);
                expect(data).toEqual({
                    userId: 2,
                    userName: "user2",
                });
            });

            await timeout(500);
        });
    });
});
