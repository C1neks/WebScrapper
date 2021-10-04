const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const offersRoute = require("./offers");
const pullRoute = require("./pull");

app.use(bodyParser.json());

app.use("/pull", pullRoute);
app.use("/offers", offersRoute);

mongoose.connect(
  "mongodb+srv://cinek:marcin12@cluster0.flguz.mongodb.net/Cluster0?retryWrites=true&w=majority",
  () => console.log("connected")
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
