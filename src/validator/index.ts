import {ISpellResultMessage, ISpellStartMessage} from "../interfaces/message/spell";
import Card, {CardType} from "../models/card";
import User, {UserState} from "../models/user";
import UserProperty, {PocketType} from "../models/userProperty";
import {Repository} from "../repository";
import {UserPropertyRepository} from "../repository/userPropertyRepository";

const validateStartMessage = async (data: ISpellStartMessage, user: User, targetUser: User, card?: Card) => {
    let msg: ISpellResultMessage;
    if (!data) {
        msg = {
            result: "failure",
            message: "ISpellStartMessage is empty",
        };
        return msg;
    }
    if (user.roomId !== targetUser.roomId) {
        msg = {
            result: "failure",
            message: "room is not the same",
        };
        return msg;
    }

    if (!data.cardNo) {
        msg = {
            result: "failure",
            message: "spell not specified",
        };
        return msg;
    }
    // check user's state
    if (user.state === UserState.Battle) {
        msg = {
            result: "failure",
            message: "user.state = UserState.Battle",
        };
        return msg;
    }
    if (targetUser.state === UserState.Battle) {
        msg = {
            result: "failure",
            message: "target's user.state = UserState.Battle",
        };
        return msg;
    }
    if (!card) {
        msg = {
            result: "failure",
            message: `attack card is not found. cardNo = ${data.cardNo}`,
        };
        return msg;
    }

    let uprop: UserProperty[];
    const userPropertyRepository = Repository.getRepository("UserProperty") as UserPropertyRepository;

    if (needTargetCardNo(card)) {
        const targetCardNo = data.spellOption.targetCardNo;
        if (!targetCardNo) {
            msg = {
                result: "failure",
                message: "SpellOption.targetCardNo is not specified",
            };
            return msg;
        }

        uprop = await userPropertyRepository.getUserPropertiesByUserIdAndCardNo(data.targetUserId, targetCardNo);

        if (!uprop) {
            msg = {
                result: "failure",
                message: "target card is not found in UserProperty.",
            };
            return msg;
        }
    }
    uprop = await userPropertyRepository.getUserPropertiesByUserId(data.targetUserId);

    if (!uprop) {
        msg = {
            result: "failure",
            message: "target user doesn't have any cards.",
        };
        return msg;
    }

    if (card.cardType !== CardType.Spell) {
        msg = {
            result: "failure",
            message: `specified cardNo = (${card.cardNo}) is not SpellCard`,
        };
        return msg;
    }
    if (!hasCardInTargetPocket(card, data)) {
        msg = {
            result: "failure",
            message: "target user doesn't have card in target pockets.",
        };
        return msg;
    }

    msg = {
        result: "success",
        message: "All validation check passed.",
    };

    return msg;
};

function needTargetCardNo(card?: Card): boolean {
    if (!card) {
        return false;
    }
    if (card.cardType !== CardType.Spell) {
        return false;
    }

    const cardname = ["rob"].find((name: string) => {
        return name === card.name;
    });

    return !!cardname;
}

async function hasCardInTargetPocket(card: Card, data: ISpellStartMessage) {
    const userPropertyRepository = Repository.getRepository("UserProperty") as UserPropertyRepository;

    let uprop: UserProperty[];
    switch (card.name) {
        case "pickPocket":
            uprop = await userPropertyRepository.getUserPropertiesByUserIdAndPocketTypes(data.targetUserId, [PocketType.Normal]);
            if (uprop) {
                return true;
            }
            break;
    }
    return false;
}

export const Validator = {
    validateStartMessage,
};
