import {Namespace} from "socket.io";

import {server} from "../src/server";

export function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const runServer = (port: number) => {
    return new Promise((resolve) => {
        const svr = server.listen(port, () => {
            console.log("running server at port:" + port);
            resolve(svr);
        });
    });
};

export const getClientsCount = (ioServer: Namespace) => {
    return new Promise((resolve, reject) => {
        ioServer.clients((err, clients) => {
            if (!err) {
                console.log(clients);
                resolve(clients.length);
            }
            reject(err);
        });
    });
};
