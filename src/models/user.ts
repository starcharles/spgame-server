import {
    AllowNull, BelongsTo, BelongsToMany, Column, Default, ForeignKey, HasMany, Model,
    Table, Unique,
} from "sequelize-typescript";

import Battle from "./battle";
import Room from "./room";
import UserBattle from "./userBattle";
import UserProperty from "./userProperty";

export enum UserState {
    Battle = 1,
    Field,
    Shop,
}

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,

})
export default class User extends Model<User> {
    @AllowNull(false)
    @Default(1)
    @ForeignKey(() => Room)
    @Column
    public roomId: number;

    @AllowNull(true)
    @Unique
    @Column
    public uid: string;

    @Column
    public socketId?: string;

    @AllowNull(false)
    @Unique
    @Column
    public name: string;

    @AllowNull(false)
    @Default(50)
    @Column
    public hp: number;

    @AllowNull(false)
    @Default(0)
    @Column
    public gold: number;

    @AllowNull(false)
    @Default(UserState.Field)
    @Column
    public state: UserState;

    // @Column
    // public location: string;

    @Column
    public online: boolean;

    @AllowNull(false)
    @Default(0)
    @Column
    public isAdmin: boolean;

    @HasMany(() => UserProperty)
    public userProperties: UserProperty[];

    @BelongsToMany(() => Battle, () => UserBattle)
    public battles: Battle[];

    @BelongsTo((() => Room))
    public room: Room;
}
