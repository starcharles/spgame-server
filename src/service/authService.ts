import {NextFunction, Request, Response} from "express";
import * as admin from "firebase-admin";

import {fadmin} from "../server";

export class AuthService {
    public static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }

    public static getDecodedToken(req: Request) {
        const token = AuthService.getAuthorizationToken(req);
        return AuthService.getInstance()._decodeToken(token);
    }

    public static decodeToken(token: string) {
        return AuthService.getInstance()._decodeToken(token);
    }

    public static async isAuthenticated(req: Request, res: Response, next: NextFunction) {
        return await AuthService.getInstance()._isAuthenticated(req, res, next);
    }

    public static getAuthorizationToken(req: Request) {
        if (!req.headers.authorization) {
            throw new Error("Authorization header is not set");
        }
        const header = req.headers.authorization;

        const result = header.match(/Bearer (.+)/);
        if (!result || !result[1]) {
            throw new Error("token not set");
        }

        return result[1];
    }

    private static instance: AuthService;
    private admin: any;

    private constructor() {
        // admin.initializeApp({
        //     credential: admin.credential.cert(serviceAccount),
        //     databaseURL: firebaseSetting.databaseURL,
        // });
        this.admin = fadmin;
    }

    private async _isAuthenticated(req: Request, res: Response, next: NextFunction) {
        const token = AuthService.getAuthorizationToken(req);
        const decoded = await this.admin.auth(fadmin).verifyIdToken(token);

        if (!decoded.uid) {
            throw new Error("Authorization failed");
        }
        next();
    }

    private _decodeToken(token: string) {
        return this.admin.auth(fadmin).verifyIdToken(token);
    }
}
