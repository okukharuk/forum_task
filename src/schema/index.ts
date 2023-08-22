import { gql } from "apollo-server-express";

export const rootSchema = gql(`
    type User {
        id: Int
        name: String
        picture: String
    }

    type Message {
        user: Int
        date: String
        name: String
        picture: String
        message: String!
    }

    type Forum {
        id: Int
        users: [Int]
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
        listForums(user_id: Int): ListForumsResult!
    }

    type RootMutation {
        postMessage(user_id: Int!, forum_id: Int!, message: String!): PostMessageResult!
        joinForum(user_id: Int!, forum_id: Int!): JoinForumResult!
        createForum(user_id: Int!): CreateForumResult!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
