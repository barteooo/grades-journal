const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");

const { MongoClient } = require("mongodb");
const cors = require("cors");
const morgan = require("morgan");
const authMiddleware = require("./middlewares/authmiddleware");
const config = require("./config");
const sockets = require("./sockets");
const mqtt = require("mqtt");
// const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

const app = express();

const options = {
  cors: {
    origin: ["*"],
  },
  key: fs.readFileSync("./certs/journal.key"),
  cert: fs.readFileSync("./certs/journal.crt"),
};

const server = https.createServer(options, app);

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// routes
const usersRoutes = require("./routes/usersRoutes");
app.use("/api/users", authMiddleware, usersRoutes);

const gradesRoutes = require("./routes/gradesRoutes");
app.use("/api/grades", authMiddleware, gradesRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const classesRoutes = require("./routes/classesRoutes");
app.use("/api/classes", authMiddleware, classesRoutes);

const subjectsRoutes = require("./routes/subjectsRoutes");
app.use("/api/subjects", authMiddleware, subjectsRoutes);

const assigmentsRoutes = require("./routes/assigmentsRoutes");
app.use("/api/assigments", authMiddleware, assigmentsRoutes);

const chatsRouter = require("./routes/chatsRoutes");
app.use("/api/chats", authMiddleware, chatsRouter);

sockets(server);

// client.on("connect", () => {
//   console.log("Połączono z brokerem MQTT");
// });

const mongoClient = new MongoClient(config.DATABASE_URL);
mongoClient.connect().then(() => {
  server.listen(3001, () => {
    console.log("Server 3001");
  });
});

// mqttClient.on("connect", () => {
//   console.log("Połączono z brokerem MQTT");
// });

// mqttClient.on("offline", () => {
//   console.log("Klient MQTT jest offline");
// });
