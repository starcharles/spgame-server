export interface IAddUserMessage {
    userId: number;
    roomId: number;
    userName: string;
    roomName: string;
}

export interface IUserJoinMessage {
    userId: number;
    userName: string;
}

export interface IUserLeftMessage {
    userId: number;
    userName: string;
}
