import { ApolloServer } from "apollo-server-express";
import express from "express";

import { PORT } from "./constants";
import { rootResolver as graphQlResolvers } from "./resolvers";
import { rootSchema as graphQlSchema } from "./schema";

const app = express();

const startApollo = async () => {
  const server = new ApolloServer({
    typeDefs: graphQlSchema,
    resolvers: graphQlResolvers,
  });
  await server.start();
  server.applyMiddleware({ app });
};

startApollo();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

app.listen({ port: PORT }, () => console.log(`Server started on port ${PORT}`));
