const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

console.log({ MONGO_URI });

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);

  // connect to the client
  await client.connect();

  // connect to the database (db name is provided as an argument to the function)
  const db = client.db("Exercise_1");
  const { name } = req.body;
  await db.collection("users").insertOne({ name });

  res.status(201).json({ status: 201, data: req.body });
  // close the connection to the database server
  client.close();
};

module.exports = { addUser };
