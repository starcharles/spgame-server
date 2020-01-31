import {BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table} from "sequelize-typescript";

import SpellCard from "./spellCard";
import UserProperty from "./userProperty";

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export default class Card extends Model<Card> {
    @PrimaryKey
    @Column
    public cardNo: number;

    @Column
    public name: string;

    @Column
    public nameJa?: string;

    @Column
    public rank: CardRank;

    @Column
    public cardType: CardType;

    @Column(DataType.INTEGER)
    public limit?: number;

    @Column
    public content: string;

    @HasOne(() => SpellCard, "cardNo")
    public spell?: SpellCard;

    @HasMany(() => UserProperty)
    public userProperties: UserProperty[];
}

export enum CardRank {
    RULER_ONLY = "ruler_only",
    SSS = "sss",
    SS = "ss",
    S = "s",
    A = "a",
    B = "b",
    C = "c",
    D = "d",
    E = "e",
    F = "f",
    G = "g",
    Z = "z",
}

export enum CardType {
    Item = 1,
    Spell,
    Monster,
}
