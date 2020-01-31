import * as express from "express";

import UserProperty from "../models/userProperty";
import {Repository} from "../repository";
import {UserPropertyRepository} from "../repository/userPropertyRepository";

async function getProperties(req: express.Request, res: express.Response, next: express.NextFunction) {
    const userId = req.params.userId;
    const userPropertyRepository = Repository.getRepository("UserProperty") as UserPropertyRepository;
    const uprops = await userPropertyRepository.getUserPropertiesByUserId(userId);
    const response: UserProperty[] = [];
    for (const uprop of uprops) {
        response.push(uprop.toJSON());
    }
    return res.json(response);
}

export {
    getProperties,
};
