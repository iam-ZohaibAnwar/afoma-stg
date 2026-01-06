import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const ConfirmModal = dynamic(() => import("@/components/ConfirmModal"), { ssr: false });
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "@headlessui/react";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Coupons = () => {
  const [activeTab, setActiveTab] = useState("admin"); // Default to Admin Coupons
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = resources?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((resources?.length || 0) / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const visibleReview = Array.isArray(resources)
    ? resources.slice(startIndex, endIndex)
    : [];

  useEffect(() => {
    if (activeTab === "admin") {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData && userData.userId) {
        axios
          .create({
            headers: {
              "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
            },
          })
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}/coupon/`)
          .then((res) => {
            if (res && res.data && res.data) {
              const filtered = res.data.filter(
                (coupon) =>
                  coupon.createdBy && coupon.createdBy._id == userData.userId
              );
              setResources(filtered.reverse());
            }
          });
      }
    }
    if (activeTab === "seller") {
      const userData = JSON.parse(localStorage.getItem("user"));
      axios
        .create({
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        })
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/coupon/`)
        .then((res) => {
          if (res && res.data && res.data) {
            const filtered = res.data.filter(
              (coupon) =>
                coupon.createdBy && coupon.createdBy._id !== userData.userId
            );
            setResources(filtered.reverse());
          }
        });
    }
  }, [activeTab]);

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

  const onEditClick = (id) => {
    let url;
    url = `/admin/coupons/${id}`;
    router.push(url);
  };

  const addNew = () => {
    router.push("/admin/coupons/add");
  };

  // For Delete Confirm Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);

  const handleDelete = (id) => {
    setLoading(true);
    // Send a delete request to delete person by the using id
    axios
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/coupon/${id}`, {
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .then(() => {
        // Update the state by filtering out the deleted person
        setResources((prevResources) =>
          prevResources.filter((res) => res._id !== id)
        );
        setLoading(false);
        toast.success("Coupon deleted successfully");
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Something went wrong");
      });
  };

  const handleSendNotification = (id) => {
    setLoading(true);
    // Send a delete request to delete person by the using id
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/send-all/${id}`, {
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .then(() => {
        setLoading(false);
        toast.success("Notification send successfully");
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Something went wrong");
      });
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
          <div className="flex justify-between items-center mb-5">
            <h1
              className={`text-2xl text-blue-950 font-medium mb-2 noto-font `}
            >
              All Coupons
            </h1>
            <button
              className="dashboard-button-primary rounded-md"
              onClick={addNew}
            >
              Add new Coupon
            </button>
          </div>
          <div className="flex gap-4 border-b mb-0">
            <button
              className={`px-4 py-2 ${
                activeTab === "admin" ? "border-b-2 border-blue-950" : ""
              }`}
              onClick={() => setActiveTab("admin")}
            >
              Admin Coupons
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "seller" ? "border-b-2 border-blue-950" : ""
              }`}
              onClick={() => setActiveTab("seller")}
            >
              Seller Coupons
            </button>
          </div>

          <div className="w-full overflow-auto bg-white rounded-md border border-[#4755694D] mt-6">
            <table className="text-sm w-full table-auto border-separate border-spacing-0 bg-orange-50 ">
              <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                <tr>
                  <th className="px-4 font-medium min-w-[50px] text-center">
                    Action
                  </th>
                  {activeTab && activeTab === "seller" && (
                    <th className="px-4 font-medium min-w-[150px]">
                      Seller Name
                    </th>
                  )}
                  <th className="px-4 font-medium min-w-[150px]">
                    Coupon Code
                  </th>
                  <th className="px-4 font-medium min-w-[150px]">
                    Coupon Type
                  </th>
                  <th className="px-4 font-medium min-w-[150px]">Discount</th>
                  <th className="px-4 font-medium min-w-[220px]">
                    Minimum Cart Amount
                  </th>
                  <th className="px-4 font-medium min-w-[150px]">
                    Usage Count
                  </th>
                  <th className="px-4 font-medium min-w-[150px]">
                    Limit Per Coupon
                  </th>
                  <th className="px-4 font-medium min-w-[170px]">
                    Limit Per Customer
                  </th>
                </tr>
              </thead>
              <tbody className="parent">
                {visibleReview.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="pl-4 py-4 font-medium text-blue-950 text-sm "
                    >
                      No Coupons added.
                    </td>
                  </tr>
                ) : (
                  visibleReview.map((item, index) => (
                    <tr key={index} className="child">
                      <td className="px-4 py-2 font-medium min-w-[50px] text-center">
                        <Menu
                          as="div"
                          className="relative inline-block text-center"
                        >
                          <Menu.Button
                            disabled={loading}
                            className="items-center hover:bg-orange-100 rounded-[4px] w-[26px] h-[28px] flex justify-center text-primary hover:text-gray-300 disabled:opacity-50"
                          >
                            <span className="sr-only">Open options</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={4}
                                d="M12 6v.01M12 12v.01M12 18v.01"
                              />
                            </svg>
                          </Menu.Button>
                          <Menu.Items className="z-[99] top-[-30px] absolute mt-2 left-full w-28 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => onEditClick(item._id)}
                                    disabled={loading}
                                    className={`${
                                      active ? "bg-gray-100" : ""
                                    } w-full group flex items-center px-4 py-2 text-sm text-gray-700 disabled:opacity-50`}
                                  >
                                    Edit
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setIsConfirmModalOpen(true);
                                    }}
                                    disabled={loading}
                                    className={`${
                                      active ? "bg-gray-100" : ""
                                    } w-full group flex items-center px-4 py-2 text-sm text-gray-700 disabled:opacity-50`}
                                  >
                                    Delete
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setIsNotificationModalOpen(true);
                                    }}
                                    disabled={loading}
                                    className={`${
                                      active ? "bg-gray-100" : ""
                                    } w-full group flex items-center px-4 py-2 text-sm text-gray-700 disabled:opacity-50`}
                                  >
                                    Notify
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Menu>
                      </td>
                      {activeTab &&
                        activeTab === "seller" &&
                        item.createdBy && (
                          <td className="px-4 font-medium min-w-[150px]">
                            {item.createdBy.firstName} {item.createdBy.lastName}
                          </td>
                        )}
                      <td className="px-4 font-medium min-w-[150px]">
                        {item.couponCode}
                      </td>
                      <td className="px-4 font-medium min-w-[150px]">
                        {item.couponType.toUpperCase()}
                      </td>
                      <td className="px-4 font-medium min-w-[150px]">
                        {item.discountAmount}
                      </td>
                      <td className="px-4 font-medium min-w-[220px]">
                        {item.minimumCartAmount}
                      </td>
                      <td className="px-4 font-medium min-w-[150px]">
                        {item.usageCount}
                      </td>
                      <td className="px-4 font-medium min-w-[150px]">
                        {item.usageLimitPerCoupon}
                      </td>
                      <td className="px-4 font-medium min-w-[170px]">
                        {item.usageLimitPerCustomer}
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
      {/* Pass dynamic props to the ConfirmModal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen && selectedItem}
        onClose={() => {
          setIsConfirmModalOpen(false);
        }}
        onConfirm={() => {
          setIsConfirmModalOpen(false);
          handleDelete(selectedItem._id);
        }}
        header="Delete Coupon"
        message="Are you sure you want to delete this coupon?"
        confirmText="Yes, Delete"
        bgClass="bg-red-500"
      />

      <ConfirmModal
        isOpen={isNotificationModalOpen && selectedItem}
        onClose={() => {
          setIsNotificationModalOpen(false);
        }}
        onConfirm={() => {
          setIsNotificationModalOpen(false);
          handleSendNotification(selectedItem._id);
        }}
        header="Send Notification"
        message="Are you sure you want to notification to all users?"
        confirmText="Yes, Send"
        bgClass="bg-blue-500"
      />
    </>
  );
};

export default Coupons;
