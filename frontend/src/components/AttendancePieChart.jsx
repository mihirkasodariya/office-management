import React from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

const AttendancePieChart = ({ attendanceData }) => {
  // Function to summarize attendance statuses
  const summarizeAttendance = (data) => {
    const summary = {
      present: 0,
      absent: 0,
      half_day: 0,
      holiday: 0,
    };

    data.forEach((entry) => {
      const status = entry.status;
      if (summary[status] !== undefined) {
        summary[status]++;
      }
    });

    return summary;
  };

  const summary = summarizeAttendance(attendanceData);

  const data = {
    labels: ["Present", "Absent", "Half Day", "Holiday"],
    datasets: [
      {
        data: [
          summary.present,
          summary.absent,
          summary.half_day,
          summary.holiday,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  return (
    <div>
      <h2 className="text-center text-xl font-semibold pb-8">
        Attendance Status Distribution
      </h2>
      <Pie data={data} options={{ responsive: true }} />
    </div>
  );
};

export default AttendancePieChart;
