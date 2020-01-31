import * as config from "config";
import * as IO from "socket.io";

import {Message} from "../interfaces";
import {EVENTS} from "../interfaces/events";
import {ISpellAttackedMessage, ISpellResultMessage, ISpellStartMessage} from "../interfaces/message/spell";
import Battle, {BattleType} from "../models/battle";
import BattleHistory, {ActionType} from "../models/battleHistory";
import {default as Card} from "../models/card";
import User from "../models/user";
import {Repository} from "../repository";
import {BattleHistoryRepository} from "../repository/battleHistoryRepository";
import {BattleRepository} from "../repository/battleRepository";
import {CardRepository} from "../repository/cardRepository";
import {UserRepository} from "../repository/userRepository";
import {SpellBattleService} from "../service/spellBattleService";
import {SpellBattleStore} from "../service/spellBattleStore";
import {SpellResultLogger} from "../service/spellResultLogger";
import {Validator} from "../validator";

export function bindBattleEvents(io: IO.Server, socket: IO.Socket) {
    const userRepository = Repository.getRepository("User") as UserRepository;

    const cardRepository = Repository.getRepository("Card") as CardRepository;
    const battleRepository = Repository.getRepository("Battle") as BattleRepository;
    const battleHisRepository = Repository.getRepository("BattleHistory") as BattleHistoryRepository;

    socket.on(EVENTS.SERVER.SPELL_START, async (data: ISpellStartMessage) => {
        console.log("[recv_ev: spell_start]");
        const user: User | null = await userRepository.getUserById(data.usedBy);
        const targetUser: User | null = await userRepository.getUserById(data.targetUserId);
        const card: Card | null = await cardRepository.getCardByNo(data.cardNo);

        if (!user) {
            console.log(`[error][spell_result]: user(id = ${data.usedBy}) not found`);
            return;
        }
        if (!user.socketId) {
            console.log(`[error][spell_result]: user.socketId not found`);
            return;
        }
        if (!card) {
            console.log(`[error][spell_result]: card(cardNo = ${data.cardNo}) not found`);
            return;
        }
        if (!targetUser) {
            console.log(`[error][spell_result]: target User not found`);
            return;
        }
        let msg = await Validator.validateStartMessage(data, user, targetUser, card);

        if (msg.result === "failure") {
            console.log(`[error][spell_result]: ${JSON.stringify(msg)}`);
            io.to(user.socketId).emit(EVENTS.CLIENT.SPELL_RESULT, msg);
            return;
        }

        // TODO: 1.持続系防御スペルがあれば失敗にする

        if (!card.spell) {
            msg = {
                result: "failure",
                message: "card.spell not found",
            };
            console.log(`[error][spell_result]: ${JSON.stringify(msg)}`);
            io.to(user.socketId).emit(EVENTS.CLIENT.SPELL_RESULT, msg);

            return;
        }
        // 1. if 応答が不必要なスペル
        if (!card.spell.isInteractive) {
            console.log("spell is not interactive");

            //  => スペル効果発動処理
            return;
        }

        // 2. else 応答が必要なスペル
        console.log("spell is interactive");

        // saveBattle and fire timer
        // TODO: いまのところ1 vs1のみ考える
        const btl = await battleRepository.createBattle(user.id, targetUser.id, BattleType.Spell, card.name);
        if (!btl) {
            console.log(`[error][spell_result]: ${JSON.stringify(msg)}`);
            io.to(user.socketId).emit(EVENTS.CLIENT.SPELL_RESULT, msg);
            return;

        }
        const battleId = (btl as Battle).id;

        const battleWithAssociation = await battleRepository.getBattleById(battleId);
        if (!battleWithAssociation) {
            msg = {
                result: "failure",
                message: "battle not found",
            };
            console.log(`[error][spell_result]: ${JSON.stringify(msg)}`);
            io.to(user.socketId).emit(EVENTS.CLIENT.SPELL_RESULT, msg);
            return;
        }

        const resultLogger = new SpellResultLogger(battleWithAssociation, card);

        // TODO: transaction で囲う
        const sbs = new SpellBattleService(battleWithAssociation, resultLogger);
        await sbs.prepareBattle(data, card);
        const attackSpell = await sbs.setAttackSpell(data.cardNo, data.spellOption);

        if (!attackSpell) {
            msg = {
                result: "failure",
                message: `attack Spell not found. ${JSON.stringify(data)}`,
            };
            console.log(`[error][spell_result]: ${JSON.stringify(msg)}`);
            io.to(user.socketId).emit(EVENTS.CLIENT.SPELL_RESULT, msg);
            return;
        }

        // notify battle-start event to both users
        const attackMsg: ISpellAttackedMessage = {
            battleId,
            userId: user.id,
            message: EVENTS.CLIENT.SPELL_ATTACKED,
            cardNo: data.cardNo,
            spellOption: data.spellOption,
        };
        if (!battleWithAssociation.attacker.socketId) {
            msg = {
                result: "failure",
                message: "battleWithAssoc.attacker.socketId = null",
            };
            console.log(`[error][spell_result]: ${JSON.stringify(msg)}`);
            io.to(user.socketId).emit(EVENTS.CLIENT.SPELL_RESULT, msg);
            return;

        }
        if (!targetUser.socketId) {
            msg = {
                result: "failure",
                message: "targetUser.socketId = null",
            };
            console.log(`[error][spell_result]: ${JSON.stringify(msg)}`);
            io.to(user.socketId).emit(EVENTS.CLIENT.SPELL_RESULT, msg);
            return;

        }
        // notify to attacker and defender
        io.to(battleWithAssociation.attacker.socketId).emit(EVENTS.CLIENT.SPELL_ATTACKED, attackMsg);
        io.to(targetUser.socketId).emit(EVENTS.CLIENT.SPELL_ATTACKED, attackMsg);

        const timer = setTimeout(afterTimeout(battleId, data), config.get<number>("battleTimeout"));
        sbs.setTimer(timer);

        // Store SpellService
        const store = SpellBattleStore.getInstance();
        store.setSpellBattleService(btl.id, sbs);
    });

    socket.on(EVENTS.SERVER.SPELL_RESPONSE, async (data: Message.Spell.ISpellResponseMessage) => {
        const battleId = +data.battleId;
        const btl = await battleRepository.getBattleById(battleId);
        if (!btl) {
            console.log(`battle not found for battleId = ${battleId}`);
            return;
        }

        const store = SpellBattleStore.getInstance();
        const sbs = store.getSpellBattleService(battleId);

        if (!sbs) {
            console.log(`Sbs not found`);
            return;
        }

        // stop Timeout timer
        sbs.clearTimer();

        if (!sbs.battleIsWaitingResponse()) {
            console.log("got spell_response, but battle is not waiting response. do nothing");
            return;
        }

        await sbs.setDefenceSpell(data.cardNo);
        await sbs.runSpell();

        // add Log
        for (const u of btl.attacked) {
            const card = await cardRepository.getCardByNo(data.cardNo);
            const hist = await battleHisRepository.addBattleHistory(btl.id, u.id, ActionType.Defense, card ? card.name : null, +data.cardNo);
        }

        // notify users
        const btlUsers = sbs.getBattleUsers();
        for (const user of btlUsers) {
            let msg: ISpellResultMessage;
            if (user.id === btl.attackerId) {
                msg = {
                    result: "failure",
                    message: "spell failed by defense",
                };

            } else {
                msg = {
                    result: "success",
                    message: "spell defensed",
                };
            }
            if (!user.socketId) {
                // TODO: ユーザーの切断時の処理?
                console.error(`userId = ${user.id}, user.socketId not found. maybe disconnected`);
                continue;
            }
            io.to(user.socketId).emit(EVENTS.CLIENT.SPELL_RESULT, msg);
        }
    });

    const afterTimeout = (battleId: number, data: ISpellStartMessage) => {
        return async () => {
            const store = SpellBattleStore.getInstance();
            const sbs: SpellBattleService | undefined = store.getSpellBattleService(battleId);
            if (!sbs) {
                console.log(`SpellBattleService not found for battleId = ${battleId}`);
                throw new Error(`SpellBattleService not found for battleId = ${battleId}`);
            }

            if (!sbs.battleIsWaitingResponse()) {
                throw new Error(`battle not waiting response battleId = ${battleId}`);
            }

            if (!(await sbs.runSpell())) {
                throw new Error("spell failed");
            }

            // notify users
            const battle = sbs.battle;
            const attacker = battle.attacker;

            const msg: ISpellResultMessage = {
                result: "success",
                message: "spell success",
                cardNo: data.cardNo,
                ownerId: attacker.id,
            };
            if (!attacker.socketId) {
                // TODO: ユーザーの切断, スペルを成功にする？
                console.error("attacker.socketId not found");
                return;
            }
            io.to(attacker.socketId).emit("spell_result", msg);

            for (const u of battle.attacked) {
                const msg2 = {
                    result: "failure",
                    message: "attack did not defensed",
                    cardNo: data.cardNo,
                    ownerId: attacker.id,
                };
                if (!u.socketId) {
                    console.error("u.name:  socketId not found");
                    return;
                }
                io.to(u.socketId).emit("spell_result", msg2);
            }
        };
    };

}
