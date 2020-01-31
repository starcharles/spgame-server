import {
    AllowNull, BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey,
    Table,
} from "sequelize-typescript";

import Battle from "./battle";
import User from "./user";

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export default class UserBattle extends Model<UserBattle> {
    @ForeignKey(() => Battle)
    @Column
    public battleId: number;

    @ForeignKey(() => User)
    @Column
    public userId: number;
}
