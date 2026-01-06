import { faAngleDown } from "@fortawesome/pro-light-svg-icons";
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

import dynamic from "next/dynamic";

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });

//const noto = Noto_Serif({ subsets: ["latin"] });

const SellerOrders = () => {
  const [doctorEnquiryData, setDoctorEnquiryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState();
  const [totalDataCount, setDataTotalCount] = useState();
  const [user, setUser] = useState({});

  const router = useRouter();

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
          <div className="flex justify-between items-center mb-5">
            <h1
              className={`text-2xl text-blue-950 font-medium mb-2 noto-font `}
            >
              Orders
            </h1>

            <div className="flex items-center justify-end gap-4">
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex items-center justify-center rounded-full">
                    <p className="dashboard-button-secondary">
                      Order Status{" "}
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        className="h-4 w-8 fill-blue-950 hover:fill-primary"
                      />
                    </p>
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
                        <button className="hover:bg-orange-100 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2">
                          Completed
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button className="hover:bg-orange-100 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2">
                          Cancelled
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button className="hover:bg-orange-100 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2">
                          Pending
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button className="hover:bg-orange-100 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2">
                          Processing
                        </button>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex items-center justify-center rounded-full">
                    <p className="dashboard-button-secondary">
                      This Month{" "}
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        className="h-4 w-8 fill-blue-950 hover:fill-primary"
                      />
                    </p>
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
                        {({ active }) => (
                          <button className="hover:bg-orange-100 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2">
                            Previous Month
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button className="hover:bg-orange-100 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2">
                            This Month
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button className="hover:bg-orange-100 hover:text-primary group flex w-full items-center gap-3 px-3.5 py-2">
                            This Year
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <div className="w-full overflow-auto bg-white rounded-md shadow shadow-slate-300 mt-6">
            <table className="text-sm w-full table-auto border-separate border-spacing-0 bg-orange-50 ">
              <thead className="text-left text-sm font-medium text-orange-50 bg-blue-950 h-14">
                <tr>
                  <th className="pl-7 py-5 pr-16">Order ID</th>
                  <th className=" pr-16">Product Name</th>
                  <th className=" pr-16">Quantity</th>
                  <th className=" pr-16">Price</th>
                  <th className=" pr-16">Total</th>
                  <th className=" pr-16">Customer Name</th>
                  <th className=" pr-16">Purchased Date</th>
                  <th className=" pr-16">Action</th>
                  <th className=" pr-16">Order Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pl-7 py-5 text-blue-950">#1025789523</td>
                  <td className="text-blue-950">Banded Weave Loafers</td>
                  <td className="text-blue-950">1</td>
                  <td className="text-blue-950">CA$87.00</td>
                  <td className="text-blue-950">CA$91.00</td>
                  <td className="text-blue-950">Clarissa Rebello</td>
                  <td className="text-blue-950">July 31, 2023</td>
                  <td>
                    <Link
                      className="underline text-blue-950"
                      href="/seller/order/view"
                    >
                      View
                    </Link>
                    <br />
                    <Link className="underline text-blue-950" href="#">
                      Process
                    </Link>
                  </td>
                  <td className="text-green-800 font-semibold">Completed</td>
                </tr>

                <tr className="bg-orange-100">
                  <td className="pl-7 py-6 text-blue-950">#1250564120</td>
                  <td className="text-blue-950">
                    The Flared Blouse - One Size Fits All
                  </td>
                  <td className="text-blue-950">1</td>
                  <td className="text-blue-950">CA$25.00</td>
                  <td className="text-blue-950">CA$28.00</td>
                  <td className="text-blue-950">Meetanshi Afolashade</td>
                  <td className="text-blue-950">July 25, 2023</td>
                  <td>
                    <Link
                      className="underline text-blue-950"
                      href="/seller/order/view"
                    >
                      View
                    </Link>
                    <br />
                    <Link className="underline text-blue-950" href="#">
                      Process
                    </Link>
                  </td>
                  <td className="text-red-700 font-semibold">Cancelled</td>
                </tr>

                <tr>
                  <td className="pl-7 py-6 text-blue-950">#1236589541</td>
                  <td className="text-blue-950">Folarin Bag Set</td>
                  <td className="text-blue-950">1</td>
                  <td className="text-blue-950">CA$65.00</td>
                  <td className="text-blue-950">CA$68.00</td>
                  <td className="text-blue-950">Adaobi Okeke</td>
                  <td className="text-blue-950">July 05, 2023</td>
                  <td>
                    <Link
                      className="underline text-blue-950"
                      href="/seller/order/view"
                    >
                      View
                    </Link>
                    <br />
                    <Link className="underline text-blue-950" href="#">
                      Process
                    </Link>
                  </td>
                  <td className="text-gray-500 font-semibold">Pending</td>
                </tr>

                <tr className="bg-orange-100">
                  <td className="pl-7 py-6 text-blue-950">#1237895210</td>
                  <td className="text-blue-950">Happy Happy Shower Steamer</td>
                  <td className="text-blue-950">3</td>
                  <td className="text-blue-950">CA$3.00</td>
                  <td className="text-blue-950">CA$5.00</td>
                  <td className="text-blue-950">Ruth Oma</td>
                  <td className="text-blue-950">June 28, 2023</td>
                  <td>
                    <Link
                      className="underline text-blue-950"
                      href="/seller/order/view"
                    >
                      View
                    </Link>
                    <br />
                    <Link className="underline text-blue-950" href="#">
                      Process
                    </Link>
                  </td>
                  <td className="text-gray-500 font-semibold">Pending</td>
                </tr>

                <tr>
                  <td className="pl-7 py-6 text-blue-950">#1300102101</td>
                  <td className="text-blue-950">Nadia Bag</td>
                  <td className="text-blue-950">1</td>
                  <td className="text-blue-950">CA$58.00</td>
                  <td className="text-blue-950">CA$60.00</td>
                  <td className="text-blue-950">Blessing Ehizoje</td>
                  <td className="text-blue-950">June 17, 2023</td>
                  <td>
                    <Link
                      className="underline text-blue-950"
                      href="/seller/order/view"
                    >
                      View
                    </Link>
                    <br />
                    <Link className="underline text-blue-950" href="#">
                      Process
                    </Link>
                  </td>
                  <td className="text-green-800 font-semibold">Completed</td>
                </tr>

                <tr className="bg-orange-100">
                  <td className="pl-7 py-6 text-blue-950">#1310265412</td>
                  <td className="text-blue-950">Brenny Bag, Nadia Bag</td>
                  <td className="text-blue-950">2</td>
                  <td className="text-blue-950">CA$47.00</td>
                  <td className="text-blue-950">CA$50.00</td>
                  <td className="text-blue-950">Satish Patil</td>
                  <td className="text-blue-950">June 12, 2023</td>
                  <td>
                    <Link
                      className="underline text-blue-950"
                      href="/seller/order/view"
                    >
                      View
                    </Link>
                    <br />
                    <Link className="underline text-blue-950" href="#">
                      Process
                    </Link>
                  </td>
                  <td className="text-sky-800 font-semibold">Processing</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pagination flex text-sm items-center justify-end text-bodyText gap-x-6 my-9">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" />
              <Link href="#" className="text-gray-500">
                {" "}
                Previous{" "}
              </Link>
            </div>

            <div className="flex gap-2 items-center text-primary">
              <Link href="#">Next</Link>
              <FontAwesomeIcon
                icon={faAngleRight}
                className="h-[8px] text-primary"
              />
            </div>
          </div>
        </>
      </Layout>
    </>
  );
};

export default SellerOrders;
