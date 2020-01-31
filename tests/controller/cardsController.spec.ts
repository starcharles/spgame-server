import admin from "firebase-admin";

import {Repository} from "../../src/repository";
import {UserRepository} from "../../src/repository/userRepository";
import {fadmin} from "../../src/server";
import {AuthService} from "../../src/service/authService";
import {seedData} from "../fixture/controller/cardsController";
import {initializeDB} from "../fixture/seed";

const request = require("supertest");
const app = require("../../src/server").app;

describe("CardsController test", () => {
    let sequelize;
    const apiBase = "/api/v1";

    describe("GET /card/:cardNo", () => {
        let MockVerifyIdToken;
        beforeEach(async () => {
            sequelize = await initializeDB(seedData);
            // mock
            // setup mock function
            MockVerifyIdToken
                = jest.fn()
                .mockImplementation(() => {
                    return Promise.resolve({
                        uid: "uid1111111111",
                    });
                }).mockName("MockVerifyIdToken");

            admin.auth(fadmin).verifyIdToken = MockVerifyIdToken;

            AuthService.getDecodedToken = jest.fn((req: any) => {
                return {
                    uid: "uid1111111111",
                };
            });
        });

        afterEach(async () => {
            await sequelize.close();
        });

        it("should get 200 status", async (done) => {
            const response = await request(app).get(`${apiBase}/card/1021`)
                .set("authorization", "Bearer " + "aaaaaaaaaaaa");
            console.log(response);

            expect(MockVerifyIdToken).toHaveBeenCalledTimes(1);
            expect(AuthService.getDecodedToken).toHaveBeenCalledTimes(1);

            expect(response.status).toEqual(200);
            expect(response.body).toMatchObject({
                cardNo: 1021,
                cardType: 2,
                limit: 100,
                name: "rob",
                nameJa: "強奪",
                rank: "b",
                spell: {
                    id: 1,
                    cardNo: 1021,
                    isInteractive: true,
                    isMultipleTarget: false,
                    spellType: "attack",
                    targetType: 1,
                },
            });
            done();
        });

        it("should get 404 status for invalid cardNo", async (done) => {
            const response = await request(app).get(`${apiBase}/card/aaa`)
                .set("authorization", "Bearer " + "aaaaaaaaaaaa");

            expect(MockVerifyIdToken).toHaveBeenCalledTimes(1);
            expect(AuthService.getDecodedToken).toHaveBeenCalledTimes(1);

            expect(response.status).toEqual(404);
            expect(response.body).toEqual({
                message: "cardNo is not valid",
            });

            const response2 = await request(app).get(`${apiBase}/card/100000`)
                .set("authorization", "Bearer " + "aaaaaaaaaaaa");

            expect(MockVerifyIdToken).toHaveBeenCalledTimes(2);
            expect(AuthService.getDecodedToken).toHaveBeenCalledTimes(2);
            expect(response2.status).toEqual(404);
            expect(response2.body).toEqual({
                message: "card not found",
            });
            done();
        });
    });

    describe("POST /card/:cardNo", () => {
        let MockVerifyIdToken;

        beforeEach(async () => {
            sequelize = await initializeDB(seedData);

            // setup mock function
            MockVerifyIdToken
                = jest.fn()
                .mockImplementation(() => {
                    return Promise.resolve({
                        uid: "uid1111111111",
                    });
                }).mockName("MockVerifyIdToken");

            admin.auth(fadmin).verifyIdToken = MockVerifyIdToken;

            AuthService.getDecodedToken = jest.fn((req: any) => {
                return {
                    uid: "uid1111111111",
                };
            }).mockName("getDecodedToken");
        });

        afterAll(async () => {
            await sequelize.close();
        });

        it("should return 404 if user doesn/t have card", async (done) => {
            const response = await request(app)
                .post(`${apiBase}/card/100000`)
                .send({})
                .set("authorization", "Bearer " + "aaaaaaaaaaaa");

            expect(MockVerifyIdToken).toHaveBeenCalledTimes(1);
            expect(AuthService.getDecodedToken).toHaveBeenCalledTimes(1);
            expect(AuthService.getDecodedToken.mock.results[0].value).toEqual({
                uid: "uid1111111111",
            });
            expect(response.status).toEqual(404);
            expect(response.body).toEqual({
                message: "user do not have card(cardNo = " + "100000)",
            });
            done();

        });

        it("should have have authorization header", async (done) => {
            // 強奪を使用(ただしnon-interactive)
            const response = await request(app)
                .post(`${apiBase}/card/1021`)
                .send({
                    targetUserId: 2,
                    spellOption: {
                        targetCardNo: 2,
                    },
                })
                .set("authorization", "Bearer " + "aaaaaaaaaaaa");

            expect(MockVerifyIdToken).toHaveBeenCalledTimes(1);
            expect(AuthService.getDecodedToken).toHaveBeenCalledTimes(1);
            expect(AuthService.getDecodedToken.mock.results[0].value).toEqual({
                uid: "uid1111111111",
            });
            expect(response.status).toEqual(200);
            expect(response.body).toEqual({
                message: "success",
            });
            done();
        });

        describe("POST /card/1018, Levy", () => {
            it("should execute 徴収,Levy(cardNo.1018)", async (done) => {
                const response = await request(app)
                    .post(`${apiBase}/card/1018`)
                    .send({})
                    .set("authorization", "Bearer " + "aaaaaaaaaaaa");

                expect(AuthService.getDecodedToken).toHaveBeenCalledTimes(1);
                expect(AuthService.getDecodedToken.mock.results[0].value).toEqual({
                    uid: "uid1111111111",
                });
                expect(response.status).toEqual(200);
                expect(response.body).toEqual({
                    message: "success",
                });

                done();
            });

            it("should execute 徴収,Levy(cardNo.1018) with validity of card numbers", async (done) => {
                const response = await request(app)
                    .post(`${apiBase}/card/1018`)
                    .send({})
                    .set("authorization", "Bearer " + "aaaaaaaaaaaa");

                expect(AuthService.getDecodedToken).toHaveBeenCalledTimes(1);
                expect(AuthService.getDecodedToken.mock.results[0].value).toEqual({
                    uid: "uid1111111111",
                });
                expect(response.status).toEqual(200);
                expect(response.body).toEqual({
                    message: "success",
                });

                const userRepo: UserRepository = Repository.getRepository("User");
                const attackerAfterRunSpell = await userRepo.getUserById(1);
                const props = attackerAfterRunSpell.userProperties;
                // Levy disappears after spell ran
                expect(props).not.toBeNull();
                // expect(props.length).toBe(5 - 1 + 2);
                const levy = props.find((up) => {
                    return up.cardNo === 1018;
                });
                expect(levy).toBeUndefined();

                // user2
                const user2 = await userRepo.getUserById(2);
                expect(user2.userProperties.length).toBe(3);
                // user3
                const user3 = await userRepo.getUserById(3);
                expect(user3.userProperties.length).toBe(3);

                // user4 is online:false. not affected.
                const user4 = await userRepo.getUserById(4);
                expect(user4.userProperties.length).toBe(2);

                done();
            });

        });
    })
    ;
});
