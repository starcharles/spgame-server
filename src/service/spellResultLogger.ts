import Battle from "../models/battle";
import BattleResult, {AttackType} from "../models/battleResult";
import Card from "../models/card";
import User from "../models/user";

export class SpellResultLogger {
    constructor(public battle: Battle, public card: Card) {
    }

    public async saveResult(from: User, to: User, attackType: AttackType, targetCardNo?: number, changeCardNo?: number) {
        // バトル結果ログ
        const bs = new BattleResult({
            battleId: this.battle.id,
            fromUserId: from.id,
            toUserId: to.id,
            cardNo: this.card.cardNo,
            attackType,
            targetCardNo,
            changeCardNo,
        });

        return await bs.save();
    }
}
