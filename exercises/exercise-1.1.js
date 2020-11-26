const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

console.log({ MONGO_URI });

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbFunction = async (dbName) => {
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);

  // connect to the client
  await client.connect();

  // connect to the database (db name is provided as an argument to the function)
  const db = client.db(dbName);
  await db.collection("users").insertOne({ name: "Buck Rogers" });
  console.log("connected!");

  // close the connection to the database server
  client.close();
  console.log("disconnected!");
};

dbFunction("Exercise_1");

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://tantelyrab:<password>@cluster0.fnb66.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
