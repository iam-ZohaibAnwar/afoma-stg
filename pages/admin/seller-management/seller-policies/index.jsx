import dynamic from "next/dynamic";
import { faAngleLeft, faTrashCan } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { object, string } from "yup";
import Select from "react-select";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const BannerImageCropperModal = dynamic(() => import("@/components/BannerImageCropperModal"), { ssr: false });
const AdminSellerDetail = dynamic(() => import("@/components/AdminSellerDetail"), { ssr: false });


const Policies = () => {
  const [loading, setLoading] = useState(false);
  const [bannerImageLoading, setBannerImageLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [isEditClickActive, setEditClickActive] = useState(false);
  const [isPoliciesEditActive, setIsPoliciesEditActive] = useState(true);
  const [isEditActive, setEditActive] = useState(false);
  const [isSellerClickActive, setSellerClickActive] = useState(false);
  const [isInfoEditActive, setInfoEditActive] = useState(false);
  const [isCommissionEdit, setCommissionEdit] = useState(false);
  const [imagePath, setImagePath] = useState([]);
  const [logoPath, setLogoPath] = useState([]);
  const [filePath, setFilePath] = useState();

  const [selectedReturnOption, setSelectedReturnOption] = useState("");
  // const [returnPolicyDetails, setReturnPolicyDetails] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [returnPolicy, setReturnPolicy] = useState(false);
  const [returnPolicyDetails, setReturnPolicyDetails] = useState("");
  const [faqList, setFaqList] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [selectedMenuItem, setSelectedMenuItem] = useState("Pending");
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
        setEditData(response.data);
        setReturnPolicy(response.data.storePolicy?.returnPolicy);
        setCancellationPolicy(response.data.storePolicy?.cancellationPolicy);
        setSelectedTime(response.data.storePolicy?.cancellationPolicyTime || "");
        setReturnPolicyDetails(response.data.storePolicy?.returnPolicyDetails || "");
        setSelectedReturnOption(response.data.storePolicy?.returnPolicyDetails || "");
        setFaqList(response.data.storePolicy?.faqList || []);
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
  const router = useRouter();

  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
  }, [router?.query]);


  const handleBack = () => {
    router.back();
  };
  const onEditClick = (id) => {
    router.push(
      `/admin/seller-management/basic-information?id=${id}#basicInformation`
    );
    setTimeout(() => {
      window.location.href = `/admin/seller-management/basic-information?id=${id}#basicInformation`;
    }, 3000);
    setEditClickActive(true);
    setEditActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };
  const onEdit = (id) => {
    router.push(`/admin/seller-management/address?id=${id}`);
    router.push(`/admin/seller-management/address?id=${id}`);
    setTimeout(() => {
      window.location.href = `/admin/seller-management/address?id=${id}`;
    }, 3000);
    setEditActive(true);
    setEditClickActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  const onSellerClick = (id) => {
    router.push(`/admin/seller-management/seller-details?id=${id}`);
    setTimeout(() => {
      window.location.href = `/admin/seller-management/seller-details?id=${id}`;
    }, 3000);
    setSellerClickActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };
  const onPoliciesEdit = (id) => {
    router.push(`/admin/seller-management/seller-policies?id=${id}#policies`);
    setTimeout(() => {
      window.location.href = `/admin/seller-management/seller-policies?id=${id}`;
    }, 3000);
    setIsPoliciesEditActive(true);
    setInfoEditActive(false);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
    setCommissionEdit(false);
  };
  const onInfoEdit = (id) => {
    router.push(`/admin/seller-management/payment-information?id=${id}`);
    router.push(`/admin/seller-management/payment-information?id=${id}`);
    setTimeout(() => {
      window.location.href = `/admin/seller-management/payment-information?id=${id}`;
    }, 3000);
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
  const validationSchema = object({
    twitter: string().matches(
      /^(https?:\/\/)?(www\.)?twitter\.com\/([a-zA-Z0-9_]){1,15}\/?$/,
      "Please enter a valid Twitter URL"
    ),
    facebook: string().matches(
      /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9.]{1,}\/?$/,
      "Please enter a valid Facebook URL"
    ),
    instagram: string().matches(
      /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_]{1,}\/?$/,
      "Please enter a valid Instagram URL"
    ),
    taxVatNumber: string()
      .matches(/^[0-9]+$/, "Please enter numbers only ")
      .nullable(),
    productGallery: string().matches(
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i,
      "Please enter a valid URL format"
    ),
    storeDesc: string().max(
      1000,
      "Description must be less than 1000 characters"
    ),

    // returnPolicy: string().required("Required"),
    // shippingPolicy: string().required("Required"),
  });
  const handleSubmit = (values, { setSubmitting }) => {

    const formData = {
      cancellationPolicy: values.cancellationPolicy, // get from form values
      cancellationPolicyTime: selectedTime, // selected time from state
      returnPolicy: values.returnPolicy, // get from form values
      returnPolicyDetails: returnPolicyDetails, // return policy details from state
      faqList: faqList, // FAQs from state
    };

    // You can now log this data or send it to an API
    if (editData?._id) {
      setSubmitting(true);
      const options = {
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${editData?._id}`,
        data: {
          storePolicy: formData
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          router.push(
            `/admin/seller-management/basic-information/${response.data._id}`
          );
          setSubmitting(false);
          toast.success("Seller Updated");
        })
        .catch(function (error) {
          console.error(error);
          setSubmitting(false);
          toast.error("Something Went Wrong");
        });
    } else {
      setSubmitting(true);
      const options = {
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers`,
        data: {
          storePolicy: formData
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          setSubmitting(false);
          toast.success("Seller policies Updated");
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
      router.push(`/admin/seller-management/basic-information?id=${editData._id}`);
      setSubmitting(false);
    }, 1500);
  };

  // Function to handle deleting a FAQ
  const handleDelete = (index) => {
    const updatedFaqList = faqList.filter((_, i) => i !== index);
    setFaqList(updatedFaqList);
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
        <div className="pb-8">
          <div className="w-full overflow-auto  bg-orange-50 rounded shadow shadow-slate-300 my-8">
            {editData ? (
              <div>
                <div>
                  <AdminSellerDetail />
                </div>

                <div className="border-[#D8D8D8] border mt-8 rounded">
                  <div className=" overflow-auto rounded-md bg-orange-100">
                    <table className="w-[661px] table-fixed  font-medium  bg-orange-100 border-b ">
                      <tbody>
                        <tr>
                          <th className="w-[194px]">
                            <button
                              id="basicInformation"
                              className={`text-blue-950 py-[18px] px-6  font-medium  transition-all ease-in-out ${isEditClickActive
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
                              className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${isEditActive
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
                              className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${isSellerClickActive
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
                              className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${isInfoEditActive
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
                      </tbody>
                    </table>
                  </div>
                  <div className="p-6 bg-orange-50">
                    <Formik
                      initialValues={initialValues}
                      onSubmit={handleSubmit}
                    >
                      {({ values, setFieldValue, setSubmitting }) => (
                        <Form>
                          {/* Cancellation Policy Section */}
                          <div className="st-form grid gap-6 mb-9">
                            <div className="w-full">
                              <div className="flex items-center">
                                <Field
                                  type="checkbox"
                                  name="cancellationPolicy"
                                  id="cancellationPolicy"
                                  onChange={(e) => {
                                    setCancellationPolicy(e.target.checked);
                                    setFieldValue("cancellationPolicy", e.target.checked);
                                  }}
                                />
                                <label htmlFor="cancellationPolicy" className="ml-2">
                                  Cancellation Policy
                                </label>
                                <span className="ml-2 text-sm text-gray-500 cursor-help" data-tip="Enable if you want to provide a cancellation policy for your service or product.">
                                  (Enable if you want to provide a return policy)
                                </span>
                              </div>
                              {cancellationPolicy && (
                                <div className="ml-6 mt-2">
                                  <Select
                                    options={[
                                      { label: "24 hours", value: "24" },
                                      { label: "48 hours", value: "48" },
                                    ]}
                                    value={selectedTime ? { label: selectedTime + " hours", value: selectedTime } : null}
                                    onChange={(selected) => setSelectedTime(selected.value)}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        backgroundColor: 'transparent',  // Set background to transparent
                                        borderRadius: '0.25rem',         // Corrected to camelCase
                                        borderColor: '#47556980',
                                      })
                                    }}
                                  />
                                  <p className="mt-1 text-sm text-gray-500">Choose the cancellation window (e.g., 24 hours before the event).</p>
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
                                  onChange={(e) => {
                                    setReturnPolicy(e.target.checked);
                                    setFieldValue("returnPolicy", e.target.checked);
                                  }}
                                />
                                <label htmlFor="returnPolicy" className="ml-2">
                                  Return Policy
                                </label>
                                <span className="ml-2 text-sm text-gray-500 cursor-help" data-tip="Enable if you want to define a return policy for your service or product.">
                                  (Enable if you want to provide a return policy)
                                </span>
                              </div>
                              {returnPolicy && (
                                <div className="ml-6 mt-2">
                                  {/* New Dropdown for Selecting Return Policy */}
                                  <div className="flex flex-col gap-2">
                                    <Select
                                      options={[
                                        { label: "No Returns – All sales are final.", value: "No Returns – All sales are final." },
                                        { label: "7-Day Returns – Return within 7 days. Buyer covers shipping.", value: "7-Day Returns – Return within 7 days. Buyer covers shipping." },
                                        { label: "14-Day Returns – Return within 14 days. Buyer covers shipping unless defective.", value: "14-Day Returns – Return within 14 days. Buyer covers shipping unless defective." },
                                        { label: "30-Day Returns – Return within 30 days. Unused, original packaging. Buyer covers shipping.", value: "30-Day Returns – Return within 30 days. Unused, original packaging. Buyer covers shipping." },
                                        { label: "Exchanges Only – No returns, but exchanges allowed for defects within 14 days.", value: "Exchanges Only – No returns, but exchanges allowed for defects within 14 days." },
                                        { label: "Damaged/Incorrect Items Only – Returns accepted within 7 days for damaged or wrong items.", value: "Damaged/Incorrect Items Only – Returns accepted within 7 days for damaged or wrong items." },
                                        { label: "Customized – Enter your own return policy details.", value: "Customized – Enter your own return policy details." }
                                      ]}
                                      value={selectedReturnOption ? { label: selectedReturnOption, value: selectedReturnOption } : null}
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          backgroundColor: 'transparent',  // Set background to transparent
                                          borderRadius: '0.25rem',         // Corrected to camelCase
                                          borderColor: '#47556980',
                                        })
                                      }}
                                      onChange={(selected) =>{
                                        setSelectedReturnOption(selected.value)
                                        if(selected.value!="Customized – Enter your own return policy details."){
                                          setReturnPolicyDetails(selected.value)
                                        }else{
                                          setReturnPolicyDetails("")
                                        }
                                      }
                                      } 
                                    />
                                    <p className="mt-1 text-sm text-gray-500">Choose your return policy option. Or you can add your own policy below.</p>

                                    {/* Option to Enter Custom Return Policy if "Customized" is Selected
                                    {selectedReturnOption === "customized" && (
                                      <Field
                                        as="textarea"
                                        name="returnPolicyCustom"
                                        id="returnPolicyCustom"
                                        placeholder="Enter your custom return policy"
                                        value={returnPolicyDetails}
                                        onChange={(e) => setReturnPolicyDetails(e.target.value)}
                                        className="w-full p-2 border"
                                      />
                                    )} */}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Return Policy Details Section */}
                          {returnPolicy && selectedReturnOption === "Customized – Enter your own return policy details." && (
                            <div className="st-form grid gap-6 mb-9">
                              <div className="w-full">
                                <div className="ml-6 mt-2">
                                  <Field
                                    as="textarea"
                                    name="returnPolicyDetails"
                                    id="returnPolicyDetails"
                                    placeholder="Enter your return policy details"
                                    value={returnPolicyDetails}
                                    onChange={(e) => setReturnPolicyDetails(e.target.value)}
                                    className="w-full p-2 border"
                                  />
                                  <p className="mt-1 text-sm text-gray-500">Provide details about your return policy (e.g., conditions for returning items).</p>
                                </div>
                              </div>
                            </div>
                          )}
{/* FAQ Section */}
<div className="st-form gap-6 mb-9">
  {/* <div className=""> */}
    <label className="p-2 font-semibold" htmlFor="faq">
      FAQs
    </label>
    <p className="text-sm text-gray-500">Add frequently asked questions to help users better understand your policies or products.</p>
    <div className="flex flex-col mt-2">
      {/* Form inputs for question and answer */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 ">
        <div className=" lg:w-1/3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter question"
            className="border p-3 h-12 text-sm"
          />
        </div>
        <div className="lg:w-1/2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter answer"
            className="border p-3 w-full h-12 text-sm"
          />
        </div>
        <div className="lg:w-1/6">
          <button
            type="button"
            onClick={handleAddFAQ}
            className="text-white bg-primary px-6 py-3  w-full"
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
          <th className="py-2 px-4 text-left font-semibold text-gray-700 border-b w-1/12">Action</th>
        </tr>
      </thead>
      <tbody>
        {faqList.map((faq, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b">{faq.question}</td>
            <td className="py-2 px-4 border-b">{faq.answer}</td>
            <td className="py-2 px-4 border-b">
              <button
                onClick={() => handleDelete(index)}
                className="hover:text-red-500"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  {/* </div> */}
</div>



                          <div className="flex items-center gap-4 pb-9">
                            <div className="flex items-center justify-start pl-6">
                              <button
                                className="buttonprimary flex gap-2 items-center"
                                type="submit"
                              >
                                Finish
                              </button>
                            </div>
                            <div className="">
                              <button
                                className={`flex gap-2 items-center text-primary`}
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
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Policies;
