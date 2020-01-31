import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

import Card from "./card";
import User from "./user";

// ユーザーにかかっている特殊効果
@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export default class UserEffect extends Model<UserEffect> {
    @ForeignKey(() => User)
    @Column
    public userId: number;

    @ForeignKey(() => Card)
    @Column
    public cardNo: number;

    // @Column(DataType.ENUM)
    @Column
    public effectType: EffectType;

    @Column(DataType.INTEGER)
    public count: number; // 残り回数
}

export enum EffectType {
    Spell = 1, // 持続効果系スペル
    Item, // 所持,装備アイテム効果
}
