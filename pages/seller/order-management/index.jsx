import { faAngleLeft, faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Menu, Transition } from "@headlessui/react";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { faAngleDown } from "@fortawesome/pro-light-svg-icons";

import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
import axios from "axios";

//const noto = Noto_Serif({ subsets: ["latin"] });

const SellerOrders = () => {
  const [persons, setPersons] = useState([]);
  const [user, setUser] = useState({});
  const [isDisabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(""); // State to store selected order status
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term
  const router = useRouter();
  const getData = (id) => {
    setLoading(false);
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/getOrders/ByUserId/${userData?.sellerId}`,
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

        setSelectedGender(response.data.gender);
        setSelectedMenuItem(response.data.status);
        setMobileNumber(response.data.phone);
        setLoading(true);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setLoading(true);
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/orders/sellerData/${userData?.sellerId}`
      )
      .then((res) => {
        setPersons(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        // Set loading to false regardless of success or error
        setLoading(false);
      });
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Filter out orders with paymentStatus not equal to "PaymentDone"
  const filteredOrders = persons?.orders?.filter(
    (order) => order.paymentStatus === "PaymentDone"
  );

  // Function to filter orders based on the selected status
  const filterOrdersByStatus = (orders, status) => {
    if (!status) return orders;
    return orders.filter((order) => order.status === status);
  };

  // Apply status filter to the filtered orders
  const ordersToDisplay = filterOrdersByStatus(filteredOrders, selectedStatus);

  // Function to search orders by customer name
  const searchOrdersByName = (orders, term) => {
    if (!term) return orders;
    return orders.filter((order) =>
      `${order.userInfo.firstName} ${order.userInfo.lastName}`
        .toLowerCase()
        .includes(term.toLowerCase())
    );
  };

  // Apply search filter to the filtered orders
  const searchedOrders = searchOrdersByName(ordersToDisplay, searchTerm);

  // Handle pagination for filtered orders
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = searchedOrders?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil((searchedOrders?.length || 0) / itemsPerPage);

  const onViewClick = (id) => {
    router.push(`/seller/order-management/view?id=${id}`);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    // Update the URL with the current page query parameter
    router.push({ pathname: router.pathname, query: { page } }, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    // Get the current page from the query parameters
    const { page } = router.query;
    setCurrentPage(Number(page) || 1);
  }, [router.query]);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
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
        <div>
          <div className="sm:flex flex-col md:flex-row justify-between md:items-center mb-5">
            <h1
              className={`text-xl lg:text-2xl text-blue-950 font-medium mb-2 noto-font `}
            >
              Orders
            </h1>
            <div className="flex sm:flex-row flex-col sm:items-center justify-end gap-4 shrink-0">
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
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end gap-4">
                <div className="flex items-center justify-end gap-2 ">
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
                      <Menu.Items className="absolute right-10 mt-2 w-40 origin-top-right rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
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
          </div>

          <div className="w-full overflow-auto bg-white rounded-md shadow shadow-slate-300 mt-6 ">
            <table className="text-sm w-full table-fixed border-separate border-spacing-0 bg-orange-50 ">
              <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                <tr>
                  <th className=" px-5 w-[100px]">Action</th>
                  <th className="px-5 w-[150px]">Order Status</th>
                  <th className="px-5 w-[180px]">Carrier</th>
                  <th className="px-5 w-[180px]">Customer Name</th>
                  <th className="pl-7 py-5 pr-16 w-[170px]">Order No</th>
                  <th className="px-5 w-[250px]">Purchased Date</th>
                  <th className="px-5 w-[180px]">Seller Name </th>
                </tr>
              </thead>
              <tbody className="parent">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="pl-9 py-9 font-medium text-blue-950 text-sm"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : ordersToDisplay?.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="pl-10 py-9 font-medium text-blue-950 text-sm "
                    >
                      No orders received
                    </td>
                  </tr>
                ) : (
                  currentOrders?.map((order, index) => (
                    <tr className="child" key={`${index}`}>
                      <td className="px-5">
                        <button
                          className="underline text-blue-950 hover:text-primary"
                          onClick={() => onViewClick(order._id)}
                        >
                          View
                        </button>
                      </td>
                      <td
                        className={`pl-5 font-semibold ${
                          order.status === "Delivered"
                            ? "text-green-800"
                            : order.status === "Cancelled"
                            ? "text-red-800"
                            : order.status === "Shipped"
                            ? "text-yellow-600"
                            : order.status === "Abandoned"
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
                        {order.userInfo
                          ? `${order.userInfo.firstName || ""} ${
                              order.userInfo.lastName || ""
                            }`
                          : "-"}
                      </td>
                      <td className="pl-7 py-5 text-blue-950 ">
                        {order._id ? `AM${order._id.substring(0, 6).toUpperCase()}` : "-"}
                      </td>
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
                      <td className="px-5 text-blue-950">
                        {order.cart?.[0]?.productData?.seller
                          ? `${order.cart?.[0]?.productData?.seller?.firstName || ""} ${
                            order.cart?.[0]?.productData?.seller?.lastName || ""
                            }`
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {loading ? (
            <p className="mt-9 pl-9 ">Loading...</p>
          ) : (
            ordersToDisplay &&
            ordersToDisplay.length > 0 && (
              <div className="bg-orange-50 ">
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
            )
          )}
        </div>
      </Layout>
    </>
  );
};

export default SellerOrders;
