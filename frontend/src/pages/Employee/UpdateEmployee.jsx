import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { Button, TextField } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

export const UpdateEmployee = () => {
  const token = Cookies.get("token");
  const { id } = useParams();
  const apiUrl = process.env.BASE_URL + `/api/v1/employee/${id}`;

  const [currentImage, setCurrentImage] = useState("");
  const [newImagePreview, setNewImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    name_of_TL: "",
    salary: "",
    date_of_joining: "",
    designation: "",
    mobile: "",
    emergency_mobile: "",
    address: "",
    aadhar_number: "",
    bank_details: {
      account_holder_name: "",
      bank_name: "",
      account_number: "",
      IFSC: "",
    },
    image: null,
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setFormData(response.data.employee);
        setCurrentImage(response.data.employee.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check for nested fields
    if (name.startsWith("bank_details.")) {
      const bankField = name.split(".")[1];
      setFormData((prevState) => ({
        ...prevState,
        bank_details: {
          ...prevState.bank_details,
          [bankField]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setNewImagePreview(URL.createObjectURL(file)); // Set new image preview
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      

      const response = await axios.patch(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Employee details updated successfully!");
      } else {
        toast.error("Failed to update employee details.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Toaster />
      <Layout>
        <div className="bg-gray-50">
          <div className="grid sm:grid-cols-12">
            <div className="bg-white rounded p-5 m-5 shadow-lg col-span-12">
              <form onSubmit={handleUpdate}>
                <div className="grid sm:grid-cols-12">
                  <div className="col-span-12 p-3">
                    <h4 className="font-semibold text-xl">Personal Details</h4>
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Employee Name"
                      size="small"
                      name="name"
                      variant="outlined"
                      required
                      fullWidth
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Name of TL"
                      size="small"
                      name="name_of_TL"
                      variant="outlined"
                      required
                      fullWidth
                      value={formData.name_of_TL}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Date of Joining (DD/MM/YYYY)"
                      size="small"
                      name="date_of_joining"
                      variant="outlined"
                      required
                      fullWidth
                      value={new Date(
                        formData.date_of_joining
                      ).toLocaleDateString("en-GB")}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Employee Salary"
                      size="small"
                      name="salary"
                      variant="outlined"
                      required
                      fullWidth
                      value={formData.salary}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Employee Designation"
                      size="small"
                      name="designation"
                      variant="outlined"
                      required
                      fullWidth
                      value={formData.designation}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Employee Mobile Number"
                      size="small"
                      name="mobile"
                      variant="outlined"
                      required
                      fullWidth
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Emergency Contact Number"
                      size="small"
                      name="emergency_mobile"
                      variant="outlined"
                      required
                      fullWidth
                      value={formData.emergency_mobile}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 p-3">
                    <TextField
                      label="Employee Aadhar Number"
                      size="small"
                      name="aadhar_number"
                      variant="outlined"
                      required
                      fullWidth
                      value={formData.aadhar_number}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 p-3">
                    <TextField
                      label="Employee Address"
                      size="small"
                      name="address"
                      variant="outlined"
                      multiline
                      required
                      fullWidth
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 p-3">
                    <h4 className="font-semibold text-xl">
                      Bank Account Details
                    </h4>
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Account Holder Name"
                      size="small"
                      name="bank_details.account_holder_name"
                      variant="outlined"
                      required
                      fullWidth
                      value={formData.bank_details.account_holder_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Bank Name"
                      size="small"
                      name="bank_details.bank_name"
                      variant="outlined"
                      required
                      fullWidth
                      value={formData.bank_details.bank_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Account Number"
                      size="small"
                      name="bank_details.account_number"
                      variant="outlined"
                      required
                      fullWidth
                      value={formData.bank_details.account_number}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="IFSC Code"
                      size="small"
                      name="bank_details.IFSC"
                      variant="outlined"
                      required
                      fullWidth
                      value={formData.bank_details.IFSC}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 p-3">
                    <h4 className="font-semibold text-xl">
                      Current Profile Image
                    </h4>
                    {currentImage && (
                      <div className="mb-3">
                        <img
                          src={`${process.env.BASE_URL}/uploads/${currentImage}`}
                          alt="Current Profile"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            objectPosition: "top",
                            marginBottom: "10px",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-span-12 p-3">
                    <h4 className="font-semibold text-xl">
                      Upload Profile Image
                    </h4>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }} // Hide the default input
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        color="primary"
                        sx={{
                          marginTop: "25px",
                          paddingLeft: "30px",
                          paddingRight: "30px",
                        }}
                      >
                        Upload Image*
                      </Button>
                    </label>
                  </div>

                  <div className="col-span-12 p-3">
                    {newImagePreview && (
                      <div className="mb-3">
                        <img
                          src={newImagePreview}
                          alt="New Image Preview"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            objectPosition: "top",
                            marginBottom: "10px",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-span-12 p-3">
                    <Button
                      size="large"
                      variant="contained"
                      color="success"
                      type="submit"
                      fullWidth
                      sx={{ paddingLeft: "30px", paddingRight: "30px" }}
                    >
                      Update Employee Details
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
