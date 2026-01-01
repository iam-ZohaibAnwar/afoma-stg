import GenerateAiDescription from "@/components/GenerateAiDescription";
import GenerateMetaTags from "@/components/GenerateMetaTags";
import ImageListDnD from "@/components/ImageDragnDrop";
import Layout from "@/components/Layout";
import ProductImageCropperModal from "@/components/ProductImageCropperModal";
import { inventoryList } from "@/lib/select-option";
import { getPrePopulatedAIProductData } from "@/utils/keywordUtils";
import {
  faAngleLeft,
  faCircleVideo,
  faImage,
  faXmark,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import { mixed, object, string } from "yup";

//const noto = Noto_Serif({ subsets: ["latin"] });
const Index = ({ keywords, prePopulatedData }) => {
  const [editData, setEditData] = useState(
    prePopulatedData
      ? {
          productName: prePopulatedData.product_title,
          description: prePopulatedData.product_description,
          metaDesc: prePopulatedData.meta_description,
          metaKeywords: prePopulatedData.meta_keywords,
          metaTitle: prePopulatedData.meta_title,
        }
      : undefined
  );

  const [imagePath, setImagePath] = useState([]);
  const [videoPath, setVideoPath] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState();
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [priceInSelectedCurrency, setPriceInSelectedCurrency] = useState("");
  const [currencyRate, setCurrencyRate] = useState("");

  const [selectedMenuItem, setSelectedMenuItem] = useState("Pending");
  const [selectedInventory, setSelectedInventory] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldScroll = urlParams.get('scroll') === 'save';

    if (!shouldScroll) return;

    const scrollToSave = () => {
      const wrapper = document.getElementById("save-button-wrapper");
      if (wrapper) {
        console.log("Scrolling to Save Button");
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        console.warn("Save wrapper not found");
      }
    };

    // Delay scroll until image is loaded and layout is stable
    if (imagePath.length > 0) {
      // Delay slightly to let DOM paint (esp. validation divs)
      setTimeout(scrollToSave, 300);
    }
  }, [imagePath]); // will rerun when imagePath is set

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
  const handlePriceChange = async (e) => {
    if (e.target.value) {
      const { data } = await axios.get(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${selectedCurrency?.toLowerCase()}.json`
      );
      const price = e.target.value;
      setPriceInSelectedCurrency(parseFloat(price));

      if (selectedCurrency && data[selectedCurrency?.toLowerCase()]["cad"]) {
        const cadPrice =
          parseFloat(price) * data[selectedCurrency?.toLowerCase()]["cad"];
        return parseFloat(cadPrice).toFixed(2);
      }
    }
    return "";
  };

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);

    const options = {
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/status/${editData?._id}`,
      data: {
        productStatus: menuItem,
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
        toast.success("Status Updated");
      })
      .catch(function (error) {
        console.error(error);
        toast.error("Something Went Wrong");
      });
  };

  const getData = (id) => {
    setLoading(true);
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setSelectedCurrency(response.data?.currency);
        setPriceInSelectedCurrency(response.data?.currencyPrice);
        setCurrencyRate(response.data?.currencyRate);
        setEditData(response.data);
        setImagePath(response.data.images);
        setVideoPath(response.data.videos);

        const imgObj = {
          featuredProduct: response.data.downloadableLink?.featuredProduct,
          featuredProductUrl:
            response.data.downloadableLink?.featuredProductUrl,
        };
        setFilePath(imgObj);
        setSelectedCategory(response.data.Category);
        setSellerList(response.data.seller);
        setSelectedMenuItem(response.data.productStatus);
        setSelectedValue(response.data.seller?._id);
        setSellerList(response.data.seller);
        setSelectedInventory(response.data.inventory);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };
  const [selectedValue, setSelectedValue] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchCurrencyRate();
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
    // //
  }, [router?.query]);

  const [persons, setPersons] = useState([]);
  const [selectedSeller, setSellerList] = useState("");
  const [selectedcategory, setSelectedCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [childcategory, setChildCategory] = useState([]);
  const [selectedParentCategoryId, setSelectedParentCategoryId] =
    useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [childCategoryDisabled, setChildCategoryDisabled] = useState(false);
  const [error, setError] = useState(null);
  const [videoerror, setVideoError] = useState(null);
  const [downloaderror, setDownloadError] = useState(null);
  const handleBack = () => {
    router.back();
  };
  useEffect(() => {
    // //
  }, [filePath]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData && userData?.accessToken) {
      const fetchSellers = axios
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

      const fetchCategories = axios
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

      Promise.all([fetchSellers, fetchCategories])
        .then(([sellersResponse, categoriesResponse]) => {
          setPersons(sellersResponse.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.error("No user data found in localStorage");
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData && userData?.accessToken) {
      const fetchData = async () => {
        try {
          // Fetch sellers
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

          // Fetch categories
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

          // Fetch subcategories if a parent category is selected
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

          // Fetch child categories if a subcategory is selected
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
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      console.error("No user data found in localStorage");
      setLoading(false);
    }
  }, [selectedParentCategoryId, selectedSubCategoryId]);
  const sellerNameList = persons
    .filter((person) => person.userRole === "seller")
    .map((person) => ({
      value: person?._id,
      label: `${person.firstName} ${person.lastName}`,
      id: person.uuid,
    }));
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

  const [selectedProductCategory, setSelectedProductCategory] = useState("");

  const initialValues = {
    productName: editData?.productName,
    productStatus: selectedMenuItem,
    Category: editData?.Category,
    SubCategory: editData?.SubCategory,
    childCategory: editData?.childCategory,
    sku: editData?.sku,
    seller: editData?.seller,
    // shortDesc: editData?.shortDesc,
    description: editData?.description,
    sku: editData?.sku,
    price: editData?.price,
    discountCode: editData?.discountCode || undefined,
    agree: editData?.discountCode ? true : false,
    // commodityCode: editData?.commodityCode,
    urlKey: editData?.slug,
    metaTitle: editData?.metaTitle,
    metaKeywords: editData?.metaKeywords,
    metaDesc: editData?.metaDesc,
    inventory: editData?.inventory,
    // downloadLimit: editData?.downloadableLink?.downloadLimit,
    // metaKeywords: editData?.metaKeywords,
    // metaDesc: editData?.metaDesc,
    images: imagePath.map((path) => {
      return {
        ...path,
        altText: path && path.altText ? path.altText : "",
      };
    }),
    videos: videoPath,
    downloadableLink: {
      featuredProductUrl: filePath?.featuredProductUrl,
      featuredProduct: filePath?.featuredProduct,
      // downloadLimit: editData?.downloadLimit,
    },
  };

  const validationSchema = object({
    productName: string().required("Required"),
    description: string().required("required"),
    // commodityCode: string().required("required"),
    inventory: mixed().required("Required"),

    price: string()
      .required("required")
      .matches(/^[0-9]+(\.[0-9]+)?$/, "Please enter numbers only")
      .test("is-greater-than-zero", "Price must be greater than 0", (value) => {
        const numberValue = parseFloat(value);
        return !isNaN(numberValue) && numberValue > 0;
      }),
    Category: mixed().required("Required"),
    SubCategory: mixed().required("Required"),
    seller: mixed().required("Required"),
  });

  const onImageUpload = (file, altText) => {
    setImageLoading(true);
    let formData = new FormData();
    formData.append("featuredimage", file);
    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/upload-image`,
      data: formData,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        const imgObj = {
          imageUrl: response.data.imageUrl,
          fileName: response.data.featuredimage,
          altText: altText,
        };
        setImagePath([...imagePath, imgObj]);
        setImageLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setImageLoading(false);
        toast.error(error.response.data.error || "Error uploading image");
      });
  };

  const onVideoUpload = (e) => {
    e.preventDefault();
    setVideoLoading(true);
    let formData = new FormData();
    formData.append("featuredVideo", e.target.files[0]);
    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/upload-video`,
      data: formData,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        // //
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
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
      data: formData,
    };

    axios
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

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (editData?._id) {
      if (imagePath.length < 2) {
        return toast.error("Atleast 2 images are required");
      }

      setSubmitting(true);
      const options = {
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${editData?._id}`,
        data: {
          productName: values.productName,
          Category: values?.Category,
          SubCategory: values?.SubCategory,
          childCategory: values?.childCategory,
          inventory: values?.inventory,
          sku: values.sku,
          seller: values?.seller,
          // shortDesc: values.shortDesc,
          description: values.description,
          sku: values.sku,
          price: values.price,
          discountCode:
            values?.discountCode && parseFloat(values?.discountCode) > 0
              ? values?.discountCode
              : "",
          // commodityCode: values.commodityCode,
          urlKey: values.slug,
          metaTitle: values.metaTitle,
          metaKeywords: values.metaKeywords,
          metaDesc: values.metaDesc,
          images: imagePath.map((path) => {
            return {
              ...path,
              altText: path && path.altText ? path.altText : "",
            };
          }),
          videos: videoPath,
          downloadableLink: {
            featuredProductUrl: filePath?.featuredProductUrl,
            featuredProduct: filePath?.featuredProduct,
            // downloadLimit: values?.downloadLimit,
          },
          productType: "Downloadable",
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          setSubmitting(false);
          toast.success("Product Updated");
          router.push(
            `/admin/product/downloadable-product?id=${response.data.newProduct._id}&scroll=save`
          );
          // resetForm();
        })
        .catch(function (error) {
          console.error(error);
          setSubmitting(false);
          toast.error("Something Went Wrong");
          // resetForm();
        });
    } else {
      if (imagePath.length < 2) {
        return toast.error("Atleast 2 images are required");
      }

      setSubmitting(true);
      const options = {
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
        data: {
          productName: values.productName,
          Category: values?.Category,
          SubCategory: values?.SubCategory,
          childCategory: values?.childCategory,
          inventory: values?.inventory,
          sku: values.sku,
          seller: values?.seller,
          // shortDesc: values.shortDesc,
          description: values.description,
          sku: values.sku,
          price: values.price,
          discountCode:
            values?.discountCode && parseFloat(values?.discountCode) > 0
              ? values?.discountCode
              : "",
          // commodityCode: values.commodityCode,
          urlKey: values.slug,
          metaTitle: values.metaTitle,
          metaKeywords: values.metaKeywords,
          metaDesc: values.metaDesc,
          images: imagePath.map((path) => {
            return {
              ...path,
              altText: path && path.altText ? path.altText : "",
            };
          }),
          videos: videoPath,
          downloadableLink: {
            featuredProductUrl: filePath?.featuredProductUrl,
            featuredProduct: filePath?.featuredProduct,
            // downloadLimit: values?.downloadLimit,
          },
          productType: "Downloadable",
          productStatus: "Pending",
        },
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };
      axios
        .request(options)
        .then(function (response) {
          setSubmitting(false);
          toast.success("New Product Added");
          // router.push(`/admin/product`);
          // resetForm();
        })
        .catch(function (error) {
          console.error(error);
          setSubmitting(false);
          toast.error("Something Went Wrong");
        });
    }
  };

    const handleDelete = async (data) => {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/products/video/delete-video`,
          {
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
              "Content-Type": "application/json",
            },
            data: { fileName: data.fileName }, // axios DELETE body
          }
        );
  
        console.log("File deleted successfully:", response.data);
  
        // Update state after deletion
  
        setVideoPath(videoPath.filter((obj) => obj !== data))
  
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    };
  return (
    <>
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
      <Layout userType="admin">
        <section>
          {!loading ? (
            <div className="pb-24">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  setFieldValue,
                  initialValues: initialFormValues,
                }) => (
                  <Form className="st-form">
                    <div className="mb-[30px] flex items-center justify-between col-span-3">
                      <div className="md:flex gap-2 items-center  ">
                        <h3
                          className={`md:text-2xl text-1xl xl:tracking-[-0.48px] text-blue-950 noto-font`}
                        >
                          Product Information
                        </h3>
                        {selectedValue && selectedValue.length ? (
                          <h6
                            className={`md:text-lg text-xs xl:tracking-[-0.36px]  noto-font`}
                          >
                            {" "}
                            <span className="md:inline-block hidden text-blue-950">
                              {" "}
                              |{" "}
                            </span>{" "}
                            {selectedValue}
                          </h6>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>
                        <div className="flex items-center justify-end gap-4">
                          <Menu as="div" className="relative">
                            <div>
                              <Menu.Button
                                className={`flex items-center justify-center rounded-full ${
                                  selectedMenuItem === "Approved"
                                    ? "bg-green-800 text-white"
                                    : selectedMenuItem === "Disapproved"
                                    ? "bg-red-700 text-white"
                                    : selectedMenuItem === "Review"
                                    ? "bg-yellow-600 text-white"
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
                                      onClick={() =>
                                        handleMenuItemClick("Approved")
                                      }
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
                                      onClick={() =>
                                        handleMenuItemClick("Disapproved")
                                      }
                                    >
                                      Disapproved
                                    </p>
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 md:gap-6 gap-4">
                      <div className="relative">
                        <label htmlFor="productName">
                          Product Name <span className="text-red-700 ">*</span>
                        </label>
                        <Field
                          type="text"
                          name="productName"
                          id="productName"
                          placeholder="Enter name of the product"
                        />
                        <ErrorMessage
                          name="productName"
                          component="p"
                          className="invalid"
                        />
                      </div>
                      <div className="relative">
                        {" "}
                        <label htmlFor="Category">
                          Parent Category{" "}
                          <span className="text-red-700 ">*</span>
                        </label>{" "}
                        <Select
                          name="Category"
                          id="Category"
                          options={categoryNameList}
                          onChange={(selectedOption) => {
                            handleChange("Category")(selectedOption?.value);
                            setSelectedParentCategoryId(selectedOption?.value);

                            // Clear subcategory when parent category changes
                            setFieldValue("SubCategory", null);
                            setSelectedSubCategoryId(null);

                            const hasSubCategories =
                              selectedOption?.hasOwnProperty("subCategories") &&
                              selectedOption.subCategories.length > 0;

                            setChildCategoryDisabled(!hasSubCategories);

                            if (!hasSubCategories) {
                              setFieldValue("SubCategory", null);
                            }
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
                      {selectedParentCategoryId && (
                        <div className="relative">
                          <label htmlFor="SubCategory">
                            Sub Category <span className="text-red-700">*</span>
                          </label>
                          {subCategoryNameList.length > 0 ? (
                            <>
                              <Select
                                key={selectedParentCategoryId}
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

                                  const hasChildCategories =
                                    selectedOption?.hasOwnProperty(
                                      "childCategories"
                                    ) &&
                                    selectedOption.childCategories.length > 0;

                                  setChildCategoryDisabled(!hasChildCategories);

                                  if (!hasChildCategories) {
                                    setFieldValue("childCategory", null);
                                  }
                                }}
                                placeholder="Select sub category"
                                isDisabled={!selectedParentCategoryId}
                                className="st-react-select"
                                classNamePrefix="react-select"
                              />
                              <ErrorMessage
                                name="SubCategory"
                                component="p"
                                className="invalid"
                              />
                            </>
                          ) : (
                            <>
                              <Select
                                name="SubCategory"
                                id="SubCategory"
                                options={[]}
                                isDisabled
                                placeholder="Select sub category"
                                className="st-react-select"
                                classNamePrefix="react-select"
                              />
                            </>
                          )}
                        </div>
                      )}

                      {!selectedParentCategoryId && (
                        <div className="relative">
                          <label htmlFor="SubCategory">
                            Sub Category <span className="text-red-700">*</span>
                          </label>
                          <Select
                            name="SubCategory"
                            id="SubCategory"
                            options={[]}
                            isDisabled
                            defaultValue={() => {
                              if (
                                editData?.SubCategory &&
                                editData?.SubCategory != ""
                              ) {
                                return {
                                  value: editData?.SubCategory?._id,
                                  label: editData?.SubCategory?.name,
                                };
                              } else {
                                return "";
                              }
                            }}
                            placeholder="Select sub category"
                            className="st-react-select"
                            classNamePrefix="react-select"
                          />
                        </div>
                      )}

                      {selectedSubCategoryId && (
                        <div className="relative">
                          <label htmlFor="childCategory">Child Category</label>
                          {childCategoryNameList.length > 0 ? (
                            <Select
                              key={selectedSubCategoryId}
                              name="childCategory"
                              id="childCategory"
                              options={childCategoryNameList}
                              onChange={(selectedOption) => {
                                handleChange("childCategory")(
                                  selectedOption?.value
                                );
                              }}
                              // defaultValue={() => {
                              //   if (
                              //     editData?.childCategory &&
                              //     editData?.childCategory != ""
                              //   ) {
                              //     return {
                              //       value: editData?.childCategory?._id,
                              //       label: editData?.childCategory?.name,
                              //     };
                              //   } else {
                              //     return "";
                              //   }
                              // }}
                              placeholder="Select child category"
                              className="st-react-select"
                              classNamePrefix="react-select"
                            />
                          ) : (
                            <>
                              <Select
                                key={selectedSubCategoryId}
                                name="childCategory"
                                id="childCategory"
                                options={[]}
                                isDisabled
                                placeholder="Select child category"
                                className="st-react-select"
                                classNamePrefix="react-select"
                              />
                              <p className="text-sm mt-2 text-gray-600 font-medium">
                                No child categories available
                              </p>
                            </>
                          )}
                        </div>
                      )}

                      {!selectedSubCategoryId && (
                        <div className="relative">
                          <label htmlFor="childCategory">Child Category</label>

                          <Select
                            key={selectedParentCategoryId}
                            name="childCategory"
                            id="childCategory"
                            options={[]}
                            isDisabled
                            defaultValue={() => {
                              if (
                                editData?.childCategory &&
                                editData?.childCategory != ""
                              ) {
                                return {
                                  value: editData?.childCategory?._id,
                                  label: editData?.childCategory?.name,
                                };
                              } else {
                                return "";
                              }
                            }}
                            placeholder="Select child category"
                            className="st-react-select"
                            classNamePrefix="react-select"
                          />
                        </div>
                      )}

                      <div className="relative">
                        {" "}
                        <label htmlFor="seller">
                          Seller Name <span className="text-red-700 ">*</span>
                        </label>{" "}
                        <Select
                          name="seller"
                          id="seller"
                          options={sellerNameList}
                          onChange={(selectedOption) => {
                            setSellerList(selectedOption?.value);
                            setSelectedValue(selectedOption?.value);
                            handleChange("seller")(selectedOption?.value);
                          }}
                          defaultValue={() => {
                            if (editData?.seller && editData?.seller != "")
                              return {
                                value: editData?.seller?._id,
                                label: `${editData?.seller?.firstName} ${editData?.seller?.lastName}`,
                              };
                            else return "";
                          }}
                          placeholder="Select seller name"
                          className="st-react-select"
                          classNamePrefix="react-select"
                        />{" "}
                        <ErrorMessage
                          name="seller"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>

                    <GenerateAiDescription
                      defaultKeywords={keywords}
                      setDescription={(res) => {
                        setFieldValue("description", res);
                      }}
                    />

                    <div className="relative my-6">
                      <label htmlFor="description">
                        Product Description{" "}
                        <span className="text-red-700 ">*</span>
                      </label>
                      <Field
                        as="textarea"
                        rows="5"
                        name="description"
                        id="description"
                        placeholder="Describe your product in detail"
                      />
                      <ErrorMessage
                        name="description"
                        component="p"
                        className="invalid"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full my-4">
                      <div className="relative col-span-4">
                        <GenerateMetaTags
                          values={values}
                          setMeta={(res) => {
                            if (res) {
                              if (res.meta_title) {
                                setFieldValue("metaTitle", res.meta_title);
                              }
                              if (res.meta_description) {
                                setFieldValue("metaDesc", res.meta_description);
                              }
                              if (res.meta_keywords) {
                                setFieldValue(
                                  "metaKeywords",
                                  res.meta_keywords
                                );
                              }
                            }
                          }}
                          initialFormValues={initialFormValues}
                        />
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
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 md:gap-6 gap-4">
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
                        <ErrorMessage
                          name="sku"
                          component="p"
                          className="invalid"
                        />
                      </div>

                      <div className="relative">
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
                            handleChange("price")("");
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
                                      (curr) => curr.value === editData.currency
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
                      {/* Conditionally render the additional input field */}
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
                              handleChange("price")(price);
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
                        <label htmlFor="price">
                          Price (CAD)<span className="text-red-700 ">*</span>
                        </label>
                        <Field
                          type="text"
                          name="price"
                          id="price"
                          placeholder="Enter product price"
                        />
                        <ErrorMessage
                          name="price"
                          component="p"
                          className="invalid"
                        />
                        <div className="mt-2">
                          {" "}
                          <label htmlFor="agree" className="typecheck">
                            <Field
                              type="checkbox"
                              className="borderslate600"
                              name="agree"
                              id="agree"
                              onChange={(e) => {
                                const { checked } = e.target;
                                setFieldValue("agree", checked);
                                if (!checked) {
                                  setFieldValue("discountCode", ""); // Reset discountCode when unchecked
                                }
                              }}
                            />
                            <span className="text-sm text-slate-600 ml-2">
                              Add discount
                            </span>
                          </label>
                        </div>
                      </div>
                      {values.agree === true && (
                        <>
                          <div className="relative">
                            <label htmlFor="discountCode">Discount (%)</label>
                            <Field
                              type="text"
                              name="discountCode"
                              id="discountCode"
                              placeholder="enter discount"
                            />
                          </div>
                        </>
                      )}
                      <div className="relative">
                        {" "}
                        <label htmlFor="inventory">
                          Inventory <span className="text-red-700 ">*</span>
                        </label>{" "}
                        <Select
                          name="inventory"
                          id="inventory"
                          options={inventoryList}
                          placeholder="Select inventory"
                          className="st-react-select"
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
                        <ErrorMessage
                          name="inventoryList"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <h3
                        className={`text-lg md:text-2xl text-blue-950 xl:tracking-[-0.48px] my-4 noto-font`}
                      >
                        Downloadable Product Upload
                      </h3>
                    </div>
                    <div className="relative ">
                      <label htmlFor="productweight">
                        Upload File <span className="text-red-700 ">*</span>
                      </label>
                      <div>
                        <div className="relative mb-6">
                          {filePath?.featuredProductUrl ? (
                            <div className="flex items-center justify-between py-3">
                              <div className="flex items-center gap-4 relative">
                                <FontAwesomeIcon
                                  icon={faImage}
                                  className="text-3xl text-gray-500"
                                />
                                <span>{filePath.featuredProduct}</span>
                                <a
                                  href={filePath.featuredProductUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span className="absolute top-0 right-0 h-full w-full"></span>
                                </a>
                              </div>
                              <button
                                type="button"
                                onClick={() => setFilePath("")}
                              >
                                <FontAwesomeIcon
                                  icon={faXmark}
                                  className="text-gray-500"
                                />
                              </button>
                            </div>
                          ) : (
                            <>
                              <input
                                type="file"
                                name="productFile"
                                disabled={fileLoading}
                                id="productFile"
                                className={`block w-full font-medium text-sm text-slate-600 file:mr-4 file:p-3.5 file:rounded file:border-0 file:text-sm file:bg-orange-100 file:font-medium file:text-blue-950 file:cursor-pointer focus:outline-none !p-0 `}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file.size > 50 * 1024 * 1024) {
                                    setDownloadError(
                                      "Product size should be less than 50 MB"
                                    );
                                    return;
                                  }
                                  onFileUpload(e);
                                  setDownloadError(null);
                                }}
                              />
                              {downloaderror && (
                                <div className="text-red-500 text-sm mb-3">
                                  {downloaderror}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="relative col-span-3 pointer-events-none">
                      <label htmlFor="urlKey">Product URL</label>
                      <Field
                        type="text"
                        name="urlKey"
                        id="urlKey"
                        placeholder="This will be pre-populated"
                        readOnly
                        disabled={editData?.slug ? false : true}
                        value={
                          editData?.slug
                            ? `${process.env.NEXT_PUBLIC_URL}/product/${editData.slug}`
                            : ""
                        }
                      />
                    </div>
                    {/* <div className="grid md:grid-cols-2 md:gap-6 gap-4">
                      <div className="relative col-span-1">
                        <label htmlFor="metaTitle">Meta Title</label>
                        <Field
                          type="text"
                          name="metaTitle"
                          id="metaTitle"
                          placeholder="Enter meta title"
                        />
                      </div>
                      <div className="relative col-span-1">
                        <label htmlFor="metaKeywords">Meta Keyword</label>
                        <Field
                          type="text"
                          name="metaKeywords"
                          id="metaKeywords"
                          placeholder="Enter meta keyword"
                        />
                      </div>
                    </div>
                    <div className="relative mt-4">
                      <label htmlFor="metaDesc">Meta Description</label>
                      <Field
                        as="textarea"
                        name="metaDesc"
                        id="metaDesc"
                        placeholder="Enter meta description"
                      />
                    </div> */}
                    <div className="col-span-3 flex gap-1.5 items-center">
                      <h3
                        className={`text-lg md:text-2xl xl:tracking-[-0.48px] my-5 noto-font mb-2 mt-4`}
                      >
                        Upload Files
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-6 w-full">
                      <div className="col-span-3 md:col-span-2">
                        <p className="text-blue-950 mb-1">
                          Product Image <span className="text-red-700 ">*</span>
                        </p>
                        {/* <p className="text-primary text-sm mb-3">
                          Recommended (320px * 380px)
                        </p> */}
                        <div className="flex items-center gap-2 mb-3">
                          <div>
                            <ProductImageCropperModal
                              onImageUpload={onImageUpload}
                              setError={setError}
                              imageLoading={imageLoading}
                            />
                            {error && (
                              <div className="text-red-500 text-sm mb-3">
                                {error}
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-slate-600 font-medium text-sm mb-5">
                          Allowed filed type: jpg, jpeg, png, gif
                        </p>

                      </div>
                      <div className="col-span-3 md:col-span-2">
                        <div>
                          <p className="text-blue-950 mb-3">Uploaded Files</p>
                          <div className="divide-y-[1px] divide-gray-500">
                            <p className="text-gray-500 text-sm italic mb-2">
                              Drag and drop your files below
                            </p>
                            <ImageListDnD imagePath={imagePath} setImagePath={setImagePath} />
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-span-3 md:col-span-2">
                        <p className="text-blue-950 mb-1">Product Video</p>
                        <p className="text-primary text-sm mb-3">
                          Recommended (320px * 380px)
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <div>
                            <input
                              id="dropzone-video-file"
                              type="file"
                              disabled={videoLoading}
                              className="block w-full font-medium text-sm text-slate-600 file:mr-4 file:p-3.5 file:rounded file:border-0 file:text-sm file:bg-orange-100 file:font-medium file:text-blue-950 file:cursor-pointer focus:outline-none !p-0"
                              accept="video/mp4,video/x-m4v,video/*"
                              // onChange={(e) => {
                              //   onVideoUpload(e);
                              // }}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file.size > 20 * 1024 * 1024) {
                                  setVideoError(
                                    "Video size should be less than 20MB"
                                  );
                                  return;
                                }
                                onVideoUpload(e);
                                e;
                                setVideoError(null);
                              }}
                            />
                            {videoerror && (
                              <div className="text-red-500 text-sm mb-3">
                                {videoerror}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-600 font-medium text-sm mb-5">
                          Allowed filed type: mp4
                        </p>

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
                                  <button
                                    type="button"
                                    onClick={() =>handleDelete(data) }
                                  >
                                    <FontAwesomeIcon
                                      icon={faXmark}
                                      className="text-gray-500"
                                    />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="text-slate-600 text-sm mb-5">
                                No files
                              </p>
                            )}
                          </div>
                        </div>
                      </div> */}
                    </div>

                    <div className="flex gap-4 items-center col-span-3 relative mt-8">
                      <div className="" id="save-button-wrapper">
                        <button
                          type="submit"
                          className="buttonprimary"
                          disabled={
                            !filePath?.featuredProductUrl ||
                            imagePath.length === 0 ||
                            Object.keys(errors).length !== 0
                          }
                        >
                          Save
                        </button>
                        {/* Error Message */}
                        {(!filePath?.featuredProductUrl ||
                          imagePath.length === 0 ||
                          Object.keys(errors).length !== 0 || imagePath.length < 2) &&
                          touched && (
                            <div className="absolute left-0 -top-5 text-xs text-red-500">
                              {/* {!filePath?.featuredProductUrl &&
                                "Featured product URL is required."} */}
                            {Object.keys(errors).length !== 0 &&
                              "Please fill in all required fields."}
                            {imagePath.length === 0 &&
                              " Please upload an image."}
                            {imagePath.length > 0 && imagePath.length < 2 &&
                              " Minimum 2 images are required."}
                            </div>
                          )}
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
          ) : (
            <p>Loading...</p>
          )}
        </section>
      </Layout>
    </>
  );
};

export async function getServerSideProps(context) {
  const queryKeyword = context.query.keywords;
  if (queryKeyword) {
    const geminiData = await getPrePopulatedAIProductData(queryKeyword);
    return {
      props: {
        prePopulatedData: geminiData,
        keywords: queryKeyword,
      },
    };
  } else {
    return {
      props: {
        prePopulatedData: null,
        keywords: null,
      },
    };
  }
}

export default Index;
