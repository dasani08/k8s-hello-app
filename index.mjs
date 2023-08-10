import express from "express";
import os from "os";

import { verifyToken } from "./cognito.mjs";

const app = express();
const PORT = 3000;

app.use(function (req, res, next) {
  console.dir(req.originalUrl); // '/admin/new?sort=desc'
  console.dir(req.baseUrl); // '/admin'
  console.dir(req.path); // '/new'
  next();
});

app.post("/validate", async (req, res) => {
  await verifyToken(req, res);
});

app.get("/", (req, res) => {
  const helloMessage = `VERSION 2: Hello from the ${os.hostname()}`;
  console.log(helloMessage);
  res.send(helloMessage);
});

app.listen(PORT, () => {
  console.log(`Web server is listening at port ${PORT}`);
});
