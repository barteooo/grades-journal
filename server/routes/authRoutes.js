const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");
const authMiddleware = require("../middlewares/authmiddleware");

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

    const token = jwt.sign({ id: user._id }, config.SECRET_KEY, {
      expiresIn: config.TOKEN_EXPIRATION,
    });

    res.json({ success: true, id: user._id, token });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.post("/teacher", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);
  try {
    const usersCollection = client.db(config.DATABASE_NAME).collection("users");
    const user = await usersCollection.findOne({
      $or: [{ email: req.body.email }, { pesel: req.body.pesel }],
    });
    if (user) {
      res.status(409).json({
        email:
          user.email === req.body.email
            ? "uzytkownik z podanym mailem juz istnieje"
            : "",
        pesel:
          user.pesel === req.body.pesel
            ? "uzytkownik z podanym peselem juz istnieje"
            : "",
      });
      return;
    }

    await usersCollection.insertOne({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
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

router.post("/student", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);
  try {
    const usersCollection = client.db(config.DATABASE_NAME).collection("users");
    const user = await usersCollection.findOne({
      $or: [{ email: req.body.email }, { pesel: req.body.pesel }],
    });
    if (user) {
      res.status(409).json({
        email:
          user.email === req.body.email
            ? "uzytkownik z podanym mailem juz istnieje"
            : "",
        pesel:
          user.pesel === req.body.pesel
            ? "uzytkownik z podanym peselem juz istnieje"
            : "",
      });
      return;
    }

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

module.exports = router;
