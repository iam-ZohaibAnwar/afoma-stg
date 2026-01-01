import Layout from "@/components/Layout";
import {
  calculateItemPrice,
  calculateItemTotalPrice,
} from "@/utils/pricingUtils";
import { faCircleInfo } from "@fortawesome/pro-light-svg-icons";
import {
  faAngleLeft,
  faImage,
  faXmark,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import jsPDF from "jspdf";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as Yup from "yup";
//const noto = Noto_Serif({ subsets: ["latin"] });

const CustomerOrderView = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [shipmentId, setShipmentId] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [order, setOrder] = useState([]);
  const router = useRouter();

  const getData = (id) => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/single/${userData?.sellerId}/${id}`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setOrder(response.data.orders);
        setSelectedMenuItem(response.data.orders.status);
        readUser(response.data.orders);
      })
      .catch(function (error) {
        console.error(error);
      })
      .finally(() => {
        // Set loading to false regardless of success or error
        setLoading(false);
      });
  };

  const readUser = async (ordersData) => {
    if (ordersData && ordersData.userInfo && ordersData.userInfo.userId) {
      const userData = JSON.parse(localStorage.getItem("user"));
      try {
        const response = await axios
          .create({
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
              Authorization: `Bearer ${userData.accessToken}`,
            },
          })
          .get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/users/${ordersData.userInfo.userId}`
          );
        if (response && response.data) {
          setCustomer(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
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

  const initialValues = {
    contact_name: "",
    contact_phone_number: "",
    dispatch_details: "",
    readyAt: {
      hour: "",
      minute: "",
    },
    readyUntil: {
      hour: "",
      minute: "",
    },
  };

  const validationSchema = Yup.object().shape({
    contact_name: Yup.string().required("Full name is required"),
    // contact_phone_number: Yup.string().required("Phone number is required"),
    dispatch_details: Yup.string().required("Pick up date is required"),
    readyAt: Yup.object().shape({
      hour: Yup.string()
        .required("Required")
        .matches(/^(?:2[0-3]|[01][0-9])$/, "Hours (00-23)"),
      minute: Yup.string()
        .required("Required")
        .matches(/^(?:[0-5][0-9])$/, " Minutes (00-59)"),
    }),
    readyUntil: Yup.object().shape({
      hour: Yup.string()
        .required("Required")
        .matches(/^(?:2[0-3]|[01][0-9])$/, "Hours (00-23)"),
      minute: Yup.string()
        .required("Required")
        .matches(/^(?:[0-5][0-9])$/, " Minutes (00-59)"),
    }),
    contact_phone_number: Yup.string().required("Contact No. is required"),
  });

  const togglePopoverAndCallApi = (shipmentId) => {
    setShipmentId(shipmentId);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/shipping/shipment-details/${shipmentId}`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      )
      .then(function (response) {
        if (response.status === 200) {
          // Toggle popover
          togglePopover();
          if (response.status === 403) {
            toast.success("Pickup is already scheduled");
          } else {
            toast.success("Schedule pickup");
          }
        } else {
          // Show error message
          toast.error("Failed to schedule pickup");
        }
      })
      .catch(function (error) {
        // Show error message
        toast.error("Something went wrong");
      });
  };
  const togglePopoverAndDhlApi = (shipment) => {
    togglePopover();
  };
  const [showPopover, setShowPopover] = useState(false);

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const handleClosePopover = () => {
    setShowPopover(false);
  };

  const onSubmit = (values) => {
    const dispatchDate = new Date(values.dispatch_details);
    // Extract year, month, and day from the Date object
    const year = dispatchDate.getFullYear();
    const month = dispatchDate.getMonth() + 1; // Months are zero-indexed, so add 1
    const day = dispatchDate.getDate();

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/shipping/create-schedule`,
        {
          shipment_data: {
            shipment_id: shipmentId,
            shipment: order,
          },
          pickup_details: {
            pre_scheduled_pickup: false,
            date: {
              year: year,
              month: month,
              day: day,
            },
            ready_at: {
              hour: parseInt(values.readyAt.hour),
              minute: parseInt(values.readyAt.minute),
            },
            ready_until: {
              hour: parseInt(values.readyUntil.hour),
              minute: parseInt(values.readyUntil.minute),
            },
            pickup_location: values.pickup_location,
            contact_name: values.contact_name,
            contact_phone_number: {
              number: values.contact_phone_number,
            },
          },
        },
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      )
      .then(function (response) {
        toast.success(response.data.message || response.message);
        setShowPopover(false);
      })
      .catch(function (response) {
        const newError = response.response.data;
        const errorMessage = JSON.stringify(newError);
        toast.error(errorMessage);
      });
  };

  const onDownload = (shipmentId) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/shipping/shipment-details/${shipmentId}`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      )
      .then(function (response) {
        if (
          response.data.shipment &&
          Array.isArray(response.data.shipment.labels) &&
          response.data.shipment.labels.length > 0
        ) {
          const firstPdfLabel = response.data.shipment.labels.find(
            (label) => label.padded === true
          );
          if (firstPdfLabel && firstPdfLabel.url) {
            // Fetch the PDF file
            axios
              .get(firstPdfLabel.url, { responseType: "blob" })
              .then((pdfData) => {
                // Create a blob object for the PDF file
                const blob = new Blob([pdfData.data], {
                  type: "application/pdf",
                });
                // Create a URL for the blob
                const pdfUrl = URL.createObjectURL(blob);
                // Create a link element to trigger download
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.download = `label-${firstPdfLabel.format}.${firstPdfLabel.format}`;
                link.click();
                // Clean up
                URL.revokeObjectURL(pdfUrl);
              })
              .catch((error) => {});
          } else {
          }
        } else {
        }
      })
      .catch(function (error) {});
  };

  const DatePickerComponent = ({ field, form, ...props }) => {
    // Define your desired date format
    const desiredDateFormat = "yyyy-MM-dd"; // Change this to your desired format

    return (
      <ReactDatePicker
        selected={field.value ? new Date(field.value) : null}
        onChange={(date) => form.setFieldValue(field.name, date)}
        placeholderText={field.value ? "" : `${desiredDateFormat}`} // Set the placeholder to show the date format
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={15} // adjust as needed
        {...props}
      />
    );
  };

  const handleMenuItemClick = (status, order, productId) => {
    const orderId = order._id;
    const options = {
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}/products/${productId}/shipping`,
      data: {
        shippingStatus: status,
      },
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        toast.success("Status Updated");
        getData(orderId);
      })
      .catch(function (error) {
        console.error(error);
        toast.error("Something Went Wrong");
      });
  };

  const exportPDF = (consignment, index) => {
    const base64PDF = index == 0 ? consignment?.[0]?.label : consignment?.[0]?.extra_label;

    if (base64PDF) {
      // Decode the base64 string
      const byteCharacters = atob(base64PDF);
      const byteArrays = [];

      // Convert base64 to byte array
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }

      // Create a Blob from the byte array
      const blob = new Blob(byteArrays, {
        type: "application/pdf",
      });

      // Create an object URL for the Blob
      const pdfUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Set the download attribute to specify the file name
      let name = index == 0 ? "label" : "invoice"
      link.href = pdfUrl;
      link.download = `${name}-${consignment?.[0]?.tracking_number}.pdf`;

      // Trigger the download by clicking the link
      link.click();

      // Revoke the object URL after download
      URL.revokeObjectURL(pdfUrl);
    } else {
      console.error("Base64 string is missing or invalid.");
    }
  };

  const downloadShippingLabel = (order) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/shipping/generate-label`,
        {
          order_id: order._id,
          shipment: order.filteredCart,
          userInfo: order.userInfo,
        },
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      )
      .then(async (response) => {
        const pdfBytesList = []; // Array to store individual PDFs
        const totalHeight = 140 + (order.filteredCart.length - 1) * 8;
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [130, totalHeight], // Width x Height in mm
        });

        // Render HTML content
        await new Promise((resolve) => {
          doc.html(response.data, {
            x: 5,
            y: 5,
            width: 112,
            windowWidth: 112 / 0.274583, // Adjust for resolution
            callback: () => {
              // Convert PDF output to Uint8Array
              const pdfBlob = new Uint8Array(doc.output("arraybuffer"));
              pdfBytesList.push(pdfBlob);
              resolve();
            },
          });
        });

        // Merge PDFs into a single Blob
        const mergedPdfBlob = new Blob(pdfBytesList, {
          type: "application/pdf",
        });

        // Create download link
        const url = URL.createObjectURL(mergedPdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "AFOMAExpress.pdf";
        a.click();

        // Clean up
        URL.revokeObjectURL(url);
        setShowPopover(false);
      })
      .catch(function (response) {
        toast.error(response.error);
      });
  };

  const foundShipment = order?.filteredCart?.find(
    (shipment) =>
      shipment.shipmentId || shipment.consignment || shipment.NGShipping
  );

  const getAllVariations = (cart) => {
    const variationsMap = new Map();
    cart.forEach((item) => {
      if (item.selectedVariations) {
        item.selectedVariations.forEach((variation) => {
          variationsMap.set(variation.attributeName, variation.attributeValue);
        });
      }
    });
    return Array.from(variationsMap.keys());
  };

  const getProductImage = (productDetail) => {
    if (
      productDetail &&
      productDetail.productData &&
      productDetail.productData.images &&
      productDetail.productData.images.length
    ) {
      const variations = productDetail.productData.variations;
      if (
        productDetail.productData.productType === "Customizable" &&
        variations &&
        variations.length &&
        productDetail.selectedVariations &&
        productDetail.selectedVariations.length
      ) {
        const selectedVariation = productDetail.selectedVariations[0];
        const find = variations.find(
          (v) =>
            v[selectedVariation.attributeName] ===
            selectedVariation.attributeValue
        );
        if (find && find.image) {
          return find.image;
        }
        return productDetail.productData.images[0].imageUrl;
      }
      return productDetail.productData.images[0].imageUrl;
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

      <Layout userType="seller">
        <>
          {loading ? (
            <p>Loading...</p> // You can replace this with a loading spinner or any other UI component
          ) : (
            <div className="pb-[76px]">
              <div className="flex justify-end md:justify-between flex-col md:flex-row md:items-center mb-6">
                <h1
                  className={`text-xl md:text-2xl text-blue-950 font-medium mb-2 noto-font `}
                >
                  Order View |<span className="text-lg">{order?._id ? `AM${order?._id.substring(0, 6).toUpperCase()}` : "-"}</span>
                </h1>

                <div className="flex items-center justify-end gap-4">
                  <Menu as="div" className="relative pointer-events-none">
                    <div>
                      <Menu.Button
                        className={`flex items-center justify-center rounded-full ${
                          selectedMenuItem === "Delivered"
                            ? "bg-green-800 text-white"
                            : selectedMenuItem === "Shipped"
                            ? "bg-yellow-600 text-white"
                            : selectedMenuItem === "Cancel order"
                            ? "bg-red-700 text-white"
                            : selectedMenuItem === "Processing"
                            ? "bg-sky-700 text-white"
                            : selectedMenuItem === "Abandoned"
                            ? "bg-orange-700 text-white"
                            : "bg-gray-500 text-white"
                        } cursor-pointer py-2.5 px-4 gap-2 rounded-sm text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center`}
                      >
                        {selectedMenuItem}
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
                          {/* <Menu.Item>
                              <button
                                className={`${
                                  selectedMenuItem === "Completed"
                                    ? "bg-orange-100 text-primary"
                                    : "hover:bg-orange-100 hover:text-primary"
                                } group flex w-full items-center gap-3 px-3.5 py-2`}
                                onClick={() => handleMenuItemClick("Completed")}
                              >
                                Completed
                              </button>
                            </Menu.Item> */}

                          <Menu.Item>
                            <button
                              className={`${
                                selectedMenuItem === "Pending"
                                  ? "bg-orange-100 text-primary"
                                  : "hover:bg-orange-100 hover:text-primary"
                              } group flex w-full items-center gap-3 px-3.5 py-2`}
                              onClick={() => handleMenuItemClick("Pending")}
                            >
                              Pending
                            </button>
                          </Menu.Item>

                          <Menu.Item>
                            <button
                              className={`${
                                selectedMenuItem === "Processing"
                                  ? "bg-orange-100 text-primary"
                                  : "hover:bg-orange-100 hover:text-primary"
                              } group flex w-full items-center gap-3 px-3.5 py-2`}
                              onClick={() => handleMenuItemClick("Processing")}
                            >
                              Processing
                            </button>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              className={`${
                                selectedMenuItem === "Shipped"
                                  ? "bg-orange-100 text-primary"
                                  : "hover:bg-orange-100 hover:text-primary"
                              } group flex w-full items-center gap-3 px-3.5 py-2`}
                              onClick={() => handleMenuItemClick("Shipped")}
                            >
                              Shipped
                            </button>
                          </Menu.Item>

                          <Menu.Item>
                            <button
                              className={`${
                                selectedMenuItem === "Delivered"
                                  ? "bg-orange-100 text-primary"
                                  : "hover:bg-orange-100 hover:text-primary"
                              } group flex w-full items-center gap-3 px-3.5 py-2`}
                              onClick={() => handleMenuItemClick("Delivered")}
                            >
                              Delivered
                            </button>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              className={`${
                                selectedMenuItem === "Abandoned"
                                  ? "bg-orange-100 text-primary"
                                  : "hover:bg-orange-100 hover:text-primary"
                              } group flex w-full items-center gap-3 px-3.5 py-2`}
                              onClick={() => handleMenuItemClick("Abandoned")}
                            >
                              Abandoned
                            </button>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              className={`${
                                selectedMenuItem === "Cancelled"
                                  ? "bg-orange-100 text-primary"
                                  : "hover:bg-orange-100 hover:text-primary"
                              } group flex w-full items-center gap-3 px-3.5 py-2`}
                              onClick={() =>
                                handleMenuItemClick("Cancel order")
                              }
                            >
                              Cancel order
                            </button>
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>

              <div>
                <div>
                  <Formik
                    initialValues={{
                      firstName: order.userInfo?.fname,
                      lastName: order.userInfo?.lname,
                      email: order.userInfo?.email,
                    }}
                    // onSubmit={async (values) => {
                    //   await new Promise((r) => setTimeout(r, 500));
                    //   alert(JSON.stringify(values, null, 2));
                    // }}
                  >
                    <Form>
                      {customer ? (
                        <div className="grid gap-4 md:gap-6  md:grid-cols-3 mb-6 ">
                          <div className="relative">
                            <div>
                              {" "}
                              <label
                                htmlFor="customerName"
                                className="text-base text-blue-950 pointer-events-none"
                              >
                                Customer Name
                              </label>
                            </div>
                            <div className="mt-3">
                              <Field
                                type="text"
                                name="customerName"
                                id="customerName"
                                placeholder={
                                  customer &&
                                  customer.firstName &&
                                  customer.lastName
                                    ? `${customer.firstName} ${customer.lastName}`
                                    : "Not added"
                                }
                                className="bg-orange-100 border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                              />
                              <ErrorMessage
                                name="customerName"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>

                          <div className="relative">
                            <div>
                              <label
                                htmlFor="customerEmailID"
                                className="text-base  text-blue-950 pointer-events-none"
                              >
                                Customer Email ID
                              </label>
                            </div>
                            <div className="mt-3 ">
                              {" "}
                              <Field
                                type="text"
                                name="customerEmailID"
                                id="customerEmailID"
                                placeholder={
                                  order?.userInfo?.email
                                    ? order?.userInfo?.email
                                    : "Not added"
                                }
                                className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                              />
                              <ErrorMessage
                                name="customerEmailID"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>

                          <div className="relative">
                            <div>
                              {" "}
                              <label
                                htmlFor="purchasedDate"
                                className="text-base  text-blue-950 pointer-events-none"
                              >
                                Purchased Date
                              </label>
                            </div>
                            <div className="mt-3">
                              {" "}
                              <Field
                                type="text"
                                name="purchasedDate"
                                id="purchasedDate"
                                placeholder={` ${
                                  order?.createdAt
                                    ? new Date(
                                        order?.createdAt
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                    : "-"
                                }`}
                                className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                              />
                              <ErrorMessage
                                name="purchasedDate"
                                component="p"
                                className="invalid"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </Form>
                  </Formik>
                </div>
              </div>

              <div className="max-w-full z-10 scrollbar overflow-y-visible overflow-x-scroll">
                <div className="h-full bg-white l z-20 rounded-md shadow shadow-slate-300">
                  <div className="">
                    <table className="border text-sm w-full table-fixed border-separate border-spacing-0 bg-orange-50 overflow-visible ">
                      <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                        <tr>
                          <th className="pl-7 py-4 pr-4 w-[150px] font-medium">
                            Product Image
                          </th>
                          <th className="px-5 font-medium w-[200px]">
                            Product Name
                          </th>
                          <th className=" px-5 font-medium w-[70px]">Qty</th>
                          <th className=" px-5  font-medium w-[200px]">
                            Download Product
                          </th>
                          <th className="px-5 font-medium w-[200px]">Status</th>
                          <th className=" px-5 font-medium w-[150px]">Price</th>
                          <th className=" px-5 font-medium w-[150px]">Total</th>
                          <th className=" px-5 font-medium w-[190px]">SKU</th>
                          <th className=" px-5 font-medium w-[250px]">
                            Personalized Note
                          </th>
                          {order?.filteredCart?.length > 0 &&
                          getAllVariations(order.filteredCart)?.length > 0
                            ? getAllVariations(order.filteredCart).map(
                                (variation, index) => (
                                  <th
                                    key={`${index}-${variation}`}
                                    className="font-medium w-[250px] capitalize"
                                  >
                                    {variation}
                                  </th>
                                )
                              )
                            : null}
                        </tr>
                      </thead>
                      <tbody>
                        {order?.filteredCart?.map((data, index) => (
                          <tr key={index}>
                            <td className="pl-7 py-4  text-blue-950">
                              {data?.productData?.images[0]?.imageUrl ? (
                                <Image
                                  src={getProductImage(data)}
                                  height={45}
                                  width={45}
                                  className="shrink-0 rounded-sm"
                                />
                              ) : (
                                <span>
                                  <FontAwesomeIcon
                                    icon={faImage}
                                    className="text-[45px] text-blue-950"
                                  />
                                </span>
                              )}
                            </td>
                            <td className="px-5 text-blue-950">
                              {data?.productData?.productName
                                ? data?.productData?.productName
                                : "-"}
                            </td>
                            <td className="px-5 text-blue-950">
                              {data?.orderQuantiy ? data?.orderQuantiy : "-"}
                            </td>
                            <td className="px-5 text-blue-950">
                              {data?.productData?.productType ===
                              "Downloadable" ? (
                                <a
                                  href={
                                    data?.productData?.downloadableLink
                                      ?.featuredProductUrl
                                  }
                                  target="_blank"
                                  className="text-orange-500 underline disabled:opacity-50"
                                  disabled={order?.status === "Cancelled"}
                                >
                                  Download
                                </a>
                              ) : (
                                "-"
                              )}
                            </td>
                            {showPopover && (
                              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900 px-4 bg-opacity-50">
                                <div className="border max-w-[890px] bg-orange-50 border-[#D8D8D8] relative">
                                  <div className="px-7 py-9">
                                    <button
                                      type="button"
                                      className="absolute top-4 right-4"
                                      onClick={handleClosePopover}
                                    >
                                      <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                    <h3 className="text-xl tex-blue-950 mb-7">
                                      Pickup Information
                                    </h3>
                                    <Formik
                                      validationSchema={validationSchema}
                                      initialValues={initialValues}
                                      onSubmit={onSubmit}
                                    >
                                      {({
                                        errors,
                                        setFieldValue,
                                        touched,
                                        submitCount,
                                      }) => (
                                        <Form className="st-form">
                                          {" "}
                                          <div className=" grid grid-cols-1 md:grid-cols-2  gap-4 mb-4">
                                            <div className="relative">
                                              <label htmlFor="contact_name">
                                                Full Name{" "}
                                                <span className="text-red-700 ">
                                                  *
                                                </span>
                                              </label>
                                              <Field
                                                type="text"
                                                name="contact_name"
                                                id="contact_name"
                                                placeholder="Eg. John"
                                              />
                                              <ErrorMessage
                                                name="contact_name"
                                                component="p"
                                                className="invalid"
                                              />
                                            </div>
                                            <div className="relative viewform">
                                              <label htmlFor="contact_phone_number">
                                                Contact No.{" "}
                                                <span className="text-red-700 ">
                                                  *
                                                </span>
                                              </label>
                                              <Field name="contact_phone_number">
                                                {({ field }) => (
                                                  <PhoneInput
                                                    country={`ca`}
                                                    countryCode={`ca`}
                                                    value={field.value}
                                                    onChange={(value) => {
                                                      // Split the phone number into country code and number parts
                                                      const countryCode = `+${value.slice(
                                                        0,
                                                        3
                                                      )}`; // Assuming country code is always the first two characters
                                                      const phoneNumber =
                                                        value.slice(3);
                                                      const fullPhoneNumber =
                                                        countryCode +
                                                        phoneNumber;

                                                      // Set the field value with country code as part of the extension
                                                      setFieldValue(
                                                        "contact_phone_number",
                                                        fullPhoneNumber
                                                      );
                                                      field.onChange(value);
                                                    }}
                                                    id="contact_phone_number"
                                                    name="contact_phone_number"
                                                    type="text"
                                                    inputProps={{
                                                      className: `${
                                                        errors.contact_phone_number &&
                                                        touched.contact_phone_number &&
                                                        submitCount > 0
                                                          ? "border-red-600"
                                                          : "border-slate-300"
                                                      }`,
                                                    }}
                                                  />
                                                )}
                                              </Field>
                                              <ErrorMessage
                                                name="contact_phone_number"
                                                component="p"
                                                className="invalid"
                                              />
                                            </div>
                                            <div className="relative">
                                              <label htmlFor="dispatch_details">
                                                Pick up date{" "}
                                                <span className="text-red-700 ">
                                                  *
                                                </span>
                                              </label>
                                              <Field
                                                type="date"
                                                name="dispatch_details"
                                                id="dispatch_details"
                                                placeholder="Pick a date"
                                                component={DatePickerComponent}
                                              />
                                              <ErrorMessage
                                                name="dispatch_details"
                                                component="p"
                                                className="invalid"
                                              />
                                            </div>

                                            <div className="col-span-1 grid gap-4  md:grid-cols-2">
                                              <div className="relative col-span-1">
                                                <label htmlFor="readyAt">
                                                  Ready At{" "}
                                                  <span className="text-red-700">
                                                    *
                                                  </span>
                                                </label>
                                                <div className="grid gap-2 grid-cols-2 ">
                                                  <div className="relative">
                                                    <Field
                                                      type="text"
                                                      name="readyAt.hour"
                                                      id="readyAtHour"
                                                      placeholder="Hour"
                                                    />
                                                    <ErrorMessage
                                                      name="readyAt.hour"
                                                      component="p"
                                                      className="absolute right-0 -top-4 text-xs text-red-500"
                                                    />
                                                  </div>
                                                  <div className="relative">
                                                    <Field
                                                      type="text"
                                                      name="readyAt.minute"
                                                      id="readyAtMinute:"
                                                      placeholder="Minute"
                                                    />
                                                    <ErrorMessage
                                                      name="readyAt.minute"
                                                      component="p"
                                                      className="absolute right-0 -top-4 text-xs text-red-500"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="relative col-span-1">
                                                <label htmlFor="readyUntil">
                                                  Ready Until{" "}
                                                  <span className="text-red-700">
                                                    *
                                                  </span>
                                                </label>
                                                <div className="grid gap-2 grid-cols-2">
                                                  <div className="relative">
                                                    <Field
                                                      type="text"
                                                      name="readyUntil.hour"
                                                      id="readyUntilHour"
                                                      placeholder="Hour"
                                                    />
                                                    <ErrorMessage
                                                      name="readyUntil.hour"
                                                      component="p"
                                                      className="absolute right-0 -top-4 text-xs text-red-500"
                                                    />
                                                  </div>
                                                  <div className="relative">
                                                    <Field
                                                      type="text"
                                                      name="readyUntil.minute"
                                                      id="readyUntilMinute"
                                                      placeholder="Minute"
                                                    />
                                                    <ErrorMessage
                                                      name="readyUntil.minute"
                                                      component="p"
                                                      className="absolute right-0 -top-4 text-xs text-red-500"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <button
                                            type="submit"
                                            className="buttonprimary"
                                          >
                                            Submit
                                          </button>
                                        </Form>
                                      )}
                                    </Formik>
                                  </div>
                                </div>
                              </div>
                            )}
                            <td>
                              {data?.productData?.productType !==
                              "Downloadable" ? (
                                <Menu as="div" className="relative">
                                  <div>
                                    <Menu.Button
                                      className={`flex items-center justify-center rounded-full ${
                                        data?.productData?.shippingStatus ===
                                          "Dispatch" ||
                                        data?.productData?.shippingStatus ===
                                          "Cancelled"
                                          ? "pointer-events-none" // Apply pointer-events: none if shipping status is "Dispatch"
                                          : data?.productData
                                              ?.shippingStatus === "Delivered"
                                          ? "bg-green-800 text-white"
                                          : data?.productData
                                              ?.shippingStatus === "Shipped"
                                          ? "bg-yellow-600 text-white"
                                          : data?.productData
                                              ?.shippingStatus ===
                                            "Cancel order"
                                          ? "bg-red-700 text-white"
                                          : data?.productData
                                              ?.shippingStatus === "Processing"
                                          ? "bg-sky-700 text-white"
                                          : data?.productData
                                              ?.shippingStatus === "Abandoned"
                                          ? "bg-orange-700 text-white"
                                          : data?.productData
                                              ?.shippingStatus === "Returned"
                                          ? "bg-purple-600 text-white"
                                          : data?.productData
                                              ?.shippingStatus === "Dispatch"
                                          ? "bg-violet-600 text-white"
                                          : "bg-gray-500 text-white"
                                      } cursor-pointer py-2.5 px-4 gap-2 rounded-sm text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center`}
                                    >
                                      {data?.productData?.shippingStatus
                                        ? data.productData.shippingStatus ===
                                          "OutforDelivery"
                                          ? "Out for Delivery"
                                          : data.productData.shippingStatus ===
                                            "Cancelled"
                                          ? "Cancel Order"
                                          : data.productData.shippingStatus ===
                                            "OnHold"
                                          ? "On Hold"
                                          : data.productData.shippingStatus ===
                                            "Dispatch"
                                          ? "Dispatched"
                                          : data.productData.shippingStatus
                                        : "-"}
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
                                    <Menu.Items className="absolute right-0 overflow-y-scroll -top-10 mt-2 w-40 origin-top-right rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                                      <div className="py-2 z-50 h-[100px]">
                                        <Menu.Item>
                                          <button
                                            className={`${
                                              data?.productData
                                                ?.shippingStatus ===
                                              "Processing"
                                                ? "bg-orange-100 text-primary"
                                                : "hover:bg-orange-100 hover:text-primary"
                                            } group flex w-full items-center gap-3 px-3.5 py-2`}
                                            onClick={() =>
                                              handleMenuItemClick(
                                                "Processing",
                                                order,
                                                data?.productData?._id
                                              )
                                            }
                                          >
                                            Processing
                                          </button>
                                        </Menu.Item>
                                        <Menu.Item>
                                          <button
                                            className={`${
                                              data?.productData
                                                ?.shippingStatus === "Dispatch"
                                                ? "bg-orange-100 text-primary"
                                                : "hover:bg-orange-100 hover:text-primary"
                                            } group flex w-full items-center gap-3 px-3.5 py-2`}
                                            onClick={() =>
                                              handleMenuItemClick(
                                                "Dispatch",
                                                order,
                                                data?.productData?._id
                                              )
                                            }
                                          >
                                            Dispatched
                                          </button>
                                        </Menu.Item>
                                        <Menu.Item>
                                          <button
                                            className={`${
                                              data?.productData
                                                ?.shippingStatus === "Returned"
                                                ? "bg-orange-100 text-primary"
                                                : "hover:bg-orange-100 hover:text-primary"
                                            } group flex w-full items-center gap-3 px-3.5 py-2`}
                                            onClick={() =>
                                              handleMenuItemClick(
                                                "Returned",
                                                order,
                                                data?.productData?._id
                                              )
                                            }
                                          >
                                            Returned
                                          </button>
                                        </Menu.Item>
                                        <Menu.Item>
                                          <button
                                            className={`${
                                              data?.productData
                                                ?.shippingStatus === "Cancelled"
                                                ? "bg-orange-100 text-primary"
                                                : "hover:bg-orange-100 hover:text-primary"
                                            } group flex w-full items-center gap-3 px-3.5 py-2`}
                                            onClick={() =>
                                              handleMenuItemClick(
                                                "Cancelled",
                                                order,
                                                data?.productData?._id
                                              )
                                            }
                                          >
                                            Cancelled
                                          </button>
                                        </Menu.Item>
                                      </div>
                                    </Menu.Items>
                                  </Transition>
                                </Menu>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="px-5 text-blue-950">
                              {data?.basePrice
                                ? `CAD ${parseFloat(
                                    calculateItemPrice(data, order, false, true)
                                  ).toFixed(2)}`
                                : "-"}
                            </td>
                            <td className="px-5 text-blue-950">
                              {data?.totalAmount
                                ? `CAD ${parseFloat(
                                    calculateItemTotalPrice(data, order, false, true)
                                  ).toFixed(2)}`
                                : "-"}
                            </td>
                            <td className="px-5 text-blue-950">
                              {data?.productData?.sku
                                ? data?.productData?.sku
                                : "-"}
                            </td>
                            <td className="px-5 text-blue-950">
                              {data?.remark ? data?.remark : "-"}
                            </td>
                            {data?.selectedVariations?.map(
                              (variation, vIndex) => (
                                <td key={vIndex}>
                                  {variation.attributeValue
                                    ? variation.attributeValue
                                    : "-"}
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {foundShipment && foundShipment.shipmentId ? (
                <div className="flex gap-5 align-center justify-start mt-3">
                  <button
                    onClick={() => onDownload(foundShipment?.shipmentId)}
                    className="buttonprimary disabled:opacity-30 text-[13px] md:w-[168px] md:text-[14px]"
                    disabled={order?.status === "Cancelled"}
                  >
                    Shipping Label
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePopoverAndCallApi(foundShipment)}
                    className="buttonprimary disabled:opacity-30 md:w-[168px] text-[13px] md:text-[14px]"
                    disabled={order?.status === "Cancelled"}
                  >
                    Schedule Pick Up
                  </button>
                </div>
              ) : (
                ""
              )}
              {foundShipment && foundShipment?.consignment?.length ? (
                <div className="flex gap-5 align-center justify-start mt-3">
                  <button
                    onClick={() => exportPDF(foundShipment?.consignment, 0)}
                    className="buttonprimary disabled:opacity-30 text-[13px] md:w-[168px] md:text-[14px]"
                    disabled={order?.status === "Cancelled"}
                  >
                    Shipping Label
                  </button>
                    {foundShipment?.consignment?.[0]?.extra_label ? (
                      <button
                        onClick={() => exportPDF(foundShipment?.consignment, 1)}
                        className="buttonprimary disabled:opacity-30 text-[13px] md:w-[168px] md:text-[14px]"
                        disabled={order?.status === "Cancelled"}
                      >
                        Invoice
                      </button>
                    ) : ""}
                  {foundShipment?.consignment?.shipmentId ? (
                    <button
                      type="button"
                      onClick={() => togglePopoverAndDhlApi(foundShipment)}
                      className="buttonprimary disabled:opacity-30 md:w-[168px] text-[13px] md:text-[14px]"
                      disabled={order?.status === "Cancelled"}
                    >
                      Schedule Pick Up
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}

              {foundShipment && foundShipment.NGShipping ? (
                <div className="flex gap-5 align-center justify-start mt-3">
                  <button
                    onClick={() => downloadShippingLabel(order)}
                    className="buttonprimary disabled:opacity-30 text-[13px] md:w-[168px] md:text-[14px]"
                    disabled={order?.status === "Cancelled"}
                  >
                    Shipping Label
                  </button>
                </div>
              ) : (
                ""
              )}

              <div className="mt-8">
                <Formik
                  initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                  }}
                >
                  <Form>
                    <div className="relative mb-6">
                      <div>
                        {" "}
                        <div className="flex items-center gap-[17px]">
                          <label
                            htmlFor="shippingInformation"
                            className="text-xl text-blue-950 pointer-events-none"
                          >
                            Shipping Information
                          </label>
                          <FontAwesomeIcon
                            icon={faCircleInfo}
                            className="h-4 w-4 fill-slate-600 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid md:gap-6 gap-4 md:grid-cols-3 mb-6">
                      {" "}
                      <div className="relative">
                        <div>
                          {" "}
                          <label
                            htmlFor="customerName"
                            className="text-base text-blue-950 pointer-events-none"
                          >
                            Name
                          </label>
                        </div>
                        <div className="mt-3">
                          <Field
                            type="text"
                            name="shippingInformation"
                            id="shippingInformation"
                            value={
                              order.userInfo?.firstName &&
                              order.userInfo?.lastName
                                ? `${order.userInfo.firstName} ${order.userInfo.lastName}`
                                : `${order.userInfo.name}`
                            }
                            className="bg-orange-100 border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <div>
                          <label
                            htmlFor="customerEmailID"
                            className="text-base  text-blue-950 pointer-events-none"
                          >
                            Country
                          </label>
                        </div>
                        <div className="mt-3 ">
                          {" "}
                          <Field
                            type="text"
                            name="shippingInformation"
                            id="shippingInformation"
                            value={
                              order.userInfo?.country
                                ? order.userInfo.country
                                : "Not added"
                            }
                            className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <div>
                          <label
                            htmlFor="customerEmailID"
                            className="text-base  text-blue-950 pointer-events-none"
                          >
                            State/Province
                          </label>
                        </div>
                        <div className="mt-3 ">
                          {" "}
                          <Field
                            type="text"
                            name="shippingInformation"
                            id="shippingInformation"
                            value={
                              order.userInfo?.state
                                ? order.userInfo.state
                                : "Not added"
                            }
                            className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <div>
                          <label
                            htmlFor="customerEmailID"
                            className="text-base  text-blue-950 pointer-events-none"
                          >
                            City
                          </label>
                        </div>
                        <div className="mt-3 ">
                          {" "}
                          <Field
                            type="text"
                            name="shippingInformation"
                            id="shippingInformation"
                            value={
                              order.userInfo?.city
                                ? order.userInfo.city
                                : "Not added"
                            }
                            className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <div>
                          <label
                            htmlFor="customerEmailID"
                            className="text-base  text-blue-950 pointer-events-none"
                          >
                            Zip/Postal Code
                          </label>
                        </div>
                        <div className="mt-3 ">
                          {" "}
                          <Field
                            type="text"
                            name="shippingInformation"
                            id="shippingInformation"
                            value={
                              order.userInfo?.ZipCode
                                ? order.userInfo.ZipCode
                                : "Not added"
                            }
                            className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                          />
                        </div>
                      </div>
                      <div className="relative ">
                        <div>
                          <label
                            htmlFor="customerEmailID"
                            className="text-base  text-blue-950 pointer-events-none"
                          >
                            Street Address
                          </label>
                        </div>
                        <div className="mt-3 ">
                          {" "}
                          <Field
                            type="text"
                            name="shippingInformation"
                            id="shippingInformation"
                            value={
                              order.userInfo?.streetAddress
                                ? order.userInfo.streetAddress
                                : "Not added"
                            }
                            className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-8">
                      <div>
                        <div className="flex item6-center gap-[17px] mb-6">
                          <label
                            htmlFor="billingInformation"
                            className="text-xl  text-blue-950 pointer-events-none"
                          >
                            Billing Information
                          </label>
                          <FontAwesomeIcon
                            icon={faCircleInfo}
                            className="h-4 w-4 fill-slate-600 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="grid md:gap-6 gap-4 md:grid-cols-3 mb-6">
                        {" "}
                        <div className="relative">
                          <div>
                            {" "}
                            <label
                              htmlFor="customerName"
                              className="text-base text-blue-950 pointer-events-none"
                            >
                              Customer Name
                            </label>
                          </div>
                          <div className="mt-3">
                            <Field
                              type="text"
                              name="shippingInformation"
                              id="shippingInformation"
                              placeholder={`${order.billing_address?.name?.given_name} ${order.billing_address?.name?.surname}`}
                              className="bg-orange-100 border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                            />
                          </div>
                        </div>
                        <div className="relative">
                          <div>
                            <label
                              htmlFor="customerEmailID"
                              className="text-base  text-blue-950 pointer-events-none"
                            >
                              Customer Email ID
                            </label>
                          </div>
                          <div className="mt-3 ">
                            {" "}
                            <Field
                              type="text"
                              name="shippingInformation"
                              id="shippingInformation"
                              placeholder={
                                order.billing_address?.email_address
                                  ? ` ${order.billing_address?.email_address}`
                                  : "Not added"
                              }
                              className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                            />
                          </div>
                        </div>
                        <div className="relative">
                          <div>
                            <label
                              htmlFor="customerEmailID"
                              className="text-base  text-blue-950 pointer-events-none"
                            >
                              Country
                            </label>
                          </div>
                          <div className="mt-3 ">
                            {" "}
                            <Field
                              type="text"
                              name="shippingInformation"
                              id="shippingInformation"
                              placeholder={
                                order.billing_address?.address?.country_code
                                  ? order.billing_address?.address?.country_code
                                  : "Not added"
                              }
                              className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
              <div className="">
                <button
                  className={` flex gap-2 items-center text-primary `}
                  onClick={handleBack}
                >
                  <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" />{" "}
                  Back
                </button>
              </div>
            </div>
          )}
        </>
      </Layout>
    </>
  );
};

export default CustomerOrderView;
