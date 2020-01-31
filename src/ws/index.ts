import * as IO from "socket.io";

import {EVENTS} from "../interfaces/events";
import {IChatMessage} from "../interfaces/message/chat";
import {
    IAddUserMessage, IUserJoinMessage,
    IUserLeftMessage,
} from "../interfaces/message/connection";
import Room from "../models/room";
import {Repository} from "../repository";
import {UserRepository} from "../repository/userRepository";

import {bindBattleEvents} from "./battleEvents";

export const onConnection = (io: IO.Server, options: any) => {
    const userRepo = Repository.getRepository("User") as UserRepository;

    return (socket: IO.Socket) => {
        console.log(`new connection: socketId = ${socket.id}`);

        socket.on(EVENTS.CLIENT.NEW_MESSAGE, async (data: IChatMessage) => {
            const user = await userRepo.getUserBySocketId(socket.id);
            if (!user) {
                return;
            }
            socket.to(user.room.name).emit("new_message", data);
        });

        socket.on(EVENTS.SERVER.ADD_USER, async (data: IAddUserMessage) => {
            const userId = data.userId;
            const roomId = data.roomId;
            const userName = data.userName;
            const roomName = data.roomName;

            const user = await userRepo.getUserById(userId);

            if (!user) {
                // let msg: IAddUserResponseMessage = {
                //     type: "response",
                //     userId: undefined,
                //     roomId: undefined,
                //     message: `added userId = ${userId} not found.`,
                // };
                // io.to(roomName).emit(EVENTS.SERVER.ADD_USER, kkkkkkkk);
                return;

            }
            user.socketId = socket.id;
            user.online = true;
            await (user as any).$set("room", new Room({
                id: roomId,
                name: data.roomName,
            }), {
                save: false,
            });
            const user2 = await user.save();

            socket.join(roomName);
            const joinMsg: IUserJoinMessage = {
                userId,
                userName,
            };

            io.to(roomName).emit(EVENTS.CLIENT.USER_JOIN, joinMsg);
        });

        socket.on("disconnect", async () => {
            const user = await userRepo.getUserBySocketId(socket.id);
            if (user) {
                user.socketId = "";
                user.online = false;
                const _user = await user.save();

                console.log(`user_left: ${user.name}`);

                const data: IUserLeftMessage = {
                    userId: user.id,
                    userName: user.name,
                };
                socket.to(_user.room.name).emit(EVENTS.CLIENT.USER_LEFT, data);
            }
        });

        bindBattleEvents(io, socket);
    };
};
