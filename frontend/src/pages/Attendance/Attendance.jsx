import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Layout } from "../../components/Layout";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Button, Chip, CircularProgress, TextField } from "@mui/material"; // Import CircularProgress

export const Attendance = () => {
  const date = new Date();
  const [employee, setEmployee] = useState([]); // Employee list
  const [attendanceMarked, setAttendanceMarked] = useState({}); // Track attendance status for each employee
  const [remarks, setRemarks] = useState({}); // Track remarks for each employee
  const [loading, setLoading] = useState(true); // Loading state for fetching employees
  const [statusTemp, setStatusTemp] = useState({}); // Temporary state to store status before submission
  const [loadingSubmit, setLoadingSubmit] = useState({}); // Track loading state for individual employee submissions
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const token = Cookies.get("token");

  const fetchEmployee = async () => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const apiUrl = process.env.BASE_URL + "/api/v1/employee";
      const response = await axios(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setEmployee(response.data.employee);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const submitIndividualAttendance = async (employeeId, status) => {
    // Set loading for this employee to true
    setLoadingSubmit((prev) => ({ ...prev, [employeeId]: true }));

    const attendanceData = {
      employeeId: employeeId,
      date: date.toISOString().split("T")[0],
      status: status.toLowerCase().replace(" ", "_"),
      remarks: remarks[employeeId] || "", // Send remarks with the attendance data
    };

    try {
      const apiUrl = process.env.BASE_URL + "/api/v1/attendance"; // Adjust the endpoint if necessary
      const response = await axios.post(apiUrl, attendanceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success(`Attendance for ${employeeId} marked as ${status}!`);
        // Update attendanceMarked with the new status
        setAttendanceMarked((prev) => ({ ...prev, [employeeId]: status }));
        // Update statusTemp with the submitted status to reflect the color change
        setStatusTemp((prev) => ({ ...prev, [employeeId]: status }));
      } else {
        toast.error("Failed to submit attendance for this employee");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error occurred while submitting attendance");
    } finally {
      // Set loading for this employee to false after submission
      setLoadingSubmit((prev) => ({ ...prev, [employeeId]: false }));
    }
  };

  const fetchEmployeeAttendance = async () => {
    try {
      const apiUrl = process.env.BASE_URL + "/api/v1/attendance/today"; // Adjust the endpoint if necessary
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        const attendanceData = response.data.attendance;
        const attendanceMap = attendanceData.reduce((acc, curr) => {
          acc[curr.employeeId] = curr.status;
          return acc;
        }, {});
        setAttendanceMarked(attendanceMap);
        // Sync statusTemp with attendanceMarked when attendance is fetched
        setStatusTemp(attendanceMap);
      } else {
        toast.error("Failed to fetch today's attendance");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error occurred while fetching attendance");
    }
  };

  const handleRemarksChange = (employeeId, value) => {
    setRemarks((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
  };

  const handleStatusChange = (employeeId, status) => {
    setStatusTemp((prev) => ({
      ...prev,
      [employeeId]: status,
    }));
  };

  useEffect(() => {
    fetchEmployee();
    fetchEmployeeAttendance();
  }, []);

  // If loading, show the loader
  if (loading) {
    return (
      <Layout>
        <Toaster />
        <div className="bg-gray-50 flex justify-center items-center min-h-screen">
          <CircularProgress /> {/* Loader is displayed here */}
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Toaster />
      <Layout>
        <div className="bg-gray-50">
          <div className="bg-white rounded p-5 m-5 shadow-lg">
            <div className="min-h-screen">
              <h1 className="text-center text-lg lg:text-2xl pt-3 pb-10 ">
                <span className="font-bold">Mark Attendance For:</span>{" "}
                {`${date.getDate()}/${
                  date.getMonth() + 1
                }/${date.getFullYear()}, ${weekday[date.getDay()]}`}
              </h1>
              <div className="overflow-auto">
                <div className="grid sm:grid-cols-12 min-w-[900px]">
                  <div className="col-span-12">
                    <div className="grid grid-cols-12 item-center">
                      <div className="col-span-1 border flex items-center">
                        <p className="text-md lg:text-xl font-bold ps-8">
                          S. No.
                        </p>
                      </div>
                      <div className="col-span-2 border flex justify-center items-center">
                        <h3 className="font-bold  text-md lg:text-lg py-3">
                          Employee Name
                        </h3>
                      </div>
                      <div className="border col-span-5 flex justify-around items-center gap-10">
                        <h3 className="font-bold text-md lg:text-lg py-3">
                          Attendance Status
                        </h3>
                      </div>
                      <div className="border col-span-3 flex justify-center items-center">
                        <h3 className="font-bold text-md lg:text-lg py-3">
                          Remarks
                        </h3>
                      </div>
                      <div className="border col-span-1 flex justify-center items-center">
                        <h3 className="font-bold text-md lg:text-lg py-3">
                          Action
                        </h3>
                      </div>
                    </div>
                  </div>
                  {employee.map((item, index) => (
                    <div key={item._id} className="col-span-12">
                      <div className="grid grid-cols-12 item-center">
                        <div className="col-span-1 border flex items-center">
                          <p className="text-md lg:text-xl ps-8">{index + 1}</p>
                        </div>
                        <div className="col-span-2 border flex gap-10 justify-center items-center">
                          <h3 className="text-md py-3">{item.name}</h3>
                        </div>
                        <div className="border col-span-5 flex justify-around items-center gap-4 lg:gap-10">
                          {attendanceMarked[item._id] ? (
                            // Display the colorized text for attendance status
                            <span
                              className={`font-bold ${
                                attendanceMarked[item._id] === "Present"
                                  ? "text-green-500"
                                  : attendanceMarked[item._id] === "Absent"
                                  ? "text-red-500"
                                  : attendanceMarked[item._id] === "Half Day"
                                  ? "text-purple-500"
                                  : "text-gray-500"
                              }`}
                            >
                              Attendance marked as {attendanceMarked[item._id]}{" "}
                              for today!
                            </span>
                          ) : (
                            <>
                              <Chip
                                label="Present"
                                variant="outlined"
                                color={
                                  statusTemp[item._id] === "Present"
                                    ? "success"
                                    : "default"
                                }
                                onClick={() =>
                                  handleStatusChange(item._id, "Present")
                                }
                              />
                              <Chip
                                label="Absent"
                                variant="outlined"
                                color={
                                  statusTemp[item._id] === "Absent"
                                    ? "error"
                                    : "default"
                                }
                                onClick={() =>
                                  handleStatusChange(item._id, "Absent")
                                }
                              />
                              <Chip
                                label="Half Day"
                                variant="outlined"
                                color={
                                  statusTemp[item._id] === "Half Day"
                                    ? "secondary"
                                    : "default"
                                }
                                onClick={() =>
                                  handleStatusChange(item._id, "Half Day")
                                }
                              />
                              <Chip
                                label="Holiday"
                                variant="outlined"
                                color={
                                  statusTemp[item._id] === "Holiday"
                                    ? "warning"
                                    : "default"
                                }
                                onClick={() =>
                                  handleStatusChange(item._id, "Holiday")
                                }
                              />
                            </>
                          )}
                        </div>
                        <div className="border col-span-3 flex justify-center items-center">
                          <textarea
                            className="w-[100%] outline-none px-3 py-2"
                            onChange={(e) =>
                              handleRemarksChange(item._id, e.target.value)
                            }
                            value={remarks[item._id] || ""}
                            name="remarks"
                            disabled={attendanceMarked[item._id]} // Disable remarks if attendance is already marked
                          ></textarea>
                        </div>
                        <div className="border col-span-1 flex justify-center items-center">
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() =>
                              submitIndividualAttendance(
                                item._id,
                                statusTemp[item._id] || "Present"
                              )
                            }
                            disabled={attendanceMarked[item._id]} // Disable submit button if attendance is already marked
                          >
                            {loadingSubmit[item._id] ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
