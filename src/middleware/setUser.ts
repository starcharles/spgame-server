import {NextFunction, Request, Response} from "express";

import User from "../models/user";
import UserProperty from "../models/userProperty";
import {AuthService} from "../service/authService";

export const setUser = (option?: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // middleware to set user
        // and Authorization: header token validation
        if (req.headers.authorization) {
            const decoded = await AuthService.getDecodedToken(req);
            const uid = decoded.uid;
            const user = await
                User.findOne({
                    where: {
                        uid,
                    },
                    include: [UserProperty],
                });
            if (user) {
                (req as any).user = user;
            }
        }
        next();
    };
};
