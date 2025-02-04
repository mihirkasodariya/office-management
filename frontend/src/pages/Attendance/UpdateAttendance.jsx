import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Layout } from "../../components/Layout";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";

export const UpdateAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState(false);

  const token = Cookies.get("token");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const fetchEmployees = async () => {
    try {
      const apiUrl = `${process.env.BASE_URL}/api/v1/employee/`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        setEmployees(response.data.employee);
      } else {
        toast.error("Failed to fetch employee data.");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error("Error fetching employee data.");
    }
  };

  const fetchAttendance = async () => {
    if (!selectedDate) {
      toast.error("Please select a date first.");
      return;
    }
    try {
      setLoading(true);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const apiUrl = `${process.env.BASE_URL}/api/v1/attendance/date?date=${formattedDate}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setAttendance(response.data.attendance);
      } else {
        toast.error("Failed to fetch attendance data.");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast.error("Error fetching attendance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenModal = (attendanceItem = null, employeeItem = null) => {
    if (attendanceItem) {
      setCurrentAttendance(attendanceItem);
      setStatus(attendanceItem.status || "");
      setRemarks(attendanceItem.remarks || "");
    } else if (employeeItem) {
      setCurrentAttendance({
        employeeId: employeeItem,
      });
      setStatus("");
      setRemarks("");
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentAttendance(null);
    setStatus("");
    setRemarks("");
  };

  const handleUpdateAttendance = async () => {
    if (!status) {
      toast.error("Status is required.");
      return;
    }

    if (!currentAttendance || !currentAttendance._id) {
      toast.error("Invalid attendance record.");
      return;
    }

    try {
      setUpdating(true);
      const updatedData = {
        status,
        remarks: remarks || "",
      };

      const apiUrl = `${process.env.BASE_URL}/api/v1/attendance/update-attendance/${currentAttendance._id}`;

      const response = await axios.put(apiUrl, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Attendance updated successfully!");
        handleCloseModal();
        fetchAttendance();
      } else {
        toast.error("Failed to update attendance.");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Error updating attendance.");
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!status) {
      toast.error("Status is required.");
      return;
    }
    if (!currentAttendance || !currentAttendance.employeeId || !currentAttendance.employeeId._id) {
      toast.error("Invalid employee data.");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date first.");
      return;
    }

    try {
      setMarkingAttendance(true);
      const newAttendance = {
        employeeId: currentAttendance.employeeId._id,
        date: format(selectedDate, "yyyy-MM-dd"),
        status,
        remarks: remarks || "",
      };

      const apiUrl = `${process.env.BASE_URL}/api/v1/attendance/`;

      const response = await axios.post(apiUrl, newAttendance, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Attendance marked successfully!");
        handleCloseModal();
        fetchAttendance();
      } else {
        toast.error("Failed to mark attendance.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Error marking attendance.");
    } finally {
      setMarkingAttendance(false);
    }
  };

  return (
    <>
      <Toaster />
      <Layout>
        <div className="bg-gray-50">
          <div className="bg-white rounded p-5 lg:m-5 shadow-lg">
            <div className="min-h-screen">
              <div className="mb-4">
                <label
                  htmlFor="attendance-date"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Select Attendance Date
                </label>
                <DatePicker
                  id="attendance-date"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  className="p-2 border border-gray-300 rounded"
                  placeholderText="Select a date"
                />
              </div>

              <Button
                onClick={fetchAttendance}
                color="primary"
                variant="contained"
                size="small"
                sx={{ textTransform: "none" }}
                disabled={loading || !selectedDate}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Fetch Attendance"
                )}
              </Button>

              {employees.length > 0 ? (
                <div className="mt-5">
                  <h2 className="text-sm lg:text-xl font-bold mb-4">
                    Attendance for{" "}
                    {selectedDate
                      ? format(selectedDate, "MMMM dd, yyyy")
                      : "N/A"}
                  </h2>
                  <div className="overflow-auto">
                    <table className="w-full border-collapse min-w-[900px]">
                      <thead>
                        <tr>
                          <th className="border p-2">S.No.</th>
                          <th className="border p-2">Employee Name</th>
                          <th className="border p-2">Status</th>
                          <th className="border p-2">Remarks</th>
                          <th className="border p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((emp, index) => {
                          const attendanceRecord = attendance.find(
                            (item) => item.employeeId._id === emp._id
                          );
                          return (
                            <tr key={emp._id}>
                              <td className="border p-2 text-center">
                                {index + 1}
                              </td>
                              <td className="border p-2 text-center">
                                {emp.name}
                              </td>
                              <td className="border p-2 text-center">
                                {attendanceRecord
                                  ? attendanceRecord.status
                                  : "Not Marked"}
                              </td>
                              <td className="border p-2 text-center">
                                {attendanceRecord
                                  ? attendanceRecord.remarks
                                  : "N/A"}
                              </td>
                              <td className="border p-2 text-center">
                                <Button
                                  variant={attendanceRecord ? "contained" : "outlined"}
                                  size="small"
                                  color={attendanceRecord ? "secondary" : "primary"}
                                  sx={{ textTransform: "none" }}
                                  onClick={() =>
                                    handleOpenModal(attendanceRecord, emp)
                                  }
                                >
                                  {attendanceRecord ? "Update" : "Mark Attendance"}
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-[50vh]">
                  <p className="text-center text-xl">No Employees Found!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="update-attendance-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {currentAttendance && currentAttendance._id
                ? `Update Attendance for ${currentAttendance.employeeId.name}`
                : `Mark Attendance for ${currentAttendance?.employeeId?.name}`}
            </Typography>

            {selectedDate ? (
              <Typography variant="body1" gutterBottom>
                <strong>Date:</strong> {format(selectedDate, "MMMM dd, yyyy")}
              </Typography>
            ) : (
              <Typography variant="body1" color="error" gutterBottom>
                <strong>Date:</strong> N/A
              </Typography>
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="half_day">Half Day</MenuItem>
                <MenuItem value="holiday">Holiday</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Remarks (optional)"
              fullWidth
              multiline
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              margin="normal"
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={
                currentAttendance && currentAttendance._id
                  ? handleUpdateAttendance
                  : handleMarkAttendance
              }
              disabled={updating || markingAttendance}
            >
              {updating || markingAttendance ? (
                <CircularProgress size={24} color="inherit" />
              ) : currentAttendance && currentAttendance._id ? (
                "Update Attendance"
              ) : (
                "Mark Attendance"
              )}
            </Button>
          </Box>
        </Modal>
      </Layout>
    </>
  );
};

