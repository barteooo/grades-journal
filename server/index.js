const express = require("express");
const { MongoClient } = require("mongodb");
const config = require("./config");

const app = express();

const mongoClient = new MongoClient(config.DATABASE_URL);
mongoClient.connect().then(() => {
  app.listen(3001, () => {
    console.log("Server 3001");
  });
});
