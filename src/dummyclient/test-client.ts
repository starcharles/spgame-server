import {rooms, users} from "./data/data";
import {SocketConnectionService} from "./socketConnectionService";

(async () => {

    const url = "http://localhost:3000/";
    const conn1 = new SocketConnectionService(url);
    const conn2 = new SocketConnectionService(url);
    const conn3 = new SocketConnectionService(url);

    await conn1.createConnection({
        userId: users[0].userId,
        roomId: rooms[0].roomId,
        userName: users[0].userName,
        roomName: rooms[0].roomName,
    });

    await conn2.createConnection({
        userId: users[1].userId,
        roomId: rooms[0].roomId,
        userName: users[1].userName,
        roomName: rooms[0].roomName,
    });

    await conn3.createConnection({
        userId: users[2].userId,
        roomId: rooms[0].roomId,
        userName: users[2].userName,
        roomName: rooms[0].roomName,
    });

    await timeout(100);
    conn3.close();
    await timeout(100);
    conn1.sendMessage("ping from user1");
    await timeout(100);
    conn2.sendMessage("pong from user2");

})()
    .catch((err) => console.log(err));

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
