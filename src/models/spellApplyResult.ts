import {
    AllowNull, BelongsTo, Column, Default, ForeignKey, Model,
    Table,
} from "sequelize-typescript";

import Battle from "./battle";
import Card from "./card";
import User from "./user";

export enum ApplyType {
    DESTROY = "destroy",
    THIEF = "thief",
    EFFECT = "effect",
    FAIL = "fail",
}

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export default class SpellApplyResult extends Model<SpellApplyResult> {
    // @AllowNull(false)
    // @ForeignKey(() => Battle)
    // @Column
    // public battleId: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    public fromUserId: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    public toUserId: number;

    // @AllowNull(false)
    // @Column
    // public applyType: ApplyType;

    @ForeignKey(() => Card)
    @Column
    public cardNo: number;

    @BelongsTo(() => User, "fromUserId")
    public fromUser: User;

    @BelongsTo(() => User, "toUserId")
    public toUser: User;
}
