import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const SellerDetail = dynamic(() => import("@/components/SellerDetail"), { ssr: false });
import { faAngleLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { object, string } from "yup";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [isEditClickActive, setEditClickActive] = useState(false);
  const [isEditActive, setEditActive] = useState(false);
  const [isSellerClickActive, setSellerClickActive] = useState(false);
  const [isInfoEditActive, setInfoEditActive] = useState(true);
  const [isPoliciesEditActive, setIsPoliciesEditActive] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Pending");
  const [isCommissionEdit, setCommissionEdit] = useState(false);

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
        setSelectedMenuItem(response.data.status);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
  }, [router?.query]);
  const initialValues = {
    accountHolderName: editData?.paymentInfo[0]?.accountHolderName,
    accountNumber: editData?.paymentInfo[0]?.accountNumber,
    swiftCode: editData?.paymentInfo[0]?.swiftCode,
    bankName: editData?.paymentInfo[0]?.bankName,
    ibanNumber: editData?.paymentInfo[0]?.ibanNumber,
    web3address: editData?.web3address,
    networkType: editData?.networkType,
  };
  const validationSchema = object({
    accountHolderName: string().required("Required"),
    accountNumber: string()
      .matches(/^[0-9]+$/, "Please enter numbers only ")
      .nullable()
      .required("Required"),
    swiftCode: string().matches(
      /^[0-9a-zA-Z]+$/,
      "Please enter alphanumeric characters only "
    ),
    ibanNumber: string().matches(
      /^[0-9a-zA-Z]+$/,
      "Please enter alphanumeric characters only "
    ),
  });
  const onEditClick = (id) => {
    router.push(
      `/seller/my-account/basic-information?id=${id}#basicInformation`
    );
    setTimeout(() => {
      window.location.href = `/seller/my-account/basic-information?id=${id}#basicInformation`;
    }, 3000);
    setEditClickActive(true);
    setEditActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
  };
  const onEdit = (id) => {
    router.push(`/seller/my-account/address?id=${id}#address`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/address?id=${id}#address`;
    }, 3000);
    setEditActive(true);
    setEditClickActive(false);
    setSellerClickActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };
  const onPoliciesEdit = (id) => {
    router.push(`/seller/my-account/seller-policies?id=${id}#policies`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/seller-policies?id=${id}#policies`;
    }, 3000);
    setIsPoliciesEditActive(true);
    setInfoEditActive(false);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
    setCommissionEdit(false);
  };
  const onSellerClick = (id) => {
    router.push(`/seller/my-account/seller-details?id=${id}#sellerDetail`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/seller-details?id=${id}#sellerDetail`;
    }, 3000);
    setSellerClickActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setInfoEditActive(false);
    setCommissionEdit(false);
  };

  const onInfoEdit = (id) => {
    router.push(`/seller/my-account/payment-information?id=${id}#paymentInfo`);
    setTimeout(() => {
      window.location.href = `/seller/my-account/payment-information?id=${id}#paymentInfo`;
    }, 3000);
    setInfoEditActive(true);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
    setCommissionEdit(false);
  };
  const onCommissionEdit = (id) => {
    router.push(`/seller/my-account/commission?id=${id}`);
    setCommissionEdit(true);
    setInfoEditActive(false);
    setEditClickActive(false);
    setEditActive(false);
    setSellerClickActive(false);
  };
  const handleSubmit = (values, { setSubmitting }) => {
    if (editData?._id) {
      setSubmitting(true);
      const options = {
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${editData?._id}`,
        data: {
          paymentInfo: [
            {
              accountHolderName: values?.accountHolderName,
              accountNumber: values?.accountNumber,
              swiftCode: values?.swiftCode,
              bankName: values?.bankName,
              productStatus: selectedMenuItem,
              ibanNumber: values?.ibanNumber,
            },
          ],
          web3address: values?.web3address,
          data: "paymentInfo"
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          router.push(
            `/seller/my-account/seller-policies/${response.data._id}`
          );
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
          paymentInfo: [
            {
              accountHolderName: values?.accountHolderName,
              accountNumber: values?.accountNumber,
              swiftCode: values?.swiftCode,
              bankName: values?.bankName,
              productStatus: selectedMenuItem,
              ibanNumber: values?.ibanNumber,
              web3address: values?.web3address,
            },
          ],
          web3address: values?.web3address,
          data: "paymentInfo"
        },
      };

      axios
        .request(options)
        .then(function (response) {
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
                  <SellerDetail />
                </div>
                <div className="border-[#D8D8D8] border mt-8 rounded">
                  <div className=" overflow-auto rounded-md bg-orange-100">
                    <table className="w-[661px] table-fixed  font-medium  bg-orange-100 border-b ">
                      <tbody>
                        <tr>
                          <th className="w-[194px]">
                            <button
                              id="basicInformation"
                              className={`text-blue-950 py-[18px] px-6  font-medium  transition-all ease-in-out ${
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
                              className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${
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
                              className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${
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
                              className={`text-blue-950 py-[18px] px-6 font-medium transition-all ease-in-out ${
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
                      </tbody>
                    </table>
                  </div>
                  <div className="p-6 bg-orange-50">
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ values }) => (
                        <Form>
                          <div className="st-form">
                            <h1 className="text-xl text-blue-950 font-medium mb-7 ">
                              Bank Details
                            </h1>
                            <div className="grid md:gap-6 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-9 ">
                              <div className="relative">
                                <div>
                                  <label htmlFor="accountHolderName">
                                    Account Holder Name{" "}
                                    <span className="text-red-700 ">*</span>
                                  </label>
                                </div>
                                <div>
                                  <Field
                                    type="text"
                                    name="accountHolderName"
                                    id="accountHolderName"
                                    placeholder="Enter account holder name"
                                  />
                                  <ErrorMessage
                                    name="accountHolderName"
                                    component="p"
                                    className="invalid"
                                  />
                                </div>
                              </div>

                              <div className="relative">
                                <div>
                                  <label
                                    htmlFor="accountNumber"
                                    className="text-base"
                                  >
                                    Account Number{" "}
                                    <span className="text-red-700 ">*</span>
                                  </label>
                                </div>
                                <div>
                                  <Field
                                    type="text"
                                    name="accountNumber"
                                    id="accountNumber"
                                    placeholder="Enter account number"
                                  />
                                  <ErrorMessage
                                    name="accountNumber"
                                    component="p"
                                    className="invalid"
                                  />
                                </div>
                              </div>

                              <div className="relative">
                                <div>
                                  {" "}
                                  <label htmlFor="swiftCode">Swift Code</label>
                                </div>
                                <div>
                                  {" "}
                                  <Field
                                    type="text"
                                    name="swiftCode"
                                    id="swiftCode"
                                    placeholder="Enter swift code"
                                  />
                                  <ErrorMessage
                                    name="swiftCode"
                                    component="p"
                                    className="invalid"
                                  />
                                </div>
                              </div>

                              <div className="relative">
                                <div>
                                  {" "}
                                  <label htmlFor="bankName">Bank Name</label>
                                </div>
                                <div>
                                  {" "}
                                  <Field
                                    type="text"
                                    name="bankName"
                                    id="bankName"
                                    placeholder="Enter bank name"
                                  />
                                  <ErrorMessage
                                    name="bankName"
                                    component="p"
                                    className="invalid"
                                  />
                                </div>
                              </div>

                              <div className="relative">
                                <div>
                                  {" "}
                                  <label htmlFor="ibanNumber">
                                    IBAN Number
                                  </label>
                                </div>
                                <div>
                                  {" "}
                                  <Field
                                    type="text"
                                    name="ibanNumber"
                                    id="ibanNumber"
                                    placeholder="Enter IBAN number"
                                  />
                                  <ErrorMessage
                                    name="ibanNumber"
                                    component="p"
                                    className="invalid"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-4 items-center">
                            <div className="flex items-center justify-start">
                              <button
                                type="submit"
                                className="buttonprimary flex gap-2 items-center "
                              >
                                Save
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

export default Payment;
