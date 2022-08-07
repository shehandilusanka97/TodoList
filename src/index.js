const { ApolloServer, gql } = require('apollo-server');
import dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
dotenv.config();
const{DB_URI, DB_NAME} = process.env;

const books = [
    {
      title: 'The Awakening ck',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ];

 

const typeDefs = gql`
  
  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      books: () => books,
    },
  };
  console.log(DB_URI);
  const {
    ApolloServerPluginLandingPageLocalDefault
  } = require('apollo-server-core');
  
const start = async () => {
  const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  await client.connect();
  const db = client.db(DB_NAME);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
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