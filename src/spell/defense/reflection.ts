import User from "../../models/user";

import {SpellOption} from "../../interfaces/message/spell";
import Card from "../../models/card";
import {SpellResultLogger} from "../../service/spellResultLogger";
import {SpellAction} from "../spellAction";

// No.1004 反射
export class Reflection extends SpellAction {
    constructor(card: Card, usedBy: User, target: User[], spellOption: SpellOption, resultLogger: SpellResultLogger) {
        super(card, usedBy, target, spellOption, resultLogger);

    }

    public async execute(): Promise<void> {
        // swap attacker and defender
        const attacker = this.target;
        const target = this.usedBy;
    }
}
