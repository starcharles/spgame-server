import {
    AllowNull, BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey,
    Table,
} from "sequelize-typescript";

import BattleHistory from "./battleHistory";
import Room from "./room";
import User from "./user";
import UserBattle from "./userBattle";

export enum MessageType {
    Spell = 1,
    Battle,
}

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export default class MessageLog extends Model<MessageLog> {
    @AllowNull(false)
    @ForeignKey(() => Room)
    @Column
    public roomId: number;

    @AllowNull(false)
    @Column
    public type: MessageType;

    @Column
    public action: string;
}
