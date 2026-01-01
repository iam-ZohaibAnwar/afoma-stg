import Layout from "@/components/Layout";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";

const Index = () => {
  const [isDisabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [selectedStatus, setSelectedStatus] = useState(""); // New state for selected status filter
  const [filteredCommissions, setFilteredCommissions] = useState([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/commission/affiliate/${userData?.userId}`
      )
      .then((res) => {
        setPersons(res.data); // Make sure res.data is an array
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (persons?.commissions) {
      // Filter commissions based on search term and selected status
      const filtered = persons.commissions.filter((order) => {
        const productMatches =
          searchTerm === "" ||
          order.orderId.cart.some((item) =>
            item.productData.productName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        const statusMatches =
          selectedStatus === "" || order.payoutStatus === selectedStatus;
        return productMatches && statusMatches;
      });

      setFilteredCommissions(filtered);
    }
  }, [searchTerm, selectedStatus, persons]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredCommissions?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCommissions.length / itemsPerPage);
  const router = useRouter();
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

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  return (
    <>
      {" "}
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
      <Layout userType="affiliate">
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
              onChange={handleSearchChange}
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
                        onClick={() => handleStatusFilter("Pending")}
                      >
                        Pending
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                        onClick={() => handleStatusFilter("Paid")}
                      >
                        Paid
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <div className="w-full overflow-auto bg-white rounded-md border border-[#4755694D] mt-6">
          <table className="text-sm w-full table-fixed border-separate border-spacing-0 bg-orange-50 ">
            <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
              <tr>
                <th className="px-5 w-[170px]">Status</th>
                <th className="px-5 w-[230px]">Order ID</th>
                <th className="px-5 w-[170px]">Payout Amount</th>
                <th className=" px-5 w-[200px]">Customer Name</th>
                <th className=" px-5 w-[230px]">Product Name</th>
                <th className=" px-5 w-[200px]">SKU</th>
                <th className="px-5 w-[170px]">Price</th>
                <th className="px-5 w-[170px]">Quantity</th>
                <th className=" px-5 w-[200px]">Purchased Date</th>

                {/* <th className="px-5 w-[170px]">Action</th> */}
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
              ) : currentOrders && currentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="pl-10 py-9 font-medium text-blue-950 text-sm"
                  >
                    No orders received
                  </td>
                </tr>
              ) : (
                currentOrders?.map((orders, index) => (
                  <tr key={index} className="child">
                    <td className="pl-5 py-5 text-blue-950">
                      <div className="flex items-center justify-end gap-4 pointer-events-none">
                        <Menu
                          as="div"
                          className="relative pointer-events-none
                        "
                        >
                          <div>
                            <Menu.Button
                              className={`flex items-center justify-center w-[150px] rounded-full pointer-events-none ${
                                orders.payoutStatus === "Paid"
                                  ? "bg-green-800 text-white"
                                  : orders.payoutStatus === "Pending"
                                  ? "bg-gray-500 text-white"
                                  : "bg-gray-500 text-white"
                              } cursor-pointer py-2.5 px-4 gap-2 rounded-sm text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center`}
                            >
                              {orders.payoutStatus}
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
                            {/* <Menu.Items className="absolute overflow-visible right-0 mt-2 w-40 origin-top-right rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                              <div className="py-2">
                                <Menu.Item>
                                  <button
                                    className={`${
                                      orders.payoutStatus === "Pending"
                                        ? "bg-orange-100 text-primary"
                                        : "hover:bg-orange-100 hover:text-primary"
                                    } group flex w-full items-center gap-3 px-3.5 py-2`}
                                    onClick={() =>
                                      handleMenuItemClick("Pending", orders._id)
                                    }
                                  >
                                    Pending
                                  </button>
                                </Menu.Item>

                                <Menu.Item>
                                  <button
                                    className={`${
                                      orders.payoutStatus === "InProcess"
                                        ? "bg-orange-100 text-primary"
                                        : "hover:bg-orange-100 hover:text-primary"
                                    } group flex w-full items-center gap-3 px-3.5 py-2`}
                                    onClick={() =>
                                      handleMenuItemClick(
                                        "InProcess",
                                        orders._id
                                      )
                                    }
                                  >
                                    In Process
                                  </button>
                                </Menu.Item>
                                <Menu.Item>
                                  <button
                                    className={`${
                                      orders.payoutStatus === "Paid"
                                        ? "bg-orange-100 text-primary"
                                        : "hover:bg-orange-100 hover:text-primary"
                                    } group flex w-full items-center gap-3 px-3.5 py-2`}
                                    onClick={() =>
                                      handleMenuItemClick("Paid", orders._id)
                                    }
                                  >
                                    Paid
                                  </button>
                                </Menu.Item>

                                <Menu.Item>
                                  <button
                                    className={`${
                                      orders.payoutStatus === "Canceled"
                                        ? "bg-orange-100 text-primary"
                                        : "hover:bg-orange-100 hover:text-primary"
                                    } group flex w-full items-center gap-3 px-3.5 py-2`}
                                    onClick={() =>
                                      handleMenuItemClick(
                                        "Canceled",
                                        orders._id
                                      )
                                    }
                                  >
                                    Canceled
                                  </button>
                                </Menu.Item>
                              </div>
                            </Menu.Items> */}
                          </Transition>
                        </Menu>
                      </div>
                    </td>
                    <td className="px-5 py-5  text-blue-950">
                      {" "}
                      {orders?.orderId?._id ? `AM${orders?.orderId?._id.substring(0, 6).toUpperCase()}` : "-"}
                    </td>
                    <td className="px-5 py-5 text-blue-950">
                      {orders?.affiliateAmount
                        ? `CA$${parseFloat(orders?.affiliateAmount).toFixed(2)}`
                        : "-"}
                    </td>
                    <td className="px-5 py-5 text-blue-950">
                      {orders?.orderId?.userInfo?.firstName || orders?.orderId?.userInfo?.lastName
                        ? `${orders?.orderId?.userInfo?.firstName} ${orders?.orderId?.userInfo?.lastName}`
                        : "-"}
                    </td>
                    <td className="px-5 py-5 text-blue-950">
                      {orders?.orderId?.cart.map((item) =>
                           item.productData.productName
                      )}
                    </td>
                    <td className="px-5 py-5 text-blue-950">
                      {orders?.orderId?.cart.map((item) =>
                        item.productData.sku)}
                    </td>
                    <td className="px-5 py-5 text-blue-950">
                      {orders?.orderId?.cart.map((item) =>
                         parseFloat(item.totalAmount).toFixed(2)
                      )}
                    </td>
                    <td className="px-5 py-5 text-blue-950">
                      {" "}
                      {orders?.orderId?.cart.map((item) =>
                        item.orderQuantiy
                      )}
                    </td>
                    <td className="px-5 py-5 text-blue-950">
                      {" "}
                      {orders?.createdAt
                        ? new Date(orders.createdAt).toLocaleDateString(
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

        {currentOrders && currentOrders.length > 0 && (
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
                    <FontAwesomeIcon icon={faAngleRight} className="h-[8px] " />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Index;
