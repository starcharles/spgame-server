import * as express from "express";
import * as admin from "firebase-admin";

import {AuthService} from "../service/authService";

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const token = AuthService.getAuthorizationToken(req);
        const decoded = await admin.auth().verifyIdToken(token);

        if (!decoded.uid) {
            throw new Error("Authorization failed");
        }
        next();
    } catch (e) {
        next(e);
    }
};
