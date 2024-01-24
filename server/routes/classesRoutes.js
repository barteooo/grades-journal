const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");

const router = express.Router();

router.get("/", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const classesCollection = client
      .db(config.DATABASE_NAME)
      .collection("classes");

    const classes = await classesCollection.find().toArray();
    res.json({ classes });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

// name
router.post("/", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { name } = req.body;

    const classesCollection = client
      .db(config.DATABASE_NAME)
      .collection("classes");

    await classesCollection.insertOne({
      name,
      students: [],
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

// studentId
router.put("/student/:id", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const classesCollection = client
      .db(config.DATABASE_NAME)
      .collection("classes");

    const classData = await classesCollection.findOne({
      _id: new ObjectId(id),
    });

    await classesCollection.updateOne(
      { _id: classData._id },
      {
        $set: {
          students: [...classData.students, new ObjectId(studentId)],
        },
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.delete("/student/:id", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const classesCollection = client
      .db(config.DATABASE_NAME)
      .collection("classes");

    const classData = await classesCollection.findOne({
      _id: new ObjectId(id),
    });

    const students = classData.students.filter(
      (x) => x.toString() !== studentId
    );

    await classesCollection.updateOne(
      { _id: classData._id },
      {
        $set: {
          students: [...students],
        },
      }
    );

    res.sendStatus(200);
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

    const gradesCollection = client
      .db(config.DATABASE_NAME)
      .collection("classes");

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
