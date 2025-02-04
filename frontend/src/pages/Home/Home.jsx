import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Layout } from "../../components/Layout";
import Cookies from "js-cookie";
import axios from "axios";
import AttendanceChart from "../../components/AttendanceChart";
import MaxAbsenteesChart from "../../components/MaxAbsenteesChart";
import AttendancePieChart from "../../components/AttendancePieChart";
import AttendanceRadarChart from "../../components/AttendanceRadarChart";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

export const Home = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const date = new Date();
  const currMonth = date.getMonth() + 1;
  const currYear = date.getFullYear();
  const [data, setData] = useState([]);
  const [employeeNames, setEmployeeNames] = useState({}); // State for employee names

  const apiUrl =
    `${process.env.BASE_URL}/api/v1/reports/single-month/?month=${currYear}-${currMonth}`;

  const token = Cookies.get("token");

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const reportData = response.data.report;

        setData(reportData);

        // Create a mapping of employee ID to employee name
        const names = {};
        reportData.forEach((entry) => {
          const employeeId = entry.employeeId._id; // Access the employee ID
          const employeeName = entry.employeeId.name; // Access the employee name
          names[employeeId] = employeeName; // Map employee ID to name
        });

        setEmployeeNames(names);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Failed to fetch data: ${error.message}`);
    } finally {
      setLoading(false); // Ensure loading is false after fetch is complete
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.success("Login successful!");
    }
  }, [location.state]);

  return (
    <>
      <Toaster />
      <Layout>
        <div className="bg-gray-50">
          <div className="bg-white rounded p-0 m-0 lg:p-5 lg:m-5 shadow-lg min-h-screen">
            <h1 className="text-center text-2xl lg:text-4xl font-bold pt-8 pb-10">
              Welcome to Dashboard!
            </h1>
            {loading ? ( // Conditional rendering for loader
              <div className="flex justify-center items-center h-[50vh]">
                <CircularProgress />
              </div>
            ) : (
              <div className="grid sm:grid-cols-12">
                <div className="col-span-12 lg:col-span-6 border p-5 m-5 shadow-lg">
                  <AttendanceChart
                    attendanceData={data} // Pass the fetched attendance data
                    employeeNames={employeeNames} // Pass the employee names
                  />
                </div>
                <div className="col-span-12 lg:col-span-6 border p-5 m-5 shadow-lg">
                  <MaxAbsenteesChart
                    attendanceData={data} // Pass the fetched attendance data
                    employeeNames={employeeNames} // Pass the employee names
                  />
                </div>
                <div className="col-span-12 lg:col-span-6 border p-5 m-5 shadow-lg">
                  <AttendancePieChart attendanceData={data} />
                  {/* Use the Pie Chart component */}
                </div>
                <div className="col-span-12 lg:col-span-6 border p-5 m-5 shadow-lg">
                  <AttendanceRadarChart
                    attendanceData={data}
                    employeeNames={employeeNames}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};
