const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");

const router = express.Router();
const mqttClient = require("../services/mqttClient");

router.get("/", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { studentId } = req.query;
    const gradesCollection = client
      .db(config.DATABASE_NAME)
      .collection("grades");
    let grades;
    if (!studentId) {
      grades = await gradesCollection.find({}).toArray();
    } else {
      grades = await gradesCollection
        .find({
          studentId: { $eq: [new ObjectId(studentId)] },
        })
        .toArray();
    }

    res.json({ grades });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

// router.post("/", async (req, res) => {
//   const client = new MongoClient(config.DATABASE_URL);

//   try {
//     const { studentId, teacherId, subjectId, grade, date } = req.body;

//     const gradesCollection = client
//       .db(config.DATABASE_NAME)
//       .collection("grades");

//     await gradesCollection.insertOne({
//       studentId: new ObjectId(studentId),
//       teacherId: new ObjectId(teacherId),
//       subjectId: new ObjectId(subjectId),
//       grade,
//       date,
//     });

//     res.sendStatus(200);
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500);
//   } finally {
//     await client.close();
//   }
// });

router.put("/", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { studentId, assigmentId, value, subjectId, assName } = req.body;

    const gradesCollection = client
      .db(config.DATABASE_NAME)
      .collection("grades");

    const grade = await gradesCollection.findOne({
      studentId: new ObjectId(studentId),
      assigmentId: new ObjectId(assigmentId),
    });
    if (grade) {
      await gradesCollection.updateOne({ _id: grade._id }, { $set: { value } });
      mqttClient.publish(
        "journal/updateGrade",
        JSON.stringify({ studentId, value, assName })
      );
    } else {
      await gradesCollection.insertOne({
        studentId: new ObjectId(studentId),
        assigmentId: new ObjectId(assigmentId),
        value,
        subjectId: new ObjectId(subjectId),
        assName,
      });
      mqttClient.publish(
        "journal/newGrade",
        JSON.stringify({ studentId, value, assName })
      );
    }

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

    const gradesCollection = client
      .db(config.DATABASE_NAME)
      .collection("grades");

    await gradesCollection.deleteOne({ _id: new ObjectId(id) });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

module.exports = router;
