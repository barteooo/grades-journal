const express = require("express");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");

const router = express.Router();

// email, password
router.post("/signin", async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { email, password } = req.body;

    const usersCollection = client.db(config.DATABASE_NAME).collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: "User not exists!" });
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ success: false, message: "Bad password" });
      return;
    }

    res.json({ success: true, id: user._id });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

module.exports = router;
