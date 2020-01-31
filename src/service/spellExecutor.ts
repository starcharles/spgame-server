import {SpellOption} from "../interfaces/message/spell";
import {SpellType} from "../models/spellCard";
import User from "../models/user";
import {Repository} from "../repository";
import {CardRepository} from "../repository/cardRepository";
import {UserPropertyRepository} from "../repository/userPropertyRepository";
import {Levy} from "../spell/attack/levy";
import {PickPocket} from "../spell/attack/pickPocket";
import {Rob} from "../spell/attack/rob";
import {DefensiveWall} from "../spell/defense/defensiveWall";
import {Reflection} from "../spell/defense/reflection";
import {SpellAction} from "../spell/spellAction";

import {SpellResultLogger} from "./spellResultLogger";

export class SpellExecutor {
    private userPropRepo = Repository.getRepository("UserProperty") as UserPropertyRepository;
    private attack: SpellAction;
    private defense: SpellAction;

    private spellsMap = {
        attack: {
            Rob,
            PickPocket,
            Levy,
        },
        defense: {
            DefensiveWall,
            // CastleGate,
            Reflection,
            // Prison,
            // HolyWater
        },
    };

    constructor(private usedBy: User, private target: User[], private resultLogger: SpellResultLogger) {
    }

    public async setAttack(cardNo: number, spellOption?: SpellOption): Promise<SpellAction | null> {
        const spellAction: SpellAction = await this.getSpellInstance(SpellType.Attack, cardNo, spellOption);
        if (!spellAction) {
            return null;
        }
        this.attack = spellAction;
        return spellAction;
    }

    public async setDefense(cardNo: number): Promise<SpellAction | null> {
        const spellAction: SpellAction = await this.getSpellInstance(SpellType.Defense, cardNo);
        if (!spellAction) {
            return null;
        }
        this.defense = spellAction;
        return spellAction;
    }

    public async run(): Promise<boolean> {
        if (!this.attack) {
            throw new Error("attack spell is not set");
        }

        if (!this.defense) {
            await this.attack.execute();
            const del = await this.userPropRepo.deleteUserProperty(this.usedBy.id, this.attack.card.cardNo);
            if (del === 0) {
                throw new Error("card delete failed");
            }
            return true;
        }

        if (this.target.length > 1) {
            // 複数ターゲット攻撃に対する防御呪文は無い。
            // delete spells after used
            const del = await this.userPropRepo.deleteUserProperty(this.usedBy.id, this.attack.card.cardNo);
            if (del === 0) {
                throw new Error("card delete failed");
            }
            return true;
        }

        if (!this.attack.card.spell) {
            return false;
        }

        switch (this.attack.card.spell.spellType) {
            case SpellType.Attack:

                // TODO: 1.持続系防御スペルがあれば失敗にする
                // if (targetUser) {
                //     //
                //
                // }

                // 反射の場合
                if (this.defense.constructor.name === "Reflection") {
                    // swap attacker and defender;
                    const tmp = this.attack.usedBy;
                    this.attack.usedBy = this.target[0];
                    this.attack.target = [tmp];
                    await this.attack.execute();
                }
                if (!this.defense.card.spell) {
                    return false;
                }
                if (this.defense.card.spell.spellType === SpellType.Defense) {
                    // 攻撃スペル、防御スペルの相殺
                    // do nothing
                }
                break;
            case SpellType.Normal:
                if (!this.defense.card.spell) {
                    return false;
                }
                if (this.defense.card.spell.spellType === SpellType.DefenseNormal) {
                    // do nothing

                    // 攻撃スペル、防御スペルの相殺
                    // const del1 = await this.userPropRepo.deleteUserProperty(this.attack.card.id, this.usedBy.id);
                    // const del2 = await this.userPropRepo.deleteUserProperty(this.defense.card.id, this.target[0].id);
                    // if (del1 === 0 || del2 === 0) {
                    //     throw new Error("card delete failed");
                    // }
                    // return true;
                }
                break;
            default:
                throw new Error("defense card not matched");
                break;
        }

        // 使用済み攻撃スペル、防御スペルの削除
        const del1 = await this.userPropRepo.deleteUserProperty(this.usedBy.id, this.attack.card.cardNo, 1);
        const del2 = await this.userPropRepo.deleteUserProperty(this.target[0].id, this.defense.card.cardNo, 1);
        if (del1 === 0 || del2 === 0) {
            throw new Error("card delete failed");
        }
        return true;
    }

    private async getSpellInstance(spellType: SpellType, cardNo: number, spellOption?: SpellOption): Promise<SpellAction> {
        const cardRepo = Repository.getRepository("Card") as CardRepository;
        const card = await cardRepo.getCardByNo(cardNo);
        if (!card) {
            throw new Error("card not found");
        }
        const classObj = (this.spellsMap as any)[spellType][this.capitalize(card.name)];
        if (!classObj) {
            throw new Error(`object not found for spell card = ${card.name}, cardNo = ${card.id}`);
        }
        return new classObj(card, this.usedBy, this.target, spellOption, this.resultLogger);
    }

    // 1文字目を大文字に変える
    private capitalize(name: string): string {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
}
