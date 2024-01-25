const express = require("express");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");

const router = express.Router();

router.post("/", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { name } = req.body;
    const subjectsCollection = client
      .db(config.DATABASE_NAME)
      .collection("subjects");
    const subject = await subjectsCollection.findOne({ name });
    if (subject) {
      res.status(409).json({
        success: false,
        message: "Przedmiot o takiej nazwie juz istnieje",
      });
      return;
    }
    await subjectsCollection.insertOne({
      name,
      teachers: [],
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.get("/", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { teacherId, Assigned } = req.query;
    const subjectsCollection = client
      .db(config.DATABASE_NAME)
      .collection("subjects");

    let subjects;
    const AssignedParsed = Assigned ? parseInt(Assigned) : 0;

    if (teacherId) {
      if (AssignedParsed) {
        subjects = await subjectsCollection
          .find({
            teachers: { $in: [new ObjectId(teacherId)] },
          })
          .toArray();
      } else {
        subjects = await subjectsCollection
          .find({
            teachers: { $nin: [new ObjectId(teacherId)] },
          })
          .toArray();
      }
    } else {
      subjects = await subjectsCollection.find().toArray();
    }

    res.json({ subjects });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.post("/subject/:id", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);
  try {
    await client.connect();
    const { id } = req.params;
    const { teacherId } = req.body;

    console.log(id);
    console.log(teacherId);

    const subjectsCollection = client
      .db(config.DATABASE_NAME)
      .collection("subjects");

    const subject = await subjectsCollection.findOne({ _id: new ObjectId(id) });
    if (!subject) {
      res.status(404).send("KPrzedmiot nie znaleziony");
      return;
    }

    subject.teachers.push(new ObjectId(teacherId));

    await subjectsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { teachers: subject.teachers } }
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.delete("/subject/:id", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);
  try {
    await client.connect();
    const { id } = req.params;
    const { teacherId } = req.body;

    const subjectsCollection = client
      .db(config.DATABASE_NAME)
      .collection("subjects");

    const subject = await subjectsCollection.findOne({ _id: new ObjectId(id) });
    if (!subject) {
      res.status(404).send("Klasa nie znaleziona");
      return;
    }

    subject.teachers = subject.teachers.filter(
      (id) => id.toString() !== teacherId.toString()
    );

    await subjectsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { teachers: subject.teachers } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

module.exports = router;
