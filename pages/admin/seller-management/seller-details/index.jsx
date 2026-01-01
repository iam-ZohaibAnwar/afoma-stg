import AdminSellerDetail from "@/components/AdminSellerDetail";
import Layout from "@/components/Layout";
import { faAngleLeft, faTrashCan } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { object, string } from "yup";

const Seller = () => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [isEditClickActive, setEditClickActive] = useState(false);
  const [isEditActive, setEditActive] = useState(false);
  const [isSellerClickActive, setSellerClickActive] = useState(true);
  const [isInfoEditActive, setInfoEditActive] = useState(false);
  const [isCommissionEdit, setCommissionEdit] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Pending");
  const [imagePath, setImagePath] = useState([]);
  const [logoPath, setLogoPath] = useState([]);
  const [filePath, setFilePath] = useState();
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
    slug: editData?.slug,
    taxVatNumber: editData?.taxVatNumber,
    storeTitle: editData?.storeTitle,
    productGallery: editData?.productGallery,
    status: selectedMenuItem,
    // returnPolicy: editData?.returnPolicy,
    // shippingPolicy: editData?.shippingPolicy,
    storeDesc: editData?.storeDesc,
    storeBanner: imagePath,
    // metaKeywords: editData?.metaKeywords,
    // metaDesc: editData?.metaDesc,
    // metaTital: editData?.metaTital,
    storeLogo: logoPath,
    userProfile: filePath,
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
        toast.success("Status Updated");
      })
      .catch(function (error) {
        console.error(error);
        toast.error("Something Went Wrong");
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
  // const validationSchema = object({
  //   returnPolicy: string().required("Required"),
  //   shippingPolicy: string().required("Required"),

  // });
  const validationSchema = object({
    twitter: string().matches(
      /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,15}\/?(?:\?.*)?$/,
      "Please enter a valid Twitter/X URL"
    ),
    facebook: string().matches(
      /^(https?:\/\/)?(www\.)?facebook\.com\/(profile\.php\?id=\d+|[a-zA-Z0-9.]{1,})\/?$/,
      "Please enter a valid Facebook URL"
    ),
    instagram: string().matches(
      /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]{1,30}\/?(\?.*)?$/,
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

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
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
          status: selectedMenuItem,
          // returnPolicy: values?.returnPolicy,
          // shippingPolicy: values?.shippingPolicy,
          productGallery: values?.productGallery,
          // metaKeywords: values?.metaKeywords,
          // metaDesc: values?.metaDesc,
          // metaTital: values?.metaTital,
          storeBanner: imagePath,
          storeLogo: logoPath,
          userProfile: filePath,
          storeDesc: values?.storeDesc,
          slug: editData?.slug,
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          router.push(
            `/admin/seller-management/payment-information?id=${response.data._id}`
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
          twitter: values?.twitter,
          facebook: values?.facebook,
          instagram: values?.instagram,
          taxVatNumber: values?.taxVatNumber,
          storeTitle: values?.storeTitle,
          status: selectedMenuItem,
          // returnPolicy: values?.returnPolicy,
          // shippingPolicy: values?.shippingPolicy,
          productGallery: values?.productGallery,
          storeDesc: values?.shortDesc,
          // metaKeywords: values?.metaKeywords,
          // metaDesc: values?.metaDesc,
          // metaTital: values?.metaTital,
          storeBanner: imagePath,
          storeLogo: logoPath,
          userProfile: filePath,
          slug: editData?.slug,
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
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
      <Layout userType="admin">
        <div className="w-full overflow-auto  bg-orange-50 rounded  my-8">
          {editData ? (
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
              <div>
                <AdminSellerDetail />
              </div>
              <div className="border-[#D8D8D8] border mt-8 rounded">
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
                      isEditActive ? "border-b border-primary text-primary" : ""
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
                <div className="md:p-6 p-4 bg-orange-50">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, errors }) => (
                      <Form>
                        <div className="st-form">
                          <div className="grid md:gap-6 gap-4 md:grid-cols-3 mb-9 ">
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
                              <div>
                                <label htmlFor="storeDesc">
                                  Company Description
                                </label>
                                <p className=" text-sm">
                                  Maximum 1000 characters allowed.
                                </p>
                              </div>
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
                                  className="pointer-events-none"
                                  placeholder="Enter shop URL"
                                  readOnly
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
                            <label htmlFor="metaTital">Meta Title </label>
                            <p className=" mb-2 text-blue-950/80 font-medium -mt-1 text-sm">
                              Provide a short title that describes your business
                              within 50 characters.
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
                          <div>
                            {" "}
                            <label htmlFor="metaKeywords">Meta Keywords</label>
                            <p className=" mb-2 text-blue-950/80 font-medium -mt-1 text-sm">
                              Provide a suitable keyword that is attributed with
                              your business.
                            </p>
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
                            <label htmlFor="metaDesc">Meta Description </label>
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
                              <p className="text-blue-950 mb-1">
                                Profile Image
                              </p>
                              <p className="text-primary text-sm mb-3">
                                Recommended (120px * 120px)
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
                              <p className="text-blue-950 mb-1">
                                Company Banner
                              </p>
                              <p className="text-primary text-sm mb-3">
                                Recommended (1250px * 380px)
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
                                      onChange={(e) => onBannerUpload(e)}
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

                            <div>
                              <p className="text-blue-950 mb-1">Company Logo</p>
                              <p className="text-primary text-sm mb-3">
                                Recommended (230px * 230px)
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
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Seller;
