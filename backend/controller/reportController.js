const Attendance = require("../model/Attendance");

const getmonthlyReport = async (req, res) => {
  try {
    const { month, employeeId } = req.query;

    if (!month || !employeeId) {
      return res.status(400).json({
        success: false,
        message: "Month and Employee ID are required",
      });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    const report = await Attendance.find({
      employeeId: employeeId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const getSingleMonthReport = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Month and Employee ID are required",
      });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    const report = await Attendance.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).populate("employeeId", "name");

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

module.exports = { getmonthlyReport, getSingleMonthReport };
