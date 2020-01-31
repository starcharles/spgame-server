import {SpellBattleService} from "./spellBattleService";

export class SpellBattleStore {
    public static getInstance() {
        if (!this.singleton) {
            this.singleton = new this();
        }

        return this.singleton;
    }

    private static singleton: SpellBattleStore;
    private instanceMap: Map<number, SpellBattleService>;

    private constructor() {
        this.instanceMap = new Map<number, SpellBattleService>();
    }

    public getSpellBattleService(battleId: number) {
        return this.instanceMap.get(battleId);
    }

    public setSpellBattleService(battleId: number, service: SpellBattleService) {
        return this.instanceMap.set(battleId, service);
    }
}
