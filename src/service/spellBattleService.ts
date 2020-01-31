import {ISpellStartMessage, SpellOption} from "../interfaces/message/spell";
import Battle, {SpellBattleState} from "../models/battle";
import {ActionType} from "../models/battleHistory";
import Card from "../models/card";
import User, {UserState} from "../models/user";
import {Repository} from "../repository";
import {BattleHistoryRepository} from "../repository/battleHistoryRepository";
import {BattleRepository} from "../repository/battleRepository";
import {UserRepository} from "../repository/userRepository";
import {SpellAction} from "../spell/spellAction";

import {SpellExecutor} from "./spellExecutor";
import {SpellResultLogger} from "./spellResultLogger";

export class SpellBattleService {
    private userRepository = Repository.getRepository("User") as UserRepository;
    private battleRepository = Repository.getRepository("Battle") as BattleRepository;
    private battleHisRepository = Repository.getRepository("BattleHistory") as BattleHistoryRepository;
    private timer: NodeJS.Timer;
    private battleUsers: User[];
    private executor: SpellExecutor;

    constructor(public battle: Battle, private resultLogger: SpellResultLogger) {
        this.executor = new SpellExecutor(battle.attacker, battle.attacked, resultLogger);
        this.battleUsers = battle.attacked.concat(battle.attacker);
    }

    public setAttackSpell(cardNo: number, spellOption: SpellOption): Promise<SpellAction | null> {
        return this.executor.setAttack(cardNo, spellOption);
    }

    public setDefenceSpell(cardNo: number): Promise<SpellAction | null> {
        return this.executor.setDefense(cardNo);
    }

    public getBattleUsers() {
        return this.battleUsers;
    }

    public battleIsWaitingResponse(): boolean {
        return this.battle.isWaitingResponse();
    }

    public setTimer(timer: NodeJS.Timer) {
        this.timer = timer;
    }

    public clearTimer() {
        clearTimeout(this.timer);
    }

    public async prepareBattle(data: ISpellStartMessage, card: Card) {
        // ユーザー状態変更
        for (const id of [data.usedBy, data.targetUserId]) {
            await this.userRepository.updateUserStateById(id, UserState.Battle);
        }

        const battleId = this.battle.id;

        if (!data.spellOption) {
            data.spellOption = {
                changeCardNo: undefined,
                targetCardNo: undefined,
            };
        }
        // add history
        await this.battleHisRepository.addBattleHistory(battleId, data.usedBy, ActionType.Attack, card.name, data.cardNo, data.spellOption.targetCardNo, data.spellOption.changeCardNo);
        await this.battleHisRepository.addBattleHistory(battleId, data.targetUserId, ActionType.IsAttacked, null, null, data.spellOption.targetCardNo, data.spellOption.targetCardNo);
        await this.battleRepository.updateBattleState(this.battle, SpellBattleState.WaitResponse);
    }

    public async runSpell(): Promise<boolean> {
        await this.start();

        if (!(await this.executor.run())) {
            throw new Error(`failure: during executing spell battleId= ${this.battle.id}`);
        }
        await this.finish();
        return true;
    }

    private async start() {
        for (const user of this.battleUsers) {
            await this.userRepository.updateUserStateById(user.id, UserState.Battle);
        }
        await this.battleRepository.updateBattleState(this.battle, SpellBattleState.Executing);
    }

    private async finish() {
        for (const user of this.battleUsers) {
            await this.userRepository.updateUserStateById(user.id, UserState.Field);
        }
        await this.battleRepository.updateBattleState(this.battle, SpellBattleState.Finished);
        console.log(`battleId = ${this.battle.id} is finished`);

    }
}
