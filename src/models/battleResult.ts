import {
    AllowNull, BelongsTo, Column, Default, ForeignKey, Model,
    Table,
} from "sequelize-typescript";

import Battle from "./battle";
import Card from "./card";
import User from "./user";

export enum AttackType {
    DESTROY = "destroy",
    THIEF = "thief",
    CHANGE = "change",
    FAIL = "fail",
}

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export default class BattleResult extends Model<BattleResult> {
    @AllowNull(false)
    @ForeignKey(() => Battle)
    @Column
    public battleId: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    public fromUserId: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    public toUserId: number;

    @AllowNull(false)
    @Column
    public attackType: AttackType;

    @ForeignKey(() => Card)
    @Column
    public cardNo: number;

    @ForeignKey(() => Card)
    @Column
    public targetCardNo: number;

    @ForeignKey(() => Card)
    @Column
    public changeCardNo?: number;

    @BelongsTo(() => Battle, "battleId")
    public battle: Battle;

    @BelongsTo(() => User, "fromUserId")
    public fromUser: User;

    @BelongsTo(() => User, "toUserId")
    public toUser: User;
}
