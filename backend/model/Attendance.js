const mongoose = require("mongoose");
const Employee = require("../model/Employee");

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["unpaid_leave", "half_day", "leave", "present", "absent", "holiday"],
    required: true,
  },
  remarks: {
    type: String,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
