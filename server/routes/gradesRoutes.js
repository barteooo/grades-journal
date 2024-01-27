const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");

const router = express.Router();

router.get("/", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);
  try {
    const gradesCollection = client
      .db(config.DATABASE_NAME)
      .collection("grades");

    const grades = await gradesCollection.find({}).toArray();

    res.json({ grades });
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
    const { studentId, teacherId, subjectId, grade, date } = req.body;

    const gradesCollection = client
      .db(config.DATABASE_NAME)
      .collection("grades");

    await gradesCollection.insertOne({
      studentId: new ObjectId(studentId),
      teacherId: new ObjectId(teacherId),
      subjectId: new ObjectId(subjectId),
      grade,
      date,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.put("/", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { studentId, assigmentId, value } = req.body;

    console.log(req.body);

    const gradesCollection = client
      .db(config.DATABASE_NAME)
      .collection("grades");

    const grade = await gradesCollection.findOne({
      studentId: new ObjectId(studentId),
      assigmentId: new ObjectId(assigmentId),
    });
    if (grade) {
      await gradesCollection.updateOne({ _id: grade._id }, { $set: { value } });
    } else {
      await gradesCollection.insertOne({
        studentId: new ObjectId(studentId),
        assigmentId: new ObjectId(assigmentId),
        value,
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

module.exports = router;
