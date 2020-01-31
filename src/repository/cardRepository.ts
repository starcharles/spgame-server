import Card from "../models/card";
import SpellCard from "../models/spellCard";

export class CardRepository {
    public async getAllCards(): Promise<Card[] | null> {
        return await Card.findAll({
            include: [SpellCard],
        });
    }

    public async getCardByNo(cardNo: number): Promise<Card | null> {
        return await Card.findOne({
            where: {
                cardNo,
            },
            include: [SpellCard],
        });
    }
}
