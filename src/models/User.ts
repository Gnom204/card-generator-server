import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cardsWithLang: {
    type: [Schema.Types.ObjectId],
    ref: "Cards",
  },
});

export const User = mongoose.model("User", UserSchema);
