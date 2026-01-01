import ConfirmModal from "@/components/ConfirmModal";
import Layout from "@/components/Layout";
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

//const noto = Noto_Serif({ subsets: ["latin"] });

const AdminOrderMgmt = () => {
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(""); // State to store selected order status
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [reloadOrders, setReloadOrders] = useState(undefined);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(undefined);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .then((res) => {
        setPersons(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reloadOrders]);

  const onEditClick = (id) => {
    router.push(`/admin/order-management/edit?id=${id}`);
  };

  const onViewClick = (id) => {
    router.push(`/admin/order-management/edit/${id}`);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    router.push({ pathname: router.pathname, query: { page } }, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    const { page } = router.query;
    setCurrentPage(Number(page) || 1);
  }, [router.query]);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to the first page on a new status filter
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  // Updated filter function
  const filterOrdersByStatusAndSearch = (orders, status, query) => {
    let filteredOrders = orders.filter(
      (order) => order.paymentStatus === "PaymentDone"
    );
    if (status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === status
      );
    }
    if (query) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          (order.userInfo.firstName &&
            order.userInfo.firstName
              .toLowerCase()
              .includes(query.toLowerCase())) ||
          (order.userInfo.lastName &&
            order.userInfo.lastName.toLowerCase().includes(query.toLowerCase()))
      );
    }
    return filteredOrders;
  };

  const filteredOrders = filterOrdersByStatusAndSearch(
    persons?.orders || [],
    selectedStatus,
    searchQuery
  );
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const cancelOrder = () => {
    setIsConfirmModalOpen(false);
    setCancelLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const options = {
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/shipping/cancel-shipment/${selectedOrderId}`,
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
          setReloadOrders(selectedOrderId);
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

  const onCancelClick = (id) => {
    setSelectedOrderId(id);
    setIsConfirmModalOpen(true);
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
        <>
          <div className="sm:flex justify-between items-center">
            <h1
              className={`md:text-2xl text-lg text-blue-950 font-medium mb-2 noto-font`}
            >
              Orders
            </h1>
            <div className="flex sm:flex-row flex-col sm:items-center sm:justify-end gap-4 shrink-0">
              <div
                className={`flex items-center border border-zinc-200 rounded-[3px]`}
              >
                <div className="bg-primary p-3 rounded-tl-[3px] rounded-bl-[3px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17.732"
                    height="17.732"
                    viewBox="0 0 17.732 17.732"
                  >
                    <path
                      id="magnifying-glass-light"
                      d="M16.578,15.84l-4.624-4.624A6.815,6.815,0,0,0,6.768,0a6.8,6.8,0,1,0,4.418,11.956L15.81,16.58a.659.659,0,0,0,.4.152.523.523,0,0,0,.369-.892ZM6.8,12.549A5.752,5.752,0,1,1,12.549,6.8,5.741,5.741,0,0,1,6.8,12.549Z"
                      transform="translate(0.5 0.5)"
                      fill="#fff"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full border-none p-2 border-zinc-200 focus:ring-zinc-200 focus:border-zinc-200 outline-none"
                  placeholder="Search by customer name..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex items-center justify-end gap-4">
                <Menu as="div">
                  <div>
                    <Menu.Button className="flex items-center justify-center rounded-full">
                      <p className="dashboard-button-secondary">
                        Order Status{" "}
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className="h-4 w-8 fill-blue-950"
                        />
                      </p>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={React.Fragment}
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
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleStatusFilter("")}
                          >
                            All
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleStatusFilter("Processing")}
                          >
                            Processing
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleStatusFilter("Pending")}
                          >
                            Pending
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleStatusFilter("Dispatched")}
                          >
                            Dispatched
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleStatusFilter("Delivered")}
                          >
                            Delivered
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleStatusFilter("Cancelled")}
                          >
                            Cancelled
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleStatusFilter("OnHold")}
                          >
                            OnHold
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleStatusFilter("Abandoned")}
                          >
                            Abandoned
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleStatusFilter("Returned")}
                          >
                            Returned
                          </button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <div className="w-full overflow-auto bg-white rounded-md border border-[#4755694D] mt-8">
            <table className="text-sm w-full table-fixed border-separate border-spacing-0 bg-orange-50 ">
              <thead className="text-left text-sm font-bold text-orange-50 bg-blue-950 h-14">
                <tr>
                  <th className="px-5 w-[100px]">Action</th>
                  <th className="px-5 w-[150px]">Order Status</th>
                  <th className="px-5 w-[180px]">Carrier </th>
                  <th className="px-5 w-[180px]">Seller Name </th>
                  <th className="px-5 w-[180px]">Customer Name</th>
                  <th className="pl-7 py-5 pr-16 w-[170px]">Order No</th>
                  <th className="px-5 w-[250px]">Purchased Date</th>
                </tr>
              </thead>

              <tbody className="parent">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="pl-9 py-9 font-medium text-blue-950 text-sm"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : currentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="pl-10 py-9 font-medium text-blue-950 text-sm "
                    >
                      No orders received
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order, index) => (
                    <tr className="child" key={index}>
                      <td className="px-5">
                        <button
                          className="underline text-blue-950 hover:text-primary"
                          onClick={() => onViewClick(order._id)}
                        >
                          View
                        </button>
                        <br />
                        <button
                          className="underline text-blue-950 hover:text-primary"
                          onClick={() => onEditClick(order._id)}
                        >
                          Edit
                        </button>

                        <button
                          className="underline text-blue-950 hover:text-primary disabled:opacity-40"
                          onClick={() => onCancelClick(order._id)}
                          disabled={
                            cancelLoading ||
                            order.status == "Cancelled" ||
                            order.status == "Shipped"
                          }
                        >
                          Cancel
                        </button>
                      </td>
                      <td
                        className={`pl-6 font-semibold ${
                          order.status === "Delivered"
                            ? "text-green-800"
                            : order.status === "Cancelled"
                            ? "text-red-800"
                            : order.status === "Dispatched"
                            ? "text-yellow-600"
                            : order.status === "OnHold"
                            ? "text-orange-800"
                            : order.status === "Processing"
                            ? "text-sky-700"
                            : "text-gray-800"
                        }`}
                      >
                        {order.status}
                      </td>
                      <td className="px-5 text-blue-950">
                        {order.cart.length > 0
                          ? `${ order.cart?.[0]?.shippingRate == -1 ? "Free Shipping"
                           : order.cart?.[0]?.shippingService?.carrier_name  || ""}`
                          : "-"}
                      </td>
                      <td className="px-5 text-blue-950">
                        {order.cart?.[0]?.productData?.seller
                          ? `${order.cart?.[0]?.productData?.seller?.firstName || ""} ${
                            order.cart?.[0]?.productData?.seller?.lastName || ""
                            }`
                          : "-"}
                      </td>
                      <td className="px-5 text-blue-950">
                        {order.userInfo?.firstName
                          ? `${order.userInfo?.firstName || ""} ${
                              order.userInfo?.lastName || ""
                            }`
                          : `${order.userInfo?.name || ""}`}
                      </td>
                      <td className="pl-7 py-5 text-blue-950 ">
                        {order._id ? `AM${order._id.substring(0, 6).toUpperCase()}` : "-"}
                      </td>
                      {/* <td className="px-5 text-blue-950">
                        {order.userInfo ? order.userInfo.userId || "-" : "-"}
                      </td> */}
                      <td className="px-5 text-blue-950">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredOrders.length > 0 && (
            <div className="bg-orange-50">
              <div className="pagination flex text-sm items-center justify-end text-bodyText gap-x-6 my-9 ">
                <div className="">
                  <button
                    className={` flex gap-2 items-center text-gray-500  ${
                      currentPage === 1
                        ? "cursor-not-allowed opacity-50"
                        : "hover:text-primary"
                    }`}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" />{" "}
                    Previous{" "}
                  </button>
                </div>

                <div>
                  <div className="">
                    <button
                      className={` flex gap-2 items-center text-gray-500  ${
                        currentPage === totalPages
                          ? "cursor-not-allowed opacity-50"
                          : "hover:text-primary"
                      }`}
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        className="h-[8px] "
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      </Layout>
      {/* Pass dynamic props to the ConfirmModal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen && selectedOrderId}
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
    </>
  );
};

export default AdminOrderMgmt;
