import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout } from "../../components/Layout";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import LoadingButton from "@mui/lab/LoadingButton";

export const Report = () => {
  const date = new Date();
  const token = Cookies.get("token");
  const [employee, setEmployee] = useState([]);
  const [employeeReport, setEmployeeReport] = useState([]);
  const [employeeSalary, setEmployeeSalary] = useState(0);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1); // Month starts from 0
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllDatesInMonth = (year, month) => {
    let date = new Date(year, month, 1); // Start at the 1st of the month
    let dates = [];

    while (date.getMonth() === month) {
      dates.push(new Date(date)); // Add current date to array
      date.setDate(date.getDate() + 1); // Move to the next day
    }
    return dates;
  };

  useEffect(() => {
    setResponse(getAllDatesInMonth(selectedYear, selectedMonth - 1)); // Adjust for zero-based month index
  }, [selectedMonth, selectedYear]);

  const fetchEmployee = async () => {
    try {
      const apiUrl = `${process.env.BASE_URL}/api/v1/employee`;
      const response = await axios.get(apiUrl, {
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
    }
  };

  const fetchReport = async () => {
    try {
      if (!selectedEmployeeId) {
        toast.error("Please select an employee");
        return;
      }

      setLoading(true);

      const month = String(selectedMonth).padStart(2, "0"); // Ensure two digits
      const apiUrl = `${process.env.BASE_URL}/api/v1/reports?month=${selectedYear}-${month}&employeeId=${selectedEmployeeId}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setLoading(false);
        toast.success("Report fetched successfully");
        setEmployeeReport(response.data.report);
        const selectedEmployee = employee.find(
          (item) => item._id === selectedEmployeeId
        );
        setEmployeeSalary(selectedEmployee?.salary || 0);
      } else {
        toast.error("Failed to fetch report");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while fetching the report");
    }

    setLoading(false)
  };

  const calculateTotals = () => {
    let totalAbsent = 0;
    let totalHalfDay = 0;
    let totalHolidays = 0;
    let estimatedSalary = 0; // Initialize estimated salary

    // Loop through the employee's attendance report
    employeeReport.forEach((record) => {
      if (record.status === "absent") totalAbsent++;
      else if (record.status === "half_day") totalHalfDay++;
      else if (record.status === "holiday") totalHolidays++;
    });

    // Define daily salary based on a fixed number of days in the month, e.g., 30 days
    const dailySalary = employeeSalary / 30;

    // Calculate the estimated salary by deducting the absent days and half-days
    estimatedSalary =
      employeeSalary -
      (totalAbsent * dailySalary + dailySalary * 0.5 * totalHalfDay);

    return { totalAbsent, totalHalfDay, totalHolidays, estimatedSalary };
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const { totalAbsent, totalHalfDay, totalHolidays, estimatedSalary } =
    calculateTotals();
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const years = Array.from(
    { length: new Date().getFullYear() - 2023 },
    (_, index) => 2024 + index
  );

  return (
    <>
      <Toaster />
      <Layout>
        <div className="bg-gray-50">
          <div className="bg-white rounded py-5 px-0 md:px-5 lg:px-20 lg:m-5  shadow-lg">
            <h1 className="text-center uppercase text-2xl lg:text-4xl font-bold pt-8 pb-10">
              Attendance Report
            </h1>

            <div className="grid sm:grid-cols-12">
              <div className="col-span-12 md:col-span-4 lg:col-span-3 m-5">
                <FormControl size="small" fullWidth>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Employee
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    autoWidth
                    label="Employee"
                  >
                    {employee &&
                      employee.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-span-12 md:col-span-4 lg:col-span-3 m-5">
                <FormControl size="small" fullWidth>
                  <InputLabel id="month-select-label">Month</InputLabel>
                  <Select
                    labelId="month-select-label"
                    id="month-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    autoWidth
                    label="Month"
                  >
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {new Date(0, month - 1).toLocaleString("default", {
                          month: "long",
                        })}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-span-12 md:col-span-4 lg:col-span-3 m-5">
                <FormControl size="small" fullWidth>
                  <InputLabel id="year-select-label">Year</InputLabel>
                  <Select
                    labelId="year-select-label"
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    autoWidth
                    label="Year"
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-span-12 lg:col-span-3 m-5">
                {
                  loading ? <LoadingButton loading size="large"
                    variant="contained"
                    color="success"
                    fullWidth>
                    Submit
                  </LoadingButton> :
                    <Button
                      onClick={fetchReport}
                      variant="contained"
                      color="success"
                      fullWidth
                    >
                      Fetch Report
                    </Button>
                }

              </div>
            </div>

            <div className="grid grid-cols-7 gap-3 bg-gray-100 p-3 mt-8 rounded">
              {/* Day names */}
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((dayName, index) => (
                <div key={index} className="border bg-white">
                  <div className="flex flex-col items-center justify-center text-tiny md:text-md md:py-1 lg:py-3 lg:text-xl font-semibold">
                    <p>{dayName}</p>
                  </div>
                </div>
              ))}

              {/* Empty cells before the first day of the month */}
              {Array(new Date(selectedYear, selectedMonth - 1, 1).getDay())
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="border border-transparent"></div>
                ))}

              {/* Dates aligned to correct days */}
              {response.map((item, index) => {
                const dayNumber = item.getDate();
                const report = employeeReport.find(
                  (record) => new Date(record.date).getDate() === dayNumber
                );

                let statusClass = "border bg-white ";
                if (report) {
                  statusClass =
                    report.status === "present"
                      ? "border border-green-500 bg-green-200"
                      : report.status === "absent"
                        ? "border border-red-500 bg-red-200"
                        : report.status === "half_day"
                          ? "border border-purple-500 bg-purple-200"
                          : report.status === "holiday"
                            ? "border border-orange-500 bg-orange-200"
                            : "";
                }

                return (
                  <div key={index} className={`${statusClass}`}>
                    <div className="flex flex-col items-center justify-center gap-4 py-1 lg:py-8 text-md lg:text-2xl">
                      <p>{dayNumber}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid sm:grid-cols-12 mt-8">
              <div className="col-span-12">
                <div className="grid grid-cols-12 p-5 gap-3">
                  <div className="col-span-6 md:col-span-3 lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="border border-green-500 bg-green-200 h-[30px] w-[30px]"></div>
                      <h5 className="font-semibold">Present</h5>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3 lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="border border-red-500 bg-red-200 h-[30px] w-[30px]"></div>
                      <h5 className="font-semibold">Absent</h5>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3 lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="border border-purple-500 bg-purple-200 h-[30px] w-[30px]"></div>
                      <h5 className="font-semibold">Half day</h5>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3 lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="border border-orange-500 bg-orange-200 h-[30px] w-[30px]"></div>
                      <h5 className="font-semibold">Holiday</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="flex flex-col justify-center items-end">
                  <ul className="flex flex-col items-end p-5 gap-3">
                    <li>
                      <span className="font-semibold">Total Absents:</span>{" "}
                      {totalAbsent}
                    </li>
                    <li>
                      <span className="font-semibold">Total Half-days:</span>{" "}
                      {totalHalfDay}
                    </li>
                    <li>
                      <span className="font-semibold">Total Holidays:</span>{" "}
                      {totalHolidays}
                    </li>
                    <li>
                      <span className="font-semibold">Salary Estimate:</span> ₹
                      {estimatedSalary}
                    </li>
                    <li>
                      <span className="font-semibold">Total Salary:</span> ₹
                      {employeeSalary}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
