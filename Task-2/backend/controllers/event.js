// controllers/event.js
const Event = require("../models/event");

class Scheduler {
  async addEvent({ n, s, e }) {
    if (s < 0 || e > 23 || s >= e) {
      return false;
    }

    const overlappingEvents = await Event.find({
      $or: [{ start: { $lt: e }, end: { $gt: s } }],
    });

    if (overlappingEvents.length > 0) {
      return false;
    }

    const newEvent = new Event({
      name: n,
      start: s.toString(),
      end: e.toString(),
    });
    await newEvent.save();
    return true;
  }

  async getEvents() {
    const events = await Event.find();
    return events;
  }
}

module.exports = Scheduler;
