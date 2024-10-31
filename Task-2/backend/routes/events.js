// routes/events.js
const express = require("express");
const router = express.Router();
const Scheduler = require("../controllers/event");

const scheduler = new Scheduler();

router.post("/add-event", async (req, res) => {
  const { n, s, e } = req.body;
  const success = await scheduler.addEvent({ n, s, e });

  if (success) {
    return res.status(200).json({ message: "Event added successfully!" });
  } else {
    return res
      .status(400)
      .json({ message: "Invalid event times or overlap detected." });
  }
});

router.get("/get-events", async (req, res) => {
  const events = await scheduler.getEvents();
  return res
    .status(200)
    .json({ message: "Events Fetched Successfully!", events });
});

module.exports = router;
