import { faAngleDown } from "@fortawesome/pro-light-svg-icons";
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";

//const noto = Noto_Serif({ subsets: ["latin"] });

const AdminSellerMgmt = ({data, fromSettings, isStatus, handleAddShop}) => {
  const router = useRouter();
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [isDisabled, setDisabled] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(""); // State to store selected order status
  const [shopStatus, setShopStatus] = useState(""); // State to store selected order status
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term

  const onEditClick = (id) => {
    router.push(`/admin/seller-management/basic-information?id=${id}`);
  };

  const onViewClick = (id) => {
    router.push(`/admin/seller-management/basic-information/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch user data from local storage
      const userData = JSON.parse(localStorage.getItem("user"));
      const headers = {
        Authorization: `Bearer ${userData?.accessToken}`,
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      };
      const sellersResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sellers`,
        { headers }
      );
      setPersons(sellersResponse.data);
      setFilteredPersons(sellersResponse.data); // Initialize filteredPersons with all sellers
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Handle delete operation
  const handleDelete = (id) => {
    setDeleteSellerLoading(true);
    axios
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${id}`, {
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .then(() => {
        setDeleteSellerLoading(false);
        // Update the state by filtering out the deleted person
        setPersons((prevPersons) =>
          prevPersons.filter((person) => person._id !== id)
        );
        // Update filteredPersons to reflect the change
        setFilteredPersons((prevPersons) =>
          prevPersons.filter((person) => person._id !== id)
        );
      })
      .catch((error) => {
        setDeleteSellerLoading(false);
        console.error("Error deleting person:", error);
      });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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
    if(status === "Active" || status === "Inactive"){
      setShopStatus(status);
      setSelectedStatus("");
      setCurrentPage(1); // Reset to the first page on status change
    }else{
      setShopStatus("");
      setSelectedStatus(status);
      setCurrentPage(1); // Reset to the first page on status change
    }
  };

  // Function to filter sellers based on the selected status
  const filterSellersByStatus = (sellers, status, shop_status) => {
    if (!status && !shop_status) return sellers;
    if(status){
      return sellers.filter((seller) => seller.status === status);
    }else{
      return sellers.filter((seller) => seller.shop_status == (shop_status == "Active" ? 1 : 0));
    }
  };

  // Function to filter sellers based on the search term
  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = persons.filter(
      (person) =>
        person.firstName.toLowerCase().includes(term) ||
        person.lastName.toLowerCase().includes(term)
    );
    setFilteredPersons(filtered);
    setCurrentPage(1); // Reset to the first page on search
  };
  // Filtered items for pagination
  const filteredItems = filterSellersByStatus(filteredPersons, selectedStatus, shopStatus);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visiblePersons = filteredItems
    .slice(startIndex, endIndex)
    .map((person) => ({
      id: person._id,
      uuid: person.uuid,
      fullName: `${person.firstName} ${person.lastName}`,
      email: person.email,
      userRole: person.userRole,
      city: person.city,
      phone: person.phone,
      country: person.country,
      referral_id: person?.referral_id,
      createdAt: person?.createdAt
        ? new Date(person.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
      state: person.state,
      status: person.status,
      shop_status:person.shop_status
    }));

  // For Delete Confirm Modal
  const [deleteSellerLoading, setDeleteSellerLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(undefined);

  const updateShopStatus = async (user, status) => {
    // console.log(user);return
    await axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          Authorization: `Bearer ${user?.accessToken}`
        },
      })
      .put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/seller-shop/update-status/${user?.id}?shop_status=${status}`
      )
      .then(function (response) {
        toast.success("Update Status Successfully");
        fetchData();
      })
      .catch(function (response) {
        console.log(response)
        const newError = response.response.data;
        const errorMessage = JSON.stringify(newError);
        toast.error(errorMessage);
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
        />
      </Head>

      <Layout  userType={fromSettings? "from-settings" :"admin" }>
        <>
          <div className="md:flex justify-between items-center">
            <div className="gap-6 md:mb-0 mb-3">
              <h1
                className={`md:text-2xl text-lg text-blue-950 font-medium mb-0 noto-font`}
              >
                {fromSettings && !isStatus? "Select Any 3 Sellers" :"Manage Sellers"}
              </h1>
              <p className="text-sm text-slate-600">
                {filteredPersons.length} records found
              </p>
            </div>
            <div className="flex md:flex-row flex-col items-center justify-end gap-4 shrink-0">
              <div
                className={`items-center border border-zinc-200 rounded-[3px] flex md:w-auto w-full`}
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
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex items-center justify-end gap-4">
                <Menu as="div">
                  <Menu.Button className="flex items-center justify-center rounded-full">
                    <p className="dashboard-button-secondary">
                      Seller Status{" "}
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        className="h-4 w-8 fill-blue-950"
                      />
                    </p>
                  </Menu.Button>
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
                            onClick={() => handleStatusFilter("Approved")}
                          >
                            Approved
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
                            onClick={() => handleStatusFilter("Disapproved")}
                          >
                            Disapproved
                          </button>
                        </Menu.Item>
                        {fromSettings && isStatus && (

                          <Menu.Item>

                            <button
                              className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                              onClick={() => handleStatusFilter("Active")}
                            >
                              Active
                            </button>
                          </Menu.Item>

                        )}
                        {fromSettings && isStatus && (

                          <Menu.Item>

                            <button
                              className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                              onClick={() => handleStatusFilter("Inactive")}
                            >
                              Inactive
                            </button>
                          </Menu.Item>

                        )}


                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                {!fromSettings &&
                <div className="flex items-center justify-end gap-4">
                  <button className="dashboard-button-primary">
                    {" "}
                    <Link href="/admin/seller-management/create-seller">
                      Add new seller
                    </Link>
                  </button>
                </div>}
              </div>
            </div>
          </div>
          {visiblePersons && visiblePersons.length > 0 ? (
            <div className="w-full overflow-auto bg-white rounded-md border border-[#4755694D] mt-8">
              <table className="text-sm w-full table-fixed overflow-visible border-separate border-spacing-0 bg-orange-50 ">
                <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                  <tr>
                    {(fromSettings && isStatus) &&<th className=" px-4 w-[150px]">Enable/Disable</th>}
                    {(fromSettings && !isStatus) &&<th className=" px-4 w-[50px]">select</th>}
                    <th className=" px-4 w-[100px]">Action</th>
                    {(fromSettings && isStatus) && <th className=" px-4 w-[120px]">Shop Status</th>}
                    <th className=" px-4 w-[120px]">Seller Status</th>
                    <th className="pl-7 py-5 pr-4 w-[105px]">Seller ID</th>
                    <th className=" px-4 w-[160px]">Seller Name</th>
                    <th className=" px-4 w-[305px]">Seller Email</th>
                    <th className=" px-4 w-[170px]">Referral Name</th>
                    <th className=" px-4 w-[160px]">Country</th>
                    <th className=" px-4 w-[205px]">State/Province</th>
                    <th className=" px-4 w-[205px]">Seller since</th>
                  </tr>
                </thead>
                <tbody className="parent">
                  {visiblePersons.map((user, index) => (
                    <tr key={index} className="child">
                    {fromSettings && isStatus && (
                      <td className="pl-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={user?.shop_status == 1}
                          onChange={async (e) => {
                            const newStatus = e.target.checked ? 1 : 0;
                            await updateShopStatus(user, newStatus); // Call your API
                            // Optionally: update user.status locally if needed (use state/prop update, not direct mutation)
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-600 transition-all"></div>
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-all"></div>
                      </label>
                      </td>
                    )}
                      {fromSettings && !isStatus && <td className="pl-4">
                        <input type="checkbox" onChange={(e)=>handleAddShop(e,user)} checked={Array.isArray(data) && data.some(item => item?.id === user?.id) || false}></input>
                      </td>}
                      <td className="pl-4">
                        <button
                          disabled={deleteSellerLoading}
                          className="underline text-blue-950 hover:text-primary disabled:opacity-50"
                          onClick={() => onEditClick(user.id)}
                        >
                          Edit
                        </button>{" "}
                        <button
                          disabled={deleteSellerLoading}
                          className="underline text-blue-950 hover:text-primary disabled:opacity-50"
                          onClick={() => onViewClick(user.id)}
                        >
                          View
                        </button>
                        <br />
                        <button
                          disabled={deleteSellerLoading}
                          className="underline text-blue-950 hover:text-primary disabled:opacity-50"
                          onClick={() => {
                            setSelectedSeller(user);
                            setIsConfirmModalOpen(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                      {fromSettings && isStatus &&
                        <td
                          className={`font-semibold pl-5 ${user.shop_status == 1
                              ? "text-green-800"
                              : user.shop_status == 0
                                ? "text-red-800"
                                : "text-gray-800"
                            }`}
                        >
                          {user.shop_status === 1 ? "Active" : user.shop_status === 0 ? "Inactive" : ""}
                        </td>
                      }
                      <td
                        className={`font-semibold pl-5 ${
                          user.status === "Approved"
                            ? "text-green-800"
                            : user.status === "Disapproved"
                            ? "text-red-800"
                            : "text-gray-800"
                        }`}
                      >
                        {user.status}
                      </td>
                      <td className="pl-7 py-5 w-[105px] text-blue-950">
                        {user.uuid}
                      </td>
                      <td className="text-blue-950 px-4 ">{user?.fullName}</td>
                      <td className="text-blue-950 px-4">{user.email}</td>
                      <td className="text-blue-950 px-4">
                        {(() => {
                          return user?.referral_id ? `${user?.referral_id?.firstName} ${user?.referral_id?.lastName}` : "-";
                        })()}
                      </td>
                      <td className="text-blue-950 px-4">{user.country}</td>
                      <td className="text-blue-950 px-4">{user.state}</td>
                      <td className="text-blue-950 px-4">{user.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-5  text-blue-950  ">No seller found</p>
          )}
          {filteredPersons.length > 0 && (
            <div className="pagination flex text-sm items-center justify-end text-bodyText gap-x-6 my-9">
              <div className="">
                <button
                  className={` flex gap-2 items-center text-gray-500  ${
                    currentPage === 1
                      ? "cursor-not-allowed opacity-50 hover:text-gray-500"
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
                      currentPage ===
                      Math.ceil(filteredPersons.length / itemsPerPage)
                        ? "cursor-not-allowed opacity-50 hover:text-gray-500"
                        : "hover:text-primary"
                    }`}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredPersons.length / itemsPerPage)
                    }
                  >
                    Next
                    <FontAwesomeIcon icon={faAngleRight} className="h-[8px] " />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      </Layout>
      {/* Pass dynamic props to the ConfirmModal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen && selectedSeller}
        onClose={() => {
          setIsConfirmModalOpen(false);
        }}
        onConfirm={() => {
          setIsConfirmModalOpen(false);
          handleDelete(selectedSeller.id);
        }}
        header="Delete Seller"
        message="Are you sure you want to delete this seller?"
        confirmText="Yes, Delete"
        bgClass="bg-red-500"
      />
    </>
  );
};

export default AdminSellerMgmt;
