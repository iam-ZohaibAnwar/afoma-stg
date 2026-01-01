import Layout from "@/components/Layout";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { object, string } from "yup";
import SellerDetail from "@/components/SellerDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/pro-regular-svg-icons";
import Head from "next/head";

const PaymentInformation = () => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [isEditClickActive, setEditClickActive] = useState(false);
  const [isEditActive, setEditActive] = useState(false);
  const [isSellerClickActive, setSellerClickActive] = useState(false);
  const [isInfoEditActive, setInfoEditActive] = useState(true);
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
        // //
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
  };
  const validationSchema = object({
    accountHolderName: string().required("Required"),
    accountNumber: string()
      .matches(/^[0-9]+$/, "Please enter numbers only ")
      .nullable()
      .required("Required"),
    swiftCode: string().matches(/^[0-9]+$/, "Please enter numbers only "),
    ibanNumber: string().matches(/^[0-9]+$/, "Please enter numbers only "),
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
            `/seller/my-account/basic-information/${response.data._id}`
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
            },
          ],
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };
      axios
        .request(options)
        .then(function (response) {
          // //

          setSubmitting(false);
          toast.success("New Information Added");
        })
        .catch(function (error) {
          console.error(error);
          setSubmitting(false);
          toast.error("Something Went Wrong");
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
          content="A Decentralized Marketplace for Artists and Artisans"
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
      <div>
        <div className="w-full overflow-auto  bg-orange-50 rounded shadow shadow-slate-300 mb-8">
          {editData ? (
            <div>
              <div className="border-[#D8D8D8] border  rounded">
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
                                <label htmlFor="ibanNumber">IBAN Number</label>
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

                          {/* <div className="flex items-baseline justify-start gap-3 mt-14">
                        <h1
                          className={`text-xl text-blue-950 font-medium mb-7  `}
                        >
                          Crypto Wallet Information
                        </h1>
                        <div>
                          <FontAwesomeIcon
                            icon={faCircleInfo}
                            className="h-4 w-4 fill-slate-600 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:gap-6 md:grid-cols-3 mb-6 lg:mb-12">
                        <div className="relative  viewform">
                          <label htmlFor="transactionType">
                            Transaction Type
                          </label>
                          <Select
                            name="transactionType"
                            id="transactionType"
                            options={genderList}
                            placeholder="Binance Network"
                            className="st-react-select "
                            classNamePrefix="react-select"
                            //   defaultValue={() => {
                            //     if (
                            //       initialValues.transactionType &&
                            //       initialValues.transactionType != ""
                            //     )
                            //       return {
                            //         value: initialValues.transactionType,
                            //         label: initialValues.transactionType,
                            //       };
                            //     else return "";
                            //   }}
                            // onChange={(selectedOption) => {
                            //   handleChange("transactionType")(selectedOption?.value);
                            // }}
                          />
                        </div>

                        <div className="relative">
                          <div>
                            <label htmlFor="walletAddress">
                              Wallet Address
                            </label>
                          </div>
                          <div>
                            {" "}
                            <Field
                              type="text"
                              name="walletAddress"
                              id="walletAddress"
                              placeholder="Enter wallet address"
                            />
                            <ErrorMessage
                              name="walletAddress"
                              component="p"
                              className="invalid"
                            />
                          </div>
                        </div>
                      </div> */}
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
    </>
  );
};

export default PaymentInformation;
