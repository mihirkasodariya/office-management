const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  salary: {
    type: Number,
    required: true,
  },
  name_of_TL: {
    type: String,
    required: true,
  },
  date_of_joining: {
    type: Date,
    required: true
  },
  designation: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true
  },
  emergency_mobile: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  aadhar_number: {
    type: Number,
  },
  bank_details: {
    account_holder_name: {
      type: String,
     
    },
    bank_name: {
      type: String,
      
    },
    account_number: {
      type: Number,
     
    },
    IFSC: {
      type: String,
      
    }
  }
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
