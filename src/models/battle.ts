import {
    AllowNull, BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, HasMany, HasOne, Model, PrimaryKey,
    Table,
} from "sequelize-typescript";

import BattleHistory from "./battleHistory";
import BattleResult from "./battleResult";
import Room from "./room";
import User from "./user";
import UserBattle from "./userBattle";

export enum BattleType {
    Spell = 1,
    Battle,
}

export enum SpellBattleState {
    BattleStart = 1,
    WaitResponse,
    Executing,
    Finished,
}

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export default class Battle extends Model<Battle> {
    @ForeignKey(() => Room)
    @Column
    public roomId: number;

    @Default(BattleType.Spell)
    @Column
    public type: BattleType;

    @Default(SpellBattleState.BattleStart)
    @Column
    public state: SpellBattleState;

    @Column
    public action: string;

    @ForeignKey(() => User)
    @Column
    public attackerId: number;

    @BelongsTo(() => User, "attackerId")
    public attacker: User;

    @BelongsTo(() => Room)
    public room: Room;

    @BelongsToMany(() => User, () => UserBattle)
    public attacked: User[];

    @HasMany(() => BattleHistory)
    public battleHistories: BattleHistory[];

    @HasMany(() => BattleResult)
    public battleResults: BattleResult[];

    // methods
    public isWaitingResponse(): boolean {
        return this.state === SpellBattleState.WaitResponse;
    }

    public isSingleTarget(): boolean {
        return this.attacked.length === 1;
    }
}
