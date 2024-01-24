const express = require("express");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");

const router = express.Router();

router.get("/one/:id", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;

    if (!id) {
      res.sendStatus(400);
      return;
    }

    const usersCollection = client.db(config.DATABASE_NAME).collection("users");

    const user = await usersCollection.findOne({
      _id: new ObjectId(id),
    });

    res.json({ user });
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
    const { classId, inclass } = req.query;
    const usersCollection = client.db(config.DATABASE_NAME).collection("users");
    let students;
    if (classId) {
      const usersCollection = client
        .db(config.DATABASE_NAME)
        .collection("users");
      const classesCollection = client
        .db(config.DATABASE_NAME)
        .collection("classes");

      const inclassParsed = inclass ? parseInt(inclass) : 0;

      if (inclassParsed) {
        const classData = await classesCollection.findOne({
          _id: new ObjectId(classId),
        });

        students = await usersCollection
          .find({
            _id: { $in: classData.students },
            role: "student",
          })
          .toArray();

        console.log(students);
      } else {
        const studentsInClassesIds = (
          await classesCollection.find().toArray()
        ).reduce((acc, x) => {
          return [...acc, ...x.students];
        }, []);

        students = await usersCollection
          .find({
            _id: { $nin: studentsInClassesIds },
            role: "student",
          })
          .toArray();
      }
    } else {
      students = await usersCollection
        .find({
          role: "student",
        })
        .toArray();
    }

    res.json({ students });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.get("/teachers", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const usersCollection = client.db(config.DATABASE_NAME).collection("users");
    const teachers = await usersCollection
      .find({
        role: "teacher",
      })
      .toArray();

    res.json({ teachers });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

// email, password, name, surname, pesel
router.post("/student", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const usersCollection = client.db(config.DATABASE_NAME).collection("users");

    await usersCollection.insertOne({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
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

router.put("/:id", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;

    const usersCollection = client.db(config.DATABASE_NAME).collection("users");
    const user = await usersCollection.findOne({
      _id: new ObjectId(id),
    });

    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.surname) {
      user.surname = req.body.surname;
    }

    if (req.body.pesel) {
      user.pesel = req.body.pesel;
    }

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          ...user,
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

router.get("/teachers/:name", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { name } = req.params;
    const usersCollection = client.db(config.DATABASE_NAME).collection("users");
    const teachers = await usersCollection
      .find({
        role: "teacher",
        name: { $regex: new RegExp(name, "i") },
      })
      .toArray();

    res.json({ teachers });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.get("/students/:name", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { name } = req.params;
    const usersCollection = client.db(config.DATABASE_NAME).collection("users");
    const students = await usersCollection
      .find({
        role: "student",
        name: { $regex: new RegExp(name, "i") },
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

module.exports = router;
