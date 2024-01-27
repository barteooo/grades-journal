const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");
const authMiddleware = require("../middlewares/authmiddleware");
const router = express.Router();

module.exports = router;

router.get("", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);
  try {
    const { classId, subjectId } = req.query;
    const classesCollection = client
      .db(config.DATABASE_NAME)
      .collection("assigments");

    const assigments = await classesCollection
      .find({
        classId: { $eq: new ObjectId(classId) },
        subjectId: { $eq: new ObjectId(subjectId) },
      })
      .toArray();

    res.json({ assigments });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.delete("/one/:id", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;

    const assigmentsCollection = client
      .db(config.DATABASE_NAME)
      .collection("assigments");

    await assigmentsCollection.deleteOne({ _id: new ObjectId(id) });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.post("/", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { name, subjectId, classId } = req.body;
    const assigmentCollection = client
      .db(config.DATABASE_NAME)
      .collection("assigments");

    await assigmentCollection.insertOne({
      name,
      subjectId: new ObjectId(subjectId),
      classId: new ObjectId(classId),
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.put("/one/:id", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;
    const { name } = req.body;
    console.log(name);
    const assigmentsCollection = client
      .db(config.DATABASE_NAME)
      .collection("assigments");

    await assigmentsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      { $set: { name } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});
