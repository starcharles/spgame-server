const EVENTS = {
    CLIENT: {
        CONNECT: "connect",
        DISCONNECT: "disconnect",
        NEW_MESSAGE: "new_message",
        USER_JOIN: "user_joined",
        USER_LEFT: "user_left",
        // spell
        SPELL_ATTACKED: "spell_attacked",
        SPELL_RESULT: "spell_result",
    },
    SERVER: {
        ADD_USER: "add_user",
        NEW_MESSAGE: "new_message",
        SPELL_START: "spell_start",
        SPELL_RESPONSE: "spell_response",
    },
};

export {
    EVENTS,
};
