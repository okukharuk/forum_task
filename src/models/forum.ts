import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    user: { type: Schema.ObjectId, ref: "User" },
    message: String,
  },
  { timestamps: true }
);

const forumSchema = new Schema({
  users: { type: [{ type: Schema.ObjectId, ref: "User" }], default: [] },
  messages: { type: [messageSchema], default: [] },
});

export const Forum = mongoose.model("Forum", forumSchema);
