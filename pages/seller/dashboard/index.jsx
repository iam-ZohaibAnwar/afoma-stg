import Layout from "@/components/Layout";
import {
  faBagShopping,
  faChartColumn,
  faFilter,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
//const noto = Noto_Serif({ subsets: ["latin"] });

const Index = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("This Month");
  const [totalSales, setTotalSales] = useState("This Month");
  const [totalOrders, setTotalOrders] = useState("This Month");
  const [ordersValue, setOrdersValue] = useState("This Month");
  const [totalEarnings, setTotalEarnings] = useState("This Month");
  const [recentProduct, setRecentProduct] = useState([]);
  const [latestPayout, setlatestPayout] = useState([]);
  const [latestOrder, setlatestOrder] = useState([]);

  const handleMenuItemClick = (menuItem, id) => {
    setSelectedMenuItem(menuItem);
  };
  const handleTotalSales = (menuItem, id) => {
    setTotalSales(menuItem);
  };
  const handleTotalOrders = (menuItem, id) => {
    setTotalOrders(menuItem);
  };
  const handleOrdersValue = (menuItem, id) => {
    setOrdersValue(menuItem);
  };
  const handleTotalEarnings = (menuItem, id) => {
    setTotalEarnings(menuItem);
  };
  const handleCommissionRate = (menuItem, id) => {
    setCommissionRate(menuItem);
  };
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/seller-dashboard/seller/${userData?.sellerId}/orders/count`
      )
      .then((res) => {
        setlatestOrder(res.data);
      });
  }, []);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/seller-dashboard/${userData?.sellerId}/pending-payouts`
      )
      .then((res) => {
        setlatestPayout(res.data);
      });
  }, []);
  //
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/seller-dashboard/seller/${userData?.sellerId}/orders/latest`
      )
      .then((res) => {
        setRecentProduct(res.data);
      });
  }, []);

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
          <div className="flex items-center justify-between mb-[30px]">
            <h2
              className={`text-blue-950 md:text-2xl text-lg noto-font`}
            >
              Dashboard
            </h2>
          </div>
          <div className="mb-8">
            <div className="flex flex-col justify-between">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                <div className="px-4 py-5 bg-orange-100 rounded">
                  <div className="flex gap-3 items-center mb-4">
                    <div className="px-2.5 py-1.5 bg-orange-50 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12.752"
                        height="18.514"
                        viewBox="0 0 12.752 18.514"
                      >
                        <g
                          id="Fair_Compensation"
                          data-name="Fair Compensation"
                          transform="translate(0.1 0.1)"
                        >
                          <path
                            id="Path_2417"
                            data-name="Path 2417"
                            d="M187.922,153.448a.412.412,0,0,0-.148-.005.984.984,0,0,1-.87-.976.433.433,0,1,0-.866,0,1.852,1.852,0,0,0,1.361,1.783v.433a.433.433,0,1,0,.866,0v-.407a1.848,1.848,0,0,0-.379-3.657.983.983,0,1,1,.983-.983.433.433,0,0,0,.866,0,1.852,1.852,0,0,0-1.47-1.809v-.394a.433.433,0,1,0-.866,0v.42a1.848,1.848,0,0,0,.487,3.631.982.982,0,0,1,.036,1.963Zm0,0"
                            transform="translate(-181.611 -139.047)"
                            fill="#1F628E"
                            stroke="#1F628E"
                            strokeWidth="0.2"
                          />
                          <path
                            id="Path_2418"
                            data-name="Path 2418"
                            d="M104.2,112.768a6.276,6.276,0,1,0,6.276-6.276A6.276,6.276,0,0,0,104.2,112.768Zm6.276-5.411a5.411,5.411,0,1,1-5.411,5.411A5.41,5.41,0,0,1,110.471,107.358Zm0,0"
                            transform="translate(-104.195 -100.73)"
                            fill="#1F628E"
                            stroke="#1F628E"
                            strokeWidth="0.2"
                          />
                          <path
                            id="Path_2420"
                            data-name="Path 2420"
                            d="M213.069,4.544V.433a.433.433,0,1,0-.866,0V4.544a.433.433,0,1,0,.866,0Zm0,0"
                            transform="translate(-206.36 0)"
                            fill="#1F628E"
                            stroke="#1F628E"
                            strokeWidth="0.2"
                          />
                          <path
                            id="Path_2421"
                            data-name="Path 2421"
                            d="M273.069,42.38V40.433a.433.433,0,0,0-.866,0V42.38a.433.433,0,0,0,.866,0Zm0,0"
                            transform="translate(-263.114 -37.836)"
                            fill="#1F628E"
                            stroke="#1F628E"
                            strokeWidth="0.2"
                          />
                          <path
                            id="Path_2422"
                            data-name="Path 2422"
                            d="M153.069,42.38V40.433a.433.433,0,1,0-.866,0V42.38a.433.433,0,0,0,.866,0Zm0,0"
                            transform="translate(-149.606 -37.836)"
                            fill="#1F628E"
                            stroke="#1F628E"
                            strokeWidth="0.2"
                          />
                        </g>
                      </svg>
                    </div>
                    <Link href="/seller/order-management">
                      <p className="text-blue-950">Number of Orders</p>
                    </Link>
                  </div>
                  <h1 className="font-medium text-4xl  text-primary mb-2.5">
                    {latestOrder.pendingOrdersCount || "-"}
                  </h1>
                </div>

                <div className="px-4 py-5 bg-orange-100 rounded">
                  <div className="flex gap-3 items-center mb-4">
                    <div className="px-2.5 py-1.5 bg-orange-50 rounded-full">
                      <FontAwesomeIcon
                        icon={faChartColumn}
                        className="text-primary"
                      />
                    </div>
                    <Link href="/seller/order-management">
                      <p className="text-blue-950">Dispatch Orders</p>
                    </Link>
                  </div>
                  <h1 className="font-medium text-4xl  text-primary mb-2.5">
                    {latestOrder.dispatchedOrdersCount || "0"}
                  </h1>
                </div>
                <div className="px-4 py-5 bg-orange-100 rounded">
                  <div className="flex gap-3 items-center mb-4">
                    <div className="px-2.5 py-1.5 bg-orange-50 rounded-full">
                      <FontAwesomeIcon
                        icon={faBagShopping}
                        className="text-primary"
                      />
                    </div>
                    <Link href="/seller/order-management">
                      <p className="text-blue-950">Completed Orders</p>
                    </Link>
                  </div>
                  <h1 className="font-medium text-4xl  text-primary mb-2.5">
                    {latestOrder.completedOrdersCount || "-"}
                  </h1>
                  {/* <Menu as="div" className="relative ">
                    <div>
                      <Menu.Button
                        className={`flex items-center justify-center rounded-full cursor-pointer py-2.5  gap-2 text-center text-slate-600 transition-colors ease-in text-xs font-medium`}
                      >
                        {totalOrders}
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
                              fill="#172554"
                              stroke="#172554"
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
                      <Menu.Items className="absolute -left-1 right-0 mt-2 w-40 origin-top-right rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                        <div className="py-2 px-3">
                          <Menu.Item>
                            <button
                              className={`${
                                totalOrders === "This Month"
                              } flex items-center justify-center py-1 text-xs font-medium text-slate-600`}
                              onClick={() => handleTotalOrders("This Month")}
                            >
                              This Month
                            </button>
                          </Menu.Item>

                          <Menu.Item>
                            <button
                              className={`${
                                totalOrders === "Last Month"
                              } flex items-center justifycenter py-1 text-xs font-medium text-slate-600`}
                              onClick={() => handleTotalOrders("Last Month")}
                            >
                              Last Month
                            </button>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              className={`${
                                totalOrders === "This Year"
                              } flex items-center justify-center py-1 text-xs font-medium text-slate-600`}
                              onClick={() => handleTotalOrders("This Year")}
                            >
                              This Year
                            </button>
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu> */}
                </div>

                {/* <div className="px-4 py-5 bg-orange-100 rounded">
                  <div className="flex gap-3 items-center mb-4">
                    <div className="px-2.5 py-1.5 bg-orange-50 rounded-full">
                      <FontAwesomeIcon
                        icon={faFilter}
                        className="text-primary"
                      />
                    </div>
                    < className="text-blue-950">Total Earning</>
                  </div>
                  <h1 className="font-medium text-4xl  text-primary mb-2.5">
                    {latestPayout.totalCommissionsCount}
                  </h1>
                  <div className="flex gap-1.5 items-center">
                    <p className="text-slate-600 font-medium text-xs">orders</p>
                  </div>
                </div> */}
                {/* <div className="px-4 py-5 bg-orange-100 rounded">
                  <div className="flex gap-3 items-center mb-4">
                    <div className="px-2.5 py-1.5 bg-orange-50 rounded-full">
                      <FontAwesomeIcon
                        icon={faFilter}
                        className="text-primary"
                      />
                    </div>
                    <p className="text-blue-950">Pending Earning</p>
                  </div>
                  <h1 className="font-medium text-4xl  text-primary mb-2.5">
                    {latestPayout.pendingCommissionsCount}
                  </h1>
                  <div className="flex gap-1.5 items-center">
                    <p className="text-slate-600 font-medium text-xs">orders</p>
                  </div>
                </div> */}
                {/* <div className="px-4 py-5 bg-orange-100 rounded">
                  <div className="flex gap-3 items-center mb-4">
                    <div className="px-2.5 py-1.5 bg-orange-50 rounded-full">
                      <FontAwesomeIcon
                        icon={faFilter}
                        className="text-primary"
                      />
                    </div>
                    <p className="text-blue-950"> Earning</p>
                  </div>
                  <h1 className="font-medium text-4xl  text-primary mb-2.5">
                    {latestPayout.paidCommissionsCount}
                  </h1>
                  <div className="flex gap-1.5 items-center">
                    <p className="text-slate-600 font-medium text-xs">orders</p>
                  </div>
                </div> */}
                <div className="px-4 py-5 bg-orange-100 rounded">
                  <div className="flex gap-3 items-center mb-4">
                    <div className="px-2.5 py-1.5 bg-orange-50 rounded-full">
                      <FontAwesomeIcon
                        icon={faFilter}
                        className="text-primary"
                      />
                    </div>
                    <Link href="/seller/earning">
                      <p className="text-blue-950">Pending Payouts</p>
                    </Link>
                  </div>
                  <h1 className="font-medium text-4xl  text-primary mb-2.5">
                    {latestPayout.totalPendingPayoutAmount !== null
                      ? !isNaN(
                          parseFloat(latestPayout.totalPendingPayoutAmount)
                        )
                        ? parseFloat(
                            latestPayout.totalPendingPayoutAmount
                          ).toFixed(2)
                        : "00"
                      : "00"}
                  </h1>
                  <div className="flex gap-1.5 items-center">
                    <p className="text-slate-600 font-medium text-xs">CAD</p>
                  </div>
                </div>
                <div className="px-4 py-5 bg-orange-100 rounded">
                  <div className="flex gap-3 items-center mb-4">
                    <div className="px-2.5 py-1.5 bg-orange-50 rounded-full">
                      <FontAwesomeIcon
                        icon={faFilter}
                        className="text-primary"
                      />
                    </div>
                    <Link href="/seller/earning">
                      <p className="text-blue-950">Completed Payouts</p>
                    </Link>
                  </div>
                  <h1 className="font-medium text-4xl  text-primary mb-2.5">
                    {latestPayout.totalPaidPayoutAmount !== null &&
                    !isNaN(parseFloat(latestPayout.totalPaidPayoutAmount))
                      ? parseFloat(latestPayout.totalPaidPayoutAmount).toFixed(
                          2
                        )
                      : "00"}
                  </h1>
                  <div className="flex gap-1.5 items-center">
                    <p className="text-slate-600 font-medium text-xs">CAD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pb-14">
            <h2 className={`text-blue-950 text-xl mb-6 noto-font`}>
              Recent Orders
            </h2>
            <div className="w-full overflow-auto ">
              {recentProduct && recentProduct.length > 0 ? (
                <table className="text-sm w-full table-fixed border-separate border-spacing-0 border border-[#4755694D] rounded bg-orange-50 ">
                  <thead className="text-left text-sm font-medium text-orange-50 bg-primary h-14">
                    <tr>
                      <th className="w-[250px]  px-4">Order ID</th>
                      <th className=" w-[200px] px-4">Customer Name</th>
                      <th className="  w-[200px] px-4">Order Status</th>
                      {/* <th className=" w-[200px] px-4">Product Name</th> */}
                      <th className=" w-[200px] px-4">Purchased Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProduct
                      ?.filter(
                        (seller) => seller.paymentStatus !== "PaymentPending"
                      )
                      ?.map((user, index) => (
                        <tr key={index} className="py-2">
                          <td className="px-4 text-blue-950 py-4">
                            {user._id ? `AM${user._id.substring(0, 6).toUpperCase()}` : "-"}
                          </td>
                          <td className="px-4 text-blue-950">
                            {user.userInfo.firstName} {user.userInfo.lastName}
                          </td>
                          <td className="px-4 text-blue-950 py-2">
                            {user.status
                              ? user.status === "OutforDelivery"
                                ? "Out for Delivery"
                                : user.status === "Cancelled"
                                ? "Cancel Order"
                                : user.status === "OnHold"
                                ? "On Hold"
                                : user.status
                              : "-"}
                          </td>
                          <td className="px-4 text-blue-950 py-2">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
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
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-5  text-blue-950  ">No orders received</p>
              )}
            </div>
          </div>
        </>
      </Layout>
    </>
  );
};

export default Index;
