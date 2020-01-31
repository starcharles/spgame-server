import User from "../../models/user";

import Card from "../../models/card";
import {SpellResultLogger} from "../../service/spellResultLogger";
import {SpellAction} from "../spellAction";

export class DefensiveWall extends SpellAction {
    constructor(card: Card, usedBy: User, target: User[], spellOption: any, spellResultLogger: SpellResultLogger) {
        super(card, usedBy, target, spellOption, spellResultLogger);
    }

    public async execute(): Promise<void> {
        // empty
    }
}
