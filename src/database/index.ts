import fixtures from "../fixtures.json";

const database = { ...fixtures };

export const userExists = (user_id?: number) => {
  return !user_id || database.users.some((user) => user.id === user_id) ? true : false;
};

export const listForums = (user_id?: number) => {
  if (!userExists(user_id)) return { __typename: "Error", message: "User does not exists" };

  const forums = user_id ? database.forums.filter((forum) => forum.users.includes(user_id)) : database.forums;

  const sortedForums = forums.map((forum) => {
    return {
      ...forum,
      messages: forum.messages
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((message) => {
          const user = database.users.filter((user) => user.id === message.user)[0];
          return { ...message, name: user.name, picture: user.picture };
        }),
    };
  });

  return { __typename: "Forums", forums: sortedForums };
};

export const joinForum = (user_id: number, forum_id: number) => {
  if (!userExists(user_id)) return { __typename: "Error", message: "User does not exists" };

  const forum_exists = database.forums.some((forum) => forum.id === forum_id);

  if (forum_exists) {
    const userJoined = database.forums.filter((forum) => forum.id === forum_id)[0].users.includes(user_id);
    if (userJoined) return { __typename: "Error", message: "User already joined" };

    database.forums = database.forums.map((forum) =>
      forum.id === forum_id ? { ...forum, users: [...forum.users, user_id] } : forum
    );

    return { ...database.forums.filter((forum) => forum.id === forum_id)[0], __typename: "Forum" };
  } else {
    return { __typename: "Error", message: "Forum does not exists" };
  }
};

export const createForum = (user_id: number) => {
  if (!userExists(user_id)) return { __typename: "Error", message: "User does not exists" };

  const newForum = { id: database.forums.length + 1, users: [user_id], messages: [] };
  database.forums.push(newForum);

  return { ...newForum, __typename: "Forum" };
};

export const postMessage = (user_id: number, forum_id: number, message: string) => {
  if (!userExists(user_id)) return { __typename: "Error", message: "User does not exists" };

  const newMessage = { user: user_id, message: message, date: new Date().toISOString() };
  database.forums = database.forums.map((forum) =>
    forum.id === forum_id ? { ...forum, messages: [...forum.messages, newMessage] } : forum
  );

  return { ...newMessage, __typename: "Message" };
};

export const getDatabase = () => database;
