import { ObjectId } from "mongodb";
import mongoose from "mongoose";

import { DB_CONN_STRING } from "../constants";
import { Forum } from "../models/forum";
import { User } from "../models/user";

export const userExists = async (user_id?: string) => {
  if (!user_id) return true;
  const user = await User.findOne({ _id: new Object(user_id) }).lean();
  return !!user;
};

export const listForums = async (user_id?: string) => {
  if (!(await userExists(user_id))) return { __typename: "Error", message: "User does not exists" };

  const forums = await Forum.aggregate([
    ...(user_id ? [{ $match: { users: new ObjectId(user_id) } }] : []),
    {
      $project: {
        _id: 1,
        users: 1,
        messages: {
          $sortArray: {
            input: "$messages",
            sortBy: 1,
          },
        },
      },
    },
    { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "messages.user",
        foreignField: "_id",
        as: "messages.user",
      },
    },
    { $unwind: { path: "$messages.user", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$_id",
        forum: { $first: "$$ROOT" },
        messages: { $push: "$messages" },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$forum",
            {
              messages: {
                $cond: {
                  if: { $ne: [{ $arrayElemAt: ["$messages", 0] }, {}] },
                  then: "$messages",
                  else: [],
                },
              },
            },
          ],
        },
      },
    },
  ]);

  return { __typename: "Forums", forums: forums };
};

export const joinForum = async (user_id: string, forum_id: string) => {
  if (!(await userExists(user_id))) return { __typename: "Error", message: "User does not exists" };
  const forum = await Forum.findOneAndUpdate(
    { _id: forum_id },
    { $addToSet: { users: new ObjectId(user_id) } },
    { new: true }
  )
    .populate("messages.user")
    .lean();

  return { ...forum, __typename: "Forum" };
};

export const createForum = async (user_id: string) => {
  if (!(await userExists(user_id))) return { __typename: "Error", message: "User does not exists" };

  const forum = await Forum.create({ users: [user_id] });

  return { ...forum, __typename: "Forum" };
};

export const postMessage = async (user_id: string, forum_id: string, message: string) => {
  if (!(await userExists(user_id))) return { __typename: "Error", message: "User does not exists" };

  await Forum.updateOne({ _id: forum_id }, { $push: { messages: { user: user_id, message: message } } }).lean();

  return { message: message, __typename: "Message" };
};

export const getDatabase = async () => {
  const forums = await Forum.find({});
  const users = await User.find({});

  return { forums: forums, users: users };
};

export const connectToDatabase = async () => {
  mongoose.connect(DB_CONN_STRING);
};

connectToDatabase();
