const assert = require("assert");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_2");
    const { data } = req.body;
    const result = await db.collection("greetings").insertOne(req.body);
    assert.strictEqual(1, result.insertedCount);

    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }

  client.close();
};

const getGreeting = async (req, res) => {
  const _id = req.params._id;
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_2");
  await db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

const getGreetings = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_2");
  await db
    .collection("greetings")
    .find()
    .toArray((err, result) => {
      if (result.length) {
        const start = Number(req.query.start) || 0;
        const cleanStart = start > -1 && start < result.length ? start : 0;
        const end = cleanStart + (Number(req.query.limit) || 25);
        const cleanEnd = end > result.length ? result.length - 1 : end;
        const data = result.slice(cleanStart, cleanEnd);
        res.status(200).json({ status: 200, data: data });
      } else {
        res.status(404).json({ status: 404, data: "not found!" });
      }
      client.close();
    });
};

const deleteGreeting = async (req, res) => {
  const _id = req.params._id;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_2");
    const result = await db.collection("greetings").deleteOne({ _id });
    assert.strictEqual(1, result.deletedCount);

    res.status(204).json({ status: 204, message: "Deleted!" });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }

  client.close();
};

const updateGreeting = async (req, res) => {
  const _id = req.params._id;
  const hello = req.body;
  if (!hello) {
    res.status(400).json({
      status: 400,
      data: req.body,
      message: "Only 'hello' may be updated.",
    });
    return;
  }
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_2");
    const query = { _id };
    const newValues = { $set: hello };
    const result = await db.collection("greetings").updateOne(query, newValues);

    assert.strictEqual(1, result.matchedCount);
    assert.strictEqual(1, result.modifiedCount);

    res.status(200).json({ status: 200, _id, message: "updated!" });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }

  client.close();
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
