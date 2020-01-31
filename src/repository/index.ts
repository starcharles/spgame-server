import {BattleHistoryRepository} from "./battleHistoryRepository";
import {BattleRepository} from "./battleRepository";
import {CardRepository} from "./cardRepository";
import {RoomRepository} from "./roomRepository";
import {UserPropertyRepository} from "./userPropertyRepository";
import {UserRepository} from "./userRepository";

type repoType = "User" | "Room" | "Battle" | "BattleHistory" | "UserProperty" | "Card";

export class Repository {
    public static getRepository(name: repoType) {
        let repo;

        switch (name) {
            case "User":
                repo = new UserRepository();
                break;
            case "Room":
                repo = new RoomRepository();
                break;
            case "UserProperty":
                repo = new UserPropertyRepository();
                break;
            case "Battle":
                repo = new BattleRepository();
                break;
            case "BattleHistory":
                repo = new BattleHistoryRepository();
                break;
            case "Card":
                repo = new CardRepository();
                break;
            default:
                throw new Error(`repository name = ${name} is not found`);
        }
        return repo;
    }
}
