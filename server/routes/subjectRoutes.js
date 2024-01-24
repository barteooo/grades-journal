const express = require("express");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");

const router = express.Router();

router.post("/", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { name } = req.body;
    const classesCollection = client
      .db(config.DATABASE_NAME)
      .collection("subjects");
    const subject = await classesCollection.findOne({ name });
    if (subject) {
      res.json({
        success: false,
      });
      return;
    }
    await classesCollection.insertOne({
      name,
      teacherAndClass: { teacher: "", class: "" },
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

module.exports = router;
