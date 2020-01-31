import * as config from "config";
import {Sequelize} from "sequelize-typescript";

import {server} from "./server";

const port = process.env.PORT || 3000;

export let sequelize = new Sequelize({
    host: config.get<string>("database.url"),
    port: config.get<number>("database.dbPort"),
    database: config.get<string>("database.dbname"),
    dialect: config.get<string>("database.dialect"),
    // dialectOptions: {
    //     ssl: {
    //         key: cKey,
    //         cert: cCert,
    //         ca: cCA
    //     },
    // },
    username: config.get<string>("database.username"),
    password: config.get<string>("database.password"),
    modelPaths: [__dirname + "/models"],
    logging: console.log,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

if (process.env.NODE_ENV === "sqlite") {
    sequelize = new Sequelize({
        host: "localhost",
        database: "mygamedb",
        dialect: "sqlite",
        username: "root",
        password: "",
        storage: __dirname + "/../" + config.get("database.filename"),
        modelPaths: [__dirname + "/models"],
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    });
}

if (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "sqlite") {
    server.listen(port, () => {
        console.log("Server listening at port %d", port);
    });
}
