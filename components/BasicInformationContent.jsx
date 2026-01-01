import { genderList } from "@/lib/select-option";
import { faAngleLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { object, string } from "yup";

import "react-datepicker/dist/react-datepicker.css";

const BasicInformationContent = ({ onSectionChange }) => {
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
  const getData = (id) => {
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
    phone: mobileNumber,
  };
  const validationSchema = object({
    firstName: string()
      .required("Required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
    lastName: string().required("Required"),
    email: string().email("Invalid email address").required("Required"),
  });
  const handleBack = () => {
    router.back();
  };
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (editData?._id) {
      setSubmitting(true);
      const options = {
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${editData?._id}`,
        data: {
          firstName: values?.firstName,
          lastName: values?.lastName,
          email: values?.email,
          DOB: values?.DOB,
          gender: selectedGender,

          phone: mobileNumber,
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          onSectionChange("address");
          setSubmitting(false);
          toast.success("Seller Updated");
          // resetForm();
        })
        .catch(function (error) {
          console.error(error);
          setSubmitting(false);
          toast.error("Something Went Wrong");
          // resetForm();
        });
    } else {
      setSubmitting(true);
      const options = {
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers`,
        data: {
          firstName: values?.firstName,
          lastName: values?.lastName,
          email: values?.email,
          DOB: values?.DOB,
          gender: selectedGender,
          phone: mobileNumber,
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          // router.push(
          //   `/seller/my-account/address?id=${response.data._id}`
          // );
          setSubmitting(false);
          toast.success("New Information Added");
          // resetForm();
        })
        .catch(function (error) {
          console.error(error);
          setSubmitting(false);
          toast.error("Something Went Wrong");
          // resetForm();
        });
    }
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
        <div>
          <div className="w-full overflow-auto  bg-orange-50 rounded shadow shadow-slate-300 ">
            {!loading ? (
              <div className="border-[#D8D8D8] border mb-8 rounded ">
                <div className="p-6 bg-orange-50 ">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, handleChange }) => (
                      <Form>
                        <div className="grid gap-4 md:gap-6  md:grid-cols-2 lg:grid-cols-3 mb-9 st-form">
                          <div className="relative">
                            <div>
                              {" "}
                              <label htmlFor="firstName">
                                First Name{" "}
                                <span className="text-red-700 ">*</span>
                              </label>
                            </div>
                            <div className="mt-3">
                              <Field
                                type="text"
                                name="firstName"
                                id="firstName"
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
                              <label htmlFor="lastName">
                                Last Name{" "}
                                <span className="text-red-700 ">*</span>
                              </label>
                            </div>
                            <div className="mt-3">
                              {" "}
                              <Field
                                type="text"
                                name="lastName"
                                id="lastName"
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
                              <label htmlFor="email">
                                Email Address{" "}
                                <span className="text-red-700 ">*</span>
                              </label>
                            </div>
                            <div className="mt-3">
                              {" "}
                              <Field
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter email address"
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
                              className="st-react-select"
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
                              value={mobileNumber}
                              // required
                              onChange={(value) => setMobileNumber(`+${value}`)}
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

                          {/* <div className="relative viewform">
                  <label htmlFor="moNumber">Contact No.</label>
                  <PhoneInput
                    country={`in`}
                    value={values.moNumber}
                    // required
                    onChange={(value) => setFieldValue("moNumber", `+${value}`)}
                    id="moNumber"
                    type="text"
                    inputProps={{
                      className: ` ${
                        errors.moNumber && touched.moNumber && submitCount > 0
                          ? "border-red-600"
                          : "border-slate-300"
                      }`,
                    }}
                  />
                  {errors.moNumber && touched.moNumber && submitCount > 0 && (
                    <span className="absolute -top-5 right-0 text-sm text-red-600">
                      {errors.moNumber}
                    </span>
                  )}
                </div> */}
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="flex items-center justify-start">
                            <button
                              type="submit"
                              className="buttonprimary flex gap-2 items-center "
                            >
                              Save and next
                            </button>
                          </div>
                          <div className="">
                            <button
                              type="button"
                              className={` flex gap-2 items-center text-primary `}
                              onClick={handleBack}
                            >
                              <FontAwesomeIcon
                                icon={faAngleLeft}
                                className="h-[8px]"
                              />{" "}
                              Back
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </>
    </>
  );
};

export default BasicInformationContent;
