import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
//const noto = Noto_Serif({ subsets: ["latin"] });

const AdminUserMgmt = () => {
  const router = useRouter();
  const [persons, setPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData && userData?.accessToken) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${userData?.accessToken}`,
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        })
        .then((res) => {
          setPersons(res.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.error("No user data found in localStorage");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const filtered = persons.filter((person) =>
      `${person.firstName} ${person.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredPersons(filtered);
  }, [searchTerm, persons]);
  const adminNameList = filteredPersons.map((person) => ({
    id: person._id,
    fullName: `${person.firstName} ${person.lastName}`,
    email: person.email,
    userRole: person.userRole,
  }));

  const currentItems = adminNameList.slice(indexOfFirstItem, indexOfLastItem);

  const onEditClick = (id) => {
    router.push(`/admin/user-management/userform?id=${id}`);
  };

  const onViewClick = (id) => {
    router.push(`/admin/user-management/userform/${id}`);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    axios
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${userData?.accessToken}`,
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .then(() => {
        setPersons((prevPersons) =>
          prevPersons.filter((person) => person._id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting person:", error);
      });
  };

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

    const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to the first page on a new status filter
  };

  useEffect(() => {
    if(selectedStatus){
      const filtered = persons.filter((person) => person.userRole == selectedStatus.toLowerCase());
      setFilteredPersons(filtered);
    }
  }, [selectedStatus, persons]);

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

      <Layout userType="admin">
        <div className="sm:flex justify-between items-center mb-5">
          <h1
            className={`text-lg md:text-2xl text-blue-950 font-medium mb-2 noto-font `}
          >
            Users
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
                placeholder="Search by user name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end gap-4">
              <button className="dashboard-button-primary">
                <Link href="/admin/user-management/create-user">
                  Add new user
                </Link>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <Menu as="div">
                <div>
                  <Menu.Button className="flex items-center rounded-full">
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
                  enterFrom="transform opacity-0 "
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-200"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 "
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
                          onClick={() => handleStatusFilter("Customer")}
                        >
                          User
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                          onClick={() => handleStatusFilter("Seller")}
                        >
                          Seller
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          className="hover:bg-orange-100 group flex w-full items-center gap-3 px-3.5 py-2"
                          onClick={() => handleStatusFilter("Affiliate")}
                        >
                          Affiliate
                        </button>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="ml-9 text-blue-950 text-xl">Loading...</p>
        ) : currentItems && currentItems.length > 0 ? (
          <div className="w-full overflow-auto bg-white rounded-md border border-[#4755694D] mt-6">
            <table className="text-sm w-full table-fixed border-separate border-spacing-0 bg-orange-50 ">
              <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                <tr>
                  <th className="px-5 w-[150px] font-medium">Action</th>
                  <th className="px-5 w-[150px] font-medium">User Name</th>
                  <th className="px-5 w-[280px] font-medium">User Email</th>
                  <th className="px-5 w-[150px] font-medium">User Role</th>
                </tr>
              </thead>
              <tbody className="parent">
                {currentItems.map((user, index) => (
                  <tr key={index} className="child">
                    <td className="px-5 py-3">
                      <button
                        className="underline text-blue-950 hover:text-primary"
                        onClick={() => onViewClick(user.id)}
                      >
                        View
                      </button>{" "}
                      <button
                        className="underline text-blue-950 hover:text-primary"
                        onClick={() => onEditClick(user.id)}
                      >
                        Edit
                      </button>
                      <br />
                      <button
                        className="underline text-blue-950 hover:text-primary"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                    <td className="px-5 text-blue-950">{user.fullName}</td>
                    <td
                      className="px-5 text-blue-950"
                      style={{ overflowWrap: "break-word" }}
                    >
                      {" "}
                      {user.email}
                    </td>
                    <td className="px-5 text-blue-950">
                      {user.userRole === "seller"
                        ? "Seller"
                        : user.userRole === "customer"
                        ? "Customer"
                        : user.userRole === "admin"
                        ? "Admin"
                        : user.userRole === "affiliate"
                        ? "Affiliate"
                        : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-blue-950  text-xl">
            No data found to show
          </p>
        )}
        {adminNameList.length > 0 && (
          <div className="pagination flex text-sm items-center justify-end text-bodyText gap-x-6 my-9">
            <div>
              <button
                className={`flex gap-2 items-center text-gray-500  ${
                  currentPage === 1
                    ? "cursor-not-allowed opacity-50 hover:text-gray-500"
                    : "hover:text-primary"
                }`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" />
                Previous
              </button>
            </div>

            <div>
              <button
                className={` flex gap-2 items-center text-gray-500  ${
                  indexOfLastItem >= adminNameList.length
                    ? "cursor-not-allowed opacity-50 hover:text-gray-500"
                    : "hover:text-primary"
                }`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={indexOfLastItem >= adminNameList.length}
              >
                Next
                <FontAwesomeIcon icon={faAngleRight} className="h-[8px]" />
              </button>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default AdminUserMgmt;
