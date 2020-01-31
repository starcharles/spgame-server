import {
    AllowNull, BelongsTo, Column, Default, ForeignKey, Model,
    Table,
} from "sequelize-typescript";

import Battle from "./battle";
import Card from "./card";
import User from "./user";

export enum ActionType {
    Attack = "attack",
    IsAttacked = "is_attacked",
    Defense = "defense",
}

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export default class BattleHistory extends Model<BattleHistory> {
    @AllowNull(false)
    @ForeignKey(() => Battle)
    @Column
    public battleId: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    public userId: number;

    @Default(ActionType.Attack)
    @Column
    public actionType: ActionType;

    @Column
    public action: string;

    @ForeignKey(() => Card)
    @Column
    public cardNo: number;

    @Column
    public targetCardNo?: number;

    @Column
    public changeCardNo?: number;

    @BelongsTo(() => Battle, "battleId")
    public battle: Battle;

    @BelongsTo(() => User, "userId")
    public user: User;
}
