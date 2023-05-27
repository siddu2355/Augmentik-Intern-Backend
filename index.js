const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const details = require("./routes/family");
const register = require("./routes/users");
const login = require("./routes/authe");
const app = express();
if (!config.get("jwtPrivateKey")) {
  console.log("Fatal ERROR: jwtPrivateKey is not set...");
  process.exit(1);
}

mongoose
  .connect(
    "mongodb://localhost:27017/augmentik"
  )
  .then(() => console.log("Connected to mongoDB..."))
  .catch((e) => console.log("could not connect to mongoDB", e));

app.use(express.json());
app.use(cors());
app.use("/api/details", details);
app.use("/api/register", register);
app.use("/api/login", login);

app.get("/", (req, res) => {
  res.send("Augmentik Internship");
});

const port = process.env.PORT || 3900;
app.listen(port, () => console.log(`Listening to port${port}...`));
