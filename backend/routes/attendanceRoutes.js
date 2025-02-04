const express = require("express");
const {
  createAttendance,
  checkTodayAttendance,
  getAllAttendance,
  getAttendanceByDate,
  updateAttendance,
  getSingleAttendance,
} = require("../controller/attendanceController");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router
  .route("/")
  .post(adminAuth, createAttendance)
  .get(adminAuth, getAllAttendance);

router.route("/get-attendance/:id").get(adminAuth, getSingleAttendance);

router.route("/update-attendance/:id").put(adminAuth, updateAttendance);

router.route("/date").get(adminAuth, getAttendanceByDate);

router.route("/today").get(checkTodayAttendance);

module.exports = router;
