const { ApolloServer, gql } = require('apollo-server');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
dotenv.config();
const{DB_URI, DB_NAME} = process.env;



const typeDefs = gql`
  type Query {
    myTaskLists: [TaskList!]!
  }

  type User{
   id: ID!
   name: String!
   email: String!
   avatar: String
  }
  type TaskList{
    id:ID!
    createdAt: String!
    title: String!
    progress: Float!

    users:[User!]!
    todos:[ToDo!]!
  }
  type ToDo{
    id:ID!
    content: String!
    isCompleted: Boolean!
    taskList: TaskList!
  }

`;

const resolvers = {
  Query: {
    myTaskLists: () => []
  }
}
  const {
    ApolloServerPluginLandingPageLocalDefault
  } = require('apollo-server-core');
  
const start = async () => {
  const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  await client.connect();
  const db = client.db(DB_NAME);

  const context ={
    db,
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    csrfPrevention: true,
    cache: 'bounded',
   
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}
start();