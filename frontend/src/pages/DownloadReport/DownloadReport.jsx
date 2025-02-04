import React, { useState, useEffect } from "react";
import { Layout } from "../../components/Layout";
import { toast, Toaster } from "react-hot-toast";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Button,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const DownloadReport = () => {
  const token = Cookies.get("token");
  const baseUrl = `${process.env.BASE_URL}/api/v1`;
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Fetch Employees for the dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${process.env.BASE_URL}/api/v1/employee`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setEmployees(response.data.employee); // assuming the response structure has employees in data
        }
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };
    fetchEmployees();
  }, [token]);

  // Fetch report data based on selected filters
  const fetchData = async () => {
    try {
      const url = `${baseUrl}/reports?month=${selectedYear}-${selectedMonth}&employeeId=${selectedEmployee}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        // Get selected employee's name if one is selected
        const selectedEmployeeName = selectedEmployee
          ? employees.find((emp) => emp._id === selectedEmployee)?.name ||
            "Employee"
          : null;

        return response.data.report.map(
          ({ _id, __v, employeeId, date, ...rest }) => {
            const currentDate = new Date(date);
            const day = currentDate.toLocaleDateString("en-US", {
              weekday: "long",
            });
            const month = currentDate.toLocaleDateString("en-US", {
              month: "long",
            });
            const year = currentDate.getFullYear();
            const formattedDate = `${String(currentDate.getDate()).padStart(
              2,
              "0"
            )}/${String(currentDate.getMonth() + 1).padStart(2, "0")}/${year}`;

            return {
              employeeName: selectedEmployee
                ? selectedEmployeeName
                : employeeId.name, // Fill with selected employee name if specified
              date: formattedDate,
              day,
              month,
              year,
              ...rest,
            };
          }
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Download not available");
      console.error(error);
      return null;
    }
  };

  // Handle Download Button Click
  const handleDownload = async () => {
    setLoading(true);
    const reportData = await fetchData();
    setLoading(false);

    if (reportData) {
      // Determine the employee name for the file name
      const selectedEmployeeName = selectedEmployee
        ? employees.find((emp) => emp._id === selectedEmployee)?.name ||
          "Employee"
        : "All_Employees";
      const formattedDate = new Date().toISOString().split("T")[0];
      const fileName = `attendance_report_${selectedEmployeeName}_${formattedDate}.xlsx`;

      const worksheet = XLSX.utils.json_to_sheet(reportData, {
        header: ["employeeName", "date", "day", "month", "year", "status"],
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

      // Styling header cells
      const headerCells = ["A1", "B1", "C1", "D1", "E1", "F1"];
      headerCells.forEach((cell) => {
        worksheet[cell].s = {
          font: { bold: true, sz: 12, color: { rgb: "000000" } },
          alignment: { vertical: "center", horizontal: "center" },
        };
      });
      headerCells.forEach(
        (cell) => (worksheet[cell].v = worksheet[cell].v.toUpperCase())
      );

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const dataBlob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(dataBlob, fileName);
    }
  };

  return (
    <>
      <Toaster />
      <Layout>
        <div className="bg-gray-50">
          <div className="bg-white rounded p-5 lg:m-5 shadow-lg h-screen flex flex-col items-center justify-center">
            <h1 className="text-center uppercase text-2xl lg:text-3xl font-bold pt-8 pb-10">
              Download Report
            </h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center mb-5">
              {/* Employee Select */}
              <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel>Employee Name</InputLabel>
                <Select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  label="Employee Name"
                >
                  <MenuItem value="">All Employees</MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee._id} value={employee._id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Month Select */}
              <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  label="Month"
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, "0");
                    return (
                      <MenuItem key={month} value={month}>
                        {new Date(0, i).toLocaleString("en-US", {
                          month: "long",
                        })}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              {/* Year Select */}
              <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  label="Year"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>

            {/* Download Button */}
            <div className="flex flex-col items-center gap-5">
              <Button
                startIcon={
                  loading ? <CircularProgress size={20} /> : <DownloadIcon />
                }
                size="large"
                variant="contained"
                color="secondary"
                sx={{ textTransform: "none" }}
                onClick={handleDownload}
                disabled={loading}
              >
                {loading ? "Downloading..." : "Download Report"}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
