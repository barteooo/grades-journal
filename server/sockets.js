const { MongoClient, ObjectId } = require("mongodb");
const { Server } = require("socket.io");
const config = require("./config");

const userIdsPerSockets = [];

const sockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("connection");

    socket.on("user_data", (data) => {
      const userIdPerSocket = {
        socket,
        userId: data.userId,
      };
      userIdsPerSockets.push(userIdPerSocket);
    });

    socket.on("message", async (messageData) => {
      const reciverSocket = userIdsPerSockets.find(
        (x) => x.userId === messageData.reciverId
      )?.socket;

      const senderUserId = userIdsPerSockets.find(
        (x) => x.socket === socket
      )?.userId;

      const message = {
        date: new Date(),
        text: messageData.text,
        userId: senderUserId,
      };

      if (reciverSocket) {
        reciverSocket.emit("message", message);
      }

      const client = new MongoClient(config.DATABASE_URL);
      const chatsCollection = client
        .db(config.DATABASE_NAME)
        .collection("chats");

      const chatData = await chatsCollection.findOne({
        $and: [
          { usersIds: { $in: [new ObjectId(messageData.reciverId)] } },
          { usersIds: { $in: [new ObjectId(senderUserId)] } },
        ],
      });

      if (chatData) {
        await chatsCollection.updateOne(
          { _id: chatData._id },
          {
            $set: {
              messages: [...chatData.messages, message],
            },
          }
        );
      } else {
        await chatsCollection.insertOne({
          usersIds: [
            new ObjectId(senderUserId),
            new ObjectId(messageData.reciverId),
          ],
          messages: [message],
        });
      }

      socket.emit("delivered", message);
    });

    socket.on("disconnect", () => {
      const index = userIdsPerSockets.findIndex((x) => x.socket === socket);
      userIdsPerSockets.splice(index, 1);
      console.log("disconnect");
    });

    socket.on("logout", () => {
      const index = userIdsPerSockets.findIndex((x) => x.socket === socket);
      userIdsPerSockets.splice(index, 1);
      console.log("logout");
    });
  });
};

module.exports = sockets;
