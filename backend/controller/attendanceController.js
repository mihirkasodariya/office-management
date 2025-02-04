const mongoose = require("mongoose");
const Attendance = require("../model/Attendance");
const Employee = require("../model/Employee");

// Create Attendance
const createAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, remarks } = req.body;

    // Check if attendance already exists for the given employee and date
    const existingAttendance = await Attendance.findOne({
      employeeId: employeeId,
      date: date,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance for this date is already recorded.",
      });
    }

    // Create a new attendance record if no existing record is found
    const newAttendance = new Attendance({
      employeeId,
      date,
      status,
      remarks,
    });

    // Save the attendance record to the database
    await newAttendance.save();

    res.status(200).json({ success: true, message: "Attendance recorded." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Check Today's Attendance
const checkTodayAttendance = async (req, res) => {
  const date = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Assuming you have a model for employees
  const employees = await Employee.find(); // Fetch all employees
  const attendanceRecords = await Attendance.find({ date });

  const attendanceStatus = employees.map((employee) => {
    const attendance = attendanceRecords.find(
      (record) => record.employeeId.toString() === employee._id.toString()
    );
    return {
      employeeId: employee._id,
      name: employee.name,
      status: attendance ? attendance.status : null,
    };
  });

  return res.status(200).json({
    success: true,
    attendance: attendanceStatus,
  });
};

// Get all attendance
const getAllAttendance = async (req, res) => {
  try {
    const report = await Attendance.find()
      .populate("employeeId", "name") // Populate employeeId with name field
      .exec();
    res.status(200).json({
      success: true,
      message: "Report fetched successfully",
      report,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required.",
      });
    }

    // Find attendance records for the specified date
    const attendanceRecords = await Attendance.find({ date })
      .populate("employeeId", "name") // Populate employeeId with employee's name
      .exec();

    res.status(200).json({
      success: true,
      message: "Attendance records fetched successfully",
      attendance: attendanceRecords,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    // Find the attendance record by ID
    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      });
    }

    attendance.status = status;

    if (remarks !== undefined) {
      attendance.remarks = remarks;
    }
    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully.",
      data: attendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getSingleAttendance = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters

    // Find the attendance document by its ID
    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    // If attendance found, send the response with attendance data
    return res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.log(error);
    // Handle any errors that occur during the process
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createAttendance,
  checkTodayAttendance,
  getAllAttendance,
  getAttendanceByDate,
  updateAttendance,
  getSingleAttendance
};
