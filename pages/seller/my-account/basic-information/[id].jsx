import Layout from "@/components/Layout";
import { genderList } from "@/lib/select-option";
import axios from "axios";

import SellerDetail from "@/components/SellerDetail";
import { faPen } from "@fortawesome/pro-light-svg-icons";
import { faAngleLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";

const BasicInfo = () => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [selectedGender, setSelectedGender] = useState("");
  const router = useRouter();
  const [isEditClickActive, setEditClickActive] = useState(true);
  const [isEditActive, setEditActive] = useState(false);
  const [isSellerClickActive, setSellerClickActive] = useState(false);
  const [isInfoEditActive, setInfoEditActive] = useState(false);
  const [isPoliciesEditActive, setIsPoliciesEditActive] = useState(false);
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
    setIsPoliciesEditActive(false);

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
    setIsPoliciesEditActive(false);

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
    setIsPoliciesEditActive(false);

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
    setIsPoliciesEditActive(false);

  };
  const onPoliciesEdit = (id) => {
    router.push(`/seller/my-account/seller-policies/${id}#policies`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/seller-policies/${id}#policies`;
    }, 3000);
    setIsPoliciesEditActive(true);
    setInfoEditActive(false);
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
    setIsPoliciesEditActive(false);

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
    web3address: editData?.web3address,
    networkType: editData?.networkType,
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
      <Layout userType="seller">
        <>
          {editData ? (
            <div className="mb-8">
              <div ref={scrollRef} />
              <div className="flex justify-end mb-5 group mr-3">
                <button
                  className="buttonprimary text-slate-600 flex items-center   gap-1.5"
                  onClick={() => onClickSubmit(editData._id)}
                >
                  <FontAwesomeIcon
                    icon={faPen}
                    className=""
                  />
                  Edit Profile
                </button>
              </div>

              <div className="w-full overflow-auto  bg-orange-50 rounded shadow shadow-slate-300 my-8">
                <div>
                  <SellerDetail />
                </div>

                <div className="border-[#D8D8D8] border mt-8 rounded">
                  <div className="w-full overflow-auto rounded-md bg-orange-100">
                    <table className="w-[661px] table-fixed  font-medium  bg-orange-100 border-b ">
                      <tr className="w-full">
                        <th className="w-[194px]">
                          <button
                            id="basicInformation"
                            className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${
                              isEditClickActive
                                ? "border-b border-primary text-primary"
                                : ""
                            }`}
                            onClick={() => onEditClick(editData._id)}
                          >
                            Basic Information
                          </button>
                        </th>
                        <th className="w-[117px]">
                          <button
                            id="address"
                            className={`text-blue-950 py-[18px] px-6  transition-all font-medium ease-in-out ${
                              isEditActive
                                ? "border-b border-primary text-primary"
                                : ""
                            }`}
                            onClick={() => onEdit(editData._id)}
                          >
                            Address
                          </button>
                        </th>
                        <th className="w-[155px]">
                          <button
                            id="sellerDetail"
                            className={`text-blue-950 py-[18px] px-6 font-medium  transition-all ease-in-out ${
                              isSellerClickActive
                                ? "border-b border-primary text-primary"
                                : ""
                            }`}
                            onClick={() => onSellerClick(editData._id)}
                          >
                            Seller Details
                          </button>
                        </th>
                        <th className="w-[215px]">
                          <button
                            id="paymentInfo"
                            className={`text-blue-950 py-[18px] px-6 font-medium  transition-all ease-in-out ${
                              isInfoEditActive
                                ? "border-b border-primary text-primary"
                                : ""
                            }`}
                            onClick={() => onInfoEdit(editData._id)}
                          >
                            Payment Information
                          </button>
                        </th>
                        <th className="w-[215px]">
                          <button
                            id="paymentInfo"
                            className={`text-blue-950 py-[18px] px-6 font-medium  transition-all ease-in-out ${
                              isPoliciesEditActive
                                ? "border-b border-primary text-primary"
                                : ""
                            }`}
                            onClick={() => onPoliciesEdit(editData._id)}
                          >
                            Seller Policies
                          </button>
                        </th>
                        {/* <button
                    className={`text-blue-950 py-[18px] px-6  transition-all ease-in-out ${
                      isCommissionEdit ? "border-b border-primary text-primary" : ""
                    }`}
                    onClick={() => onCommissionEdit(editData._id)}
                  >
                    Commission
                  </button> */}
                      </tr>
                    </table>
                  </div>

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
                                loyalty reward redemption. In addition, it can
                                be used for Tamperproof Digital Product
                                Certificates and NFT purchases (applicable to
                                Digital Artists).
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
                        </Form>
                      )}
                    </Formik>
                  </div>
                  <div className="flex items-center gap-4 pb-9">
                    <div className="flex items-center justify-start pl-6">
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
                        <FontAwesomeIcon
                          icon={faAngleLeft}
                          className="h-[8px]"
                        />{" "}
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
      </Layout>
    </>
  );
};

export default BasicInfo;
