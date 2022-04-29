const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Is Running");
});

app.listen(port, () => {
  console.log("CRUD Is Running", port);
});
