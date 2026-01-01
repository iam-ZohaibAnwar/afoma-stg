import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MyAccountSidebar from "@/components/MyAccountSidebar";
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const EarningsPage = ({ cart, addToCart }) => {
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData?._id) return;

    setLoading(true);
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/commission/affiliate/${userData._id}`)
      .then((res) => setCommissions(res.data.commissions || []))
      .catch((err) => console.error("Error fetching commissions:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const { page } = router.query;
    setCurrentPage(Number(page) || 1);
  }, [router.query]);

  const totalPages = Math.ceil(commissions.length / itemsPerPage);
  const paginatedData = commissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const changePage = (page) => {
    setCurrentPage(page);
    router.push({ pathname: router.pathname, query: { page } }, undefined, { shallow: true });
  };

  return (
    <>
      <Head>
        <title>My Earnings</title>
      </Head>

      <Header cart={cart} addToCart={addToCart}/>

      <nav className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mt-4 mb-4 lg:mt-6 lg:mb-6 max-w-screen-xl mx-auto px-4">
        <Link href="/">Home</Link>
        <FontAwesomeIcon icon={faAngleRight} size="sm" />
        <Link href="/my-account/earning" className="text-primary">My Earnings</Link>
      </nav>

      <main className="max-w-screen-xl mx-auto lg:grid lg:grid-cols-6 gap-4 md:gap-6 px-4 mb-10">
        <aside className="col-span-2">
          <MyAccountSidebar />
        </aside>

        <section className="col-span-4">
          <div className="p-4 xl:p-6 bg-orange-100 rounded">
            <h1 className="text-2xl xl:text-4xl text-blue-950 mb-5 font-semibold">My Earnings</h1>
            <div className="border border-b text-slate-600/30 mb-4"></div>

            {paginatedData.length > 0 && (
              <p className="text-blue-950 text-base font-semibold mb-4">
                {commissions.length} earnings
              </p>
            )}

            {paginatedData.length > 0 ? (
              <>
                {/* Table Headers */}
                <div className="hidden md:flex bg-orange-100 rounded gap-4 font-semibold text-blue-950 text-lg mb-4">
                  <div className="w-44">Status</div>
                  <div className="w-44">Order ID</div>
                  <div className="w-44">Referral Amount</div>
                  <div className="w-44">Customer Name</div>
                </div>

                {/* Table Rows */}
                {paginatedData.map((order) => (
                  <div key={order._id} className="flex flex-col md:flex-row gap-4 border-b border-slate-300 py-4">
                    <div className="w-full md:w-44 text-blue-950 text-base">
                      <span className="md:hidden font-semibold">Status: </span>
                      {order?.payoutStatus ? `${order.payoutStatus}` : "-"}
                    </div>
                    <div className="w-full md:w-44 text-blue-950 text-base">
                      <span className="md:hidden font-semibold">Order ID: </span>
                      {order?.orderId?._id ? `AM${order.orderId._id.slice(0, 6).toUpperCase()}` : "-"}
                    </div>
                    <div className="w-full md:w-44 text-blue-950 text-base">
                      <span className="md:hidden font-semibold">Amount: </span>
                      {order?.referralAmount ? `CA$${parseFloat(order.referralAmount).toFixed(2)}` : "-"}
                    </div>
                    <div className="w-full md:w-44 text-blue-950 text-base">
                      <span className="md:hidden font-semibold">Customer: </span>
                      {order?.orderId?.userInfo
                        ? `${order.orderId.userInfo.firstName} ${order.orderId.userInfo.lastName}`.trim()
                        : "-"}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="py-20 text-center">
                <div className="mb-6 flex justify-center">
                  {/* Optional: Insert SVG or empty state icon */}
                </div>
                <h2 className="text-2xl xl:text-3xl text-blue-950 font-semibold mb-3">No Earnings Yet</h2>
                <p className="text-slate-600 text-sm">Discover unique handicrafts at the best deals.</p>
              </div>
            )}

            {/* Pagination */}
            {commissions.length > 0 && (
              <div className="flex items-center justify-end gap-6 mt-9 text-sm text-gray-600">
                <button
                  className={`flex items-center gap-2 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:text-primary"}`}
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FontAwesomeIcon icon={faAngleLeft} className="h-3" />
                  Previous
                </button>
                <button
                  className={`flex items-center gap-2 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:text-primary"}`}
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <FontAwesomeIcon icon={faAngleRight} className="h-3" />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default EarningsPage;
