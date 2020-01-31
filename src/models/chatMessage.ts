import {BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table} from "sequelize-typescript";

import Room from "./room";
import User from "./user";

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export default class ChatMessage extends Model<ChatMessage> {
    @Column
    @ForeignKey(() => User)
    public userId: number;

    @Column
    @ForeignKey(() => Room)
    public roomId: number;

    @Column
    public message: string;

    @BelongsTo(() => User)
    public user: User;

    @BelongsTo(() => Room)
    public room: Room;
}
