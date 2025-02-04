import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import Button from "@mui/material/Button";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import toast, { Toaster } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import defaultUser from "../../assets/defaultUser.png";

export const ViewEmployee = () => {
  const token = Cookies.get("token");
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading

  const apiUrl = `${process.env.BASE_URL}/api/v1/employee`;

  const fetchData = async () => {
    setLoading(true); // Set loading to true when fetching data

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setEmployee(response.data.employee);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch employee data");
    } finally {
      setLoading(false); // Set loading to false when data is fetched
    }
  };

  const handleDelete = async (id) => {
    try {
      const deleteUrl = `${apiUrl}/${id}`;

      const response = await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchData(); // Re-fetch employee data after deletion
      } else {
        console.log(response);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  // Fetch all data
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Toaster />
      <Layout>
        <div className="bg-gray-50">
          <div className="grid sm:grid-cols-12 min-h-screen">
            {loading ? ( // Conditional rendering for loading
              <div className="col-span-12 flex justify-center items-center h-[90vh]">
                <CircularProgress />
              </div>
            ) : (
              employee.map((item) => {
                return (
                  <div
                    key={item._id}
                    className="col-span-12 md:col-span-6 lg:col-span-3"
                  >
                    <div className="bg-white rounded p-5 m-5 shadow-lg">
                      <div className="flex flex-col">
                        <div className="flex justify-center">
                          <img
                            src={
                              item.image
                                ? `${process.env.BASE_URL}/uploads${item.image}`
                                : defaultUser
                            }
                            alt=""
                            className="rounded-[50%] h-[100px] w-[100px] lg:h-[200px] lg:w-[200px] object-top object-cover border-2 border-blue-700"
                          />
                        </div>
                        <ul className="flex flex-col gap-5 justify-start mt-8">
                          <li>
                            <strong>Employee Name: </strong> {item.name}
                          </li>
                          <li>
                            <strong>Date of Joining: </strong>{" "}
                            {((date) =>
                              `${String(date.getDate()).padStart(
                                2,
                                "0"
                              )}/${String(date.getMonth() + 1).padStart(
                                2,
                                "0"
                              )}/${date.getFullYear()}`)(
                              new Date(item.date_of_joining)
                            )}
                          </li>
                          <li>
                            <strong>Name of TL: </strong> {item.name_of_TL}
                          </li>
                        </ul>
                        <div className="mt-5">
                          <Link to={`/view-employee/${item._id}`}>
                            <Button variant="outlined" fullWidth>
                              View Full Details
                            </Button>
                          </Link>
                        </div>
                        <div className="mt-5 flex gap-3">
                          <div className="flex-1">
                            <Link to={`/edit-employee/${item._id}`}>
                              <Button
                                color="success"
                                startIcon={<EditIcon />}
                                variant="outlined"
                                fullWidth
                              >
                                Edit
                              </Button>
                            </Link>
                          </div>
                          <div className="flex-1">
                            <Button
                              onClick={() => handleDelete(item._id)}
                              color="error"
                              startIcon={<DeleteIcon />}
                              variant="contained"
                              fullWidth
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};
