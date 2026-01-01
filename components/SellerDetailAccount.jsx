import Layout from "@/components/Layout";
import SellerDetail from "@/components/SellerDetail";
import {
  faAngleLeft,
  faCircleInfo,
  faTrashCan,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { object, string } from "yup";

const SellerDetailAccount = ({ onSectionChange }) => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [isEditClickActive, setEditClickActive] = useState(false);
  const [isEditActive, setEditActive] = useState(false);
  const [isSellerClickActive, setSellerClickActive] = useState(true);
  const [isInfoEditActive, setInfoEditActive] = useState(false);
  const [isCommissionEdit, setCommissionEdit] = useState(false);
  const [imagePath, setImagePath] = useState([]);
  const [logoPath, setLogoPath] = useState([]);
  const [filePath, setFilePath] = useState();
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
        //
        setSelectedMenuItem(response.data.status);
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
    storeDesc: editData?.storeDesc,
    // returnPolicy: editData?.returnPolicy,
    slug: editData?.slug,
    // shippingPolicy: editData?.shippingPolicy,
    productGallery: editData?.productGallery,
    // metaKeywords: editData?.metaKeywords,
    // metaTital: editData?.metaTital,
    // metaDesc: editData?.metaDesc,
    storeBanner: imagePath,
    storeLogo: logoPath,
    userProfile: filePath,
  };
  const onImageUpload = (e) => {
    let formData = new FormData();
    formData.append("userProfile", e.target.files[0]);
    const userData = JSON.parse(localStorage.getItem("user"));

    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/upload-profile`,
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

  const handleBack = () => {
    router.back();
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
    // returnPolicy: string().required("Required"),
    // shippingPolicy: string().required("Required"),
  });
  const handleSubmit = (values, { setSubmitting }) => {
    if (editData?._id) {
      setSubmitting(true);
      const options = {
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${editData?._id}`,
        data: {
          twitter: values?.twitter,
          facebook: values?.facebook,
          instagram: values?.instagram,
          taxVatNumber: values?.taxVatNumber,
          storeTitle: values?.storeTitle,
          storeBanner: imagePath,
          storeLogo: logoPath,
          storeDesc: values?.storeDesc,
          // returnPolicy: values?.returnPolicy,
          // shippingPolicy: values?.shippingPolicy,
          productGallery: values?.productGallery,
          // metaKeywords: values?.metaKeywords,
          // metaTital: values?.metaTital,
          // metaDesc: values?.metaDesc,
          slug: editData?.slug,
          userProfile: filePath,
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          //
          onSectionChange("payment-information");
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
          twitter: values?.twitter,
          facebook: values?.facebook,
          instagram: values?.instagram,
          taxVatNumber: values?.taxVatNumber,
          storeTitle: values?.storeTitle,
          storeBanner: imagePath,
          storeLogo: logoPath,
          storeDesc: values?.storeDesc,
          // returnPolicy: values?.returnPolicy,
          // shippingPolicy: values?.shippingPolicy,
          productGallery: values?.productGallery,
          // metaKeywords: values?.metaKeywords,
          // metaTital: values?.metaTital,
          // metaDesc: values?.metaDesc,
          slug: editData?.slug,
          userProfile: filePath,
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          //

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
                    {({ values, errors }) => (
                      <Form>
                        <div className="st-form">
                          <div className="grid gap-4 md:gap-6  md:grid-cols-2 lg:grid-cols-3 mb-9 ">
                            <div className="relative">
                              <div>
                                {" "}
                                <label htmlFor="twitter">Twitter Profile</label>
                              </div>
                              <div>
                                <Field
                                  type="text"
                                  name="twitter"
                                  id="twitter"
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
                            {/* <div className="relative viewOnly">
                                <div>
                                  <label htmlFor="slug">Shop URL</label>
                                </div>
                                <div>
                                  {" "}
                                  <Field
                                    type="text"
                                    name="slug"
                                    id="slug"
                                    readOnly
                                    placeholder="Enter shop URL"
                                    disabled={editData?.slug ? false : true}
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
                              <label htmlFor="metaTital">
                                Meta Title{" "}
                              </label>{" "}
                              <p className=" mb-2 text-blue-950/80 font-medium -mt-1 text-sm">
                                Provide a short title that describes your
                                business within 50 characters.
                              </p>
                            </div>
                            <div>
                              {" "}
                              <Field
                                type="text"
                                name="metaTital"
                                id="metaTital"
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
                            <div className="flex gap-1.5 items-center ">
                              {" "}
                              <div>
                                <label htmlFor="metaKeywords">
                                  Meta Keywords
                                </label>{" "}
                                <p className=" mb-2 text-blue-950/80 font-medium -mt-1 text-sm">
                                  Provide a suitable keyword that is attributed
                                  with your business.
                                </p>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <Field
                                type="text"
                                name="metaKeywords"
                                id="metaKeywords"
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
                              <p className=" mb-2 text-blue-950/80 font-medium -mt-1 text-sm">
                                Provide a short description of your business
                                within 150 characters.
                              </p>
                            </div>
                            <div>
                              {" "}
                              <Field
                                as="textarea"
                                row="1"
                                name="metaDesc"
                                id="metaDesc"
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
                                <span className="text-red-700 ">*</span>
                              </label>
                            </div>
                            <div>
                              {" "}
                              <Field
                                as="textarea"
                                row="1"
                                name="returnPolicy"
                                id="returnPolicy"
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
                                <span className="text-red-700 ">*</span>
                              </label>
                            </div>
                            <div>
                              {" "}
                              <Field
                                as="textarea"
                                row="1"
                                name="shippingPolicy"
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
                          <div className="grid gap-4 md:gap-6 md:grid-cols-3 mb-6 lg:mb-12">
                            <div className="relative ">
                              <p className="text-blue-950 mb-3">
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
                                  <span>
                                    <button
                                      type="button"
                                      className="bg-red-100 hover:bg-red-200 h-9 w-9 rounded-full"
                                      onClick={() => setFilePath("")}
                                    >
                                      <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <input
                                    type="file"
                                    name="userProfile"
                                    id="userProfile"
                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                    className={`block w-full font-medium text-sm text-slate-600 file:mr-4 file:p-3.5 file:rounded file:border-0 file:text-sm file:bg-orange-100 file:font-medium file:text-blue-950 file:cursor-pointer focus:outline-none !p-0 ${
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
                              <p className="text-slate-600 font-medium text-sm mt-4">
                                Allowed filed type: jpg, jpeg, png, gif
                              </p>
                            </div>
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
                                    <span>
                                      <button
                                        type="button"
                                        className="bg-red-100 hover:bg-red-200 h-9 w-9 rounded-full"
                                        onClick={() => setImagePath("")}
                                      >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                      </button>
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <input
                                      type="file"
                                      name="storeBanner"
                                      id="storeBanner"
                                      accept="image/png, image/gif, image/jpeg, image/jpg"
                                      className={`block w-full font-medium text-sm text-slate-600 file:mr-4 file:p-3.5 file:rounded file:border-0 file:text-sm file:bg-orange-100 file:font-medium file:text-blue-950 file:cursor-pointer focus:outline-none !p-0 ${
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

                              <p className="text-slate-600 font-medium text-sm mt-4">
                                Allowed filed type: jpg, jpeg, png, gif
                              </p>
                            </div>

                            <div>
                              <p className="text-blue-950 mb-3">Company Logo</p>
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
                                    <span>
                                      <button
                                        type="button"
                                        className="bg-red-100 hover:bg-red-200 h-9 w-9 rounded-full"
                                        onClick={() => setLogoPath("")}
                                      >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                      </button>
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <input
                                      type="file"
                                      name="userProfile"
                                      id="userProfile"
                                      accept="image/png, image/gif, image/jpeg, image/jpg"
                                      className={`block w-full font-medium text-sm text-slate-600 file:mr-4 file:p-3.5 file:rounded file:border-0 file:text-sm file:bg-orange-100 file:font-medium file:text-blue-950 file:cursor-pointer focus:outline-none !p-0 ${
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
                              <p className="text-slate-600 font-medium text-sm mt-4">
                                Allowed filed type: jpg, jpeg, png, gif
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
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
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerDetailAccount;
