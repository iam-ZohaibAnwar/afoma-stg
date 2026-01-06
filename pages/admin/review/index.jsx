import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

//const noto = Noto_Serif({ subsets: ["latin"] });

const AdminReview = () => {
  const [activeTab, setActiveTab] = useState("reviews"); // Default to Admin Coupons
  const [review, setReview] = useState([]);

  useEffect(() => {
    if (activeTab) {
      if (activeTab === "reviews") {
        axios
          .create({
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
            },
          })
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews/`)
          .then((res) => {
            setReview(res.data.reverse());
          });
      }
      if (activeTab === "replies") {
        axios
          .create({
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
            },
          })
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews/all/replies`)
          .then((res) => {
            setReview(res.data.reverse());
          });
      }
    } else {
      return true;
    }
  }, [activeTab]);

  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = review?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((review?.length || 0) / itemsPerPage);
  const [selectedReviewStatus, setSelectedReviewStatus] = useState("");

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filterReviewsByStatus = (allReviews, status) => {
    if (!status) return allReviews;
    return allReviews.filter((review) => review.reviewStatus === status);
  };

  const visibleReview = Array.isArray(review)
    ? filterReviewsByStatus(review, selectedReviewStatus).slice(
        startIndex,
        endIndex
      )
    : [];

  const onEditClick = (id) => {
    router.push(`/admin/review/product-reviews/${id}`);
  };

  const onViewClick = (data) => {
    if (
      data &&
      data.productId &&
      data.productId.Category &&
      data.productId.SubCategory
    ) {
      let isMobile = window.innerWidth < 768;
      let hashTarget = isMobile ? "#customerReviewsMobile" : "#customerReviews";
      const route = `/category/${data?.productId?.Category?.slug}/${
        data?.productId?.SubCategory?.slug
      }${
        data?.productId?.childCategory?.slug
          ? "/" + data?.productId?.childCategory?.slug
          : ""
      }/${data?.productId?.slug}${hashTarget}`;
      window.open(route, "_blank");
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    // Update the URL with the current page query parameter
    router.push({ pathname: router.pathname, query: { page } }, undefined, {
      shallow: true,
    });
  };

  const handleReviewStatusFilter = (status) => {
    setSelectedReviewStatus(status);
  };

  return (
    <>
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
      <Layout userType="admin">
        <>
          <div className="xl:flex justify-between items-center">
            <h1
              className={`md:text-2xl text-lg text-blue-950 font-medium mb-2 noto-font `}
            >
              All Reviews
            </h1>
            <div className="flex md:flex-row flex-col items-center justify-end gap-4 shrink-0">
              <div className="flex items-center justify-end gap-4">
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="flex items-center justify-center rounded-full">
                      <p className="dashboard-button-secondary">
                        {selectedReviewStatus
                          ? selectedReviewStatus
                          : "Review Status"}
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
                            onClick={() => handleReviewStatusFilter("")}
                          >
                            All
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleReviewStatusFilter("Approved")}
                          >
                            Approved
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() => handleReviewStatusFilter("Pending")}
                          >
                            Pending
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                            onClick={() =>
                              handleReviewStatusFilter("Disapproved")
                            }
                          >
                            Disapproved
                          </button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <div className="flex gap-4 border-b mb-0 mt-4">
            <button
              className={`px-4 py-2 ${
                activeTab === "reviews" ? "border-b-2 border-blue-950" : ""
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Customer Reviews
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "replies" ? "border-b-2 border-blue-950" : ""
              }`}
              onClick={() => setActiveTab("replies")}
            >
              Seller Reply
            </button>
          </div>

          <div className="w-full overflow-auto bg-white rounded-md border border-[#4755694D] mt-4">
            <table className="text-sm w-full table-auto border-separate border-spacing-0 bg-orange-50 ">
              <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                <tr>
                  <th className="px-3 py-4 font-medium min-w-[70px]">Action</th>
                  <th className="px-3 py-4 font-medium min-w-[180px]">
                    {activeTab === "reviews" ? "Customer Name" : "Seller Name"}
                  </th>
                  <th className="px-3 py-4 font-medium min-w-[250px]">
                    Product Name
                  </th>
                  <th className="px-3 py-4 font-medium min-w-[180px]">
                    Average Rating
                  </th>
                  <th className="px-3 py-4 font-medium min-w-[150px]">
                    Price Rating
                  </th>
                  <th className="px-3 py-4 font-medium min-w-[150px]">
                    Value Rating
                  </th>
                  <th className="px-3 py-4 font-medium min-w-[150px]">
                    Quality Rating
                  </th>
                </tr>
              </thead>
              <tbody className="parent">
                {visibleReview.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="pl-9 py-9 font-medium text-blue-950 text-sm "
                    >
                      No Reviews added.
                    </td>
                  </tr>
                ) : (
                  visibleReview.map((admin, index) => (
                    <tr key={index} className="child">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => onEditClick(admin._id)}
                            className="underline text-blue-950 hover:text-primary "
                          >
                            Edit
                          </button>
                          {admin && admin.productId && (
                            <button
                              onClick={() => onViewClick(admin)}
                              className="underline text-blue-950 hover:text-primary "
                            >
                              View
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-blue-950 pr-5">
                        {`${admin?.UserId?.firstName} ${admin?.UserId?.lastName}`}
                      </td>
                      <td className="text-blue-950 px-3 py-4">
                        {admin.productId && admin.productId?.productName
                          ? admin.productId.productName
                          : "Seller Reply to Customer"}
                      </td>
                      <td className="text-blue-950 px-3 py-4">
                        {admin?.avgRating !== undefined
                          ? admin.avgRating.toFixed(1)
                          : ""}
                      </td>
                      <td className="text-blue-950 px-3 py-4">
                        {admin?.price.toFixed(1)}
                      </td>
                      <td className="text-blue-950 px-3 py-4">
                        {admin?.value.toFixed(1)}
                      </td>
                      <td className="text-blue-950 px-3 py-4">
                        {admin?.quality.toFixed(1)}
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
        {/* <>
          <div className="mt-10 lg:mt-80">
            <ComingSoonSeller />
          </div>
        </> */}
      </Layout>
    </>
  );
};

export default AdminReview;
