import React from "react";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(...registerables);

const AttendanceChart = ({ attendanceData, employeeNames }) => {
  const currentMonthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date());

  const summarizeAttendance = (data) => {
    const summary = {};

    data.forEach((entry) => {
      const employeeId = entry.employeeId._id; // Access the employee ID correctly
      const status = entry.status;

      if (!summary[employeeId]) {
        summary[employeeId] = {
          present: 0,
        };
      }

      // Only increment the present count
      if (status === "present") {
        summary[employeeId].present++;
      }
    });

    return summary;
  };

  const summary = summarizeAttendance(attendanceData);
  const labels = Object.keys(summary).map((id) => employeeNames[id] || id); // Use employee names or fallback to ID

  const presentCounts = Object.keys(summary).map((id) => summary[id].present);

  const data = {
    labels: labels, // Employee Names
    datasets: [
      {
        label: "Present",
        data: presentCounts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div>
      <h2 className="text-center text-xl font-semibold pb-8">
        Attendance Summary of {currentMonthName} Month
      </h2>
      <Bar data={data} options={{ responsive: true }} />
    </div>
  );
};

export default AttendanceChart;
