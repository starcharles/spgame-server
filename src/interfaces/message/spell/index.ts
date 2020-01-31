export interface ISpellAttackedMessage {
    battleId: number;
    userId: number;
    message: string;
    cardNo: number;
    spellOption: SpellOption;
}

export interface ISpellResponseMessage  {
    battleId: number;
    cardNo: number;
    spellOption?: SpellOption;
}

export interface ISpellStartMessage {
    cardNo: number;
    usedBy: number;
    targetUserId: number; // targetUser
    targetRoomId?: number;
    spellOption: SpellOption;
}

export interface SpellOption  {
    targetCardNo?: number;
    changeCardNo?: number;
}

export interface ISpellResultMessage {
    result: "success" | "failure";
    message?: string;
    cardNo?: number;
    ownerId?: number;
}
