import { ApolloServer, gql } from "apollo-server";
import { schema } from "./graphql/schema";
import { createContext } from "./graphql/context";

const server = new ApolloServer({
  context: createContext(),
  schema,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});