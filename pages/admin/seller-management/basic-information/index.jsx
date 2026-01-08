import dynamic from "next/dynamic";
import { genderList } from "@/lib/select-option";
import axios from "axios";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const AdminSellerDetail = dynamic(() => import("@/components/AdminSellerDetail"), { ssr: false });
import { faAngleLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { object, string } from "yup";

const BasicInfo = () => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [selectedGender, setSelectedGender] = useState("");
  const router = useRouter();
  const [isEditClickActive, setEditClickActive] = useState(true);
  const [isEditActive, setEditActive] = useState(false);
  const [isSellerClickActive, setSellerClickActive] = useState(false);
  const [isInfoEditActive, setInfoEditActive] = useState(false);
  const [isCommissionEdit, setCommissionEdit] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Pending");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isPoliciesEditActive, setIsPoliciesEditActive] = useState(false);
  const handleBack = () => {
    router.back();
  };
  const getData = (id) => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${id}`,
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
        // //
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
    router.push(`/admin/seller-management/basic-information?id=${id}`);
    setEditClickActive(true);
    setEditActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };
  const onEdit = (id) => {
    router.push(`/admin/seller-management/address?id=${id}`);
    setEditActive(true);
    setEditClickActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  const onSellerClick = (id) => {
    router.push(`/admin/seller-management/seller-details?id=${id}`);
    setSellerClickActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  const onInfoEdit = (id) => {
    router.push(`/admin/seller-management/payment-information?id=${id}`);
    setInfoEditActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
    setCommissionEdit(false);
  };

  const onCommissionEdit = (id) => {
    router.push(`/admin/seller-management/commission?id=${id}`);
    setCommissionEdit(true);
    setInfoEditActive(false);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
  };

  const onPoliciesEdit = (id) => {
    router.push(`/admin/seller-management/seller-policies?id=${id}`);
    setIsPoliciesEditActive(true);
    setInfoEditActive(false);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
    setCommissionEdit(false);
  };

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);

    const options = {
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/change-status/${editData?._id}`,
      data: {
        status: menuItem,
        userRole: menuItem == "Approved" ? "seller" : "customer",
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
        // //
        toast.success("Status Updated");
      })
      .catch(function (error) {
        console.error(error);
        toast.error("Something Went Wrong");
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
    status: selectedMenuItem,
    email: editData?.email,
    DOB: editData?.DOB ? new Date(editData.DOB) : null,
    gender: selectedGender,
    phone: mobileNumber,
    web3address: editData?.web3address,
    networkType: editData?.networkType,
  };

  const validationSchema = object({
    firstName: string()
      .required("Required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
    lastName: string().required("Required"),
    email: string().email("Invalid email address").required("Required"),
    // shopUrl: string().required("Required"),
    // password: string().required("Required").min(7),
    // contact: string().required("Required"),

    // city: string().required("Required"),
    // zipCode: string().required("Required"),
    // address: string().required("Required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
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
          status: selectedMenuItem,
          phone: mobileNumber,
          userRole: values?.userRole,
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          // //
          router.push(
            `/admin/seller-management/address?id=${response.data._id}`
          );
          setSubmitting(false);
          toast.success("Seller Detail Updated");
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
          status: selectedMenuItem,
          // userRole: values?.userRole,
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          // //
          // router.push(
          //   `/admin/seller-management/address?id=${response.data._id}`
          // );
          setSubmitting(false);
          toast.success("Seller Detail Updated");
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
      <Layout userType="admin">
        <>
          <div className="w-full overflow-auto  bg-orange-50 rounded  my-8">
            <div>
              <div className="flex items-center justify-end gap-4 mb-6">
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button
                      className={`flex items-center justify-center rounded-full ${
                        selectedMenuItem === "Approved"
                          ? "bg-green-800 text-white"
                          : selectedMenuItem === "Disapproved"
                          ? "bg-red-700 text-white"
                          : "bg-gray-500 text-white"
                      } cursor-pointer py-2.5 px-4 gap-2 rounded-sm text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center`}
                    >
                      {selectedMenuItem}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9.211"
                        height="5.411"
                        viewBox="0 0 9.211 5.411"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="9.211"
                          height="5.411"
                          viewBox="0 0 9.211 5.411"
                        >
                          <path
                            d="M24.23,44.615a.383.383,0,0,1-.272-.113l-3.846-3.846a.385.385,0,0,1,.544-.544l3.574,3.574L27.8,40.112a.385.385,0,1,1,.544.544L24.5,44.5a.383.383,0,0,1-.272.113Z"
                            transform="translate(-19.625 -39.579)"
                            fill="#fff"
                            stroke="#fff"
                            strokeWidth="0.75"
                          />
                        </svg>
                      </svg>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-200"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                      <div className="py-2">
                        <Menu.Item>
                          <p
                            className={`${
                              selectedMenuItem === "Approved"
                                ? "hover:bg-orange-100 hover:text-primary"
                                : "hover:bg-orange-100 productCategoryListhover:text-primary"
                            } group flex w-full items-center gap-3 px-3.5 py-2`}
                            onClick={() => handleMenuItemClick("Approved")}
                          >
                            Approved
                          </p>
                        </Menu.Item>
                        <Menu.Item>
                          <p
                            className={`${
                              selectedMenuItem === "Disapproved"
                                ? "hover:bg-orange-100 hover:text-primary"
                                : "hover:bg-orange-100 hover:text-primary"
                            } group flex w-full items-center gap-3 px-3.5 py-2`}
                            onClick={() => handleMenuItemClick("Disapproved")}
                          >
                            Disapproved
                          </p>
                        </Menu.Item>
                        <Menu.Item>
                          <p
                            className={`${
                              selectedMenuItem === "Pending"
                                ? "hover:bg-orange-100 hover:text-primary"
                                : "hover:bg-orange-100 hover:text-primary"
                            } group flex w-full items-center gap-3 px-3.5 py-2`}
                            onClick={() => handleMenuItemClick("Pending")}
                          >
                            Pending
                          </p>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
            <div>
              <AdminSellerDetail />
            </div>
            {!loading ? (
              <div className="border-[#D8D8D8] border mt-8 rounded">
                {editData ? (
                  <div className="relative font-medium text-slate-500 bg-orange-100 border-b flex overflow-auto">
                    <button
                      className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                        isEditClickActive
                          ? "border-b border-primary text-primary"
                          : ""
                      }`}
                      onClick={() => onEditClick(editData._id)}
                    >
                      Basic Information
                    </button>

                    <button
                      className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                        isEditActive
                          ? "border-b border-primary text-primary"
                          : ""
                      }`}
                      onClick={() => onEdit(editData._id)}
                    >
                      Address
                    </button>
                    <button
                      className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                        isSellerClickActive
                          ? "border-b border-primary text-primary"
                          : ""
                      }`}
                      onClick={() => onSellerClick(editData._id)}
                    >
                      Seller Details
                    </button>
                    <button
                      className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                        isInfoEditActive
                          ? "border-b border-primary text-primary"
                          : ""
                      }`}
                      onClick={() => onInfoEdit(editData._id)}
                    >
                      Payment Information
                    </button>
                    <button
                      className={`text-blue-950 py-[18px] md:px-6 px-4  transition-all ease-in-out min-w-[max-content] ${
                        isPoliciesEditActive
                          ? "border-b border-primary text-primary"
                          : ""
                      }`}
                      onClick={() => onPoliciesEdit(editData._id)}
                    >
                      Seller Policies
                    </button>
                    {/* <button
                    className={`text-blue-950 py-[18px] px-6  transition-all ease-in-out ${
                      isCommissionEdit ? "border-b border-primary text-primary" : ""
                    }`}
                    onClick={() => onCommissionEdit(editData._id)}
                  >
                    Commission
                  </button> */}
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
                <div className="md:p-6 p-4 bg-orange-50">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, setFieldValue, errors, handleChange }) => (
                      <Form>
                        <div className="grid md:gap-6 gap-4 md:grid-cols-3 mb-9 st-form">
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
                            <div className="">
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
                              // onChange={(value) => setMobileNumber(`+${value}`)}
                              onChange={(value) => setMobileNumber(`+${value}`)}
                              id="phone"
                              type="text"
                              inputProps={{
                                className: ` ${
                                  errors.contact &&
                                  touched.contact &&
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
                        <div className="flex items-baseline justify-start gap-3 mt-14 mb-7 st-form">
                          <div>
                            <h1
                              className={`text-xl text-blue-950 font-medium   `}
                            >
                              Web3 Wallet Information
                            </h1>
                            <p className="mb-1 mt-1 text-sm font-medium text-blue-950">
                              Currently supporting BNB Smart Chain Network
                              Addressses.
                            </p>
                            <p className="text-xs font-medium">
                              This address is automatically linked to your
                              E-Mail account.
                              <br />
                              This optional Web3 wallet allows secure sign-in
                              (without email), digital asset transactions, and
                              loyalty reward redemption. In addition, it can be
                              used for Tamperproof Digital Product Certificates
                              and NFT purchases (applicable to Digital Artists).
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 md:gap-6 md:grid-cols-3 mb-6 lg:mb-12 st-form">
                          <div className="relative pointer-events-none">
                            <label htmlFor="networkType">Network Type</label>
                            <Field
                              type="text"
                              name="networkType"
                              id="networkType"
                              placeholder="Binance Network"
                            />
                            <ErrorMessage
                              name="networkType"
                              component="p"
                              className="invalid"
                            />
                          </div>

                          <div className="relative pointer-events-none">
                            <div>
                              <label htmlFor="web3address">
                                Wallet Address
                              </label>
                            </div>
                            <div>
                              {" "}
                              <Field
                                type="text"
                                name="web3address"
                                id="web3address"
                                placeholder="Enter wallet address"
                              />
                              <ErrorMessage
                                name="web3address"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>
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
                          <div>
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
        </>
      </Layout>
    </>
  );
};

export default BasicInfo;
