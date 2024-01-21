const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");

const router = express.Router();

router.get("/student/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.sendStatus(400);
      return;
    }

    const usersCollection = client.db(config.DATABASE_NAME).collection("users");

    const student = await usersCollection
      .find({
        _id: new ObjectId(id),
      })
      .toArray();

    res.json({ student });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.get("/students", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { classId } = req.query;

    if (!classId) {
      res.sendStatus(400);
      return;
    }

    const usersCollection = client.db(config.DATABASE_NAME).collection("users");
    const classesCollection = client
      .db(config.DATABASE_NAME)
      .collection("classes");

    const classData = await classesCollection.findOne({
      _id: new ObjectId(classId),
    });

    const students = await usersCollection
      .find({
        _id: { $in: classData.students },
        role: "student",
      })
      .toArray();

    res.json({ students });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.post("/student", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    // email, password, name, surname, pesel
    const { student } = req.body;

    const usersCollection = client.db(config.DATABASE_NAME).collection("users");

    await usersCollection.insertOne({
      ...student,
      role: "student",
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.post("/teacher", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    // email, password, name, surname, pesel
    const { teacher } = req.body;

    const usersCollection = client.db(config.DATABASE_NAME).collection("users");

    await usersCollection.insertOne({
      ...teacher,
      role: "teacher",
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.delete("/:id", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;

    const usersCollection = client.db(config.DATABASE_NAME).collection("users");
    await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

module.exports = router;
