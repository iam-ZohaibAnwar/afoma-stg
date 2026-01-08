import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const GenerateAiHarmonizedCode = dynamic(() => import("@/components/GenerateAiHarmonizedCode"), { ssr: false });
const GenerateMetaTags = dynamic(() => import("@/components/GenerateMetaTags"), { ssr: false });
import { faCircleVideo, faImage } from "@fortawesome/pro-light-svg-icons";
import { faAngleLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Select from "react-select";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Index = () => {
  const [imagePath, setImagePath] = useState([]);
  const [videoPath, setVideoPath] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedProductCategory, setSelectedProductCategory] = useState("");
  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [childcategory, setChildCategory] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [persons, setPersons] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [priceInSelectedCurrency, setPriceInSelectedCurrency] = useState("");
  const [currencyRate, setCurrencyRate] = useState("");
  const [selectedParentCategoryId, setSelectedParentCategoryId] =
    useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);

  const router = useRouter();
  const [isCustomShipping, setIsCustomShipping] = useState(false);

  const fetchCurrencyRate = async () => {
    try {
      editData?.currency ? setSelectedCurrency(editData?.currency) : "";
      const { data } = await axios.get(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json`
      );

      const currencyOptions = Object.keys(data).map((key) => ({
        value: key,
        label: `${key.toUpperCase()} - ${data[key]}`,
      }));
      setCurrencies(currencyOptions);
    } catch (error) {
      console.error("Error fetching currency rate:", error);
      return null;
    }
  };
  // Handle price change in selected currency
  const handlePriceChange = async (currency) => {
    const { data } = await axios.get(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency?.toLowerCase()}.json`
    );

    if (currency && data[currency?.toLowerCase()]["cad"]) {
      setCurrencyRate(data[currency?.toLowerCase()]["cad"] || 1);
      return true;
    }

    return "";
  };

  const getData = (id) => {
    setLoading(true);
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        setSelectedCurrency(response.data?.currency);
        setPriceInSelectedCurrency(response.data?.currencyPrice);
        setCurrencyRate(response.data?.currencyRate);
        setEditData(response.data);
        if(response.data?.freeDelivery || response.data?.handlingFee) setIsCustomShipping(true)
        setImagePath(response.data.images);
        setVideoPath(response.data.videos);
        setSelectedProductCategory(response.data.Category);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCurrencyRate();
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
  }, [router?.query]);

  const initialValues = {
    productName: editData?.productName,
    productCategory: selectedProductCategory,
    sku: editData?.sku,
    // shortDesc: editData?.shortDesc,
    description: editData?.description,
    commodityCode: editData?.commodityCode,
    urlKey: editData?.slug,
    weight: editData?.weight,
    height: editData?.height,
    length: editData?.length,
    discountCode: editData?.discountCode || undefined,
    agree: editData?.discountCode ? true : false,
    dispatchDays: editData?.dispatchDays,
    width: editData?.width,
    metaTitle: editData?.metaTitle,
    metaKeywords: editData?.metaKeywords,
    metaDesc: editData?.metaDesc,
    Category: editData?.Category,
    SubCategory: editData?.SubCategory,
    childCategory: editData?.childCategory,
    images: imagePath.map((path) => {
      return {
        ...path,
        altText: path && path.altText ? path.altText : "",
      };
    }),
    videos: videoPath,
    freeDelivery: editData?.freeDelivery,
    handlingFee: editData?.currency && editData?.currency != "cad" ? (parseFloat(editData?.handlingFee / (currencyRate || 1)))?.toFixed(2) : editData?.handlingFee,
    additionalCost: editData?.currency && editData?.currency != "cad" ? (parseFloat(editData?.additionalCost / (currencyRate || 1)))?.toFixed(2) : editData?.additionalCost,
    currency: editData?.currency || "",
    currencyPrice: editData?.currencyPrice || "",
    currencyRate: editData?.currencyRate || 1,
  };
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const headers = {
      Authorization: `Bearer ${userData?.accessToken}`,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sellers`, { headers })
      .then((res) => {
        setPersons(res.data);
      });

    // Fetch parent categories
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`, { headers })
      .then((res) => {
        setCategory(res.data);
      });

    // Fetch subcategories based on selected parent category
    if (selectedParentCategoryId) {
      axios
        .create({
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        })
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/sub-categories/search/parent/${selectedParentCategoryId}`,
          { headers }
        )
        .then((res) => {
          setSubCategory(res.data);
        });
    }

    // Fetch child categories based on selected subcategory
    if (selectedSubCategoryId) {
      axios
        .create({
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        })
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/child-category/search/parent/${selectedSubCategoryId}`,
          { headers }
        )
        .then((res) => {
          setChildCategory(res.data);
        });
    }
  }, [selectedParentCategoryId, selectedSubCategoryId]);

  const categoryNameList = category.map((type) => ({
    value: type._id,
    label: type.name,
  }));

  const subCategoryNameList = subcategory.map((type) => ({
    value: type._id,
    label: type.name,
  }));

  const childCategoryNameList = childcategory.map((type) => ({
    value: type._id,
    label: type.name,
  }));

  const handleBack = () => {
    router.back();
  };

  const formatAdminValue = (key, value) => {
    if (value === null || value === "") return "-";
    if (key === "image") {
      return (
        <>
          <img
            src={value}
            className="rounded-md w-[50px] h-[50px]"
            alt={value}
          />
        </>
      );
    } else {
      return key === "price" ? `CA$${parseFloat(value).toFixed(2)}` : value;
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
        <>
          <section>
            <div className="pb-36 max-w-screen-2xl mx-auto viewOnly">
              <h2
                className={`text-2xl text-blue-950 xl:tracking-[-0.48px] mb-7 noto-font`}
              >
                Customization
              </h2>
              {!loading ? (
                <>
                  <div>
                    <Formik initialValues={initialValues}>
                      {({ values, isSubmitting }) => (
                        <Form className="st-form">
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full">
                            <div className="relative">
                              <label htmlFor="productName">Product Name</label>
                              <Field
                                type="text"
                                name="productName"
                                id="productName"
                                className="pointer-events-none"
                                readOnly
                                placeholder="Enter name of the product"
                              />
                              <ErrorMessage
                                name="productName"
                                component="p"
                                className="invalid"
                              />
                            </div>
                            <div className="relative viewform pointer-events-none">
                              {" "}
                              <label htmlFor="Category">
                                Parent Category
                              </label>{" "}
                              <Select
                                name="Category"
                                id="Category"
                                options={categoryNameList}
                                onChange={(selectedOption) => {
                                  handleChange("Category")(
                                    selectedOption?.value
                                  );
                                  setSelectedParentCategoryId(
                                    selectedOption?.value
                                  );
                                }}
                                defaultValue={() => {
                                  if (
                                    editData?.Category &&
                                    editData?.Category != ""
                                  )
                                    return {
                                      value: editData?.Category?._id,
                                      label: editData?.Category?.name,
                                    };
                                  else return "";
                                }}
                                placeholder="Select parent category"
                                className="st-react-select"
                                classNamePrefix="react-select"
                              />{" "}
                              <ErrorMessage
                                name="Category"
                                component="p"
                                className="invalid"
                              />
                            </div>
                            <div className="relative viewform pointer-events-none">
                              {" "}
                              <label htmlFor="SubCategory">
                                Sub Category
                              </label>{" "}
                              <Select
                                name="SubCategory"
                                id="SubCategory"
                                options={subCategoryNameList}
                                onChange={(selectedOption) => {
                                  handleChange("SubCategory")(
                                    selectedOption?.value
                                  );
                                  setSelectedSubCategoryId(
                                    selectedOption?.value
                                  );
                                }}
                                defaultValue={() => {
                                  if (
                                    editData?.SubCategory &&
                                    editData?.SubCategory != ""
                                  )
                                    return {
                                      value: editData?.SubCategory?._id,
                                      label: editData?.SubCategory?.name,
                                    };
                                  else return "";
                                }}
                                placeholder="Select sub category"
                                className="st-react-select"
                                classNamePrefix="react-select"
                              />{" "}
                              <ErrorMessage
                                name="subCategory"
                                component="p"
                                className="invalid"
                              />
                            </div>

                            <div className="relative viewform pointer-events-none">
                              {" "}
                              <label htmlFor="childCategory">
                                Child Category
                              </label>{" "}
                              <Select
                                name="childCategory"
                                id="childCategory"
                                options={childCategoryNameList}
                                onChange={(selectedOption) => {
                                  handleChange("childCategory")(
                                    selectedOption?.value
                                  );
                                }}
                                defaultValue={() => {
                                  if (
                                    editData?.childCategory &&
                                    editData?.childCategory != ""
                                  )
                                    return {
                                      value: editData?.childCategory?._id,
                                      label: editData?.childCategory?.name,
                                    };
                                  else return "";
                                }}
                                placeholder="Select child category"
                                className="st-react-select"
                                classNamePrefix="react-select"
                              />{" "}
                              <ErrorMessage
                                name="childCategory"
                                component="p"
                                className="invalid"
                              />
                            </div>
                            <div className="relative">
                              <label htmlFor="sku">SKU</label>
                              <Field
                                type="text"
                                name="sku"
                                id="sku"
                                className="pointer-events-none"
                                readOnly
                                placeholder="This will be pre-populated"
                                disabled={editData?.sku ? false : true}
                              />
                              <ErrorMessage
                                name="sku"
                                component="p"
                                className="invalid"
                              />
                            </div>

                            <div className="relative md:col-span-2 lg:col-span-3">
                              <label htmlFor="description">
                                Product Description
                              </label>
                              <Field
                                as="textarea"
                                rows="5"
                                name="description"
                                id="description"
                                readOnly
                                placeholder="Describe your product in detail"
                              />
                              <ErrorMessage
                                name="description"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full mt-4">
                            <div className="relative col-span-4">
                              {/* <GenerateMetaTags
                                values={values}
                                setMeta={(res) => {
                                  if (res) {
                                    if (res.meta_title) {
                                      setFieldValue(
                                        "metaTitle",
                                        res.meta_title
                                      );
                                    }
                                    if (res.meta_description) {
                                      setFieldValue(
                                        "metaDesc",
                                        res.meta_description
                                      );
                                    }
                                    if (res.meta_keywords) {
                                      setFieldValue(
                                        "metaKeywords",
                                        res.meta_keywords
                                      );
                                    }
                                  }
                                }}
                              /> */}
                            </div>
                            <div className="relative col-span-4 md:col-span-2">
                              <div>
                                <label htmlFor="metaTitle">Meta Title</label>
                                <p className=" mb-2 text-blue-950/80 font-medium -mt-1 text-sm">
                                  Provide a short title of product within 50
                                  characters.
                                </p>
                              </div>
                              <Field
                                type="text"
                                name="metaTitle"
                                id="metaTitle"
                                placeholder="Enter meta title"
                                disabled
                              />
                            </div>
                            <div className="relative col-span-4 md:col-span-2">
                              <div>
                                <label htmlFor="metaKeywords">
                                  Meta Keyword
                                </label>
                                <p className=" mb-2 text-blue-950/80 font-medium -mt-1 text-sm">
                                  Provide a suitable keyword that is attributed
                                  with the product.
                                </p>
                              </div>
                              <Field
                                type="text"
                                name="metaKeywords"
                                id="metaKeywords"
                                placeholder="Enter meta keyword"
                                disabled
                              />
                            </div>
                            <div className="relative col-span-4 md:col-span-4">
                              <div className="relative">
                                <div>
                                  <label htmlFor="metaDesc">
                                    Meta Description
                                  </label>
                                  <p className=" mb-2 text-blue-950/80 font-medium -mt-1 text-sm">
                                    Provide a short description of the product
                                    within 150 characters.
                                  </p>
                                </div>
                                <Field
                                  as="textarea"
                                  name="metaDesc"
                                  id="metaDesc"
                                  rows="5"
                                  placeholder="Enter meta description"
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                          <div className="relative col-span-1 md:col-span-2 lg:col-span-3 pointer-events-none">
                            <label htmlFor="currency">
                              Currency <span className="text-red-700">*</span>
                            </label>
                            <Select
                              name="currency"
                              id="currency"
                              options={currencies}
                              placeholder="Select Currency"
                              className="st-react-select"
                              classNamePrefix="react-select"
                              onChange={(selectedOption) => {
                                setSelectedCurrency(selectedOption?.value);
                                handleChange("currency")(selectedOption?.value);
                                handlePriceChange(selectedOption?.value);
                              }}
                              defaultValue={
                                editData?.currency &&
                                currencies.some(
                                  (curr) => curr.value === editData.currency
                                )
                                  ? {
                                      value: editData.currency,
                                      label: `${
                                        currencies.find(
                                          (curr) =>
                                            curr.value === editData.currency
                                        )?.label
                                      }`,
                                    }
                                  : {
                                      value: "cad", // Default to CAD
                                      label: "CAD - Canadian Dollar", // Ensure this label matches the format of your options
                                    }
                              }
                            />
                            <ErrorMessage
                              name="currency"
                              component="p"
                              className="invalid text-red-600"
                            />
                          </div>

                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full mt-4">
                            <div className="relative md:col-span-2 lg:col-span-3">
                              <label htmlFor="discount">Discount (%)</label>
                              <Field
                                type="text"
                                name="discountCode"
                                id="discountCode"
                                readOnly
                              />
                            </div>
                            <div className="relative col-span-1 md:col-span-2 lg:col-span-3 pointer-events-none">
                              <div>
                                <label htmlFor="dispatchDays">
                                  Dispatch time (Days)
                                  <span className="text-red-700 ">*</span>
                                </label>
                                <p className=" mb-2 text-blue-950/80 font-medium -mt-1 text-sm">
                                  The duration for making your craft and
                                  dropping off with shipping company
                                </p>
                              </div>
                              <Field
                                type="text"
                                name="dispatchDays"
                                id="dispatchDays"
                                readOnly
                                className="pointer-events-none"
                                placeholder="Enter dispatch time"
                              />
                            </div>
                            <div className="relative col-span-1 md:col-span-2 lg:col-span-3">
                              <div>
                                <label htmlFor="commodityCode">
                                  Harmonized Systems Code{" "}
                                  <span className="text-gray-500 text-sm font-medium hover:text-orange-500">
                                    <a
                                      href="https://www.tariffnumber.com/"
                                      target="_blank"
                                    >
                                      (Link to HS Portal)
                                    </a>
                                  </span>
                                  <span className="pl-2">
                                    <GenerateAiHarmonizedCode
                                      productTitle={values.productName}
                                      productDesc={values.description}
                                      setHarmonizedCode={(res) => {
                                        setFieldValue("commodityCode", res);
                                      }}
                                    />
                                  </span>
                                </label>
                                <p className=" mb-2 text-blue-950/80 font-medium -mt-1 text-sm">
                                  A code used to classify products for
                                  international trade. It helps with customs and
                                  tariffs (applicable for international shipping
                                  only)
                                </p>
                              </div>
                              <Field
                                type="text"
                                name="commodityCode"
                                id="commodityCode"
                                className="pointer-events-none"
                                readOnly
                                placeholder="Enter commodity code"
                              />
                              <ErrorMessage
                                name="commodityCode"
                                component="p"
                                className="invalid"
                              />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                              <h3
                                className={`text-2xl xl:tracking-[-0.48px] noto-font`}
                              >
                                Package Specifications
                              </h3>
                            </div>

                            <div className="relative">
                              <label htmlFor="weight">
                                Package Weight (kg)
                              </label>
                              <Field
                                type="text"
                                name="weight"
                                id="weight"
                                className="pointer-events-none"
                                readOnly
                                placeholder="Enter weight of package"
                              />
                            </div>

                            <div className="relative">
                              <label htmlFor="height">
                                Package Height (cm)
                              </label>
                              <Field
                                type="text"
                                name="height"
                                id="height"
                                className="pointer-events-none"
                                readOnly
                                placeholder="Enter height of package"
                              />
                            </div>
                            <div className="relative">
                              <label htmlFor="length">
                                Package Length (cm)
                              </label>
                              <Field
                                type="text"
                                name="length"
                                id="length"
                                className="pointer-events-none"
                                readOnly
                                placeholder="Enter length of package"
                              />
                            </div>
                            <div className="relative">
                              <label htmlFor="width">Package Width (cm)</label>
                              <Field
                                type="text"
                                name="width"
                                id="width"
                                className="pointer-events-none"
                                placeholder="Enter width of package"
                              />
                            </div>
                            <div className="relative md:col-span-2 lg:col-span-3">
                              <label htmlFor="urlKey">Product URL</label>
                              <Field
                                type="text"
                                name="urlKey"
                                id="urlKey"
                                className="pointer-events-none"
                                readOnly
                                placeholder="This will be pre-populated"
                                disabled={editData?.slug ? false : true}
                                value={
                                  editData?.slug
                              ? `${process.env.NEXT_PUBLIC_URL}/category/${editData.Category.slug}/${editData.SubCategory.slug}${editData.childCategory ? "/" + editData.childCategory.slug : ""}/${editData.slug}`
                                    : ""
                                }
                              />
                              <ErrorMessage
                                name="urlKey"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>

                          {/* Add a horizontal border */}
                          <div>
                            {/* Section Header */}
                            <div className="flex items-center mt-6 mb-4">
                              <div className="flex-grow border-t border-gray-400"></div>
                              <h2 className={`text-2xl xl:tracking-[-0.48px] noto-font`}>
                                Customize Shipping Config
                              </h2>
                              <div className="flex-grow border-t border-gray-400"></div>
                            </div>

                            {/* Customize Shipping Checkbox */}
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="customShipping"
                                checked={isCustomShipping}
                                onChange={() => setIsCustomShipping(!isCustomShipping)}
                                className="borderslate600"
                                disabled={true}
                              />
                              <span className="text-sm text-slate-600 ml-2">
                                Customize Shipping Config
                              </span>
                            </div>

                            {isCustomShipping && (
                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full mt-4">
                                {/* Free Shipping */}
                                <div className="relative col-span-3 md:col-span-2 lg:col-span-1">
                                  <h3 className={`text-blue-950 text-lg md:text-2xl xl:tracking-[-0.48px] mb-3 mt-5 noto-font`}>
                                    Free Shipping <small className="text-sm"></small>
                                  </h3>
                                  <p className="text-blue-950 text-sm">
                                    Want to offer buyers a free shipping option?
                                  </p>
                                  <div className="mt-2">
                                    <label htmlFor="freeDelivery" className="typecheck">
                                      <Field
                                        type="checkbox"
                                        className="borderslate600"
                                        name="freeDelivery"
                                        id="freeDelivery"
                                      />
                                      <span className="text-sm text-slate-600 ml-2">
                                        Free domestic shipping
                                      </span>
                                    </label>
                                  </div>
                                </div>

                              {/* Handling Fee */}
                              <div className="relative col-span-3 md:col-span-2 lg:col-span-1">
                                <h3 className={`text-blue-950 text-lg md:text-2xl xl:tracking-[-0.48px] mb-3 mt-5 flex items-center gap-1 noto-font`}>
                                  Flat Rate
                                </h3>

                                <div className="flex items-center gap-1 text-blue-950 text-sm">
                                  <span>Flat Rate Description</span>
                                  
                                  <div className="relative group cursor-pointer">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 text-blue-600"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-3a1 1 0 100-2 1 1 0 000 2zm1 6V9a1 1 0 10-2 0v4a1 1 0 002 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>

                                    <div className="absolute z-10 hidden group-hover:block bg-white text-blue-950 text-xs rounded shadow-md p-2 w-64 top-full mt-2 left-1/2 -translate-x-1/2">
                                      This will be added to the product price if free shipping is enabled. Otherwise, this rate will be shown to the buyer on checkout.
                                    </div>
                                  </div>
                                </div>


                                <div className="mt-2">
                                  <Field
                                    type="number"
                                    name="handlingFee"
                                    id="handlingFee"
                                    placeholder="Enter Rate in Selected Currency"
                                    className="border p-2 w-full rounded"
                                  />
                                </div>
                              </div>


                              <div className="relative col-span-3 md:col-span-2 lg:col-span-1">
                                <h3 className={`text-blue-950 text-lg md:text-2xl xl:tracking-[-0.48px] mb-3 mt-5 noto-font`}>
                                  Additional Amount <small className="text-sm"></small>
                                </h3>
                                <p className="text-blue-950 text-sm">
                                  For each additional item <br />
                                </p>
                                <div className="mt-2">
                                  <Field
                                    type="number"
                                    name="additionalCost"
                                    id="additionalCost"
                                    placeholder="Enter Cost in Selected Currency"
                                    className="border p-2 w-full rounded"
                                    readOnly
                                  />
                                </div>
                              </div>
                              </div>
                            )}
                          </div>
                          {/* Add a horizontal border */}
                          <div className="flex items-center mb-4 mt-8">
                            <div className="flex-grow border-t border-gray-400"></div>
                            <div className="flex-grow border-t border-gray-400"></div>
                          </div>

                          <div className="items-center mt-4">
                            <h3
                              className={`text-blue-950 text-2xl xl:tracking-[-0.48px] noto-font`}
                            >
                              Upload Files
                            </h3>
                          </div>

                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 w-full mt-4">
                            <div className="relative col-span-3 md:col-span-1">
                              <p className="text-blue-950 mb-3">
                                Product Image
                              </p>
                              <div>
                                <p className="text-blue-950 mb-3">
                                  Uploaded Files
                                </p>
                                <div className="divide-y-[1px] divide-gray-500">
                                  {imagePath.length > 0 ? (
                                    imagePath.length &&
                                    imagePath.map((data, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between py-3"
                                      >
                                        <div className="flex items-center gap-4 relative">
                                          <FontAwesomeIcon
                                            icon={faImage}
                                            className="text-3xl text-gray-500"
                                          />
                                          {data?.fileName}
                                          <a
                                            href={data?.imageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <span className="absolute top-0 right-0 h-full w-full"></span>
                                          </a>
                                        </div>
                                        {/* <button
                                    type="button"
                                    onClick={() =>
                                      setImagePath(
                                        imagePath.filter((obj) => obj !== data)
                                      )
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faXmark}
                                      className="text-gray-500"
                                    />
                                  </button> */}
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-slate-600 text-sm mb-5">
                                      No files
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="relative col-span-3 md:col-span-1">
                              <p className="text-blue-950 mb-3">
                                Product Video
                              </p>
                              <div>
                                <p className="text-blue-950 mb-3">
                                  Uploaded Files
                                </p>
                                <div className="divide-y-[1px] divide-gray-500">
                                  {videoPath.length > 0 ? (
                                    videoPath.length &&
                                    videoPath.map((data, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between py-3"
                                      >
                                        <div className="flex items-center gap-4 relative">
                                          <FontAwesomeIcon
                                            icon={faCircleVideo}
                                            className="text-3xl text-gray-500"
                                          />
                                          {data?.fileName}
                                          <a
                                            href={data?.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <span className="absolute top-0 right-0 h-full w-full"></span>
                                          </a>
                                        </div>
                                        {/* <button
                                    type="button"
                                    onClick={() =>
                                      setVideoPath(
                                        videoPath.filter((obj) => obj !== data)
                                      )
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faXmark}
                                      className="text-gray-500"
                                    />
                                  </button> */}
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-slate-600 text-sm mb-5">
                                      No files
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                  {editData?.variations && editData.variations.length > 0 && (
                    <div>
                      <h3
                        className={`text-blue-950 text-2xl xl:tracking-[-0.48px] mt-4 noto-font`}
                      >
                        Variation Details
                      </h3>
                      <div className="w-full overflow-auto bg-white rounded-md shadow shadow-slate-300 mt-6 mb-10">
                        <table className="text-sm w-full table-fixed border-separate border-spacing-0 bg-orange-50">
                          <tbody className="st-form">
                            {editData.variations.map((admin, index) => (
                              <React.Fragment key={index}>
                                {/* Assuming 'keyadmin' is the first object in the 'admin' array */}
                                {index === 0 && (
                                  <tr className="text-left text-sm font-medium text-orange-50 bg-blue-950">
                                    {Object.keys(admin)
                                    .filter((key) => key !== "finalPrice" && key !== "totalPrice")
                                    .map((key) => (
                                      <td
                                        key={key}
                                        className="text-orange-50 w-[100px] h-14 pl-4"
                                      >
                                        {key}
                                      </td>
                                    ))}
                                  </tr>
                                )}
                                <tr>
                                  {Object.keys(admin)
                                  .filter((key) => key !== "finalPrice" && key !== "totalPrice")
                                  .map((key, valueIndex) => (
                                    <td
                                      key={valueIndex}
                                      className="text-blue-950 pl-4 py-4"
                                    >
                                      {formatAdminValue(key, admin[key])}
                                    </td>
                                  ))}
                                </tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="md:col-span-2 lg:col-span-3">
                        {" "}
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
                  )}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </section>
        </>
      </Layout>
    </>
  );
};

export default Index;
