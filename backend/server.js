// Use Environment Variables
require("dotenv").config();

// Importing Libraries
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDb");
const app = express();

// Router
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const reportRoutes = require("./routes/reportRoutes");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Database Connection
connectDB();

// API Routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/employee", employeeRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/reports", reportRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port:", process.env.PORT);
});
