import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";

import Card, {} from "./card";

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export default class SpellCard extends Model<SpellCard> {
    @ForeignKey(() => Card)
    @Column
    public cardNo: number;

    @Column
    public spellType: SpellType; // 攻撃、防御、持続、その他

    @Column
    public targetType: TargetType; // 遠距離、近距離

    @Column
    public isInteractive: boolean; // プレイヤー間相互作用必要か？

    @Column
    public isMultipleTarget: boolean; // 複数対象かどうか

    @BelongsTo(() => Card, {targetKey: "cardNo"})
    public card: Card;
}

export enum SpellType {
    Attack = "attack", // 近距離攻撃呪文
    Normal = "normal", // 通常呪文
    Defense = "defense", // 攻撃スペル防御
    DefenseNormal = "defense-normal", // 通常スペル防御
    None = "none",
}

export enum TargetType {
    Short = 1,
    Long,
    None,
}
