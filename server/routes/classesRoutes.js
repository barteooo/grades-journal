const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");

const router = express.Router();

router.get("/", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { teacherId, Assigned } = req.query;
    const classesCollection = client
      .db(config.DATABASE_NAME)
      .collection("classes");

    let classes;
    const AssignedParsed = Assigned ? parseInt(Assigned) : 0;

    if (teacherId) {
      if (AssignedParsed) {
        classes = await classesCollection
          .find({
            teachers: { $in: [new ObjectId(teacherId)] },
          })
          .toArray();
      } else {
        classes = await classesCollection
          .find({
            teachers: { $nin: [new ObjectId(teacherId)] },
          })
          .toArray();
      }
    } else {
      classes = await classesCollection.find().toArray();
    }

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
    const subject = await classesCollection.findOne({ name });
    if (subject) {
      res.status(409).json({
        success: false,
        message: "Klasa o takiej nazwie juz istnieje",
      });
      return;
    }
    await classesCollection.insertOne({
      name,
      teachers: [],
      students: [],
    });
    res.json({ success: true });
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

router.delete("/teacher/:id", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);
  try {
    await client.connect();
    const { id } = req.params;
    const { teacherId } = req.body;

    console.log(id);
    console.log(teacherId);

    const classesCollection = client
      .db(config.DATABASE_NAME)
      .collection("classes");

    const clas = await classesCollection.findOne({ _id: new ObjectId(id) });
    if (!clas) {
      res.status(404).send("Klasa nie znaleziona");
      return;
    }

    clas.teachers = clas.teachers.filter(
      (id) => id.toString() !== teacherId.toString()
    );

    await classesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { teachers: clas.teachers } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.post("/teacher/:id", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);
  try {
    await client.connect();
    const { id } = req.params;
    const { teacherId } = req.body;

    console.log(id);
    console.log(teacherId);

    const classesCollection = client
      .db(config.DATABASE_NAME)
      .collection("classes");

    const clas = await classesCollection.findOne({ _id: new ObjectId(id) });
    if (!clas) {
      res.status(404).send("Klasa nie znaleziona");
      return;
    }

    clas.teachers.push(new ObjectId(teacherId));

    await classesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { teachers: clas.teachers } }
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
