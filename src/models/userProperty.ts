import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey, HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import Card from "./card";
// import Token from "./token";
import User from "./user";

// ユーザーの所持するカード情報(ブックと同じ)
@Table({
  timestamps: true,
  paranoid: true,
  underscored: true,

})
export default class UserProperty extends Model<UserProperty> {
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  public userId: number;

  @AllowNull(false)
  @ForeignKey(() => Card)
  @Column
  public cardNo: number;

  @AllowNull(false)
  @Column
  public pocketType: PocketType;

  @AllowNull(false)
  @Default(false)
  @Column
  public isFake: boolean;

  @BelongsTo(() => User)
  public user: User;

  @BelongsTo(() => Card)
  public card: Card;

  // @HasOne(() => Token)
  // public token?: Token;
}

export enum PocketType {
  Special = 1, // 指定ポケット
  Normal, // フリーポケット
  Spell, // スペルポケット
  Item, // 現物アイテム
}
