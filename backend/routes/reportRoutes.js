const express = require("express");
const { 
  getmonthlyReport,
  getSingleMonthReport,
} = require("../controller/reportController");
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();

router.route("/").get(adminAuth, getmonthlyReport);
router.route("/single-month").get(adminAuth, getSingleMonthReport);

module.exports = router;
