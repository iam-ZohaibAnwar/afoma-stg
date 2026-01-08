import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const GenerateMetaTags = dynamic(() => import("@/components/GenerateMetaTags"), { ssr: false });
import { inventoryList } from "@/lib/select-option";
import { faImage } from "@fortawesome/pro-light-svg-icons";
import { faAngleLeft, faCircleVideo } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Select from "react-select";

//const noto = Noto_Serif({ subsets: ["latin"] });
const Index = () => {
  const [imagePath, setImagePath] = useState([]);
  const [videoPath, setVideoPath] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [selectedProductCategory, setSelectedProductCategory] = useState("");
  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [childcategory, setChildCategory] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [persons, setPersons] = useState([]);

  const [selectedParentCategoryId, setSelectedParentCategoryId] =
    useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [priceInSelectedCurrency, setPriceInSelectedCurrency] = useState("");
  const [currencyRate, setCurrencyRate] = useState("");

  
  const fetchCurrencyRate = async () => {
    try {
       editData?.currency ? setSelectedCurrency(editData?.currency)  : ""
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
  }
    // Handle price change in selected currency
    const handlePriceChange = async (e) => {
      if(e.target.value){
        const { data } = await axios.get(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${selectedCurrency?.toLowerCase()}.json`
        );
        const price = e.target.value;
        setPriceInSelectedCurrency(parseFloat(price));
    
        if (selectedCurrency && data[selectedCurrency?.toLowerCase()]["cad"]) {
          const cadPrice = parseFloat(price) * data[selectedCurrency?.toLowerCase()]["cad"];
          return parseFloat(cadPrice).toFixed(2)
        }
      }
      return ""
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
        setSelectedCurrency(response.data?.currency)
        setPriceInSelectedCurrency(response.data?.currencyPrice);
        setCurrencyRate(response.data?.currencyRate);
        setEditData(response.data);
        setImagePath(response.data.images);
        setVideoPath(response.data.videos);
        setSelectedProductCategory(response.data.Category);
        setFilePath(response.data.productFile);
        setSelectedProductCategory(response.data.Category);
        setSelectedInventory(response.data.inventory);
        const imgObj = {
          featuredProduct: response.data.downloadableLink?.featuredProduct,
          featuredProductUrl:
            response.data.downloadableLink?.featuredProductUrl,
        };
        setFilePath(imgObj);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };
  const handleBack = () => {
    router.back();
  };
  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
  }, [router?.query]);

  useEffect(() => {
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`)
      .then((res) => {
        setCategory(res.data);
      });
  }, []);
  useEffect(() => {
    fetchCurrencyRate()
    const fetchData = async () => {
      try {
        // Fetch user data from local storage
        const userData = JSON.parse(localStorage.getItem("user"));

        // Fetch sellers with authorization headers
        const sellersResponse = await axios
          .create({
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
            },
          })
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sellers`, {
            headers: {
              Authorization: `Bearer ${userData?.accessToken}`,
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
            },
          });
        setPersons(sellersResponse.data);

        // Fetch parent categories with authorization headers
        const categoriesResponse = await axios
          .create({
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
            },
          })
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`, {
            headers: {
              Authorization: `Bearer ${userData?.accessToken}`,
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
            },
          });
        setCategory(categoriesResponse.data);

        // Fetch subcategories based on selected parent category with authorization headers
        if (selectedParentCategoryId) {
          const subCategoriesResponse = await axios
            .create({
              headers: {
                "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
              },
            })
            .get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/sub-categories/search/parent/${selectedParentCategoryId}`,
              {
                headers: {
                  Authorization: `Bearer ${userData?.accessToken}`,
                  "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
                },
              }
            );
          setSubCategory(subCategoriesResponse.data);
        }

        // Fetch child categories based on selected subcategory with authorization headers
        if (selectedSubCategoryId) {
          const childCategoriesResponse = await axios
            .create({
              headers: {
                "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
              },
            })
            .get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/child-category/search/parent/${selectedSubCategoryId}`,
              {
                headers: {
                  Authorization: `Bearer ${userData?.accessToken}`,
                  "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
                },
              }
            );
          setChildCategory(childCategoriesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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

  const onVideoUpload = (e) => {
    e.preventDefault();
    setVideoLoading(true);

    let formData = new FormData();
    formData.append("featuredVideo", e.target.files[0]);

    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/upload-video`,
      data: formData,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        const videoObj = {
          videoUrl: response.data.videoUrl,
          fileName: response.data.featuredVideo,
        };
        setVideoPath([...videoPath, videoObj]);
        setVideoLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setVideoLoading(false);
      });
  };

  const [filePath, setFilePath] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState("");

  const onFileUpload = (e) => {
    setFileLoading(true);

    let formData = new FormData();
    formData.append("productFile", e.target.files[0]);

    const userData = JSON.parse(localStorage.getItem("user"));

    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/upload-product`,
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
        const fileObj = {
          featuredProduct: res.data.featuredProduct,
          featuredProductUrl: res.data.featuredProductUrl,
        };
        setFilePath(fileObj);
        setFileLoading(false);
      })
      .catch((err) => {
        setFileLoading(false);
      });
  };
  const initialValues = {
    productName: editData?.productName,
    Category: editData?.Category,
    SubCategory: editData?.SubCategory,
    childCategory: editData?.childCategory,
    inventory: selectedInventory,
    sku: editData?.sku,
    // shortDesc: editData?.shortDesc,
    description: editData?.description,
    // commodityCode: editData?.commodityCode,
    urlKey: editData?.slug,
    metaTitle: editData?.metaTitle,
    metaKeywords: editData?.metaKeywords,
    metaDesc: editData?.metaDesc,
    price: editData?.price ? parseFloat(editData?.price).toFixed(2) : undefined,
    discountCode: editData?.discountCode || undefined,
    agree: editData?.discountCode ? true : false,
    // downloadLimit: editData?.downloadableLink?.downloadLimit,
    images: imagePath.map((path) => {
      return {
        ...path,
        altText: path && path.altText ? path.altText : "",
      };
    }),
    videos: videoPath,
    productFile: filePath,
    currency: editData?.currency || "",
    currencyPrice: editData?.currencyPrice || "",
    currencyRate: editData?.currencyRate || 1
  };

  return (
    <>
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
        <section>
          <div className="pb-24 viewOnly">
            <h3
              className={`text-2xl xl:tracking-[-0.48px] text-blue-950 mb-8 noto-font`}
            >
              Product Information
            </h3>
            {!loading ? (
              <Formik
                initialValues={initialValues}
                // validationSchema={validationSchema}
                // onSubmit={handleSubmit}
              >
                {({ errors, handleChange }) => (
                  <Form className="st-form">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 lg:gap-y-6">
                      <div className="relative">
                        <label htmlFor="productName">Product Name</label>
                        <Field
                          type="text"
                          name="productName"
                          id="productName"
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
                        <label htmlFor="Category">Parent Category</label>{" "}
                        <Select
                          name="Category"
                          id="Category"
                          options={categoryNameList}
                          onChange={(selectedOption) => {
                            handleChange("Category")(selectedOption?.value);
                            setSelectedParentCategoryId(selectedOption?.value);
                          }}
                          defaultValue={() => {
                            if (editData?.Category && editData?.Category != "")
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
                        <label htmlFor="SubCategory">Sub Category</label>{" "}
                        <Select
                          name="SubCategory"
                          id="SubCategory"
                          options={subCategoryNameList}
                          onChange={(selectedOption) => {
                            handleChange("SubCategory")(selectedOption?.value);
                            setSelectedSubCategoryId(selectedOption?.value);
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
                          readOnly
                          placeholder="This will be pre-populated"
                          disabled={editData?.sku ? false : true}
                        />
                      </div>

                      <div className="relative md:col-span-2 lg:col-span-3">
                        <label htmlFor="description">Product Description</label>
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
                          <label htmlFor="metaKeywords">Meta Keyword</label>
                          <p className=" mb-2 text-blue-950/80 font-medium -mt-1 text-sm">
                            Provide a suitable keyword that is attributed with
                            the product.
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
                            <label htmlFor="metaDesc">Meta Description</label>
                            <p className=" mb-2 text-blue-950/80 font-medium -mt-1 text-sm">
                              Provide a short description of the product within
                              150 characters.
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

    

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 lg:gap-y-6 mt-4">
                    <div className="relative ">
                        <label htmlFor="currency">
                          Currency <span className="text-red-700">*</span>
                        </label>
                        <Select
                          name="currency"
                          id="currency"
                          options={currencies}
                          placeholder="Select Currency"
                          className="st-react-select pointer-events-none"
                          classNamePrefix="react-select"
                          onChange={(selectedOption) => {
                            setSelectedCurrency(selectedOption?.value);
                            handleChange("currency")(selectedOption?.value);
                            handleChange("price")("")
                          }}
                          defaultValue={
                            editData?.currency && currencies.some((curr) => curr.value === editData.currency)
                              ? {
                                  value: editData.currency,
                                  label: `${currencies.find((curr) => curr.value === editData.currency)?.label}`,
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
                      {selectedCurrency && selectedCurrency !== "cad" && (
                          <div className="relative">
                            <label htmlFor="currencyPrice">
                            {`Price in ${selectedCurrency.toUpperCase()}`}
                            </label>
                            <Field
                              type="number"
                              id="currencyPrice"
                              name="currencyPrice"
                              placeholder="Price In Selected Currency"
                              className="border border-gray-300 rounded p-2 w-full"
                              
                              onChange={async (e) => {
                                handleChange("currencyPrice")(e.target.value);
                                const price = await handlePriceChange(e);
                                handleChange("price")(price)
                              }}
                            />
                            <ErrorMessage
                              name="currencyPrice"
                              component="p"
                              className="invalid text-red-600"
                            />
                          </div>
                        )}
                      <div className="relative">
                        <label htmlFor="price">Price (CAD)</label>
                        <Field
                          type="text"
                          name="price"
                          id="price"
                          readOnly
                          placeholder="Enter product price"
                          disabled={selectedCurrency && selectedCurrency !== "cad"}
                        />
                        <ErrorMessage
                          name="price"
                          component="p"
                          className="invalid"
                        />
                      </div>
                      <div className="relative">
                        <label htmlFor="discountCode">Discount (%)</label>
                        <Field
                          type="text"
                          name="discountCode"
                          id="discountCode"
                          readOnly
                          placeholder="Enter Discount"
                        />
                        <ErrorMessage
                          name="discountCode"
                          component="p"
                          className="invalid"
                        />
                      </div>

                      <div className="relative viewform">
                        {" "}
                        <label htmlFor="inventoryList">Inventory</label>{" "}
                        <Select
                          name="inventory"
                          id="inventory"
                          options={inventoryList}
                          placeholder="Select Select inventory"
                          className="st-react-select pointer-events-none"
                          classNamePrefix="react-select"
                          onChange={(selectedOption) => {
                            setSelectedInventory(selectedOption?.value);
                            handleChange("inventory")(selectedOption?.value);
                          }}
                          defaultValue={
                            editData?.inventory && editData?.inventory !== ""
                              ? {
                                  value: editData?.inventory,
                                  label: editData?.inventory,
                                  label:
                                    editData?.inventory === "InStock"
                                      ? "In Stock"
                                      : editData?.inventory === "OutOffStock"
                                      ? "Out Of Stock"
                                      : null,
                                }
                              : null
                          }
                        />
                      </div>

                      <div className="md:col-span-2 lg:col-span-3">
                        <h3
                          className={`text-2xl text-blue-950 xl:tracking-[-0.48px] mt-5 noto-font`}
                        >
                          Downloadable Product Upload
                        </h3>
                      </div>
                      <div className="relative ">
                        <label htmlFor="productweight">Upload File</label>

                        <div>
                          <div className="relative mb-6" readOnly>
                            {filePath?.featuredProductUrl ? (
                              <div
                                className="flex items-center justify-between py-3 "
                                readOnly
                              >
                                <div className="flex items-center gap-4 relative">
                                  <FontAwesomeIcon
                                    icon={faImage}
                                    className="text-3xl text-gray-500"
                                  />
                                  <span>{filePath?.featuredProduct}</span>
                                  <a
                                    href={filePath?.featuredProductUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <span className="absolute top-0 right-0 h-full w-full"></span>
                                  </a>
                                </div>
                                {/* <button
                                type="button"
                                onClick={() => setFilePath("")}
                              >
                                <FontAwesomeIcon
                                  icon={faXmark}
                                  className="text-gray-500"
                                />
                              </button> */}
                              </div>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  name="productFile"
                                  id="productFile"
                                  className={`block w-full font-medium text-sm text-slate-600 file:mr-4 file:p-3.5 file:rounded file:border-0 file:text-sm file:bg-orange-100 file:font-medium file:text-blue-950 file:cursor-pointer focus:outline-none !p-0 ${
                                    errors.productFile &&
                                    touched.productFile &&
                                    submitCount > 0
                                      ? "border-red-600"
                                      : "border-gray-300"
                                  }`}
                                  onChange={(e) => onFileUpload(e)}
                                />
                                {errors.productFile &&
                                touched.productFile &&
                                submitCount > 0 ? (
                                  <span className="text-xs text-red-600 mt-1">
                                    {errors.productFile}
                                  </span>
                                ) : null}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="relative md:col-span-2 lg:col-span-3">
                        <label htmlFor="urlKey">Product URL</label>
                        <Field
                          type="text"
                          name="urlKey"
                          id="urlKey"
                          readOnly
                          placeholder="This will be pre-populated"
                          disabled={editData?.slug ? false : true}
                          value={
                            editData?.slug
                              ? `${process.env.NEXT_PUBLIC_URL}/category/${editData.Category.slug}/${editData.SubCategory.slug}${editData.childCategory ? "/" + editData.childCategory.slug : ""}/${editData.slug}`
                              : ""
                          }
                        />
                      </div>

                      <div className="md:col-span-2 lg:col-span-3 flex gap-1.5 items-center">
                        <h3
                          className={`text-blue-950 text-2xl xl:tracking-[-0.48px] mt-4 noto-font`}
                        >
                          Upload Files
                        </h3>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <p className="text-blue-950 mb-3">Product Image</p>
                        <div>
                          <p className="text-blue-950 mb-3">Uploaded Files</p>
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
                      <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <p className="text-blue-950 mb-3">Product Video</p>
                        <div>
                          <p className="text-blue-950 mb-3">Uploaded Files</p>
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
                  </Form>
                )}
              </Formik>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Index;
