import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import defaultUser from "../../assets/defaultUser.png";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

export const SingleEmployeeView = () => {
    const { id } = useParams();
    const apiUrl = `${process.env.BASE_URL}/api/v1/employee/${id}`;
    const token = Cookies.get("token");
    const [singleEmployee, setSingleEmployee] = useState(null); // Initialize to null for better handling
    const [loading, setLoading] = useState(true); // Initialize loading state

    const fetchDetails = async () => {
        setLoading(true); // Set loading to true when fetching data
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setSingleEmployee(response.data.employee);
            } else {
                console.log('Something went wrong');
                toast.error('Something went wrong!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong!');
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    // Handle case when singleEmployee is null and loading is true
    if (loading) {
        return (
            <Layout>
                <Toaster />
                <div className="bg-gray-50 flex justify-center items-center min-h-screen">
                    <CircularProgress /> {/* Loader is displayed here */}
                </div>
            </Layout>
        );
    }

    // Handle case when singleEmployee is null (not loading anymore)
    if (!singleEmployee) {
        return (
            <Layout>
                <Toaster />
                <div className="bg-gray-50">
                    <div className="bg-white rounded p-5 m-5 shadow-lg">
                        <p>Employee details not found.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <>
            <Toaster />
            <Layout>
                <div className="bg-gray-50">
                    <div className="bg-white rounded p-5 m-5 shadow-lg">
                        <div className="grid sm:grid-cols-12">
                            <div className="col-span-12 lg:col-span-9 order-last lg:order-none">
                                <ul className="flex flex-col gap-5 p-5 bg-gray-100 rounded-lg shadow-md">
                                    <li className="flex justify-between">
                                        <strong className="text-gray-700">Employee Id:</strong>
                                        <span className="text-gray-900">{singleEmployee._id}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <strong className="text-gray-700">Full Name:</strong>
                                        <span className="text-gray-900">{singleEmployee.name}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <strong className="text-gray-700">Aadhar Card Number:</strong>
                                        <span className="text-gray-900">{singleEmployee.aadhar_number}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <strong className="text-gray-700">Name of TL:</strong>
                                        <span className="text-gray-900">{singleEmployee.name_of_TL}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <strong className="text-gray-700">Date of Joining:</strong>
                                        <span className="text-gray-900">
                                            {new Intl.DateTimeFormat('en-GB').format(new Date(singleEmployee.date_of_joining))}
                                        </span>
                                    </li>
                                    <li className="flex justify-between">
                                        <strong className="text-gray-700">Designation:</strong>
                                        <span className="text-gray-900">{singleEmployee.designation}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <strong className="text-gray-700">Salary:</strong>
                                        <span className="text-gray-900">Rs. {singleEmployee.salary}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <strong className="text-gray-700">Contact Number:</strong>
                                        <span className="text-gray-900">{singleEmployee.mobile}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <strong className="text-gray-700">Emergency Contact Number:</strong>
                                        <span className="text-gray-900">{singleEmployee.emergency_mobile}</span>
                                    </li>
                                    {singleEmployee.bank_details && (
                                        <>
                                            <li className="flex justify-between">
                                                <strong className="text-gray-700">Account Holder Name:</strong>
                                                <span className="text-gray-900">{singleEmployee.bank_details.account_holder_name}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <strong className="text-gray-700">Bank Name:</strong>
                                                <span className="text-gray-900">{singleEmployee.bank_details.bank_name}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <strong className="text-gray-700">Account Number:</strong>
                                                <span className="text-gray-900">{singleEmployee.bank_details.account_number}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <strong className="text-gray-700">IFSC Code:</strong>
                                                <span className="text-gray-900">{singleEmployee.bank_details.IFSC}</span>
                                            </li>
                                        </>
                                    )}
                                    <li className="flex justify-between">
                                        <strong className="text-gray-700">Address:</strong>
                                        <span className="text-gray-900">{singleEmployee.address}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-span-12 lg:col-span-3 flex flex-col items-center lg:justify-start lg:items-center">
                                <img
                                    src={singleEmployee.image ? `${process.env.BASE_URL}/uploads${singleEmployee.image}` : defaultUser}
                                    alt={singleEmployee.name}
                                    className="lg:h-[250px] lg:w-[250px] h-[180px] w-[180px] rounded-[50%] lg:rounded-lg object-cover object-top mb-5 lg:mb-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};
