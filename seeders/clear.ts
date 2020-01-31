import {dbInit} from "./dbInit";

(async () => {
    const sequelize = dbInit();
    await sequelize.sync({force: true});
})();
