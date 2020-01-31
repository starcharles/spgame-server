import {SpellOption} from "../interfaces/message/spell";
import Card from "../models/card";
import User from "../models/user";
import {SpellResultLogger} from "../service/spellResultLogger";

export abstract class SpellAction {
    constructor(public card: Card, public usedBy: User, public target: User[], public spellOption: SpellOption, public resultLogger: SpellResultLogger) {
    }

    public abstract execute(): Promise<any>;
}
