import React from "react";
import { Bar } from "react-chartjs-2";

const MaxAbsenteesChart = ({ attendanceData, employeeNames }) => {
  const summarizeAbsentees = (data) => {
    const summary = {};

    data.forEach((entry) => {
      const employeeId = entry.employeeId._id; // Access the employee ID correctly
      const status = entry.status;

      if (status === "absent") {
        if (!summary[employeeId]) {
          summary[employeeId] = 0;
        }
        summary[employeeId]++;
      }
    });

    return summary;
  };

  const absenteesSummary = summarizeAbsentees(attendanceData);
  const labels = Object.keys(absenteesSummary).map((id) => employeeNames[id] || id); // Use employee names or fallback to ID
  const absentCounts = Object.keys(absenteesSummary).map((id) => absenteesSummary[id]);

  const data = {
    labels: labels, // Employee Names
    datasets: [
      {
        label: "Max Absent Count",
        data: absentCounts,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div>
      <h2 className="text-center text-xl font-semibold pb-8">Maximum Absent Count per Employee</h2>
      <Bar data={data} options={{ responsive: true }} />
    </div>
  );
};

export default MaxAbsenteesChart;
