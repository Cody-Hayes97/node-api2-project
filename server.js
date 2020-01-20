const express = require("express");
const expressRouter = require("./routers/expressRouter.js");

const server = express();

server.use(express.json());
server.use("/api/posts", expressRouter);

server.get("/", (req, res) => {
  res.send("hello world");
});

module.exports = server;
