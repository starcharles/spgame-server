import {Transaction} from "sequelize";

import Battle, {BattleType, SpellBattleState} from "../models/battle";
import BattleHistory from "../models/battleHistory";
import BattleResult from "../models/battleResult";
import User from "../models/user";

import {Repository} from "./index";
import {UserRepository} from "./userRepository";

export class BattleRepository {
    private includes = [{
        model: User,
        as: "attacked",
    }, {
        model: User,
        as: "attacker",
    }, {
        model: BattleHistory,
        as: "battleHistories",
    }, {
        model: BattleResult,
        as: "battleResults",
    }];

    public async getAll(): Promise<Battle[] | null> {
        // noinspection TypeScriptValidateTypes
        return await Battle.findAll({
            where: {},
            include: this.includes,
        });
    }

    public async getBattleByUserId(userId: number): Promise<Battle[] | null> {
        // noinspection TypeScriptValidateTypes
        return await Battle.findAll({
            where: {},
            include: this.includes,
        });
    }

    public async getBattleById(battleId: number): Promise<Battle | null> {
        return await Battle.findOne({
            where: {
                id: battleId,
            },
            include: this.includes,
        });
    }

    public async createBattle(attackerId: number, targetId: number, battleType = BattleType.Spell, action: string): Promise<Battle | null> {
        const userRepo = Repository.getRepository("User") as UserRepository;
        const attacker = await userRepo.getUserById(attackerId);
        const target = await userRepo.getUserById(targetId);

        if (!attacker) {
            return null;
        }
        if (!target) {
            return null;
        }

        const btl: Battle = new Battle({
            roomId: attacker.roomId,
            type: BattleType.Spell,
            state: SpellBattleState.BattleStart,
            action,
            attackerId,
        });

        // TODO: Transaction
        await btl.save(); // new id
        await btl.$add("attacked", target);
        return btl;
    }

    public async updateBattleState(battle: Battle, spellBattleState: SpellBattleState): Promise<Battle | null> {
        battle.state = spellBattleState;
        return await battle.save();
    }
}
