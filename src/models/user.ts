import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema({
  name: String,
  picture: String,
});

export const User = mongoose.model("User", userSchema);
