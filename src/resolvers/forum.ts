import { createForum, getDatabase, joinForum, listForums, postMessage } from "../database";

export type User = {
  id?: number;
  name: string;
  picture: string;
};

export type Message = {
  date: string;
  user: number;
  message: string;
};

export type Forum = {
  id?: number;
  users: number[];
  messages: Message[];
};

export const forumResolver = {
  RootQuery: {
    getDatabase: () => getDatabase(),
    listForums: (parent, args: { user_id?: string }) => {
      return listForums(args.user_id);
    },
  },
  RootMutation: {
    postMessage: (parent, args: { user_id: string; forum_id: string; message: string }) => {
      return postMessage(args.user_id, args.forum_id, args.message);
    },
    createForum: (parent, args: { user_id: string }) => {
      return createForum(args.user_id);
    },
    joinForum: (parent, args: { user_id: string; forum_id: string }) => {
      return joinForum(args.user_id, args.forum_id);
    },
  },
};
