import Layout from "@/components/Layout";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

//const noto = Noto_Serif({ subsets: ["latin"] });

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const itemsPerPage = 10;

  // Fetch orders on initial load
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData?.userId) {
        throw new Error("affiliate ID is not available.");
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/orders/getOrders/ByUserId/${userData?.userId}`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      let filterOrders = [];
      if (
        response.data &&
        response.data.reversedOrders &&
        response.data.reversedOrders.length
      ) {
        filterOrders = response.data.reversedOrders.filter((ord) => {
          return ord.userInfo.userId == userData.userId;
        });
      }
      setOrders(filterOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Sync current page with the URL
    const { page } = router.query;
    setCurrentPage(Number(page) || 1);
  }, [router.query]);

  // Filter orders by payment status
  const filteredOrders = orders.filter(
    (order) => order.paymentStatus === "PaymentDone"
  );

  // Search orders by customer name
  const searchOrdersByName = (orders, term) => {
    if (!term) return orders;
    return orders.filter((order) =>
      `${order.userInfo?.firstName || ""} ${order.userInfo?.lastName || ""}`
        .toLowerCase()
        .includes(term.toLowerCase())
    );
  };

  // Apply search and pagination
  const searchedOrders = searchOrdersByName(filteredOrders, searchTerm);
  const totalPages = Math.ceil(searchedOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = searchedOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Navigate to the order view page
  const onViewClick = (id) => {
    router.push(`/affiliate/my-orders/view?id=${id}`);
  };

  // Change pagination and update URL
  const onPageChange = (page) => {
    setCurrentPage(page);
    router.push({ pathname: router.pathname, query: { page } }, undefined, {
      shallow: true,
    });
  };

  return (
    <>
      <Head>
        <title>My Orders - Decentralized Marketplace</title>
        <meta
          name="description"
          content="View and manage your orders on the decentralized marketplace."
        />
      </Head>

      <Layout userType="affiliate">
        <div>
          <div className="sm:flex flex-col md:flex-row justify-between md:items-center mb-5">
            <h1
              className={`text-xl lg:text-2xl text-blue-950 font-medium mb-2 noto-font`}
            >
              My Orders
            </h1>
            <div className="flex sm:flex-row flex-col sm:items-center justify-end gap-4">
              <div className="flex items-center border border-zinc-200 rounded-[3px]">
                <div className="bg-primary p-3 rounded-tl-[3px] rounded-bl-[3px]">
                  <FontAwesomeIcon icon={faSearch} className="text-white" />
                </div>
                <input
                  type="text"
                  className="w-full border-none p-2 focus:outline-none h-[48px]"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="w-full overflow-auto bg-white rounded-md shadow shadow-slate-300 mt-6">
            <table className="text-sm w-full border-separate border-spacing-0 bg-orange-50">
              <thead className="text-left font-medium text-white bg-blue-950 h-14">
                <tr>
                  <th className="px-5 py-3 border-b border-gray-200 w-[66px]">
                    Action
                  </th>
                  <th className="px-5 py-3 border-b border-gray-200">
                    Order ID
                  </th>
                  <th className="px-5 py-3 border-b border-gray-200">
                    Purchased Date
                  </th>
                  <th className="px-5 py-3 border-b border-gray-200">
                    Order Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="pl-9 py-9 font-medium text-blue-950 text-sm text-center border-b border-gray-200"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : currentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="pl-10 py-9 font-medium text-blue-950 text-sm text-center border-b border-gray-200"
                    >
                      No orders placed.
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-5 py-3 border-b border-gray-200 text-blue-950">
                        <button
                          className="underline hover:text-primary"
                          onClick={() => onViewClick(order._id)}
                        >
                          View
                        </button>
                      </td>
                      <td className="px-5 py-3 border-b border-gray-200 text-blue-950">
                        {order._id ? `AM${order._id.substring(0, 6).toUpperCase()}` : "-"}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-blue-950">
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
                      <td
                        className={`px-5 py-3 border-b border-gray-200 font-semibold ${
                          order.status === "Delivered"
                            ? "text-green-800"
                            : order.status === "Cancelled" ||
                              order.status === "Delayed"
                            ? "text-red-800"
                            : order.status === "Shipped"
                            ? "text-yellow-600"
                            : order.status === "Abandoned"
                            ? "text-orange-800"
                            : order.status === "Processing" ||
                              order.status === "Pending"
                            ? "text-sky-700"
                            : "text-gray-800"
                        }`}
                      >
                        {order.status || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {searchedOrders.length > 0 && !loading && (
            <div className="bg-orange-50 mt-6">
              <div className="flex items-center justify-end gap-x-6 my-9">
                <button
                  className={`flex items-center gap-2 ${
                    currentPage === 1
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-primary"
                  }`}
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FontAwesomeIcon icon={faAngleLeft} /> Previous
                </button>
                <button
                  className={`flex items-center gap-2 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-primary"
                  }`}
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next <FontAwesomeIcon icon={faAngleRight} />
                </button>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default MyOrders;
