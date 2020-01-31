import Card from "../../models/card";
import User from "../../models/user";
import UserProperty from "../../models/userProperty";
import {Repository} from "../../repository";
import {UserPropertyRepository} from "../../repository/userPropertyRepository";

import {SpellOption} from "../../interfaces/message/spell";
import {AttackType} from "../../models/battleResult";
import {SpellResultLogger} from "../../service/spellResultLogger";
import {SpellAction} from "../spellAction";

export class Rob extends SpellAction {

    private static getUserProperty(userId: number, cardNo: number): Promise<UserProperty[]> {
        const userPropertyRepo = Repository.getRepository("UserProperty") as UserPropertyRepository;
        return userPropertyRepo.getUserPropertiesByUserIdAndCardNo(userId, cardNo);
    }

    constructor(card: Card, usedBy: User, target: User[], spellOption: SpellOption, resultLogger: SpellResultLogger) {
        super(card, usedBy, target, spellOption, resultLogger);

        if (!spellOption.targetCardNo) {
            throw new Error("target cardNo is not specified.");
        }
    }

    public async execute(): Promise<any> {
        const targetCardNo = this.spellOption.targetCardNo;
        if (!targetCardNo) {
            return await this.resultLogger.saveResult(this.usedBy, this.target[0], AttackType.FAIL);
            throw new Error("Spell rob's targetCardNo is null ");
        }
        const targetUser = this.target as User[];
        if (targetUser.length !== 1) {
            return await this.resultLogger.saveResult(this.usedBy, targetUser[0], AttackType.FAIL, targetCardNo);
            throw new Error("Spell rob's target user should be 1 user");
        }

        const targetCards: UserProperty[] = await Rob.getUserProperty(targetUser[0].id, targetCardNo);

        // 2. ターゲットがカードを持っていなければ失敗, 消滅
        if (targetCards.length === 0) {
            return await this.resultLogger.saveResult(this.usedBy, targetUser[0], AttackType.FAIL, targetCardNo);
            // throw new Error(`Spell 'Rob' failed card not found: userId = ${targetUser[0].id}, cardNo = ${targetCardNo}`);
        }

        // 3. 攻撃成功  カードの所有情報を移し替える
        const up = targetCards[0];
        const userPropertyRepo = Repository.getRepository("UserProperty") as UserPropertyRepository;
        await userPropertyRepo.updateOwnerId(up, this.usedBy.id);

        return await this.resultLogger.saveResult(this.usedBy, targetUser[0], AttackType.THIEF, targetCardNo);

    }
}
