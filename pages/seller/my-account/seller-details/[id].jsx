import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const SellerDetail = dynamic(() => import("@/components/SellerDetail"), { ssr: false });
import { faPen } from "@fortawesome/pro-light-svg-icons";
import { faAngleLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Seller = () => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [isEditClickActive, setEditClickActive] = useState(false);
  const [isEditActive, setEditActive] = useState(false);
  const [isSellerClickActive, setSellerClickActive] = useState(true);
  const [isInfoEditActive, setInfoEditActive] = useState(false);
  const [isCommissionEdit, setCommissionEdit] = useState(false);
  const [isPoliciesEditActive, setIsPoliciesEditActive] = useState(false);
  const [imagePath, setImagePath] = useState([]);
  const [logoPath, setLogoPath] = useState([]);
  const [filePath, setFilePath] = useState();
  const [isDisabled, setDisabled] = useState(true);
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
        setImagePath(response.data.storeBanner);
        setLogoPath(response.data.storeLogo);
        setFilePath(response.data.userProfile);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };
  const router = useRouter();

  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
  }, [router?.query]);

  const initialValues = {
    twitter: editData?.twitter,
    facebook: editData?.facebook,
    instagram: editData?.instagram,
    taxVatNumber: editData?.taxVatNumber,
    storeTitle: editData?.storeTitle,
    productGallery: editData?.productGallery,
    returnPolicy: editData?.returnPolicy,
    shippingPolicy: editData?.shippingPolicy,
    storeDesc: editData?.storeDesc,
    // metaKeywords: editData?.metaKeywords,
    // metaTital: editData?.metaTital,
    // metaDesc: editData?.metaDesc,
    storeBanner: imagePath,
    storeLogo: logoPath,
    slug: editData?.slug,
    userProfile: filePath,
  };

  const onImageUpload = (e) => {
    let formData = new FormData();
    formData.append("userProfile", e.target.files[0]);
    const userData = JSON.parse(localStorage.getItem("user"));

    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/upload-profile`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userData?.accessToken}`,
      },
      data: formData,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then((res) => {
        setFilePath(res.data.imageUrl);
      })
      .catch((err) => {});
  };
  const handleBack = () => {
    router.back();
  };
  const onBannerUpload = (e) => {
    let formData = new FormData();
    formData.append("sellerImg", e.target.files[0]);
    const userData = JSON.parse(localStorage.getItem("user"));

    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/upload-sellerimg`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userData?.accessToken}`,
      },
      data: formData,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then((res) => {
        setImagePath(res.data.imageUrl);
      })
      .catch((err) => {});
  };

  const onLogoUpload = (e) => {
    let formData = new FormData();
    formData.append("sellerImg", e.target.files[0]);
    const userData = JSON.parse(localStorage.getItem("user"));

    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/upload-sellerimg`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userData?.accessToken}`,
      },
      data: formData,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then((res) => {
        setLogoPath(res.data.imageUrl);
      })
      .catch((err) => {});
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

  const handleSubmit = (id) => {
    router.push(`/seller/my-account/payment-information/${id}`);
  };
  const onClickSubmit = (id) => {
    router.push(`/seller/my-account/seller-details?id=${id}`);
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
        {editData ? (
          <div className="mb-8">
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
                  <div className="p-6 bg-orange-50">
                    <Formik
                      initialValues={initialValues}
                      // validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ values, errors }) => (
                        <Form className="viewOnly">
                          <div className="st-form">
                            <div className="grid gap-4 md:gap-6  md:grid-cols-2 lg:grid-cols-3 mb-9 ">
                              <div className="relative">
                                <div>
                                  {" "}
                                  <label htmlFor="twitter">
                                    Twitter Profile
                                  </label>
                                </div>
                                <div>
                                  <Field
                                    type="text"
                                    name="twitter"
                                    id="twitter"
                                    disabled={isDisabled}
                                    className={` ${
                                      isDisabled ? "cursor-not-allowed " : ""
                                    }`}
                                    placeholder="Enter Twitter Profile URL"
                                  />
                                  <ErrorMessage
                                    name="twitter"
                                    component="p"
                                    className="invalid"
                                  />
                                </div>
                              </div>

                              <div className="relative">
                                <div>
                                  <label htmlFor="facebook">
                                    Facebook Profile
                                  </label>
                                </div>
                                <div>
                                  {" "}
                                  <Field
                                    type="text"
                                    name="facebook"
                                    id="facebook"
                                    disabled={isDisabled}
                                    className={` ${
                                      isDisabled ? "cursor-not-allowed " : ""
                                    }`}
                                    placeholder="Enter Facebook Profile URL"
                                  />
                                  <ErrorMessage
                                    name="facebook"
                                    component="p"
                                    className="invalid"
                                  />
                                </div>
                              </div>

                              <div className="relative">
                                <div>
                                  {" "}
                                  <label htmlFor="instagram">
                                    Instagram Profile
                                  </label>
                                </div>
                                <div>
                                  {" "}
                                  <Field
                                    type="text"
                                    name="instagram"
                                    id="instagram"
                                    disabled={isDisabled}
                                    className={` ${
                                      isDisabled ? "cursor-not-allowed " : ""
                                    }`}
                                    placeholder="Enter Instagram Profile URL"
                                  />
                                  <ErrorMessage
                                    name="instagram"
                                    component="p"
                                    className="invalid"
                                  />
                                </div>
                              </div>

                              <div className="relative">
                                <div>
                                  {" "}
                                  <label htmlFor="taxVatNumber">
                                    Tax/VAT number
                                  </label>
                                </div>
                                <div>
                                  {" "}
                                  <Field
                                    type="text"
                                    name="taxVatNumber"
                                    id="taxVatNumber"
                                    disabled={isDisabled}
                                    className={` ${
                                      isDisabled ? "cursor-not-allowed " : ""
                                    }`}
                                    placeholder="Enter tax or VAT number"
                                  />
                                  <ErrorMessage
                                    name="taxVatNumber"
                                    component="p"
                                    className="invalid"
                                  />
                                </div>
                              </div>

                              <div className="relative">
                                <div>
                                  {" "}
                                  <label htmlFor="productGallery">
                                    Product Gallery URL
                                  </label>
                                </div>
                                <div>
                                  {" "}
                                  <Field
                                    type="text"
                                    name="productGallery"
                                    id="productGallery"
                                    disabled={isDisabled}
                                    className={` ${
                                      isDisabled ? "cursor-not-allowed " : ""
                                    }`}
                                    placeholder="Enter URL"
                                  />
                                  <ErrorMessage
                                    name="productGallery"
                                    component="p"
                                    className="invalid"
                                  />
                                </div>
                              </div>
                              <div className="relative">
                                <div>
                                  {" "}
                                  <label htmlFor="storeTitle">Shop Title</label>
                                </div>
                                <div>
                                  <Field
                                    type="text"
                                    name="storeTitle"
                                    id="storeTitle"
                                    disabled={isDisabled}
                                    className={` ${
                                      isDisabled ? "cursor-not-allowed " : ""
                                    }`}
                                    placeholder="Enter shop title"
                                  />
                                  <ErrorMessage
                                    name="storeTitle"
                                    component="p"
                                    className="invalid"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="relative mt-4 mb-8">
                              <div>
                                {" "}
                                <label htmlFor="storeDesc">
                                  Company Description
                                </label>
                              </div>
                              <div>
                                {" "}
                                <Field
                                  as="textarea"
                                  row="2"
                                  name="storeDesc"
                                  id="storeDesc"
                                  disabled={isDisabled}
                                  className={` ${
                                    isDisabled ? "cursor-not-allowed " : ""
                                  }`}
                                  placeholder="Describe your company"
                                />
                                <ErrorMessage
                                  name="storeDesc"
                                  component="p"
                                  className="invalid"
                                />
                              </div>
                            </div>

                            <div>
                              {/* <div className="relative">
                                <div>
                                  <label htmlFor="slug">Shop URL</label>
                                </div>
                                <div>
                                  {" "}
                                  <Field
                                    type="text"
                                    name="slug"
                                    id="slug"
                                    placeholder="Enter shop URL"
                                    disabled={editData?.slug ? false : true}
                                    readOnly
                                    className={`cursor-not-allowed ${
                                      editData?.slug
                                        ? false
                                        : true
                                        ? "cursor-not-allowed "
                                        : ""
                                    }`}
                                  />
                                  <ErrorMessage
                                    name="slug"
                                    component="p"
                                    className="invalid"
                                  />
                                </div>
                              </div> */}
                            </div>

                            {/* <div className="relative mt-9 mb-9">
                            <div>
                              {" "}
                              <label htmlFor="metaTital">Meta Title </label>
                            </div>
                            <div>
                              {" "}
                              <Field
                                type="text"
                                name="metaTital"
                                id="metaTital"
                                disabled={isDisabled}
                                className={` ${
                                  isDisabled ? "cursor-not-allowed " : ""
                                }`}
                                placeholder="Enter meta title"
                              />
                              <ErrorMessage
                                name="metaTital"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>
                          <div className="relative">
                            <div>
                              {" "}
                              <label htmlFor="metaKeywords">
                                Meta Keywords
                              </label>
                            </div>
                            <div>
                              {" "}
                              <Field
                                type="text"
                                name="metaKeywords"
                                id="metaKeywords"
                                disabled={isDisabled}
                                className={` ${
                                  isDisabled ? "cursor-not-allowed " : ""
                                }`}
                                placeholder="Enter meta keywords"
                              />
                              <ErrorMessage
                                name="metaKeywords"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>
                          <div className="relative mt-9 mb-9">
                            <div>
                              {" "}
                              <label htmlFor="metaDesc">
                                Meta Description{" "}
                              </label>
                            </div>
                            <div>
                              {" "}
                              <Field
                                as="textarea"
                                row="1"
                                name="metaDesc"
                                id="metaDesc"
                                disabled={isDisabled}
                                className={` ${
                                  isDisabled ? "cursor-not-allowed " : ""
                                }`}
                                placeholder="Enter meta description"
                              />
                              <ErrorMessage
                                name="metaDesc"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div> */}

                            {/* <div className="relative mt-9 mb-9">
                            <div>
                              {" "}
                              <label htmlFor="returnPolicy">
                                Return Policy{" "}
                              </label>
                            </div>
                            <div>
                              {" "}
                              <Field
                                as="textarea"
                                readOnly
                                row="1"
                                name="returnPolicy"
                                disabled={isDisabled}
                                className={` ${
                                  isDisabled ? "cursor-not-allowed " : ""
                                }`}
                                placeholder="Enter meta description"
                              />
                              <ErrorMessage
                                name="returnPolicy"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>

                          <div className="relative mt-9 mb-9">
                            <div>
                              {" "}
                              <label htmlFor="shippingPolicy">
                                Shipping Policy{" "}
                              </label>
                            </div>
                            <div>
                              {" "}
                              <Field
                                as="textarea"
                                row="1"
                                name="shippingPolicy"
                                disabled={isDisabled}
                                className={` ${
                                  isDisabled ? "cursor-not-allowed " : ""
                                }`}
                                id="shippingPolicy"
                                placeholder="Enter meta description"
                              />
                              <ErrorMessage
                                name="shippingPolicy"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div> */}
                            <div className="grid gap-6 lg:gap-8 md:grid-cols-3 mb-4 lg:mb-8 viewImage">
                              <div className="relative ">
                                <p className="text-blue-950 mb-3 pointer-events-none">
                                  Profile Image
                                </p>
                                {filePath ? (
                                  <div className="mb-4 flex gap-2">
                                    <div className="relative h-28 w-28 rounded-md overflow-hidden">
                                      <Image
                                        src={filePath}
                                        alt={filePath}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>{" "}
                                  </div>
                                ) : (
                                  <>
                                    <input
                                      type="file"
                                      name="userProfile"
                                      id="userProfile"
                                      className={`block w-full pointer-events-none font-medium text-sm text-slate-600 file:mr-4 file:p-3.5 file:rounded file:border-0 file:text-sm file:bg-orange-100 file:font-medium file:text-blue-950 file:cursor-pointer focus:outline-none !p-0 ${
                                        errors.userProfile &&
                                        touched.userProfile &&
                                        submitCount > 0
                                          ? "border-red-600"
                                          : "border-gray-300"
                                      }`}
                                      onChange={(e) => onImageUpload(e)}
                                    />
                                    {errors.userProfile &&
                                    touched.userProfile &&
                                    submitCount > 0 ? (
                                      <span className="text-xs text-red-600 mt-1">
                                        {errors.userProfile}
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </div>
                              <div>
                                <div>
                                  <p className="text-blue-950 mb-3">
                                    Company Banner
                                  </p>
                                  <div className="relative">
                                    {imagePath ? (
                                      <div className="mb-4 flex gap-2">
                                        <div className="relative h-28 w-28 rounded-md overflow-hidden">
                                          <Image
                                            src={imagePath}
                                            alt={imagePath}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>{" "}
                                      </div>
                                    ) : (
                                      <>
                                        <input
                                          type="file"
                                          name="storeBanner"
                                          id="storeBanner"
                                          className={`block w-full pointer-events-none font-medium text-sm text-slate-600 file:mr-4 file:p-3.5 file:rounded file:border-0 file:text-sm file:bg-orange-100 file:font-medium file:text-blue-950 file:cursor-pointer focus:outline-none !p-0 ${
                                            errors.storeBanner &&
                                            touched.storeBanner &&
                                            submitCount > 0
                                              ? "border-red-600"
                                              : "border-gray-300"
                                          }`}
                                          onChange={(e) => onBannerUpload(e)}
                                        />
                                        {errors.storeBanner &&
                                        touched.storeBanner &&
                                        submitCount > 0 ? (
                                          <span className="text-xs text-red-600 mt-1">
                                            {errors.storeBanner}
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <p className="text-blue-950 mb-3">
                                  Company Logo
                                </p>
                                <div className="relative">
                                  {logoPath ? (
                                    <div className="mb-4 flex gap-2">
                                      <div className="relative h-28 w-28 rounded-md overflow-hidden">
                                        <Image
                                          src={logoPath}
                                          alt={logoPath}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>{" "}
                                    </div>
                                  ) : (
                                    <>
                                      <input
                                        type="file"
                                        name="userProfile"
                                        id="userProfile"
                                        className={`block w-full pointer-events-none font-medium text-sm text-slate-600 file:mr-4 file:p-3.5 file:rounded file:border-0 file:text-sm file:bg-orange-100 file:font-medium file:text-blue-950 file:cursor-pointer focus:outline-none !p-0 ${
                                          errors.userProfile &&
                                          touched.userProfile &&
                                          submitCount > 0
                                            ? "border-red-600"
                                            : "border-gray-300"
                                        }`}
                                        onChange={(e) => onLogoUpload(e)}
                                      />
                                      {errors.userProfile &&
                                      touched.userProfile &&
                                      submitCount > 0 ? (
                                        <span className="text-xs text-red-600 mt-1">
                                          {errors.userProfile}
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                  <div className="flex items-center gap-4  pb-9">
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
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Layout>
    </>
  );
};

export default Seller;
