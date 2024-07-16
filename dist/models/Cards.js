"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cards = void 0;
const mongoose_1 = require("mongoose");
const CardsSchema = new mongoose_1.Schema({
    language: {
        type: String,
        required: true,
    },
    isPrivate: {
        type: Boolean,
        required: true,
        default: false,
    },
    lessonName: {
        type: String,
        required: true,
    },
    preview: {
        type: String,
    },
    cards: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Card",
    },
});
exports.Cards = (0, mongoose_1.model)("Cards", CardsSchema);
