const express = require("express");
const app = express();
const cors = require("cors");
const port = 6565;

const mongoose = require("mongoose");
const mongoUrl = "mongodb://127.0.0.1:27017/KoachAITask2";

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

const eventRouter = require("./routes/events");

app.use("/", eventRouter);

app.get("/", (req, res, next) => {
  res.send("It's the backend of KoachAI Task-2!");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});