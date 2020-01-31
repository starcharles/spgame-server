import * as config from "config";
import {Sequelize} from "sequelize-typescript";

export let sequelize;
export const dbInit = () => {
    sequelize = new Sequelize({
        host: config.get<string>("database.url"),
        database: config.get<string>("database.dbname"),
        dialect: config.get<string>("database.dialect"),
        username: config.get<string>("database.username"),
        password: config.get<string>("database.password"),
        modelPaths: [__dirname + "/../src/models/*.ts"],
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
            modelPaths: [__dirname + "/../src/models/*.ts"],
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        });
        return sequelize;
    }

    return sequelize;
};
