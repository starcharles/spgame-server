import * as bodyParser from "body-parser";
import * as config from "config";
import * as cors from "cors";
import * as express from "express";
import * as admin from "firebase-admin";
import * as http from "http";
import * as IO from "socket.io";

import {firebaseSetting} from "../config/firebase";

import {getAllBattles, getBattle} from "./controller/battlesController";
import {getAllCards, getCard, postCard} from "./controller/cardsController";
import {postHunt} from "./controller/postHuntController";
import {postSpell, postSpellGacha} from "./controller/spellController";
import {getProperties} from "./controller/userPropertiesController";
import {
    getContactUsers,
    getUser,
    getUserByUserId,
    getUsers,
    postContactUser,
    postUser,
} from "./controller/usersController";
import {isAuthenticated, setUser} from "./middleware";
import {asyncMw} from "./middleware/ayncMw";
import {onConnection} from "./ws";

const serviceAccount = require("../config/spgame-satons-firebase-adminsdk-mf8qf-6e2a9ad8af.json");

const helmet = require("helmet");
const log4js = require("log4js");
log4js.configure({
    appenders: {
        console: {type: "console"},
        system: {type: "file", filename: "app.log"},
    },
    categories: {
        default: {appenders: ["system", "console"], level: "debug"},
    },
});

let logger: any;
if (config.get<boolean>("log")) {
    logger = log4js.getLogger("system");
} else {
    logger = log4js.getLogger();
}

require("express-namespace");
export const app: any = express();
export const server = http.createServer(app);
export const io = IO(server);

// (参考ミドルウェア):   https://github.com/sahat/hackathon-starter/blob/master/app.js
// const lusca = require('lusca');

// TODO: Auth(io)
// io.use()

// TODO: originを限定したい
app.use(cors({
    origin: config.get<string>("ALLOW_ORIGIN"), // default "*"
}));
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(helmet());
app.use(bodyParser.json());
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    // var yellow  = '\u001b[33m';
    logger.info("\u001b[33m %s %s %s", req.method, req.url, req.path);
    logger.info("req.headers:" + JSON.stringify(req.headers));
    logger.info("req.params:" + JSON.stringify(req.params));
    logger.info("req.body:" + JSON.stringify(req.body));
    next();
});

app.namespace("/api", () => {
    app.namespace("/v1", () => {
        app.post("/users/:uid/contact", postContactUser);
        app.get("/users/:uid/contacts", getContactUsers);
    });
});

export let fadmin: admin.app.App;
if (config.get<boolean>("auth")) {
    fadmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: firebaseSetting.databaseURL,
    });

    app.use(isAuthenticated);
    app.use(setUser());
}

app.namespace("/api", () => {
    app.namespace("/v1", () => {
        // マスタ系
        app.get("/cards", asyncMw(getAllCards));
        app.get("/battles", asyncMw(getAllBattles));
        // その他
        app.get("/users", asyncMw(getUsers));
        app.get("/user", asyncMw(getUser));
        app.get("/user/:userId", asyncMw(getUserByUserId));
        app.post("/user/new", asyncMw(postUser));
        app.get("/card/:cardNo", asyncMw(getCard));
        app.post("/card/:cardNo", asyncMw(postCard));
        app.get("/battles/:userId", asyncMw(getBattle));
        app.get("/properties/:userId", asyncMw(getProperties));
        app.post("/spell", asyncMw(postSpell));

        // 探索
        app.post("/hunt", asyncMw(postHunt));
        // スペルガチャ
        app.post("/spell/gacha", asyncMw(postSpellGacha));
    });
});

const options = {};
io.on("connection", onConnection(io, options));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(err);
    return res.status(500).json({
        code: 500,
        message: err.message,
    });
});
