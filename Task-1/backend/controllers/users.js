const User = require("../models/users");

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

    const newUser = new User({ name, age });

    await newUser.save();

    return res
      .status(200)
      .json({ message: "User Saved Successfully!", newUser });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
