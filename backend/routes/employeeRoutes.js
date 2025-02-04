const express = require("express");
const {
  getEmployee,
  createEmployee,
  getSingleEmployee,
  deleteEmployee,
  updateEmployee,
} = require("../controller/employeeController");

const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.route("/").get(adminAuth, getEmployee).post(adminAuth,upload.single('image'), createEmployee);

router
  .route("/:id")
  .get(adminAuth, getSingleEmployee)
  .delete(adminAuth, deleteEmployee)
  .patch(adminAuth,upload.single('image'), updateEmployee);

module.exports = router;
