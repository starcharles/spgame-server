import {
    AllowNull, BelongsTo, BelongsToMany, Column, Default, ForeignKey, HasMany, Model,
    Table, Unique,
} from "sequelize-typescript";

import Battle from "./battle";
import Room from "./room";
import User from "./user";
import UserBattle from "./userBattle";
import UserProperty from "./userProperty";

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,

})
export default class UserContact extends Model<UserContact> {
    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    public userId: number;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    public contactUserId: number;

    @BelongsTo((() => User), "userId")
    public user: User;

    @BelongsTo((() => User), "contactUserId")
    public contactUser: User;
}
