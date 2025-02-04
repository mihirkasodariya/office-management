import React from "react";
import { Chart, registerables } from "chart.js";
import { Radar } from "react-chartjs-2";

Chart.register(...registerables);

const AttendanceRadarChart = ({ attendanceData, employeeNames }) => {
  const summarizeAttendance = (data) => {
    const summary = {};

    data.forEach((entry) => {
      const employeeId = entry.employeeId._id; // Access employee ID
      const status = entry.status;

      if (!summary[employeeId]) {
        summary[employeeId] = {
          present: 0,
          absent: 0,
          half_day: 0,
          holiday: 0,
        };
      }

      summary[employeeId][status]++;
    });

    return summary;
  };

  const summary = summarizeAttendance(attendanceData);
  const labels = ["Present", "Absent", "Half Day", "Holiday"];
  const datasets = Object.keys(summary).map((employeeId) => {
    return {
      label: employeeNames[employeeId] || employeeId,
      data: [
        summary[employeeId].present,
        summary[employeeId].absent,
        summary[employeeId].half_day,
        summary[employeeId].holiday,
      ],
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
      borderColor: "rgba(0, 0, 0, 1)",
      borderWidth: 1,
    };
  });

  const data = {
    labels: labels,
    datasets: datasets,
  };

  return (
    <div>
      <h2 className="text-center text-xl font-semibold pb-8">
        Attendance Comparison
      </h2>
      <Radar data={data} options={{ responsive: true }} />
    </div>
  );
};

export default AttendanceRadarChart;
