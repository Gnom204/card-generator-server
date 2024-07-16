import { model, Schema } from "mongoose";

const CardsSchema = new Schema({
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
    type: [Schema.Types.ObjectId],
    ref: "Card",
  },
});

export const Cards = model("Cards", CardsSchema);
