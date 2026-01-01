import Layout from "@/components/Layout";
import { genderList } from "@/lib/select-option";
import axios from "axios";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useRef, useState } from "react";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/pro-light-svg-icons";
import SellerDetail from "@/components/SellerDetail";
import { faAngleLeft } from "@fortawesome/pro-regular-svg-icons";
import Head from "next/head";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BasicInformationContentview = () => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [selectedGender, setSelectedGender] = useState("");
  const router = useRouter();
  const [isEditClickActive, setEditClickActive] = useState(true);
  const [isEditActive, setEditActive] = useState(false);
  const [isSellerClickActive, setSellerClickActive] = useState(false);
  const [isInfoEditActive, setInfoEditActive] = useState(false);
  const [isCommissionEdit, setCommissionEdit] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isDisabled, setDisabled] = useState(true);
  const scrollRef = useRef(null);

  const handleBack = () => {
    router.back();
  };
  const getData = () => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${userData?.sellerId}`,
      headers: {
        Authorization: `Bearer ${userData?.accessToken}`,
      },
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        setEditData(response.data);
        setSelectedGender(response.data.gender);
        setSelectedMenuItem(response.data.status);
        setMobileNumber(response.data.phone);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };

  const onEditClick = (id) => {
    router.push(`/seller/my-account/basic-information/${id}#basicInformation`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/basic-information/${id}#basicInformation`;
    }, 3000);
    setEditClickActive(true);
    setEditActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };
  const onEdit = (id) => {
    router.push(`/seller/my-account/address/${id}#address`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/address/${id}#address`;
    }, 3000);
    setEditActive(true);
    setEditClickActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  const onSellerClick = (id) => {
    router.push(`/seller/my-account/seller-details/${id}#sellerDetail`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/seller-details/${id}#sellerDetail`;
    }, 3000);
    setSellerClickActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  const onInfoEdit = (id) => {
    router.push(`/seller/my-account/payment-information/${id}#paymentInfo`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/payment-information/${id}#paymentInfo`;
    }, 3000);
    setInfoEditActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
    setCommissionEdit(false);
  };
  const onCommissionEdit = (id) => {
    router.push(`/seller/my-account/commission/${id}`);
    setCommissionEdit(true);
    setInfoEditActive(false);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
  };

  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
  }, [router?.query]);
  const initialValues = {
    firstName: editData?.firstName,
    lastName: editData?.lastName,

    email: editData?.email,
    DOB: editData?.DOB ? new Date(editData.DOB) : null,
    gender: selectedGender,
    phone: editData?.phone,
  };

  const handleSubmit = (id) => {
    router.push(`/seller/my-account/address/${id}`);
  };

  const onClickSubmit = (id) => {
    router.push(`/seller/my-account/basic-information?id=${id}`);
  };

  const DatePickerComponent = ({ field, form, ...props }) => (
    <ReactDatePicker
      selected={field.value ? new Date(field.value) : null}
      onChange={(date) => form.setFieldValue(field.name, date)}
      placeholderText={field.value ? "" : "Pick a date"} // Conditionally set placeholder text
      dateFormat="yyyy-MM-dd"
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={15} // adjust as needed
      {...props}
    />
  );
  return (
    <>
      {" "}
      <Head>
        <title>A Decentralized Marketplace for Artists and Artisans</title>
        <meta
          property="og:title"
          content="A Decentralized Marketplace for Artists and Artisans
"
        />
        <meta
          property="og:description"
          content="Are you an artist or artisan seeking an alternative and affordable handicraft marketplace to sell your crafts to the global market? Then join our waitlist to gain access to exclusive promotions and be first in line for exciting deals in our upcoming launch!"
        />
        <meta
          name="description"
          content="Join AFOMA Marketplace - a unique platform for artists and artisans to sell crafts globally. Be first for exclusive deals and promotions."
        ></meta>
      </Head>
      <>
        {editData ? (
          <div className="mb-8">
            <div ref={scrollRef} />
            <div className="w-full overflow-auto  bg-orange-50 rounded shadow shadow-slate-300 mb-8">
              <div className="border-[#D8D8D8] border  rounded">
                <div className="p-6 bg-orange-50 ">
                  <Formik
                    initialValues={initialValues}
                    // validationSchema={validationSchema}
                    // onSubmit={handleSubmit}
                  >
                    {({ values, errors, handleChange }) => (
                      <Form className="viewOnly">
                        <div className="grid gap-4 md:gap-6  md:grid-cols-2 lg:grid-cols-3 mb-9 st-form">
                          <div className="relative">
                            <div>
                              {" "}
                              <label htmlFor="firstName">First Name</label>
                            </div>
                            <div className="mt-3">
                              <Field
                                type="text"
                                name="firstName"
                                id="firstName"
                                disabled={isDisabled}
                                className={` ${
                                  isDisabled ? "cursor-not-allowed " : ""
                                }`}
                                placeholder="Enter first name"
                              />
                              <ErrorMessage
                                name="firstName"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>

                          <div className="relative">
                            <div>
                              <label htmlFor="lastName">Last Name</label>
                            </div>
                            <div className="mt-3">
                              {" "}
                              <Field
                                type="text"
                                name="lastName"
                                id="lastName"
                                // readOnly
                                disabled={isDisabled}
                                className={` ${
                                  isDisabled ? "cursor-not-allowed " : ""
                                }`}
                                placeholder="Enter last name"
                              />
                              <ErrorMessage
                                name="lastName"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>

                          <div className="relative">
                            <div>
                              {" "}
                              <label htmlFor="email">Email Address</label>
                            </div>
                            <div className="mt-3">
                              {" "}
                              <Field
                                type="email"
                                name="email"
                                id="email"
                                disabled={isDisabled}
                                className={` ${
                                  isDisabled ? "cursor-not-allowed " : ""
                                }`}
                                placeholder="Enter email id"
                              />
                              <ErrorMessage
                                name="email"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>

                          <div className="relative viewform">
                            <label htmlFor="gender">Gender</label>
                            <Select
                              name="gender"
                              id="gender"
                              options={genderList}
                              placeholder="Select gender"
                              isDisabled={isDisabled}
                              className={`st-react-select  cursor-not-allowed ${
                                isDisabled ? "cursor-not-allowed " : ""
                              }`}
                              classNamePrefix="react-select"
                              onChange={(selectedOption) => {
                                setSelectedGender(selectedOption?.value);
                                handleChange("property_type")(
                                  selectedOption?.value
                                );
                              }}
                              defaultValue={
                                selectedGender && selectedGender !== ""
                                  ? {
                                      value: selectedGender,
                                      label:
                                        selectedGender === "male"
                                          ? "Male"
                                          : selectedGender === "female"
                                          ? "Female"
                                          : selectedGender === "other"
                                          ? "Other"
                                          : null,
                                    }
                                  : null
                              }
                            />
                          </div>

                          <div className="relative ">
                            <div>
                              {" "}
                              <label htmlFor="DOB">Date of Birth</label>
                            </div>
                            <div className="mt-3 ">
                              <Field
                                type="date"
                                name="DOB"
                                id="DOB"
                                disabled={isDisabled}
                                className={` ${
                                  isDisabled ? "cursor-not-allowed " : ""
                                }`}
                                placeholder="Pick a date"
                                component={DatePickerComponent}
                              />
                              <ErrorMessage
                                name="DOB"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>

                          <div className="relative viewform">
                            <label htmlFor="phone">Contact No.</label>
                            <PhoneInput
                              country={`in`}
                              countryCode={`in`}
                              disabled={isDisabled}
                              className={` ${
                                isDisabled ? "cursor-not-allowed " : ""
                              }`}
                              value={mobileNumber}
                              // required
                              onChange={(value) =>
                                setMobileNumber("phone", `+${value}`)
                              }
                              id="phone"
                              type="text"
                              inputProps={{
                                className: ` ${
                                  errors.phone &&
                                  touched.phone &&
                                  submitCount > 0
                                    ? "border-red-600"
                                    : "border-slate-300"
                                }`,
                              }}
                            />
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
                <div className="flex items-center gap-4 pb-9">
                  <div className="flex items-center justify-start md:pl-6 pl-4">
                    <button
                      className="buttonprimary flex gap-2 items-center "
                      onClick={() => handleSubmit(editData._id)}
                    >
                      Next
                    </button>
                  </div>
                  <div className="">
                    <button
                      className={` flex gap-2 items-center text-primary `}
                      onClick={handleBack}
                    >
                      <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" />{" "}
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </>
    </>
  );
};

export default BasicInformationContentview;
