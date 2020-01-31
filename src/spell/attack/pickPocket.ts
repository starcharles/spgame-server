import Card from "../../models/card";
import User from "../../models/user";
import UserProperty, {PocketType} from "../../models/userProperty";
import {Repository} from "../../repository";
import {UserPropertyRepository} from "../../repository/userPropertyRepository";

import {SpellOption} from "../../interfaces/message/spell";
import {AttackType} from "../../models/battleResult";
import {SpellResultLogger} from "../../service/spellResultLogger";
import {SpellAction} from "../spellAction";

export class PickPocket extends SpellAction {
    private userPropertyRepo = Repository.getRepository("UserProperty") as UserPropertyRepository;

    constructor(card: Card, usedBy: User, target: User[], spellOption: SpellOption, resultLogger: SpellResultLogger) {
        super(card, usedBy, target, spellOption, resultLogger);
    }

    public async execute() {
        const targets = this.target;
        if (targets.length !== 1) {
            return await this.resultLogger.saveResult(this.usedBy, targets[0], AttackType.FAIL);
            throw new Error(`Spell's target user should be 1 user. cardNo = ${this.card.cardNo}`);
        }
        const targetUser = targets[0];
        const targetCards: UserProperty[] = await this.userPropertyRepo.getUserPropertiesByUserIdAndPocketTypes(targetUser.id, [PocketType.Normal, PocketType.Spell]);

        // 2. ターゲットがカードを持っていなければ失敗, 消滅
        if (targetCards.length === 0) {
            // throw new Error(`Spell 'PickPocket' failed because target user does't have cards: target userId = ${targetUser.id}`);
            // バトル結果ログ
            if (this.resultLogger) {
                return await this.resultLogger.saveResult(this.usedBy, targetUser, AttackType.FAIL);
            }
        }

        // 3. ランダムに選択
        const up = targetCards[Math.floor(Math.random() * targetCards.length)];
        const up2 = await this.userPropertyRepo.updateOwnerId(up, this.usedBy.id);

        // バトル結果ログ
        return await this.resultLogger.saveResult(this.usedBy, targetUser, AttackType.THIEF, up.cardNo);
    }
}
