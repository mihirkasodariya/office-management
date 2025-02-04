import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Home } from "./pages/Home/Home";
import { Error404 } from "./components/Error404";
import { ViewEmployee } from "./pages/Employee/ViewEmployee";
import { AddEmployee } from "./pages/Employee/AddEmployee";
import { Attendance } from "./pages/Attendance/Attendance";

import PrivateRoute from "./components/PrivateRoute";
import { Report } from "./pages/Report/Report";
import { SingleEmployeeView } from "./pages/Employee/SingleEmployeeView";
import { UpdateEmployee } from "./pages/Employee/UpdateEmployee";
import { DownloadReport } from "./pages/DownloadReport/DownloadReport";
import { UpdateAttendance } from "./pages/Attendance/UpdateAttendance";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-employee"
          element={
            <PrivateRoute>
              <AddEmployee />
            </PrivateRoute>
          }
        />
        <Route
          path="/view-employee"
          element={
            <PrivateRoute>
              <ViewEmployee />
            </PrivateRoute>
          }
        />
        <Route
          path="/view-employee/:id"
          element={
            <PrivateRoute>
              <SingleEmployeeView />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-employee/:id"
          element={
            <PrivateRoute>
              <UpdateEmployee />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <Attendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-attendance"
          element={
            <PrivateRoute>
              <UpdateAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Report />
            </PrivateRoute>
          }
        />

        <Route
          path="/download-report"
          element={
            <PrivateRoute>
              <DownloadReport />
            </PrivateRoute>
          }
        />

        <Route path="/*" element={<Error404 />} />
      </Routes>
    </Router>
  );
};
