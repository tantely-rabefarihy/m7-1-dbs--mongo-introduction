const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db("Exercise_1");
  const users = await db.collection("users").find().toArray();
  //   console.log({ users });
  if (!users.length) {
    res.status(400).json({ status: 400, message: "Not here" });
  }
  res.status(200).json({ status: 200, data: users });

  client.close();
};

module.exports = { getUsers };
