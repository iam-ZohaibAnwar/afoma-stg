import dynamic from "next/dynamic";
import { genderList } from "@/lib/select-option";
import axios from "axios";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const AdminSellerDetail = dynamic(() => import("@/components/AdminSellerDetail"), { ssr: false });
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
import toast from "react-hot-toast";

const PoliciesView = () => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [selectedGender, setSelectedGender] = useState("");
  const router = useRouter();
  const [isEditClickActive, setEditClickActive] = useState(false);
  const [isEditActive, setEditActive] = useState(false);
  const [isSellerClickActive, setSellerClickActive] = useState(false);
  const [isPoliciesEditActive, setIsPoliciesEditActive] = useState(true);
  const [isInfoEditActive, setInfoEditActive] = useState(false);
  const [isCommissionEdit, setCommissionEdit] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isDisabled, setDisabled] = useState(true);


  const [cancellationPolicy, setCancellationPolicy] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [returnPolicy, setReturnPolicy] = useState(false);
  const [returnPolicyDetails, setReturnPolicyDetails] = useState("");
  const [faqList, setFaqList] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");


  const scrollRef = useRef(null);

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
        // setEditData(response.data);
        // setSelectedGender(response.data.gender);
        // setSelectedMenuItem(response.data.status);
        // setMobileNumber(response.data.phone);
        // setSelectedMenuItem(response.data.status);
        // setEditData(response.data);
        // setImagePath(response.data.storeBanner);
        // setLogoPath(response.data.storeLogo);
        // setFilePath(response.data.userProfile);
        setEditData(response.data);
        setReturnPolicy(response.data.storePolicy?.returnPolicy);
        setCancellationPolicy(response.data.storePolicy?.cancellationPolicy);
        setSelectedTime(response.data.storePolicy?.cancellationPolicyTime || "");
        setReturnPolicyDetails(response.data.storePolicy?.returnPolicyDetails || "");
        setFaqList(response.data.storePolicy?.faqList || []);
        setLoading(false);
        setLoading(false);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };
  const initialValues = {
    cancellationPolicy: editData?.storePolicy?.cancellationPolicy || "",
    cancellationPolicyTime: selectedTime,
    returnPolicy: editData?.storePolicy?.returnPolicy || "",
    returnPolicyDetails: returnPolicyDetails,
    faqList: faqList,
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
  };

  const onSellerClick = (id) => {
    router.push(`/admin/seller-management/seller-details/${id}`);
    setSellerClickActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
  }, [router?.query]);
  //   const initialValues = {
  //     firstName: editData?.firstName,
  //     lastName: editData?.lastName,

  //     email: editData?.email,
  //     DOB: editData?.DOB ? new Date(editData.DOB) : null,
  //     gender: selectedGender,
  //     phone: editData?.phone,
  //     web3address: editData?.web3address,
  //     networkType: editData?.networkType,
  //   };

  // const handleSubmit = (id) => {
  //   router.push(`/seller/my-account/basic-information/${id}`);
  // };

  const onClickSubmit = (id) => {
    router.push(`/seller/my-account/seller-policies?id=${id}#policies`);
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




  //   const router = useRouter();

  //   const handleBack = () => {
  //     router.back();
  //   };

  const handleAddFAQ = () => {
    if (question && answer) {
      setFaqList((prev) => [...prev, { question, answer }]);
      setQuestion("");
      setAnswer("");
    } else {
      toast.error("Both question and answer are required!");
    }
  };

  const handleSubmitForm = (values, { setSubmitting }) => {
    // Here, you can handle saving the policies (for example, via an API request)
    setSubmitting(true);

    // Collect the values from the form and relevant states
    const formData = {
      cancellationPolicy: values.cancellationPolicy, // get from form values
      cancellationPolicyTime: selectedTime, // selected time from state
      returnPolicy: values.returnPolicy, // get from form values
      returnPolicyDetails: returnPolicyDetails, // return policy details from state
      faqList: faqList, // FAQs from state
    };

    // You can now log this data or send it to an API

    // Simulate API request with a delay
    setTimeout(() => {
      toast.success("Policies Updated Successfully!");
      router.push(`/seller/my-account/basic-information?id=${editData._id}`);
      setSubmitting(false);
    }, 1500);
  };


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
              <div className="flex justify-end mb-5 group">
                <button
                  className=" text-slate-600 group-hover:text-primary flex items-center   gap-1.5"
                  onClick={() => onClickSubmit(editData._id)}
                >
                  <FontAwesomeIcon
                    icon={faPen}
                    className=" group-hover:text-primary"
                  />
                  Edit
                </button>
              </div>

              <div className="w-full overflow-auto  bg-orange-50 rounded shadow shadow-slate-300 my-8">
                <div>
                  <AdminSellerDetail />
                </div>

                <div className="border-[#D8D8D8] border mt-8 rounded">
                  <div className="w-full overflow-auto rounded-md bg-orange-100">
                    <table className="w-[661px] table-fixed  font-medium  bg-orange-100 border-b ">
                      <tr className="w-full">
                        <th className="w-[194px]">
                          <button
                            id="basicInformation"
                            className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${isEditClickActive
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
                            className={`text-blue-950 py-[18px] px-6  transition-all font-medium ease-in-out ${isEditActive
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
                            className={`text-blue-950 py-[18px] px-6 font-medium  transition-all ease-in-out ${isSellerClickActive
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
                            className={`text-blue-950 py-[18px] px-6 font-medium  transition-all ease-in-out ${isInfoEditActive
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
                            className={`text-blue-950 py-[18px] px-6 font-medium  transition-all ease-in-out ${isPoliciesEditActive
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
                  <div className="p-6 bg-orange-50">
                    <Formik
                      initialValues={initialValues}
                    // onSubmit={handleSubmitForm}
                    >
                      {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
                        <Form>
                          {/* Cancellation Policy Section */}
                          <div className="st-form grid gap-6 mb-9">
                            <div className="w-full">
                              <div className="flex items-center">
                                <Field
                                  type="checkbox"
                                  name="cancellationPolicy"
                                  id="cancellationPolicy"
                                  disabled={isDisabled}
                                  className={` ${isDisabled ? "cursor-not-allowed" : ""}`}
                                  onChange={(e) => {
                                    setCancellationPolicy(e.target.checked);
                                    setFieldValue("cancellationPolicy", e.target.checked);
                                  }}
                                />
                                <label htmlFor="cancellationPolicy" className="ml-2">
                                  Cancellation Policy
                                </label>
                                <span
                                  className="ml-2 text-sm text-gray-500 cursor-help"
                                  data-tip="Enable if you want to provide a cancellation policy for your service or product."
                                  >
                                  (Enable if you want to provide a cancellation policy)
                                </span>
                              </div>
                              {cancellationPolicy && (
                                <div className="ml-6 mt-2">
                                  <Select
                                    options={[
                                      { label: "24 hours", value: "24" },
                                      { label: "48 hours", value: "48" },
                                    ]}
                                    value={
                                      selectedTime
                                        ? { label: selectedTime + " hours", value: selectedTime }
                                        : null
                                    }
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        backgroundColor: 'transparent',  // Set background to transparent
                                        borderRadius: '0.25rem',         // Corrected to camelCase
                                        borderColor: '#47556980',
                                      })
                                    }}
                                    onChange={(selected) => setSelectedTime(selected.value)}
                                    isDisabled={isDisabled} // Disable the Select dropdown
                                  />
                                  <p className="mt-1 text-sm text-gray-500">
                                    Choose the cancellation window (e.g., 24 hours before the event).
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Return Policy Section */}
                          <div className="st-form grid gap-6 mb-9">
                            <div className="w-full">
                              <div className="flex items-center">
                                <Field
                                  type="checkbox"
                                  name="returnPolicy"
                                  id="returnPolicy"
                                  disabled={isDisabled}
                                  className={` ${isDisabled ? "cursor-not-allowed" : ""}`}
                                  onChange={(e) => {
                                    setReturnPolicy(e.target.checked);
                                    setFieldValue("returnPolicy", e.target.checked);
                                  }}
                                />
                                <label htmlFor="returnPolicy" className="ml-2">
                                  Return Policy
                                </label>
                                <span
                                  className="ml-2 text-sm text-gray-500 cursor-help"
                                  data-tip="Enable if you want to define a return policy for your service or product."
                                >
                                  (Enable if you want to provide a return policy)
                                </span>
                              </div>
                              {returnPolicy && (
                                <div className="ml-6 mt-2">
                                  <Field
                                    as="textarea"
                                    name="returnPolicyDetails"
                                    id="returnPolicyDetails"
                                    placeholder="Enter return policy details"
                                    value={returnPolicyDetails}
                                    onChange={(e) => setReturnPolicyDetails(e.target.value)}
                                    className="w-full p-2 border"
                                    disabled={isDisabled} // Disable the textarea
                                  />
                                  <p className="mt-1 text-sm text-gray-500">
                                    Provide details about your return policy (e.g., conditions for returning items).
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                  {/* FAQ Section */}
<div className="st-form gap-6 mb-9">
  <label className="p-2 font-semibold" htmlFor="faq">
    FAQs
  </label>
  <p className="text-sm text-gray-500">
    Add frequently asked questions to help users better understand your policies or products.
  </p>
  
  <div className="flex flex-col mt-2">
    {/* Form inputs for question and answer */}
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-10">
      <div className="lg:w-1/3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter question"
          className="border p-3 h-12 text-sm"
          disabled={isDisabled} // Disable input field if needed
        />
      </div>
      <div className="lg:w-1/2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter answer"
          className="border p-3 w-full h-12 text-sm"
          disabled={isDisabled} // Disable input field if needed
        />
      </div>
      <div className="lg:w-1/6">
        <button
          type="button"
          onClick={handleAddFAQ}
          className="text-white bg-primary px-6 py-3 w-full"
          disabled={isDisabled} // Disable button if needed
        >
          Add FAQ
        </button>
      </div>
    </div>

    {/* FAQ List */}
    <div className="mt-4">
      <h2 className="p-2 font-semibold">FAQs List</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left font-semibold text-gray-700 border-b w-1/3">Question</th>
              <th className="py-2 px-4 text-left font-semibold text-gray-700 border-b">Answer</th>
              {/* <th className="py-2 px-4 text-left font-semibold text-gray-700 border-b w-1/12">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {faqList.map((faq, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{faq.question}</td>
                <td className="py-2 px-4 border-b">{faq.answer}</td>
                {/* <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleDelete(index)}
                    className="hover:text-red-500"
                  >
                    Delete
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>


                          {/* Submit and Back buttons */}
                          <div className="flex items-center gap-4 pb-9">
                            <div className="flex items-center justify-start pl-6">
                              <button
                                className="buttonprimary flex gap-2 items-center"
                                onClick={onClickSubmit}
                              // disabled={isDisabled || isSubmitting} // Disable the button when form is disabled or submitting
                              >
                                Finish
                              </button>
                            </div>
                            <div className="">
                              <button
                                className={`flex gap-2 items-center text-primary`}
                                onClick={handleBack}
                              // disabled={isDisabled} // Disable the button
                              >
                                <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" /> Back
                              </button>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
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

export default PoliciesView;
