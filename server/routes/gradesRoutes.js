const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");

const router = express.Router();

router.get("", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);
  try {
    const { assigmentId, studentId } = req.query;
    const classesCollection = client
      .db(config.DATABASE_NAME)
      .collection("grades");

    const assigments = await classesCollection
      .find({
        assigmentId: { $eq: new ObjectId(classId) },
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

// studentId, subjectId, teacherId, grade, date
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

router.put("/:id", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;
    const { grade } = req.body;

    const gradesCollection = client
      .db(config.DATABASE_NAME)
      .collection("grades");

    await gradesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { grade } }
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
