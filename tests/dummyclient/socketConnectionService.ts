import * as IOClient from "socket.io-client";

import {IAddUserMessage} from "../../src/interfaces/message/connection";
import {
    ISpellAttackedMessage, ISpellResponseMessage, ISpellResultMessage,
    ISpellStartMessage,
} from "../../src/interfaces/message/spell";

type UserData = {
    userId: number,
    userName: string,
    roomId: number,
    roomName: string,
};

export class SocketConnectionService {
    private socket: SocketIOClient.Socket;
    private ioOptions: any;
    private connectionInterval: number;
    private userData: UserData;

    constructor(private url: string, options?: any) {
        this.connectionInterval = 100;
        this.ioOptions = {
            forceNew: true,
        };
    }

    public async createConnection(userData: UserData): Promise<SocketIOClient.Socket> {
        this.userData = userData;
        this.socket = IOClient(this.url, this.ioOptions);
        this.bindListners(userData);
        // Spell
        this.bindSpellEventListeners(this.socket);

        return this.socket;
    }

    public close() {
        this.socket.close();
    }

    public sendAddUser() {
        const userData = this.userData;
        const data: IAddUserMessage = {
            userId: userData.userId,
            roomId: userData.roomId,
            userName: userData.userName,
            roomName: userData.roomName,
        };

        this.socket.emit("add_user", data);
    }

    public sendMessage(message: string) {
        this.socket.emit("new_message", message);
        console.log(`[emit ev]new_message: ${message}`);
    }

    public spellBattleStart(spellId: number, targetId: number, spellOption) {
        const data: ISpellStartMessage = {
            cardNo: spellId,
            usedBy: this.userData.userId,
            targetUserId: targetId,
            spellOption,
        };

        this.socket.emit("spell_start", data);
        console.log(`[emit ev]spell_start`);
        console.log(data);
    }

    public spellResponse(battleId: number, spellId: number, spellOption) {

        const data: ISpellResponseMessage = {
            battleId,
            cardNo: spellId,
            spellOption,
        };

        console.log(`[emit_ev: spell_response]`);
        this.socket.emit("spell_response", data);
    }

    private bindListners(userData: UserData) {
        this.socket.on("connect", () => {
            console.log("connected");

            this.setUsernameAndRoomname(userData);
        });

        this.socket.on("new_message", (data) => {
            console.log(`[recv ev]new_message(at ${this.socket.id}): from user = ${data.userName} , message = ${data.message}`);
        });

        this.socket.on("user_joined", (data) => {
            console.log(`socketId: ${this.socket.id}: ` + data.userName + " joined");
            //   addParticipantsMessage(data);
        });

        this.socket.on("user_left", (data) => {
            console.log(`socketId: ${this.socket.id}: ` + data.userName + " left");
            console.log(`socketId: ${this.socket.id}: numUsers = ${data.numUsers}`);
        });

    }

    private bindSpellEventListeners(socket: any) {
        socket.on("spell_result", (data: ISpellResultMessage) => {
            console.log(`[spell_result]: result :` + data.result);
            console.log(data);
        });

        socket.on("spell_attacked", (data: ISpellAttackedMessage) => {
            console.log(`[spell_attacked]: By ` + data.userId);
            console.log(data);
        });
    }

    private setUsernameAndRoomname(userData: UserData) {
        const data = {
            userId: userData.userId,
            roomId: userData.roomId,
            userName: userData.userName,
            roomName: userData.roomName,
        };
        console.log("dummyclient: add_user ");
        this.socket.emit("add_user", data);
    }

    private timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
