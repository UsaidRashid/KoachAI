const User = require("../models/users");
const { ValidationError } = require("mongoose").Error;

module.exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    return res
      .status(200)
      .json({ message: "Users Fetched Successfully", users });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.addUser = async (req, res) => {
  try {
    const { age, name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        message: "Invalid input: 'name' is required and must be a string.",
      });
    }
    if (age === undefined || typeof age !== "number") {
      return res.status(400).json({
        message: "Invalid input: 'age' is required and must be a number.",
      });
    }

    const newUser = new User({ name, age });
    await newUser.save();

    return res
      .status(200)
      .json({ message: "User Saved Successfully!", newUser });
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error("Validation Error: ", error);
      return res
        .status(400)
        .json({ message: "Validation Error", error: error.message });
    } else {
      console.error("Error saving user: ", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
};
