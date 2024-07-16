import mongoose, { Schema } from "mongoose";

const CardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  translate: {
    type: String,
    required: true,
  },
});

export const Card = mongoose.model("Card", CardSchema);
