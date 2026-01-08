import {
  faAngleLeft,
  faAngleRight,
  faAnglesRight,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, Fragment } from "react";
//import { Noto_Serif } from "next/font/google";
import { Menu, Transition } from "@headlessui/react";
import dynamic from "next/dynamic";
import { faAngleDown, faCircleInfo } from "@fortawesome/pro-light-svg-icons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });
const SellerInfoLayout = dynamic(() => import("@/components/SellerInfoLayout"), { ssr: false });
const SellerProduct = dynamic(() => import("@/components/SellerProduct"), { ssr: false });

//const noto = Noto_Serif({ subsets: ["latin"] });

const CustomerOrderView = () => {
  const [doctorEnquiryData, setDoctorEnquiryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState();
  const [totalDataCount, setDataTotalCount] = useState();
  const [user, setUser] = useState({});

  const router = useRouter();

  const [selectedMenuItem, setSelectedMenuItem] = useState("Completed");
  const [selectedMenuItem1, setSelectedMenuItem1] = useState("Completed");
  const [selectedMenuItem2, setSelectedMenuItem2] = useState("Completed");
  const [selectedMenuItem3, setSelectedMenuItem3] = useState("Completed");
  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };
  const handleMenuItemClick1 = (menuItem) => {
    setSelectedMenuItem1(menuItem);
  };
  const handleMenuItemClick2 = (menuItem) => {
    setSelectedMenuItem2(menuItem);
  };
  const handleMenuItemClick3 = (menuItem) => {
    setSelectedMenuItem3(menuItem);
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

      <Layout userType="seller">
        <>
          <div className="pb-[76px]">
            <div className="flex justify-between items-center mb-12">
              <h1
                className={`text-2xl text-blue-950 font-medium mb-2 noto-font `}
              >
                Order View |<span className="text-lg">#1025789523</span>
              </h1>

              <div className="flex items-center justify-end gap-4">
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button
                      className={`flex items-center justify-center rounded-full ${
                        selectedMenuItem === "Completed"
                          ? "bg-green-800 text-white"
                          : selectedMenuItem === "Shipped"
                          ? "bg-yellow-600 text-white"
                          : selectedMenuItem === "Cancel order"
                          ? "bg-red-700 text-white"
                          : "bg-gray-500 text-white"
                      } cursor-pointer py-2.5 px-4 gap-2 rounded-sm text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center`}
                    >
                      {selectedMenuItem}
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
                            fill="#fff"
                            stroke="#fff"
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
                    <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                      <div className="py-2">
                        <Menu.Item>
                          <button
                            className={`${
                              selectedMenuItem === "Completed"
                                ? "bg-orange-100 text-primary"
                                : "hover:bg-orange-100 hover:text-primary"
                            } group flex w-full items-center gap-3 px-3.5 py-2`}
                            onClick={() => handleMenuItemClick("Completed")}
                          >
                            Completed
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className={`${
                              selectedMenuItem === "Shipped"
                                ? "bg-orange-100 text-primary"
                                : "hover:bg-orange-100 hover:text-primary"
                            } group flex w-full items-center gap-3 px-3.5 py-2`}
                            onClick={() => handleMenuItemClick("Shipped")}
                          >
                            Shipped
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className={`${
                              selectedMenuItem === "Pending"
                                ? "bg-orange-100 text-primary"
                                : "hover:bg-orange-100 hover:text-primary"
                            } group flex w-full items-center gap-3 px-3.5 py-2`}
                            onClick={() => handleMenuItemClick("Pending")}
                          >
                            Pending
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className={`${
                              selectedMenuItem === "Cancel order"
                                ? "bg-orange-100 text-primary"
                                : "hover:bg-orange-100 hover:text-primary"
                            } group flex w-full items-center gap-3 px-3.5 py-2`}
                            onClick={() => handleMenuItemClick("Cancel order")}
                          >
                            Cancel order
                          </button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>

            <div>
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                }}
                onSubmit={async (values) => {
                  await new Promise((r) => setTimeout(r, 500));
                  alert(JSON.stringify(values, null, 2));
                }}
              >
                <Form>
                  <div className="grid gap-12 md:grid-cols-3 mb-6  ">
                    <div className="relative">
                      <div>
                        {" "}
                        <label
                          htmlFor="customerName"
                          className="text-base text-blue-950"
                        >
                          Customer Name
                        </label>
                      </div>
                      <div className="mt-3">
                        <Field
                          type="text"
                          name="customerName"
                          id="customerName"
                          placeholder="Clarissa Rebello"
                          className="bg-orange-100 border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="customerName"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div>
                        <label
                          htmlFor="customerEmailID"
                          className="text-base  text-blue-950 "
                        >
                          Customer Email ID
                        </label>
                      </div>
                      <div className="mt-3">
                        {" "}
                        <Field
                          type="text"
                          name="customerEmailID"
                          id="customerEmailID"
                          placeholder="clarissar@gmail.com"
                          className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="customerEmailID"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div>
                        {" "}
                        <label
                          htmlFor="purchasedDate"
                          className="text-base  text-blue-950"
                        >
                          Purchased Date
                        </label>
                      </div>
                      <div className="mt-3">
                        {" "}
                        <Field
                          type="text"
                          name="purchasedDate"
                          id="purchasedDate"
                          placeholder="July 31, 2023"
                          className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                        />
                        <ErrorMessage
                          name="purchasedDate"
                          component="p"
                          className="invalid"
                        />
                      </div>
                    </div>
                  </div>
                </Form>
              </Formik>
            </div>

            <div className="w-full overflow-auto bg-white rounded-md shadow shadow-slate-300 mt-6">
              <table className="text-sm w-full table-fixed border-separate border-spacing-0 bg-orange-50 ">
                <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                  <tr>
                    <th className="pl-7 py-5 pr-16 font-medium">
                      Product Image
                    </th>
                    <th className=" pr-16 font-medium">Product Name</th>
                    <th className=" pr-16 font-medium">Unit Price</th>
                    <th className=" pr-16 font-medium">Price</th>
                    <th className=" pr-16 font-medium">Total</th>
                    <th className=" pr-16 font-medium">Qty</th>
                    <th className=" pr-16 font-medium">SKU</th>
                    <th className=" pr-16 font-medium">Estimated Delivery</th>
                    <th className=" pr-16 font-medium">Personalized Note</th>
                    <th className=" pr-16 w-36 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pl-7 py-5 text-blue-950">
                      <Image
                        src={"/assets/product small 1.png"}
                        alt="Fashion"
                        height={45}
                        width={45}
                        className="shrink-0"
                      />
                    </td>
                    <td className="text-blue-950">Banded Weave Loafers</td>
                    <td className="text-blue-950">CA$85.00</td>
                    <td className="text-blue-950">CA$87.00</td>
                    <td className="text-blue-950">CA$81.00</td>
                    <td className="text-blue-950">1</td>
                    <td className="text-blue-950">XYZ12345</td>
                    <td className="text-blue-950">August 4, 2023</td>
                    <td>
                      My note for...{" "}
                      <a className="underline text-blue-950" href="#">
                        View
                      </a>
                    </td>
                    {/* <td className="text-green-800 font-semibold">Completed</td> */}
                    <td>
                      {" "}
                      {/* <button className="py-2.5 px-4 w-[131px] bg-green-800 gap-2 rounded-sm text-white cursor-pointer text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center">
                        Completed
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
                      </button> */}
                      <Menu as="div" className="relative">
                        <div>
                          <Menu.Button
                            className={`flex items-center justify-center rounded-full ${
                              selectedMenuItem1 === "Completed"
                                ? "bg-green-800 text-white"
                                : selectedMenuItem1 === "Shipped"
                                ? "bg-yellow-600 text-white"
                                : selectedMenuItem1 === "Cancel order"
                                ? "bg-red-700 text-white"
                                : "bg-gray-500 text-white"
                            } cursor-pointer py-2.5 px-4 gap-2 rounded-sm text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center`}
                          >
                            {selectedMenuItem1}
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
                                  fill="#fff"
                                  stroke="#fff"
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
                          <Menu.Items className="absolute mt-2 w-40 origin-top-right -left-[38px] rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                            <div className="py-2">
                              <Menu.Item>
                                <button
                                  className={`${
                                    selectedMenuItem1 === "Completed"
                                      ? "bg-orange-100 text-primary"
                                      : "hover:bg-orange-100 hover:text-primary"
                                  } group flex w-full items-center gap-3 px-3.5 py-2`}
                                  onClick={() =>
                                    handleMenuItemClick1("Completed")
                                  }
                                >
                                  Completed
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  className={`${
                                    selectedMenuItem1 === "Shipped"
                                      ? "bg-orange-100 text-primary"
                                      : "hover:bg-orange-100 hover:text-primary"
                                  } group flex w-full items-center gap-3 px-3.5 py-2`}
                                  onClick={() =>
                                    handleMenuItemClick1("Shipped")
                                  }
                                >
                                  Shipped
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  className={`${
                                    selectedMenuItem1 === "Pending"
                                      ? "bg-orange-100 text-primary"
                                      : "hover:bg-orange-100 hover:text-primary"
                                  } group flex w-full items-center gap-3 px-3.5 py-2`}
                                  onClick={() =>
                                    handleMenuItemClick1("Pending")
                                  }
                                >
                                  Pending
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  className={`${
                                    selectedMenuItem1 === "Cancel order"
                                      ? "bg-orange-100 text-primary"
                                      : "hover:bg-orange-100 hover:text-primary"
                                  } group flex w-full items-center gap-3 px-3.5 py-2`}
                                  onClick={() =>
                                    handleMenuItemClick1("Cancel order")
                                  }
                                >
                                  Cancel order
                                </button>
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </td>
                  </tr>

                  <tr className="bg-orange-100">
                    <td className="pl-7 py-6 text-blue-950">
                      <Image
                        src={"/assets/product small 2.png"}
                        alt="Fashion"
                        height={45}
                        width={45}
                        className="shrink-0"
                      />
                    </td>
                    <td className="text-blue-950">
                      The Flared Blouse - One Size Fits All
                    </td>
                    <td className="text-blue-950">CA$24.00</td>
                    <td className="text-blue-950">CA$25.00</td>
                    <td className="text-blue-950">CA$28.00</td>
                    <td className="text-blue-950">2</td>
                    <td className="text-blue-950">XYZ12345</td>
                    <td className="text-blue-950">August 8, 2023</td>

                    <td>
                      My note for...{" "}
                      <a className="underline text-blue-950" href="#">
                        View
                      </a>
                    </td>
                    {/* <td className="text-yellow-600 font-semibold">
                      Shipped</td> */}
                    <td>
                      <Menu as="div" className="relative">
                        <div>
                          <Menu.Button
                            className={`flex items-center justify-center rounded-full ${
                              selectedMenuItem2 === "Completed"
                                ? "bg-green-800 text-white"
                                : selectedMenuItem2 === "Shipped"
                                ? "bg-yellow-600 text-white"
                                : selectedMenuItem2 === "Cancel order"
                                ? "bg-red-700 text-white"
                                : "bg-gray-500 text-white"
                            } cursor-pointer py-2.5 px-4 gap-2 rounded-sm text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center`}
                          >
                            {selectedMenuItem2}
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
                                  fill="#fff"
                                  stroke="#fff"
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
                          <Menu.Items className="absolute mt-2 w-40 origin-top-right -left-[38px] rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                            <div className="py-2">
                              <Menu.Item>
                                <button
                                  className={`${
                                    selectedMenuItem2 === "Completed"
                                      ? "bg-orange-100 text-primary"
                                      : "hover:bg-orange-100 hover:text-primary"
                                  } group flex w-full items-center gap-3 px-3.5 py-2`}
                                  onClick={() =>
                                    handleMenuItemClick2("Completed")
                                  }
                                >
                                  Completed
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  className={`${
                                    selectedMenuItem2 === "Shipped"
                                      ? "bg-orange-100 text-primary"
                                      : "hover:bg-orange-100 hover:text-primary"
                                  } group flex w-full items-center gap-3 px-3.5 py-2`}
                                  onClick={() =>
                                    handleMenuItemClick2("Shipped")
                                  }
                                >
                                  Shipped
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  className={`${
                                    selectedMenuItem2 === "Pending"
                                      ? "bg-orange-100 text-primary"
                                      : "hover:bg-orange-100 hover:text-primary"
                                  } group flex w-full items-center gap-3 px-3.5 py-2`}
                                  onClick={() =>
                                    handleMenuItemClick2("Pending")
                                  }
                                >
                                  Pending
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  className={`${
                                    selectedMenuItem2 === "Cancel order"
                                      ? "bg-orange-100 text-primary"
                                      : "hover:bg-orange-100 hover:text-primary"
                                  } group flex w-full items-center gap-3 px-3.5 py-2`}
                                  onClick={() =>
                                    handleMenuItemClick2("Cancel order")
                                  }
                                >
                                  Cancel order
                                </button>
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      {/* <button className="py-2.5 px-4 w-[131px] bg-yellow-600 gap-2 rounded-sm text-white cursor-pointer text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center">
                        Shipped
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
                      </button> */}
                    </td>
                  </tr>

                  <tr>
                    <td className="pl-7 py-6 text-blue-950">
                      <Image
                        src={"/assets/product small 3.png"}
                        alt="Fashion"
                        height={45}
                        width={45}
                        className="shrink-0"
                      />
                    </td>
                    <td className="text-blue-950">Folarin Bag Set</td>
                    <td className="text-blue-950">CA$63.00</td>
                    <td className="text-blue-950">CA$65.00</td>
                    <td className="text-blue-950">CA$68.00</td>
                    <td className="text-blue-950">1</td>
                    <td className="text-blue-950">XYZ12345</td>
                    <td className="text-blue-950">August 10, 2023</td>

                    <td>
                      My note for...{" "}
                      <a className="underline text-blue-950" href="#">
                        View
                      </a>
                    </td>
                    {/* <td className="text-gray-500 font-semibold">
                     Pending</td> */}
                    <td>
                      {/* <button className="py-2.5 px-4 w-[131px] bg-gray-500 gap-2 rounded-sm text-white cursor-pointer text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center">
                        Pending
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
                      </button> */}
                      <Menu as="div" className="relative">
                        <div>
                          <Menu.Button
                            className={`flex items-center justify-center rounded-full ${
                              selectedMenuItem3 === "Completed"
                                ? "bg-green-800 text-white"
                                : selectedMenuItem3 === "Shipped"
                                ? "bg-yellow-600 text-white"
                                : selectedMenuItem3 === "Cancel order"
                                ? "bg-red-700 text-white"
                                : "bg-gray-500 text-white"
                            } cursor-pointer py-2.5 px-4 gap-2 rounded-sm text-center hover:border-orange-700 transition-colors ease-in inline-flex items-center justify-center`}
                          >
                            {selectedMenuItem3}
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
                                  fill="#fff"
                                  stroke="#fff"
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
                          <Menu.Items className="absolute mt-2 w-40 origin-top-right -left-[38px] rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                            <div className="py-2">
                              <Menu.Item>
                                <button
                                  className={`${
                                    selectedMenuItem3 === "Completed"
                                      ? "bg-orange-100 text-primary"
                                      : "hover:bg-orange-100 hover:text-primary"
                                  } group flex w-full items-center gap-3 px-3.5 py-2`}
                                  onClick={() =>
                                    handleMenuItemClick3("Completed")
                                  }
                                >
                                  Completed
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  className={`${
                                    selectedMenuItem3 === "Shipped"
                                      ? "bg-orange-100 text-primary"
                                      : "hover:bg-orange-100 hover:text-primary"
                                  } group flex w-full items-center gap-3 px-3.5 py-2`}
                                  onClick={() =>
                                    handleMenuItemClick3("Shipped")
                                  }
                                >
                                  Shipped
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  className={`${
                                    selectedMenuItem3 === "Pending"
                                      ? "bg-orange-100 text-primary"
                                      : "hover:bg-orange-100 hover:text-primary"
                                  } group flex w-full items-center gap-3 px-3.5 py-2`}
                                  onClick={() =>
                                    handleMenuItemClick3("Pending")
                                  }
                                >
                                  Pending
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  className={`${
                                    selectedMenuItem3 === "Cancel order"
                                      ? "bg-orange-100 text-primary"
                                      : "hover:bg-orange-100 hover:text-primary"
                                  } group flex w-full items-center gap-3 px-3.5 py-2`}
                                  onClick={() =>
                                    handleMenuItemClick3("Cancel order")
                                  }
                                >
                                  Cancel order
                                </button>
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-base text-blue-950 mt-6 mb-3">Payment Details</p>

            <div className="p-5 max-w-[392px] bg-orange-100 border rounded">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-blue-950">Item(s) total</p>
                <p className="text-sm text-blue-950">CA$177.00</p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-blue-950">Tax</p>
                <p className="text-sm text-blue-950">CA$2.00</p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-blue-950">Commission</p>
                <p className="text-sm text-blue-950">CA$4.00</p>
              </div>

              <div className="flex items-center justify-between mb-3.5 pb-3.5 border-b ">
                <p className="text-sm text-blue-950">Shipping charges</p>
                <p className="text-sm text-blue-950">CA$3.00</p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <p className="text-base font-medium text-blue-950">Total</p>
                <p className="text-base font-medium text-blue-950">CA$186.00</p>
              </div>

              {/* <div className="flex item-center gap-3 ">
                  
  
                  <p className="text-base text-blue-950">Top Seller</p>
                </div>
  
                <p className="mt-4 text-2xl text-primary font-medium">
                  Blessing Ehizoje
                </p>
  
                <div className="flex items-center justify-start gap-3  mt-3">
                  <button className="text-slate-600 text-xs font-medium">
                    This Month{" "}
                  </button>
                  
                </div> */}
            </div>

            <div className="mt-8">
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                }}
                onSubmit={async (values) => {
                  await new Promise((r) => setTimeout(r, 500));
                  alert(JSON.stringify(values, null, 2));
                }}
              >
                <Form>
                  <div className="relative">
                    <div>
                      {" "}
                      <div className="flex items-center gap-[17px]">
                        <label
                          htmlFor="shippingInformation"
                          className="text-base text-blue-950"
                        >
                          Shipping Information
                        </label>
                        {/* <FontAwesomeIcon
                          icon={faCircleInfo}
                          className="h-4 w-4 fill-slate-600"
                        /> */}
                      </div>
                    </div>
                    <div className="mt-3">
                      <Field
                        type="text"
                        name="shippingInformation"
                        id="shippingInformation"
                        placeholder="Canada, Tornonto, Ontario M5A 2V8, APT10"
                        className="bg-orange-100 border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                      />
                      <ErrorMessage
                        name="shippingInformation"
                        component="p"
                        className="invalid"
                      />
                    </div>
                  </div>

                  <div className="relative mt-8">
                    <div>
                      <div className="flex items-center gap-[17px]">
                        <label
                          htmlFor="billingInformation"
                          className="text-base  text-blue-950"
                        >
                          Billing Information
                        </label>
                        {/* <FontAwesomeIcon
                          icon={faCircleInfo}
                          className="h-4 w-4 fill-slate-600"
                        /> */}
                      </div>
                    </div>
                    <div className="mt-3">
                      {" "}
                      <Field
                        type="text"
                        name="billingInformation"
                        id="billingInformation"
                        placeholder="Canada, Tornonto, Ontario M5A 2V8, APT10"
                        className="bg-orange-100  border border-[#47556980] w-full text-sm font-medium text-slate-600 p-3.5 rounded"
                      />
                      <ErrorMessage
                        name="billingInformation"
                        component="p"
                        className="invalid"
                      />
                    </div>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </>
      </Layout>
    </>
  );
};

export default CustomerOrderView;
