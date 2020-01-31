import Card from "../../models/card";
import User from "../../models/user";
import UserProperty from "../../models/userProperty";
import {Repository} from "../../repository";
import {UserPropertyRepository} from "../../repository/userPropertyRepository";

import {SpellOption} from "../../interfaces/message/spell";
import BattleResult, {AttackType} from "../../models/battleResult";
import {SpellResultLogger} from "../../service/spellResultLogger";
import {SpellAction} from "../spellAction";

export class Levy extends SpellAction {
    constructor(card: Card, usedBy: User, target: User[], spellOption: SpellOption, resultLogger: SpellResultLogger) {
        super(card, usedBy, target, spellOption, resultLogger);
    }

    public async execute(): Promise<void> {
        const userPropertyRepo = Repository.getRepository("UserProperty") as UserPropertyRepository;

        this.target.forEach(async (user: User) => {

            const props = user.userProperties;
            if (props.length === 0) {
                return;
            }

            // ユーザーの持つカードからランダムに1枚を選ぶ
            let rand = props.length;
            while (rand === props.length) {
                rand = Math.floor(Math.random() * props.length);
            }

            const up = props[rand];
            await userPropertyRepo.updateOwnerId(up, this.usedBy.id);

            await this.resultLogger.saveResult(this.usedBy, user, AttackType.THIEF, up.cardNo);
        });
    }
}
