import Battle, {} from "../models/battle";
import BattleHistory, {ActionType} from "../models/battleHistory";
import User from "../models/user";

export class BattleHistoryRepository {
    private includes = [{
        model: User,
        as: "attacked",
    }, {
        model: User,
        as: "attacker",
    }];

    public async getAll(): Promise<Battle[]> {
        // noinspection TypeScriptValidateTypes
        return await Battle.findAll({
            where: {},
            include: this.includes,
        });
    }

    public async addBattleHistory(battleId: number, userId: number, actionType: ActionType, action: string | null, cardNo: number | null, targetCardNo?: number, changeCardNo?: number): Promise<BattleHistory> {
        const hist = BattleHistory.build({
            battleId,
            userId,
            actionType,
            action,
            cardNo,
            targetCardNo,
            changeCardNo,
        });
        console.log(hist.toJSON());
        return await hist.save();
    }
}
