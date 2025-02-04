import React, { useState } from "react";
import { Layout } from "../../components/Layout";
import { Button, TextField } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";

export const AddEmployee = () => {
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
    image: null,
    bank_details: {
      account_holder_name: "",
      bank_name: "",
      account_number: "",
      IFSC: "",
    },
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [imagePreview, setImagePreview] = useState("");
  const token = Cookies.get("token");
  const apiUrl = process.env.BASE_URL + "/api/v1/employee";
  const [day, month, year] = formData.date_of_joining.split("/");
  const formattedDate = `${year}-${month}-${day}`;

  const dataToSubmit = {
    ...formData,
    date_of_joining: formattedDate,
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const addEmployee = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.post(apiUrl, dataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Employee added successfully!");
        setFormData({
          name: "",
          name_of_TL: "",
          salary: "",
          date_of_joining: "",
          designation: "",
          mobile: "",
          emergency_mobile: "",
          address: "",
          aadhar_number: "",
          image: null,
          bank_details: {
            account_holder_name: "",
            bank_name: "",
            account_number: "",
            IFSC: "",
          },
        });
        setImagePreview("");
      } else {
        toast.error("Failed to add employee");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!formData.image) {
    //   toast.error("Please upload an image.");
    //   return;
    // }

    await addEmployee(); // Add the employee
  };

  return (
    <>
      <Toaster />
      <Layout>
        <div className="bg-gray-50">
          <div className="grid sm:grid-cols-12">
            <div className="bg-white rounded p-5 lg:m-5 shadow-lg col-span-12">
              <form onSubmit={handleSubmit}>
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
                      value={formData.date_of_joining}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Employee Salary"
                      size="small"
                      name="salary"
                      variant="outlined"
                      value={formData.salary}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Employee Designation"
                      size="small"
                      name="designation"
                      variant="outlined"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Employee Mobile Number"
                      size="small"
                      name="mobile"
                      variant="outlined"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Emergency Contact Number"
                      size="small"
                      name="emergency_mobile"
                      variant="outlined"
                      value={formData.emergency_mobile}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Employee Aadhar Number"
                      size="small"
                      name="aadhar_number"
                      variant="outlined"
                      value={formData.aadhar_number}
                      onChange={handleChange}
                      // required
                      fullWidth
                    />
                  </div>
                  <div className="col-span-12 p-3">
                    <TextField
                      label="Employee Address"
                      size="small"
                      name="address"
                      variant="outlined"
                      value={formData.address}
                      onChange={handleChange}
                      multiline
                      required
                      fullWidth
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
                      name="bank_details.account_holder_name" // Set name for nested field
                      variant="outlined"
                      value={formData.bank_details.account_holder_name}
                      onChange={handleChange}
                      // required
                      fullWidth
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Bank Name"
                      size="small"
                      name="bank_details.bank_name" // Set name for nested field
                      variant="outlined"
                      value={formData.bank_details.bank_name}
                      onChange={handleChange}
                      // required
                      fullWidth
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="Account Number"
                      size="small"
                      name="bank_details.account_number" // Set name for nested field
                      variant="outlined"
                      value={formData.bank_details.account_number}
                      onChange={handleChange}
                      // required
                      fullWidth
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6 p-3">
                    <TextField
                      label="IFSC Code"
                      size="small"
                      name="bank_details.IFSC" // Set name for nested field
                      variant="outlined"
                      value={formData.bank_details.IFSC}
                      onChange={handleChange}
                      // required
                      fullWidth
                    />
                  </div>
                  <div className="col-span-12 p-3">
                    <h4 className="font-semibold text-xl">
                      Upload Profile Image
                    </h4>
                  </div>
                  <div className="col-span-12 p-3">
                    <input
                      type="file"
                      accept="image/*"
                      name="image"
                      onChange={handleImageChange}
                      style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                      id="image-upload"
                      // required
                    />

                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        color="primary"
                        sx={{ paddingLeft: "30px", paddingRight: "30px" }}
                      >
                        Upload Image*
                      </Button>
                    </label>

                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Selected"
                        style={{ width: "100px", marginTop: "10px" }}
                      />
                    )}
                  </div>
                  <div className="col-span-12 p-3">
                    <Button
                      size="large"
                      variant="contained"
                      color="success"
                      type="submit"
                      fullWidth
                      disabled={loading} // Disable button while loading
                      sx={{ paddingLeft: "30px", paddingRight: "30px" }}
                    >
                      {loading ? "Adding Employee..." : "Add Employee"}
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
