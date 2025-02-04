import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import "./Login.css";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import Cookies from "js-cookie";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import LoadingButton from "@mui/lab/LoadingButton";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const apiUrl = process.env.BASE_URL + "/api/v1/admin/login";

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/");
    } else {
      toast.success("Logout successful");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (email === "" || password === "") {
      toast.error("Please provide both email & password !");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(apiUrl, {
        email: email,
        password: password,
      });

      if (response.data.success) {
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 20); // Set expiration to 20 years in the future

        Cookies.set("token", response.data.token, {
          expires: expirationDate,
          secure: true,
          sameSite: "Strict",
        });

        setLoading(false);
        navigate("/", { state: { loginSuccess: true } });
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again!"); // Fallback message
      }
      console.error("Login error:", error);
    }

    setEmail("");
    setPassword("");
    setLoading(false);
  };

  return (
    <div className="h-screen loginBg bg-cover bg-center flex items-center justify-center">
      <Toaster />
      <div className="lg:w-[75%] lg:h-[80%] rounded-lg shadow-xl">
        <div className="grid sm:grid-cols-12 h-full">
          <div className="col-span-12 m-5 lg:m-0 md:col-span-12 lg:col-span-6 h-full bg-white rounded lg:rounded-none lg:rounded-s-lg">
            <div className="p-5 lg:p-10 h-full flex flex-col justify-center">
              <h2 className="text-center text-xl lg:text-3xl font-semibold">
                Welcome to Attendance Portal!
              </h2>
              <p className="text-center text-sm py-3">
                *To access full control sign-in with user id and password*
              </p>
              <form
                action=""
                className="flex my-8 flex-col gap-10 justify-center"
              >
                <div>
                  <TextField
                    id="outlined-basic"
                    label="Enter Email ID"
                    fullWidth
                    required
                    size="large"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password*
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </div>
                <div>
                  {loading ? (
                    <LoadingButton
                      loading
                      size="large"
                      sx={{ padding: "13px" }}
                      fullWidth
                      variant="outlined"
                    >
                      Submit
                    </LoadingButton>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      size="large"
                      sx={{ backgroundColor: "#04012f", padding: "13px" }}
                      fullWidth
                    >
                      Login
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-6 bg-gray-50 rounded-e-lg">
            <div className="flex flex-col h-full justify-center items-center">
              <img src={logo} alt="" width={400} />
              <h3 className="text-3xl text-center uppercase text-[#04012f] font-bold my-8">
                Attendance Portal
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
