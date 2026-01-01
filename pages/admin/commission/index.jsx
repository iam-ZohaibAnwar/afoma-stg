import Layout from "@/components/Layout";
import {
  faAngleDown,
  faHandHoldingDollar,
} from "@fortawesome/pro-light-svg-icons";
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

//const noto = Noto_Serif({ subsets: ["latin"] });

const AdminCommission = () => {
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);
  const [totalSell, setTotalSell] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPersons, setFilteredPersons] = useState([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/commission`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      setPersons(response.data);
      setFilteredPersons(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
    try {
      const totalSellResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/commission/total/amount`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      setTotalSell(totalSellResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const filtered = persons.filter((person) => {
      const fullName = person.seller
      ? `${person.seller.firstName ?? ""} ${person.seller.lastName ?? ""}`
      : `${person.userId?.firstName ?? ""} ${person.userId?.lastName ?? ""}`;
      const matchesSearch =fullName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "" || person.payoutStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
    setFilteredPersons(filtered);
    setCurrentPage(1); // Reset to the first page when searching or filtering
  }, [searchTerm, persons, statusFilter]);

  useEffect(() => {
    const filtered = persons.filter((person) => {
      const matchesSearch =
        `${person.seller?.firstName} ${person.seller?.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      if(roleFilter === "") {
        return matchesSearch;
      }
      if( roleFilter === "seller") {
        return person.payoutAmount;
      }
      if( roleFilter === "affiliate") {
        return person.affiliateAmount;
      }
      if( roleFilter === "referral") {
        return person.referralAmount;
      }
    });
    setFilteredPersons(filtered);
    setCurrentPage(1); // Reset to the first page when searching or filtering
  }, [searchTerm, persons, roleFilter]);



  const distributeCartToOrders = (orders) => {
    const groupedOrdersByOrderId = {};

    // Step 1: Group orders by orderId
    orders.forEach(order => {
      const orderId = order?.orderId?._id;
      if (!groupedOrdersByOrderId[orderId]) {
        groupedOrdersByOrderId[orderId] = [];
      }
      groupedOrdersByOrderId[orderId].push(order);
    });

    const finalOrders = [];

    // Step 2: For each orderId, process
    Object.values(groupedOrdersByOrderId).forEach(orderGroup => {
      const baseOrder = orderGroup[0];
      const cartItems = baseOrder?.orderId?.cart || [];

      // ---- Seller Rows ----
      const cartBySeller = {};
      const sellerDetailsMap = {};

      cartItems.forEach(item => {
        const seller = item.productData?.seller;
        const sellerId = seller?._id;

        if (!cartBySeller[sellerId]) {
          cartBySeller[sellerId] = [];
          sellerDetailsMap[sellerId] = seller;
        }

        cartBySeller[sellerId].push(item);
      });

      if (roleFilter === "seller" || roleFilter === "") {
        Object.entries(cartBySeller).forEach(([sellerId, sellerCart]) => {
          let totalCommission = 0;
          let totalPayout = 0;

          orderGroup.forEach(order => {
            if (order.seller?._id === sellerId) {
              totalCommission += Number(order.commissionAmount || 0);
              totalPayout += Number(order.payoutAmount || 0);
            }
          });

          finalOrders.push({
            ...baseOrder,
            type: "seller",
            seller: sellerDetailsMap[sellerId],
            orderId: {
              ...baseOrder.orderId,
              cart: sellerCart
            },
            totalCommission,
            totalPayout
          });
        });
      }

      if (roleFilter === "affiliate" || roleFilter === "") {
        // ---- Affiliate Row ----
        let totalAffiliateCommission = 0;
        let affiliatPayout = 0;
        let affiliateUser = null;

        orderGroup.forEach(order => {
          if (order.userId?._id && order.affiliateAmount) {
            affiliateUser = order.userId; // store affiliate user details
            totalAffiliateCommission += Number(order.commissionAmount || 0);
            affiliatPayout += Number(order.affiliateAmount || 0);
          }
        });

        if (affiliateUser) {
          finalOrders.push({
            ...baseOrder,
            type: "affiliate",
            affiliate: affiliateUser,
            orderId: {
              ...baseOrder.orderId,
              cart: [] // ✅ affiliates usually don’t need seller cart
            },
            totalCommission: totalAffiliateCommission,
            affiliatPayout
          });
        }
      }

      if (roleFilter === "referral" || roleFilter === "") {
        // ---- Referral Row ----
        let totalReferralCommission = 0;
        let referralPayout = 0;
        let referralUser = null;

        orderGroup.forEach(order => {
          if (order.userId?._id && order.referralAmount) {
            referralUser = order.userId;
            totalReferralCommission += Number(order.commissionAmount || 0);
            referralPayout += Number(order.referralAmount || 0);
          }
        });

        if (referralUser) {
          finalOrders.push({
            ...baseOrder,
            type: "referral",
            referral: referralUser,
            orderId: {
              ...baseOrder.orderId,
              cart: [] // ✅ referrals also don’t need cart items
            },
            totalCommission: totalReferralCommission,
            referralPayout
          });
        }
      }
    });

    return finalOrders;
  };

  
  
  let updateOrders = distributeCartToOrders(filteredPersons)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = updateOrders.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPersons.length / itemsPerPage);

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

  const handleMenuItemClick = (payoutStatus, orderId) => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/commission/updatePayoutStatus/${orderId}`,
        { newPayoutStatus: payoutStatus },
        { headers: { "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm" } }
      )
      .then(() => {
        toast.success("Status Updated");
        fetchData(); // Refresh data
      })
      .catch(() => {
        toast.error("Something Went Wrong");
      });
  };
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    fetchData(); // Fetch data with the new status filter
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    fetchData(); // Fetch data with the new status filter
  };

  const handlePayoutLink = async (commission) => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/commission/payout-link`,
      commission,
      { headers: { "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm" } }
    )
      .then(() => {
        toast.success("Payout Sent Successfully");
      })
      .catch(() => {
        toast.error("Something Went Wrong");
      });
  }

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
          <div className="flex justify-start items-center mb-7">
            <h1
              className={`text-2xl text-blue-950 font-medium mb-2 noto-font `}
            >
              Commission
            </h1>
          </div>

          <div className="flex justify-start items-center gap-[42px] mb-12">
            <div className="px-4 py-5 w-72 bg-orange-100">
              <div className="flex item-center gap-3 ">
                <div className="h-8 w-8 p-2 items-center  rounded-full bg-orange-50">
                  <FontAwesomeIcon
                    icon={faHandHoldingDollar}
                    className="h-4 w-4 text-primary "
                  />
                </div>

                <p className="text-base text-blue-950">Total commission</p>
              </div>

              <p className="mt-4 text-2xl text-primary font-medium">
                {totalSell?.totalCommission !== undefined &&
                !isNaN(parseFloat(totalSell?.totalCommission))
                  ? `CA$ ${parseFloat(totalSell?.totalCommission).toFixed(2)}`
                  : "0"}
              </p>
            </div>
          </div>

          <div className="md:flex justify-between items-center mb-5">
            <h1
              className={`text-lg md:text-xl text-blue-950 font-medium mb-2 noto-font `}
            >
              Commission Distribution
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
                  placeholder="Search by seller name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                          <div className="flex items-center justify-end gap-4">
                <Menu as="div">
                  <div>
                    <Menu.Button className="flex items-center justify-center rounded-full">
                      <p className="dashboard-button-secondary">
                        User Role{" "}
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
                            onClick={() => handleRoleFilter("")}
                          >
                            All
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleRoleFilter("seller")}
                          >
                            Seller
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleRoleFilter("affiliate")}
                          >
                            Affiliate
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleRoleFilter("referral")}
                          >
                            Referral
                          </button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <div className="w-full overflow-auto bg-white rounded-md border border-[#4755694D] mt-6">
            <table className="text-sm w-full table-fixed border-separate border-spacing-0 bg-orange-50 ">
              <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14 w-full">
                <tr>
                  <th className="px-5 w-[190px]"></th>
                  <th className="px-5 w-[170px]">Status</th>
                  <th className="px-5 w-[250px]">Commission Amount</th>
                  <th className="px-5 w-[170px]">Payout Seller</th>
                  <th className="px-5 w-[170px]">Payout Affiliate</th>
                  <th className="px-5 w-[170px]">Payout Referral</th>
                  <th className="px-5 w-[170px]">Shipping Payout</th>
                  <th className=" px-5 w-[200px]">Name</th>
                  <th className="px-5 w-[230px]">Order ID</th>
                  <th className=" px-5 w-[230px]">Product Name</th>
                  <th className=" px-5 w-[200px] truncate">SKU</th>
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
                    <td className="px-5 py-6 text-blue-950">
                        <button
                          className="buttonprimary"
                          onClick={() => handlePayoutLink(orders)} // replace with your payout handler
                          disabled={orders.isPayout || orders.payoutStatus == "Paid"}
                        >
                          Initiate Payout
                        </button>
                      </td>
                      <td className="px-5 py-6 text-blue-950">
                        {/* <div
                          className={`flex items-center justify-center bg-green-800 text-white  cursor-pointer py-2.5  gap-2 rounded-sm text-center hover:border-orange-700 transition-colors ease-in `}
                        >
                          Pending
                        </div> */}
                        <div className="flex items-center justify-end gap-4">
                          <Menu as="div" className="relative w-[150px]">
                            <div>
                              <Menu.Button
                                className={`flex items-center justify-center w-full rounded-full ${
                                  orders.payoutStatus === "Paid"
                                    ? "pointer-events-none"
                                    : orders.payoutStatus === "Pending"
                                    ? "bg-gray-500 text-white"
                                    : "bg-gray-500 text-white"
                                } cursor-pointer py-2.5 px-4 gap-2 rounded-sm text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center`}
                              >
                                {orders.payoutStatus}
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
                              <Menu.Items className="absolute overflow-visible left-0 -top-5 mt-2 w-40 origin-top-right rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                                <div className="py-2">
                                  <Menu.Item>
                                    <button
                                      className={`${
                                        orders.payoutStatus === "Pending"
                                          ? "bg-orange-100 text-primary"
                                          : "hover:bg-orange-100 hover:text-primary"
                                      } group flex w-full items-center gap-3 px-3.5 py-2`}
                                      onClick={() =>
                                        handleMenuItemClick(
                                          "Pending",
                                          orders._id
                                        )
                                      }
                                    >
                                      Pending
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
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </td>
                      <td className="px-5 py-5 text-blue-950">
                        {orders?.totalCommission
                          ? `CA$${parseFloat(orders?.totalCommission).toFixed(
                              2
                            )}`
                          : "-"}
                      </td>

                      <td className="px-5 py-5 text-blue-950">
                        {orders?.totalPayout
                          ? `CA$${parseFloat(orders?.totalPayout).toFixed(2)}`
                          : "-"}
                      </td>

                      <td className="px-5 py-5 text-blue-950">
                        {orders?.affiliatPayout
                          ? `CA$${parseFloat(orders?.affiliatPayout).toFixed(2)}`
                          : "-"}
                      </td>

                      <td className="px-5 py-5 text-blue-950">
                        {orders?.referralPayout
                          ? `CA$${parseFloat(orders?.referralPayout).toFixed(2)}`
                          : "-"}
                      </td>

                      <td className="px-5 py-5 text-blue-950">
                      {
                        (() => {
                          const sellerCarts = orders?.orderId?.cart?.filter(
                            item => item.productData.seller._id === orders?.seller?._id
                          ) || [];

                          const customShippingItem = sellerCarts.find(
                            item => item.shippingService?.carrier_name === "Flat Rate Shipping"
                          );

                          const rate = customShippingItem ? customShippingItem.shippingRate || 0 : 0;
                          return `$${rate.toFixed(2)}`;
                        })()
                      }
                      </td>

                      <td className="px-5 py-5 text-blue-950">
                        {orders?.seller
                          ? `${orders?.seller?.firstName} ${orders?.seller?.lastName}`
                          : `${orders?.userId?.firstName} ${orders?.userId?.lastName}`}
                      </td>
                      <td className="px-5 py-5  text-blue-950">
                        {" "}
                        {orders?.orderId?._id ? `AM${orders?.orderId?._id.substring(0, 6).toUpperCase()}` : "-"}
                      </td>
                      {/* <td className="px-5 py-5 text-blue-950">
                        {orders?.seller?._id ? `${orders?.seller?._id} ` : "-"}
                      </td> */}
                      <td className="px-5 py-5 text-blue-950">
                        {
                          (() => {
                            const products = orders?.orderId?.cart
                              ?.filter(item => item.productData?.seller?._id === orders?.seller?._id)
                              .map(item => item.productData?.productName);

                            return products?.length ? products.join(", ") : "-";
                          })()
                        }
                      </td>

                      <td className="px-5 py-5 text-blue-950">
                         {
                          (() => {
                            const skus = orders?.orderId?.cart
                            ?.filter(item => item.productData.seller._id === orders?.seller?._id)
                            .map(item => item.productData.sku)

                            return skus?.length ? skus.join(", ") : "-";
                          })()
                        }
                      </td>
                      {/* <td className="px-5 py-5 text-blue-950">
                        {orders?.orderId?.cart[0]?.totalAmount
                          ? `CA$${parseFloat(
                              orders?.orderId?.cart[0]?.totalAmount
                            ).toFixed(2)}`
                          : "-"}
                      </td> */}
                      <td className="px-5 py-5 text-blue-950">
                        {
                          orders?.totalPayout ? orders?.orderId?.cart
                            ?.filter(item => item.productData.seller._id === orders?.seller?._id)
                            .reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0)
                            .toFixed(2) : "-"
                        }
                      </td>

                      {/* <td className="px-5 py-5 text-blue-950">
                        {" "}
                        {orders?.orderId?.cart[0]?.orderQuantiy
                          ? orders?.orderId?.cart[0]?.orderQuantiy
                          : "-"}
                      </td> */}
                      <td className="px-5 py-5 text-blue-950">
                        {
                          orders?.totalPayout ? orders?.orderId?.cart
                            ?.filter(item => item.productData.seller._id === orders?.seller?._id)
                            .reduce((sum, item) => sum + Number(item.orderQuantiy || 0), 0) : "-"
                        }
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

                      {/* <td className="px-5">
                        <button
                          className="underline text-blue-950 hover:text-primary"
                          onClick={() => onViewClick(orders._id)}
                        >
                          View
                        </button>
                      </td> */}
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
    </>
  );
};

export default AdminCommission;
