import * as IO from "socket.io";

import {SocketConnectionService} from "../dummyclient/socketConnectionService";

import {io} from "../../src/server";
import {initializeDB} from "../fixture/seed";
import {seedData} from "../fixture/ws/data1";
import {runServer, timeout} from "../testUtil";

jest.setTimeout(10000);

describe("Websocket message test", () => {

    describe("connection", () => {
        const url = "http://localhost:3000/";

        describe("1 connection", () => {
            let socket: SocketIOClient.Socket;
            let conn1: SocketConnectionService;
            let server: any;
            const connections: SocketIOClient.Socket[] = [];

            beforeAll(async () => {
                await initializeDB(seedData);
                server = await runServer(3000);
            });

            afterAll(async () => {
                server.close();
            });

            beforeEach(async () => {
                conn1 = new SocketConnectionService(url);
                socket = await conn1.createConnection({
                    userId: 1,
                    roomId: 1,
                    userName: "user1",
                    roomName: "room1",
                });
                connections.push(socket);
            });

            afterEach(() => {
                for (const conn of connections) {
                    conn.close();
                }
            });

            it("establish connection", async () => {
                let called = false;
                let called2 = false;
                socket.once("connect", () => {
                    called = true;
                    console.log(socket.id);
                    expect(socket).toBeDefined();
                });

                io.on("connection", (mySocket) => {
                    called2 = true;
                    expect(mySocket).toBeDefined();
                });

                await timeout(500);
                expect(server.connections).toBe(1);
                expect(called).toBeTruthy();
                expect(called2).toBeTruthy();
            });

            it("should add_user", async () => {
                let called = false;
                io.on("connection", (mySocket) => {
                    // ioServer.on("connection", (mySocket) => {
                    expect(mySocket).toBeDefined();
                    mySocket.once("add_user", (data) => {
                        called = true;
                        console.log(data);
                        expect(data).toEqual({
                            userId: 1,
                            roomId: 1,
                            userName: "user1",
                            roomName: "room1",
                        });
                    });
                });

                await timeout(500);
                expect(called).toBeTruthy();
            });
        });
    });
});
