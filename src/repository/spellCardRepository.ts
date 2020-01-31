import Card from "../models/card";
import SpellCard from "../models/spellCard";

export class SpellCardRepository {
    public async getAllCards(): Promise<Card[] | null> {
        return await Card.findAll();
    }

    public async getCardById(cardNo: number): Promise<Card | null> {
        return await Card.findByPk(cardNo, {
            include: [SpellCard],
        });
    }
}
