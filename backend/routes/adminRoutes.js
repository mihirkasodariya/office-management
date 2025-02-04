const express = require("express");
const {
  getAdmin,
  createAdmin,
  loginAdmin,
} = require("../controller/adminController");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.route("/").get(getAdmin).post(createAdmin);

router.route("/login").post(loginAdmin);

module.exports = router;
