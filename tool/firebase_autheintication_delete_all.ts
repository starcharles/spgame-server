import * as admin from "firebase-admin";

const serviceAccount = require("../config/spgame-satons-firebase-adminsdk-mf8qf-6e2a9ad8af.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spgame-satons.firebaseio.com",
});

const sleep = (msec: number) => {
  // @ts-ignore
  return new Promise((resolve) => setTimeout(resolve, msec));
};

// @ts-ignore
(async () => {
  const users = await admin.auth().listUsers();
  for (const user of users.users) {
    console.log(user.uid);
    await admin.auth().deleteUser(user.uid);
    await sleep(50); // 速すぎると`QUOTA_EXCEEDED`になるので適当に間隔を開ける
  }
})();
