import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
import {
  calculateItemPrice,
  calculateItemsTotalPrice,
  calculateItemTotalPrice,
  calculateShippingRate,
} from "@/utils/pricingUtils";
import { faCircleInfo, faImage } from "@fortawesome/pro-light-svg-icons";
import { faAngleLeft } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

//const noto = Noto_Serif({ subsets: ["latin"] });

const AdminOrderManagementView = (id) => {
  const [order, setOrder] = useState([]);
  const [customer, setCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getData = (id) => {
    setLoading(true);

    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${id}`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setOrder(response.data);
        setSelectedMenuItem(response.data.status);
        readUser(response.data);
      })
      .catch(function (error) {
        console.error(error);
      })
      .finally(function () {
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

  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
  }, [router?.query]);

  const handleBack = () => {
    router.back();
  };

  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [selectedMenuItem1, setSelectedMenuItem1] = useState("Completed");

  const handleMenuItemClick = (menuItem, id) => {
    setSelectedMenuItem(menuItem);
    const options = {
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/update/status/${order?._id}`,
      data: {
        status: menuItem,
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

  const MenuItemClick = (status, order, productId) => {
    const orderId = order._id;
    const options = {
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}/products/${productId}/shipping`,
      data: {
        shippingStatus: status,
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
        getData(orderId);
      })
      .catch(function (error) {
        console.error(error);
        toast.error("Something Went Wrong");
      });
  };

  const payShipmentPayment = () => {
    const orderId = order._id;
    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/payShipment`,
      data: {
        id: order?.cart?.[0]?.consignment?.[0]?.shipmentId,
        orderId: orderId
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
        toast.success(response?.data?.message);
        getData(orderId);
      })
      .catch(function (error) {
        console.error(error);
        toast.error(error.response.data.message ||"Something Went Wrong");
      });
  };

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
  
    const foundShipment = order?.cart?.find(
      (shipment) =>
        shipment.shipmentId || shipment.consignment || shipment.NGShipping
    );

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
        <>
          {loading ? (
            <p>Loading...</p> // You can replace this with a loading spinner or any other UI component
          ) : (
            <div className="pb-[76px]">
              <div className="flex justify-between items-center mb-12">
                <h1
                  className={`md:text-2xl text-1xl text-blue-950 font-medium mb-2 noto-font `}
                >
                  Order View <span className="hidden md:inline">| </span>
                  <span className="md:text-lg text-xs"> {order?._id ? `AM${order?._id.substring(0, 6).toUpperCase()}` : "-"}</span>
                </h1>
                <div className="flex items-center justify-end gap-4">
                {order?.cart?.[0]?.consignment?.[0]?.shipmentId &&
                <button
                onClick={payShipmentPayment}
                className={`dashboard-button-primary ${
                  order?.cart?.[0]?.consignment?.[0]?.paymentPaid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={order?.cart?.[0]?.consignment?.[0]?.paymentPaid}
                >
                  Pay Shipment
                </button>
                }
                  <Menu as="div" className="relative ">
                    <div>
                      <Menu.Button
                        className={`flex items-center justify-center rounded-full ${
                          selectedMenuItem === "Delivered"
                            ? "bg-green-800 text-white"
                            : selectedMenuItem === "Shipped"
                            ? "bg-yellow-600 text-white"
                            : selectedMenuItem === "Cancelled"
                            ? "bg-red-700 text-white"
                            : selectedMenuItem === "Processing"
                            ? "bg-sky-700 text-white"
                            : selectedMenuItem === "Returned"
                            ? "bg-orange-700 text-white"
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
                                selectedMenuItem === "Returned"
                                  ? "bg-orange-100 text-primary"
                                  : "hover:bg-orange-100 hover:text-primary"
                              } group flex w-full items-center gap-3 px-3.5 py-2`}
                              onClick={() => handleMenuItemClick("Returned")}
                            >
                              Returned
                            </button>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              className={`${
                                selectedMenuItem === "Cancelled"
                                  ? "bg-orange-100 text-primary"
                                  : "hover:bg-orange-100 hover:text-primary"
                              } group flex w-full items-center gap-3 px-3.5 py-2`}
                              onClick={() => handleMenuItemClick("Cancelled")}
                            >
                              Cancelled
                            </button>
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>

              <div>
                <Formik
                  initialValues={{
                    firstName: order.userInfo?.fname,
                    lastName: order.userInfo?.lname,
                    email: order.userInfo?.email,
                  }}
                  onSubmit={async (values) => {
                    await new Promise((r) => setTimeout(r, 500));
                    alert(JSON.stringify(values, null, 2));
                  }}
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

              <div className="w-auto overflow-auto bg-white rounded-md border border-[#4755694D] mt-6 ">
                <table className="text-sm w-full table-fixed border-separate overflow-visible border-spacing-0 bg-orange-50 ">
                  <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                    <tr>
                      <th className="pl-7 py-5 pr-16 w-[200px]">
                        Product Image
                      </th>
                      <th className=" px-5  w-[250px]">Product Name</th>
                      <th className=" px-5  w-[150px]">Price</th>
                      <th className=" px-5  w-[100px]">Quantity</th>
                      <th className=" px-5  w-[150px]">Total</th>
                      <th className=" px-5 w-[100px]">Seller ID</th>
                      <th className=" px-5 w-[200px]">Seller Name</th>
                      <th className=" px-5 w-[240px]">Personalized Note</th>
                      <th className=" px-5  font-medium w-[200px]">
                        Download Product
                      </th>
                      <th className=" px-5 w-[200px]">Payment Status</th>
                      <th className=" px-5 w-[300px]">Delivery Status</th>
                      {order?.cart?.length > 0 &&
                      getAllVariations(order.cart)?.length > 0
                        ? getAllVariations(order.cart).map(
                            (variation, index) => (
                              <th
                                key={`${index}-${variation}`}
                                className="w-[250px] capitalize"
                              >
                                {variation}
                              </th>
                            )
                          )
                        : null}
                    </tr>
                  </thead>
                  <tbody>
                    {order?.cart?.map((data, index) => (
                      <tr key={index}>
                        <td className="pl-7 py-4 text-blue-950">
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
                          {data?.basePrice
                            ? `CAD ${parseFloat(
                                calculateItemPrice(data, order, false)
                              ).toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-5 text-blue-950">
                          {data?.orderQuantiy ? data?.orderQuantiy : "-"}
                        </td>
                        <td className="px-5 text-blue-950">
                          {data?.totalAmount
                            ? `CAD ${parseFloat(
                                calculateItemTotalPrice(data, order, false)
                              ).toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-5 text-blue-950">
                          {" "}
                          {data?.productData?.seller?.uuid
                            ? data?.productData?.seller?.uuid
                            : "-"}
                        </td>
                        <td className="px-5 text-blue-950">
                          {data?.productData?.seller?.firstName ||
                          data?.productData?.seller?.lastName
                            ? `${data?.productData?.seller?.firstName || ""} ${
                                data?.productData?.seller?.lastName || ""
                              }`
                            : "-"}
                        </td>
                        <td className="px-5">
                          {data?.remark ? data?.remark : "-"}
                        </td>
                        <td className="px-5 text-blue-950">
                          {data?.productData?.productType === "Downloadable" ? (
                            <a
                              href={
                                data?.productData?.downloadableLink
                                  ?.featuredProductUrl
                              }
                              target="_blank"
                              className="text-orange-500 underline"
                            >
                              Download
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        {/* <td className="text-green-800 font-semibold">Completed</td> */}
                        <td className="px-5">
                          <div
                            className={`flex items-center justify-center rounded-full ${
                              order?.paymentStatus === "PaymentDone"
                                ? "bg-green-800 text-white"
                                : order?.paymentStatus === "PaymentPending"
                                ? "bg-gray-500 text-white"
                                : "bg-gray-500 text-white"
                            } cursor-pointer py-2.5 px-4 gap-2 rounded-sm text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center`}
                          >
                            {order?.paymentStatus === "PaymentDone"
                              ? "Done"
                              : order?.paymentStatus === "PaymentPending"
                              ? "Pending"
                              : "-"}
                          </div>
                        </td>
                        <td className="px-5">
                          {data?.productData?.productType !== "Downloadable" ? (
                            <Menu as="div" className="relative ">
                              <div>
                                <Menu.Button
                                  className={`flex items-center justify-center rounded-full ${
                                    data?.productData?.shippingStatus ===
                                    "Processing"
                                      ? "bg-sky-700 text-white"
                                      : data?.productData?.shippingStatus ===
                                        "Shipped"
                                      ? "bg-yellow-600 text-white"
                                      : data?.productData?.shippingStatus ===
                                        "Dispatch"
                                      ? "bg-violet-600 text-white"
                                      : data?.productData?.shippingStatus ===
                                        "Delivered"
                                      ? "bg-green-800 text-white"
                                      : data?.productData?.shippingStatus ===
                                        "Cancel order"
                                      ? "bg-red-700 text-white"
                                      : data?.productData?.shippingStatus ===
                                        "Abandoned"
                                      ? "bg-orange-700 text-white"
                                      : data?.productData?.shippingStatus ===
                                        "Returned"
                                      ? "bg-purple-600 text-white"
                                      : data?.productData?.shippingStatus ===
                                        "Cancelled"
                                      ? "bg-red-600 text-white"
                                      : "bg-gray-500 text-white"
                                  } cursor-pointer py-2.5 px-4 gap-2 rounded-sm text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center`}
                                >
                                  {data?.productData?.shippingStatus
                                    ? data.productData.shippingStatus ===
                                      "OutforDelivery"
                                      ? "Out for Delivery"
                                      : data.productData.shippingStatus ===
                                        "Cancelled"
                                      ? "Cancelled"
                                      : data.productData.shippingStatus ===
                                        "OnHold"
                                      ? "On Hold"
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
                                <Menu.Items className="absolute right-0 overflow-y-scroll -top-10 mt-2 w-40 origin-top-right  bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                                  <div className="py-2 h-[100px]">
                                    <Menu.Item>
                                      <button
                                        className={`${
                                          selectedMenuItem1 === "Processing"
                                            ? "bg-orange-100 text-primary"
                                            : "hover:bg-orange-100 hover:text-primary"
                                        } group flex w-full items-center gap-3 px-3.5 py-2`}
                                        onClick={() =>
                                          MenuItemClick(
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
                                          selectedMenuItem1 === "Dispatch"
                                            ? "bg-orange-100 text-primary"
                                            : "hover:bg-orange-100 hover:text-primary"
                                        } group flex w-full items-center gap-3 px-3.5 py-2`}
                                        onClick={() =>
                                          MenuItemClick(
                                            "Dispatch",
                                            order,
                                            data?.productData?._id
                                          )
                                        }
                                      >
                                        Dispatch
                                      </button>
                                    </Menu.Item>
                                    <Menu.Item>
                                      <button
                                        className={`${
                                          selectedMenuItem1 === "Returned"
                                            ? "bg-orange-100 text-primary"
                                            : "hover:bg-orange-100 hover:text-primary"
                                        } group flex w-full items-center gap-3 px-3.5 py-2`}
                                        onClick={() =>
                                          MenuItemClick(
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
                                          selectedMenuItem1 === "Cancelled"
                                            ? "bg-orange-100 text-primary"
                                            : "hover:bg-orange-100 hover:text-primary"
                                        } group flex w-full items-center gap-3 px-3.5 py-2`}
                                        onClick={() =>
                                          MenuItemClick(
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

                        {data?.selectedVariations?.map((variation, vIndex) => (
                          <td key={vIndex}>
                            {variation.attributeValue
                              ? variation.attributeValue
                              : "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                </div>
              ) : (
                ""
              )}

              {foundShipment && foundShipment?.consignment?.length ? (
                  <div className="flex gap-2 mt-3">
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

              <p className="text-base text-blue-950 mt-6 mb-3">
                Payment Details
              </p>

              <div className="p-5 max-w-[392px] bg-orange-100 border rounded">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-blue-950">Item(s) total</p>
                  <p className="text-sm text-blue-950">
                    {order?.subTotal ? `CAD ${calculateItemsTotalPrice(order, false, false)?.toFixed(2)}` : "-"}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-blue-950">Service fees</p>
                  <p className="text-sm text-blue-950">
                    {order?.serviceFees
                      ? `CAD ${order.serviceFees.toFixed(2)}`
                      : "-"}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-3.5 pb-3.5 border-b  ">
                  <p className="text-sm text-blue-950">Shipping charges</p>
                  <p className="text-sm text-blue-950">
                  {order?.cart
                  ? (() => {
                      // Filter unique shipmentId and ignore negative shippingRate
                      let totalShipping = order.cart
                        .filter(
                          (value, index, self) =>
                            index === self.findIndex((t) => t.productData?.seller?._id === value.productData?.seller?._id) &&
                            value.shippingRate > 0 // Ignore negative shippingRate
                        )
                        .reduce((total, item) => total + (item.shippingRate || 0), 0);
                        if(order.conversionRate && order.conversionRate > 0) {
                          totalShipping = totalShipping / order.conversionRate;
                        }
                      return totalShipping > 0 ? `CAD ${totalShipping.toFixed(2)}` : "0.00";
                    })()
                  : "-"}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <p className="text-base font-medium text-blue-950">Total</p>
                  <p className="text-base font-medium text-blue-950">
                    {order.cart.some(
                      (item) =>
                        item.productData.seller?.shippingConfigId?.international
                          .afoma_shipping &&
                        item?.productData?.seller?.country !=
                          order.userInfo?.country
                    ) && (
                      <div className="relative inline-block group">
                        <span className="cursor-pointer text-blue-600">ℹ️</span>
                        <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs rounded py-2 px-4 z-10 top-full left-1/2 transform -translate-x-1/2 mt-1 w-max text-center">
                          Shipping surcharge is applied
                          <br />
                          to the base product price.
                        </div>
                      </div>
                    )}{" "}
                    {order?.order_price
                      ? `CAD ${(Number(calculateItemsTotalPrice(order,false,false).toFixed(2)) + Number(order.serviceFees?.toFixed(2)) + Number(calculateShippingRate(order)?.toFixed(2)))?.toFixed(2)}`
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Formik>
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
                            placeholder={
                              order.userInfo?.firstName &&
                              order.userInfo?.lastName
                                ? `${order.userInfo?.name} ${order.userInfo?.lastName}`
                                : `${order.userInfo?.name}`
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
                            placeholder={
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
                            placeholder={
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
                            placeholder={
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
                            placeholder={
                              order.userInfo?.ZipCode
                                ? order.userInfo.ZipCode
                                : "Not added"
                            }
                            className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="relative col-span-3">
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
                          placeholder={
                            order.userInfo?.streetAddress
                              ? order.userInfo.streetAddress
                              : "Not added"
                          }
                          className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded pointer-events-none"
                        />
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

export default AdminOrderManagementView;
