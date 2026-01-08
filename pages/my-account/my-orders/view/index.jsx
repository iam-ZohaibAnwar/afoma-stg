import dynamic from "next/dynamic";

// Lazy load heavy components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const MyAccountSidebar = dynamic(() => import("@/components/MyAccountSidebar"), { ssr: false });
const ConfirmModal = dynamic(() => import("@/components/ConfirmModal"), { ssr: false });
const ReviewModal = dynamic(() => import("@/components/ReviewModal"), { ssr: false });
import {
  calculateItemPrice,
  calculateItemTotalPrice,
} from "@/utils/pricingUtils";
import { faCircleInfo } from "@fortawesome/pro-light-svg-icons";
import {
  faAngleLeft,
  faAngleRight,
  faImage,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

//const noto = Noto_Serif({ subsets: ["latin"] });

const CustomerOrderView = ({ cart, addToCart }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [existingReview, setExistingReview] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };
  const [order, setOrder] = useState([]);
  const [product, setProduct] = useState(undefined);
  const [productId, setProductId] = useState(undefined);
  const [sellerId, setSellerId] = useState(undefined);
  const [customer, setCustomer] = useState(null);
  const router = useRouter();

  const getData = (id) => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${id}`,
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
        setOrder(response.data);
        setSelectedMenuItem(response.data.status);
        readUser(response.data);
        // getReview(response.data);
      })
      .catch(function (error) {
        console.error(error);
      })
      .finally(() => {
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

  const hasDownloadableProduct = order?.cart?.some(
    (data) => data?.productData?.productType === "downloadable"
  );

  const cancelOrder = () => {
    setIsConfirmModalOpen(false);
    setCancelLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const options = {
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/shipping/cancel-shipment/${order._id}`,
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
          toast.success("Order cancelled successfully");
          setCancelLoading(false);
          router.push("/my-account/my-orders");
        })
        .catch(function (error) {
          setCancelLoading(false);
          if (error.response.data && error.response.data.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error("Server error.");
          }
        })
        .finally(() => {
          setCancelLoading(false);
        });
    } catch (e) {
      setCancelLoading(false);
    }
  };

  const [cancelLoading, setCancelLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const openWriteReviewModal = async (data) => {
    if (data && data.productData._id) {
      setProduct(data);
      setProductId(data.productData._id);
      setSellerId(data.productData.seller._id);
      const userData = JSON.parse(localStorage.getItem("user"));
      setReviewLoading(true);
      let options = {};
      if (
        data.productData.productType === "Customizable" &&
        data.selectedVariations &&
        data.selectedVariations.length
      ) {
        const selectedVariantId = data.selectedVariations
          .map((variation) => variation.attributeValue.replace(/\s+/g, ""))
          .join("_");
        options = {
          method: "GET",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/single/customized/${data.productData._id}/variation/${data.productData._id}_${selectedVariantId}`,
          headers: {
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        };
      } else {
        options = {
          method: "GET",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/single/${data.productData._id}`,
          headers: {
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        };
      }

      axios
        .create({
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        })
        .request(options)
        .then(function (response) {
          if (response && response.data && response.data.length) {
            const review = response.data.find(
              (rev) => userData.userId === rev.UserId
            );
            setExistingReview(review ? review : {});
          } else {
            setExistingReview({});
          }
        })
        .catch(function (error) {
          setReviewLoading(false);
          console.error(error);
        })
        .finally(() => {
          setReviewLoading(false);
          setReviewModalOpen(true);
        });
    }
  };

  const handleCloseWriteReviewModal = () => {
    setReviewModalOpen(false);
  };

  const handleReviewSubmit = (reviewData) => {
    if (reviewData && sellerId && productId && product) {
      setReviewLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      let variationId = "";
      if (
        product.productData.productType === "Customizable" &&
        product.selectedVariations &&
        product.selectedVariations.length
      ) {
        const selectedVariantId = product.selectedVariations
          .map((variation) => variation.attributeValue.replace(/\s+/g, ""))
          .join("_");
        variationId = `${product.productData._id}_${selectedVariantId}`;
      }
      if (reviewData && reviewData.id) {
        const options = {
          method: "PUT",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/${reviewData.id}`,
          data: {
            variationId: variationId,
            productId: productId,
            sellerId: sellerId,
            UserId: userData?.userId,
            value: reviewData?.valueRating,
            quality: reviewData?.qualityRating,
            price: reviewData?.priceRating,
            reviewText: reviewData.comment,
            title: reviewData.heading,
          },
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
            if (response && response.data && response.data._id) {
              updateStatus(response.data);
              toast.success("Review updated successfully!");
            }
            setReviewLoading(false);
          })
          .catch(function (error) {
            setReviewLoading(false);
            if (error.response.data && error.response.data.error) {
              toast.error(error.response.data.error);
            } else {
              toast.error("Server error.");
            }
          })
          .finally(() => {
            setReviewLoading(false);
          });
      } else {
        const options = {
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/`,
          data: {
            variationId: variationId,
            productId: productId,
            UserId: userData?.userId,
            sellerId: sellerId,
            value: reviewData?.valueRating,
            quality: reviewData?.qualityRating,
            price: reviewData?.priceRating,
            reviewText: reviewData.comment,
            title: reviewData.heading,
          },
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
            if (response && response.data && response.data._id) {
              updateStatus(response.data);
              toast.success("Review posted successfully!");
            }
            setReviewLoading(false);
          })
          .catch(function (error) {
            setReviewLoading(false);
            if (error.response.data && error.response.data.error) {
              toast.error(error.response.data.error);
            } else {
              toast.error("Server error.");
            }
          })
          .finally(() => {
            setReviewLoading(false);
          });
      }
    }
  };

  const updateStatus = (review) => {
    setReviewLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const options = {
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/${review._id}/update-status`,
        data: {
          newStatus: "Approved",
        },
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
          if (response && response.data && response.data._id) {
          }
          setReviewLoading(false);
        })
        .catch(function (error) {
          setReviewLoading(false);
        })
        .finally(() => {
          setReviewLoading(false);
        });
    } catch (e) {
      setReviewLoading(false);
    }
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

  return (
    <>
      <section>
        <Header cart={cart} addToCart={addToCart} />
      </section>
      <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mt-4 mb-4 lg:mt-6 lg:mb-6 max-w-screen-xl mx-auto px-4">
        <Link href="/">Home</Link>
        <FontAwesomeIcon icon={faAngleRight} size="sm" />
        <Link href="/my-account/account-details" className="text-primary">
          My account
        </Link>
      </div>

      <div className="max-w-screen-xl mx-auto lg:grid lg:grid-cols-6 gap-4 md:gap-6 px-4 mb-10">
        <div className="col-span-2">
          <MyAccountSidebar />
        </div>
        <div className="col-span-4">
          <div className="p-4 md:p-6 rounded bg-orange-100">
            {loading ? (
              <p>Loading...</p> // You can replace this with a loading spinner or any other UI component
            ) : (
              <div className="pb-[76px]">
                <div className="flex justify-end md:justify-between flex-col md:flex-row md:items-center mb-6">
                  <h1
                    className={`text-xl md:text-2xl text-blue-950 font-medium mb-2 noto-font `}
                  >
                    Order View |<span className="text-lg">{order?._id}</span>
                  </h1>
                  <div className="flex gap-3">
                    <button
                      className="px-4 rounded py-2 bg-red-600 text-white disabled:opacity-40"
                      onClick={setIsConfirmModalOpen}
                      disabled={
                        cancelLoading ||
                        order.status == "Cancelled" ||
                        order.status == "Shipped"
                      }
                    >
                      Cancel
                    </button>
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
                </div>
                <div className="w-full scrollbar overflow-auto bg-white rounded-md shadow shadow-slate-300 mt-6">
                  <table className="text-sm w-full table-fixed border-separate border-spacing-0 bg-orange-50 ">
                    <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                      <tr>
                        <th className="py-3 px-4 font-medium w-[150px]">
                          Action
                        </th>
                        <th className="py-3 px-4 w-[150px] font-medium">
                          Product Image
                        </th>
                        <th className="py-3 px-4 font-medium w-[200px]">
                          Download Product
                        </th>
                        <th className="py-3 px-4 font-medium w-[250px]">
                          Product Name
                        </th>
                        <th className="py-3 px-4 font-medium w-[150px]">
                          Price
                        </th>
                        <th className="py-3 px-4 font-medium w-[100px]">Qty</th>
                        <th className="py-3 px-4 font-medium w-[150px]">
                          Total
                        </th>
                        <th className="py-3 px-4 font-medium w-[150px]">
                          Seller ID
                        </th>
                        <th className="py-3 px-4 font-medium w-[200px]">
                          Seller Name
                        </th>
                        <th className="py-3 px-4 font-medium w-[230px]">SKU</th>

                        <th className="py-3 px-4 font-medium w-[250px]">
                          Personalized Note
                        </th>
                        <th className="py-3 px-4 font-medium w-[200px]">
                          Delivery Status
                        </th>
                        {order?.cart?.length > 0 &&
                        getAllVariations(order.cart)?.length > 0
                          ? getAllVariations(order.cart).map(
                              (variation, index) => (
                                <th
                                  key={`${index}-${variation}`}
                                  className="py-3 px-4 font-medium w-[250px] capitalize"
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
                          <td className="py-3 px-4">
                            <button
                              className="px-4 rounded py-2 bg-primary text-white disabled:opacity-40"
                              onClick={() => {
                                openWriteReviewModal(data);
                              }}
                              disabled={cancelLoading || reviewLoading}
                            >
                              Write Review
                            </button>
                          </td>
                          <td className="py-3 px-4 text-blue-950">
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
                          <td className="py-3 px-4 text-blue-950">
                            {data?.productData?.productType ===
                            "Downloadable" ? (
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
                          <td className="py-3 px-4 text-blue-950">
                            {data?.productData?.productName
                              ? data?.productData?.productName
                              : "-"}
                          </td>

                          <td className="py-3 px-4 text-blue-950">
                            {data?.basePrice
                              ? `${order.currency || "CAD"} ${parseFloat(
                                  calculateItemPrice(data, order)
                                ).toFixed(2)}`
                              : "-"}
                          </td>

                          <td className="py-3 px-4 text-blue-950">
                            {data?.orderQuantiy ? data?.orderQuantiy : "-"}
                          </td>
                          <td className="py-3 px-4 text-blue-950">
                            {data?.totalAmount
                              ? `${order.currency || "CAD"} ${parseFloat(
                                  calculateItemTotalPrice(data, order)
                                ).toFixed(2)}`
                              : "-"}
                          </td>

                          <td className="py-3 px-4 text-blue-950">
                            {" "}
                            {data?.productData?.seller?.uuid
                              ? data?.productData?.seller?.uuid
                              : "-"}
                          </td>
                          <td className="py-3 px-4 text-blue-950">
                            {data?.productData?.seller?.firstName ||
                            data?.productData?.seller?.lastName
                              ? `${
                                  data?.productData?.seller?.firstName || ""
                                } ${data?.productData?.seller?.lastName || ""}`
                              : "-"}
                          </td>

                          <td className="py-3 px-4 text-blue-950">
                            {data?.productData?.sku
                              ? data?.productData?.sku
                              : "-"}
                          </td>
                          <td className="py-3 px-4 text-blue-950">
                            {data?.remark ? data?.remark : "-"}
                          </td>
                          <td className="py-3 px-4">
                            {" "}
                            <Menu
                              as="div"
                              className="relative pointer-events-none"
                            >
                              <div>
                                <Menu.Button
                                  className={`flex items-center justify-center rounded-full ${
                                    selectedMenuItem === "Completed"
                                      ? "bg-green-800 text-white"
                                      : selectedMenuItem === "Shipped"
                                      ? "bg-yellow-600 text-white"
                                      : selectedMenuItem === "Cancel order"
                                      ? "bg-red-700 text-white"
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
                                        onClick={() =>
                                          handleMenuItemClick("Pending")
                                        }
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
                                        onClick={() =>
                                          handleMenuItemClick("Processing")
                                        }
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
                                        onClick={() =>
                                          handleMenuItemClick("Shipped")
                                        }
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
                                        onClick={() =>
                                          handleMenuItemClick("Delivered")
                                        }
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
                                        onClick={() =>
                                          handleMenuItemClick("Abandoned")
                                        }
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
                          </td>
                          {data?.selectedVariations?.map(
                            (variation, vIndex) => (
                              <td key={vIndex} className="py-3 px-4">
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
                <p className="text-base text-blue-950 mt-6 mb-3">
                  Payment Details
                </p>
                <div className="p-5 max-w-[392px] bg-white border  rounded">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-blue-950">Item(s) total</p>
                    <p className="text-sm text-blue-950">
                      {order?.subTotal
                        ? `${order.currency || "CAD"} ${
                            order.conversionRate
                              ? (order.conversionRate * order.subTotal).toFixed(
                                  2
                                )
                              : order.subTotal.toFixed(2)
                          }`
                        : "-"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-blue-950">Service fees</p>
                    <p className="text-sm text-blue-950">
                      {order?.serviceFees
                        ? `${order.currency || "CA"} ${
                            order.conversionRate
                              ? (
                                  order.conversionRate * order.serviceFees
                                ).toFixed(2)
                              : order.serviceFees.toFixed(2)
                          }`
                        : "-"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-3.5 pb-3.5 border-b  ">
                    <p className="text-sm text-blue-950">Shipping charges</p>
                    <p className="text-sm text-blue-950">
                      {order?.cart
                        ? `${order.currency || "CAD"} ${order.cart
                            .filter(
                              (value, index, self) =>
                                index ===
                                self.findIndex(
                                  (t) => t.productData?.seller?._id === value.productData?.seller?._id
                                )
                            )
                            .reduce(
                              (total, item) => total + (item.shippingRate || 0),
                              0
                            )
                            .toFixed(2)}`
                        : "-"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-medium text-blue-950">Total</p>
                    <p className="text-base font-medium text-blue-950">
                      {" "}
                      {order?.order_price
                        ? `${order.currency || "CAD"} ${
                            order.conversionRate
                              ? (
                                  order.conversionRate * order.order_price
                                ).toFixed(2)
                              : order.order_price.toFixed(2)
                          }`
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <Formik
                    initialValues={{
                      firstName: "",
                      lastName: "",
                      email: "",
                    }}
                    onSubmit={async (values) => {
                      await new Promise((r) => setTimeout(r, 500));
                      alert(JSON.stringify(values, null, 2));
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
                      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mb-6">
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
                                  : "Not added"
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
                        <div className="relative lg:col-span-3">
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
                        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mb-6">
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
                                    ? order.billing_address?.address
                                        ?.country_code
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
          </div>
        </div>
      </div>
      {/* Pass dynamic props to the ConfirmModal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
        }}
        onConfirm={() => {
          cancelOrder();
        }}
        header="Cancel Order"
        message="Are you sure you want to cancel this order?"
        confirmText="Yes, Cancel"
        bgClass="bg-red-500"
      />
      {reviewModalOpen && sellerId && productId && product && (
        <ReviewModal
          reviewsData={existingReview}
          isOpen={reviewModalOpen}
          onClose={handleCloseWriteReviewModal}
          onSubmit={handleReviewSubmit}
        />
      )}
    </>
  );
};

export default CustomerOrderView;
