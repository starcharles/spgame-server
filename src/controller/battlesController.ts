import * as express from "express";

import Battle from "../models/battle";
import {Repository} from "../repository";
import {BattleRepository} from "../repository/battleRepository";

async function getAllBattles(req: express.Request, res: express.Response, next: express.NextFunction) {
    const btlRepo = Repository.getRepository("Battle") as BattleRepository;
    const battles = await btlRepo.getAll();
    if (!battles) {
        res.json([]);
        return;
    }

    const response: Battle[] = [];
    for (const btl of battles) {
        response.push(btl.toJSON());
    }
    res.json(response);
}

async function getBattle(req: express.Request, res: express.Response, next: express.NextFunction) {

    // const userId = +req.params.userId;
    const userId = 1;
    const btlRepo = Repository.getRepository("Battle") as BattleRepository;
    const battles = await btlRepo.getBattleByUserId(userId);
    if (!battles) {
        res.json([]);
        return;
    }

    const response: Battle[] = [];
    for (const btl of battles) {
        response.push(btl.toJSON());
    }
    res.json(response);
}

export {
    getBattle,
    getAllBattles,
};
