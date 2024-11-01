const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.route("/add").post(userController.addUser);

router.route("/fetch").get(userController.fetchAllUsers);

module.exports = router;
