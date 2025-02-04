import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

// A wrapper for protected routes
const PrivateRoute = ({ children }) => {
  const token = Cookies.get("token");

  // If the token does not exist, redirect to login
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
