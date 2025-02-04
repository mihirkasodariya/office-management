import React, { useState } from "react";
import Cookies from "js-cookie";
import logo from "../assets/logo.png";
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    try {
      Cookies.remove("token");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="px-8 py-3 flex justify-between items-center shadow-xl relative">
      <div>
        <Link to="/">
          <img src={logo} alt="Logo" className="w-[140px] lg:w-[200px]" />
        </Link>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden lg:flex items-center gap-10 justify-between">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/add-employee">Add Employee</NavLink>
        <NavLink to="/view-employee">View Employee</NavLink>
        <NavLink to="/attendance">Attendance</NavLink>
        <NavLink to="/update-attendance">Update Attendance</NavLink>
        <NavLink to="/reports">Reports</NavLink>
        <NavLink to="/download-report">Downloads</NavLink>
        <div>
          <Button
            onClick={handleLogout}
            variant="outlined"
            size="small"
            color="error"
          >
            Logout
          </Button>
        </div>
      </ul>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <IconButton onClick={toggleMenu} aria-label="menu">
          {menuOpen ? <CloseIcon color="primary" size="large" /> : <MenuIcon color="primary" size="large" />}
        </IconButton>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden h-screen fixed z-20 bg-white shadow-lg py-10 w-[80%] md:w-[60%] top-0 left-0 transform transition-transform duration-500 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-10 justify-center items-start ms-10">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-[190px]" />
          </Link>
          <NavLink to="/" onClick={toggleMenu}>Home</NavLink>
          <NavLink to="/add-employee" onClick={toggleMenu}>Add Employee</NavLink>
          <NavLink to="/view-employee" onClick={toggleMenu}>View Employee</NavLink>
          <NavLink to="/attendance" onClick={toggleMenu}>Attendance</NavLink>
          <NavLink to="/update-attendance" onClick={toggleMenu}>Update Attendance</NavLink>
          <NavLink to="/reports" onClick={toggleMenu}>Reports</NavLink>
          <NavLink to="/download-report" onClick={toggleMenu}>Downloads</NavLink>
          <div>
            <Button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              variant="outlined"
              size="small"
              color="error"
            >
              Logout
            </Button>
          </div>
        </ul>
      </div>
    </nav>
  );
};
