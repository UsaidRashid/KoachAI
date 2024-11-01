require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6564;

const mongoose = require("mongoose");
const mongoUrl = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("Successfully connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoUrl);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((err, req, res, next) => {
  console.error(err);

  if (err.status) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const userRouter = require("./routes/users");

app.use("/", userRouter);

app.get("/", (req, res, next) => {
  res.send("It's the backend of koach AI Task 1!");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
