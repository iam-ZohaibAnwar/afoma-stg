import Layout from "@/components/Layout";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
// removed jsonwebtoken (client bundle bloat)
import { Menu, Transition } from "@headlessui/react";


//const noto = Noto_Serif({ subsets: ["latin"] });

const SellerShippingConfig = () => {
  const [rewards, setRewards] = useState([]);
  const [sellers, setSellers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [redeemThreshold, setRedeemThreshold] = useState(500);
  const [maxRedeemToken, setMaxRedeemToken] = useState(1000);
  const router = useRouter();
  const menuRef = useRef();
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query

  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sellers`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      const filterData = response.data.filter(seller => seller.userRole == "seller")
      setSellers(filterData)
    } catch (error) {
      console.error("Error fetching List:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const { page } = router.query;
    setCurrentPage(Number(page) || 1);
  }, [router.query]);


  const searchedSeller = sellers.filter((seller) => {
    if (!searchTerm) return true;
    const username = `${seller?.firstName || ""}`.toLowerCase();
    return username.includes(searchTerm.toLowerCase());
  });

  const totalItems = searchedSeller.length
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSeller = searchedSeller.slice(indexOfFirstItem, indexOfLastItem);
  
  const onPageChange = (page) => {
    setCurrentPage(page);
    router.push({ pathname: router.pathname, query: { page } }, undefined, {
      shallow: true,
    });
  };

  const onViewClick = (id) => {
    router.push(`/admin/settings/seller-shipping-config/${id}`);
  };


  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  return (
    <>
      <Head>
        <title>Seller Shipping Config - Decentralized Marketplace</title>
        <meta
          name="description"
          content="View and manage your rewards on the decentralized marketplace."
        />
      </Head>

      <Layout userType="admin">
        <div>
          <div className="sm:flex justify-between items-center">
            <h1
              className={`md:text-2xl text-lg text-blue-950 font-medium mb-2 noto-font`}
            >
              Sellers
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Seller Shipping Config Table */}
          <div className="w-full overflow-auto bg-white rounded-md shadow shadow-slate-300 mt-6">
            <table className="text-sm w-full border-separate border-spacing-0 bg-orange-50">
              <thead className="text-left font-medium text-white bg-blue-950 h-14">
                <tr>
                  <th className="px-5 py-3 border-b border-gray-200"></th>
                  <th className="px-5 py-3 border-b border-gray-200">Seller Name</th>
                  <th className="pl-7 py-3 border-b border-gray-200">email</th>
                  <th className="px-5 py-3 border-b border-gray-200">Country</th>
                  <th className="pl-7 py-3 border-b border-gray-200">Role</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="pl-9 py-9 font-medium text-blue-950 text-sm text-center border-b border-gray-200"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : currentSeller.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="pl-10 py-9 font-medium text-blue-950 text-sm text-center border-b border-gray-200"
                    >
                      No List available.
                    </td>
                  </tr>
                ) : (
                  currentSeller.map((seller) => (
                    <tr
                      key={seller._id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-4 py-4">
                      <button
                          className="underline text-blue-950 hover:text-primary"
                          onClick={() => onViewClick(seller._id)}
                        >
                          View
                        </button>
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-blue-950">
                        {seller?.firstName || "-"} {seller?.lastName || "-"}
                      </td>
                      <td className="pl-7 py-4 border-b border-gray-200 text-blue-950">
                        {seller?.email || "-"}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-blue-950">
                        {seller?.country || "-"}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-blue-950">
                        {seller?.userRole || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {searchedSeller.length > 0 && !loading && (
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
                    currentPage === Math.ceil(totalItems / itemsPerPage)
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-primary"
                  }`}
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={
                    currentPage === Math.ceil(totalItems / itemsPerPage)
                  }
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

export default SellerShippingConfig;
