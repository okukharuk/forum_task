import { gql } from "apollo-server-express";

export const rootSchema = gql(`
    scalar ObjectID

    type User {
        _id: ObjectID
        name: String
        picture: String
    }

    type Message {
        user: User
        createdAt: String
        message: String!
    }

    type Forum {
        _id: ObjectID
        users: [ObjectID]
        messages: [Message]
    }

    type Database {
        forums: [Forum]
        users: [User]
    }
    
    type Error {
        message: String!
    }

    type Forums {
        forums: [Forum]
    }
    
    union PostMessageResult = Message | Error
    union JoinForumResult = Forum | Error
    union CreateForumResult = Forum | Error 
    union ListForumsResult = Forums | Error 

    type RootQuery {
        getDatabase: Database!
        listForums(user_id: String): ListForumsResult!
    }

    type RootMutation {
        postMessage(user_id: String!, forum_id: String!, message: String!): PostMessageResult!
        joinForum(user_id: String!, forum_id: String!): JoinForumResult!
        createForum(user_id: String!): CreateForumResult!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
