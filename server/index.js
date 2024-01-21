const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// routes
const usersRoutes = require("./routes/usersRoutes");
app.use("/api/users", usersRoutes);

const gradesRoutes = require("./routes/gradesRoutes");
app.use("/api/grades", usersRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const classesRoutes = require("./routes/classesRoutes");
app.use("/api/classes", classesRoutes);

const mongoClient = new MongoClient(config.DATABASE_URL);
mongoClient.connect().then(() => {
  app.listen(3001, () => {
    console.log("Server 3001");
  });
});
