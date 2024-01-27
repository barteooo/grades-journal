const express = require("express");
const http = require("http");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const morgan = require("morgan");
const authMiddleware = require("./middlewares/authmiddleware");
const config = require("./config");
const sockets = require("./sockets");

const app = express();

const server = http.createServer(app);

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

const mongoClient = new MongoClient(config.DATABASE_URL);
mongoClient.connect().then(() => {
  server.listen(3001, () => {
    console.log("Server 3001");
  });
});
