const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");
const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

// {
//     usersIds: [],
//     messages: [
//         userId: "",
//         text: ""
//     ]
// }

router.get("/", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { currentUserId, userId } = req.query;
    const chatsCollection = client.db(config.DATABASE_NAME).collection("chats");
    const chat = await chatsCollection.findOne({
      $and: [
        { usersIds: { $in: [new ObjectId(currentUserId)] } },
        { usersIds: { $in: [new ObjectId(userId)] } },
      ],
    });

    res.json({ chat });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

module.exports = router;
