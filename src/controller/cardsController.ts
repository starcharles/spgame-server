import * as express from "express";
import * as util from "util";

import {SpellOption} from "../interfaces/message/spell";
import Battle, {BattleType, SpellBattleState} from "../models/battle";
import Card from "../models/card";
import User from "../models/user";
import UserProperty from "../models/userProperty";
import {Repository} from "../repository";
import {CardRepository} from "../repository/cardRepository";
import {SpellExecutor} from "../service/spellExecutor";
import {SpellResultLogger} from "../service/spellResultLogger";

import {sequelize} from "../main";

async function getAllCards(req: express.Request, res: express.Response, next: express.NextFunction) {
    const cardRepo = Repository.getRepository("Card") as CardRepository;
    const cards = await cardRepo.getAllCards();
    const response: Card[] = [];
    if (!cards) {
        res.json(response);
        return;
    }
    for (const card of cards) {
        response.push(card.toJSON());
    }
    res.json(response);
}

async function getCard(req: express.Request, res: express.Response, next: express.NextFunction) {
    const cardNo: number = +req.params.cardNo;

    if (!cardNo || !util.isNumber(cardNo)) {
        res.status(404).json({
            message: "cardNo is not valid",
        });
        return;
    }
    const cardRepo = Repository.getRepository("Card") as CardRepository;
    const card = await cardRepo.getCardByNo(cardNo);
    if (!card) {
        res.status(404).json({
            message: "card not found",
        });
        return;
    }

    // res.status(200).json({});
    res.status(200).json(card.toJSON());
}

async function postCard(req: express.Request, res: express.Response, next: express.NextFunction) {
    const cardNo: number = +req.params.cardNo;

    const body = req.body as {
        targetUserId: number | number[],
        spellOption: SpellOption,
    };

    const user: User | null = (req as any).user;
    if (!user) {
        res.status(400).json({
            message: "user not found",
        });
        return;

    }
    const props = user.userProperties;
    const prop = props.find((prp) => {
        return prp.cardNo === cardNo;
    });

    if (!prop) {
        res.status(404).json({
            message: "user do not have card(cardNo = " + cardNo + ")",
        });
        return;
    }

    let targets: User[] = [];
    // 各カード実行時の特殊条件を考慮して条件分岐
    switch (prop.cardNo) {
        case 1018: {
            // TODO: 位置情報関係
            // Levyの時はオンラインユーザのみ、全体が対象
            // TODO: idだけ取り出したい query?
            targets = await User.findAll({
                where: {
                    online: true,
                },
                // attributes: ["id"],
            });

            targets = targets.filter((t: User) => {
                return t.id !== user.id;
            });

            body.targetUserId = targets.map((target) => {
                return target.id;
            });
        }
    }

    let spellExecutor: SpellExecutor;
    let btl: Battle;

    const card = await Card.findOne({
        where: {
            cardNo: prop.cardNo,
        },
    });

    if (!card) {
        res.status(404).json({
            message: "user do not have card(cardNo = " + cardNo + ")",
        });
        return;
    }

    // TODO: roomId
    btl = new Battle({
        roomId: 1,
        type: BattleType.Spell,
        state: SpellBattleState.Finished,
        action: card.name,
        attackerId: user.id,
    });

    btl = await btl.save();

    const resultLogger = new SpellResultLogger(btl, card);

    if (Array.isArray(body.targetUserId)) {
        // TODO: validate targetUserId
        // is there in your area or distance?

        const targetUsers = await User.findAll({
            where: {
                id: body.targetUserId,
                online: true,
            },
            include: [UserProperty],
        });
        spellExecutor = new SpellExecutor(user, targetUsers, resultLogger);
    } else {
        const targetUser = await User.findOne({
            where: {
                id: body.targetUserId,
            },
            include: [UserProperty],
        });
        if (!targetUser) {
            spellExecutor = new SpellExecutor(user, [], resultLogger);
        } else {
            spellExecutor = new SpellExecutor(user, [targetUser], resultLogger);
        }
    }

    await spellExecutor.setAttack(cardNo, body.spellOption);
    const result = await spellExecutor.run();

    if (!result) {
        res.status(500).json({
            message: "failure",
        });
    }

    res.status(200).json({
        message: "success",
    });
}

export {
    getAllCards,
    getCard,
    postCard,
};
