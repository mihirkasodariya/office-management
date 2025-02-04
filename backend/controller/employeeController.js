const fs = require("fs");
const path = require("path");
const Employee = require("../model/Employee");
const Attendance = require("../model/Attendance");

// Fetch all Employee details
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.find();
    res.status(200).json({
      success: true,
      message: "All Employees data fetched",
      employee,
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

// Create a Employee
const createEmployee = async (req, res) => {
  try {
    const {
      name,
      name_of_TL,
      salary,
      date_of_joining,
      designation,
      mobile,
      emergency_mobile,
      address,
      aadhar_number,
      bank_details,
    } = req.body;

    // Check if file is uploaded and handle the image path
    let image = null; // Initialize image as null
    if (req.file) {
      image = `/images/${req.file.filename}`; // Store image path from the upload
    }

    // Prepare bank details, ensuring they are optional
    const employeeBankDetails = bank_details
      ? {
          account_holder_name: bank_details.account_holder_name,
          bank_name: bank_details.bank_name,
          account_number: bank_details.account_number,
          IFSC: bank_details.IFSC,
        }
      : null; // If no bank details, set as null

    // Create new employee object
    const employee = new Employee({
      name,
      image, // Image is optional now
      name_of_TL,
      salary,
      date_of_joining,
      designation,
      mobile,
      emergency_mobile,
      address,
      aadhar_number, // Aadhar number is optional
      bank_details: employeeBankDetails, // Bank details are optional
    });

    // Save employee to the database
    await employee.save();

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    console.log(error);
    console.log(req.body);
    console.log(req.file);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// Get a single Employee
const getSingleEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee found",
      employee,
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

// Delete a Employee
const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    console.log(employeeId);
    // Find the employee by ID to get the image path
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Get the image patzh (assuming the image is stored as a relative path in the database
    if (employee.image) {
      const imagePath = path.join(__dirname, "../uploads", employee.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Remove the file
      }
    }

   


    // Now delete the employee record from the database
    await Employee.findByIdAndDelete(employeeId);

    // Delete all attendance records associated with this employee
    await Attendance.deleteMany({ employeeId });

    res.status(200).json({
      success: true,
      message: "Employee Deleted Successfully, including the image file",
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

// Update Employee
const updateEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const {
      name,
      name_of_TL,
      salary,
      date_of_joining,
      designation,
      mobile,
      emergency_mobile,
      address,
      aadhar_number,
      bank_details,
    } = req.body;

    // Prepare the update object
    const updateData = {
      ...(name && { name }),
      ...(name_of_TL && { name_of_TL }),
      ...(salary && { salary }),
      ...(date_of_joining && { date_of_joining: new Date(date_of_joining) }),
      ...(designation && { designation }),
      ...(mobile && { mobile }),
      ...(emergency_mobile && { emergency_mobile }),
      ...(address && { address }),
      ...(aadhar_number && { aadhar_number }),
      ...(bank_details && {
        bank_details: {
          account_holder_name: bank_details.account_holder_name,
          bank_name: bank_details.bank_name,
          account_number: bank_details.account_number,
          IFSC: bank_details.IFSC,
        },
      }),
    };

    // Handle image upload
    if (req.file) {
      // Get current employee data to delete old image if it exists
      const employee = await Employee.findById(employeeId);
      if (employee && employee.image) {
        const oldImagePath = path.join(__dirname, "../uploads", employee.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image file
        }
      }
      // Update the image path
      updateData.image = `/images/${req.file.filename}`;
    }

    // Perform the update
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the updated fields
      }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getEmployee,
  createEmployee,
  getSingleEmployee,
  deleteEmployee,
  updateEmployee,
};
