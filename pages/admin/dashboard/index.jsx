import ChartPieAdmin from "@/components/ChartPieAdmin";
import Layout from "@/components/Layout";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  faArrowTrendUp,
  faBagShopping,
  faChartColumn,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { clearThirdWebAuthTokens } from "@/lib/thirdweb-utils";
//const noto = Noto_Serif({ subsets: ["latin"] });
const Index = () => {
  const [activeTab, setActiveTab] = useState("table1");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [selectedMenuItem, setSelectedMenuItem] = useState("This Month");
  const [selectedMenuItemPrice, setSelectedMenuItemPrice] = useState("");
  const [ordersNumber, setOrdersNumber] = useState("This Month");
  const [ordersNumberValue, setOrdersNumberValue] = useState("");
  const [ordersValue, setOrdersValue] = useState("This Month");
  const [ordersValueAverage, setOrdersValueAverage] = useState("");
  const [totalSale, setTotalSale] = useState("This Month");
  const [orderValue, setorderValue] = useState("");
  const [productOrder, setProductOrder] = useState("");
  const [lowValue, setLowValue] = useState("");
  const [sellerCount, setSellerCount] = useState("");
  const [pendingProductCount, setPendingProductCoun] = useState("");
  const [outOfStock, setOutOfStock] = useState("");
  const [pendingPayout, setPendingPayout] = useState("");
  const [pendingOrders, setPendingOrders] = useState("");
  const [totalOrders, setTotalOrders] = useState("");
  const [latestSelller, setlatestSelller] = useState([]);
  const [lastProduct, setlastProduct] = useState([]);
  const [searchProduct, setSearchProduct] = useState([]);
  const [totalSell, setTotalSell] = useState([]);
  const [totalSaleData, setTotalSaleData] = useState("This Month");
  const handleTotalSale = (menuItem, id) => {
    setTotalSale(menuItem);
  };
  const handleMenuItemClick = (menuItem, id) => {
    setSelectedMenuItem(menuItem);
  };
  const handleOrdersNumber = (menuItem, id) => {
    setOrdersNumber(menuItem);
  };
  const handleOrdersValue = (menuItem, id) => {
    setOrdersValue(menuItem);
  };
  useEffect(() => {
    const priceMapping = {
      "This Month": "CA$00.00",
      "Last Month": "CA$00.00",
      "This Year": "CA$00.00",
    };

    setSelectedMenuItemPrice(priceMapping[selectedMenuItem]);
  }, [selectedMenuItem]);

  useEffect(() => {
    const orderMapping = {
      "This Month": "48",
      "Last Month": "180",
      "This Year": "900",
    };

    setOrdersNumberValue(orderMapping[ordersNumber]);
  }, [ordersNumber]);
  useEffect(() => {
    const valueMapping = {
      "This Month": "CA$0.00",
      "Last Month": "CA$150.00",
      "This Year": "CA$1500.00",
    };

    setOrdersValueAverage(valueMapping[ordersValue]);
  }, [ordersValue]);
  useEffect(() => {
    const dataMapping = {
      "This Month": "CA$0.00",
      "Last Month": "CA$150.00",
      "This Year": "CA$1500.00",
    };

    setTotalSaleData(dataMapping[totalSale]);
  }, [totalSale]);

  const TotalSell = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard/total-sales`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setTotalSell(response.data);
        setorderValue(response.data)
        setProductOrder(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if(userData && userData.accessToken){
      try{
        const decoded = jwt.verify(userData.accessToken, process.env.NEXT_PUBLIC_ACCESS_KEY);
        if(decoded.role == "admin" && decoded?.fullAccess){
          TotalSell();
        }else{
          setTotalSell(0);
        }
      }catch(err){
        clearThirdWebAuthTokens()
        window.location.href = "/sign-in"
      }
    }
  }, []);

  // const AverageValue = () => {
  //   const options = {
  //     method: "GET",
  //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard/average-order-price`,
  //     headers: {
  //       "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
  //     },
  //   };

  //   axios
  //     .request(options)
  //     .then(function (response) {
  //       setorderValue(response.data);
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // };
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if(userData && userData.accessToken){
      try{
        const decoded = jwt.verify(userData.accessToken, process.env.NEXT_PUBLIC_ACCESS_KEY);
        if(decoded.role == "admin" && decoded?.fullAccess){
          // AverageValue();
        }else{
          setorderValue(0);
        }
      }catch(err){
        clearThirdWebAuthTokens()
        window.location.href = "/sign-in"
      }

    }
  }, []);
  // const TotalOrder = () => {
  //   const options = {
  //     method: "GET",
  //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard/count-orders`,
  //     headers: {
  //       "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
  //     },
  //   };
  //   axios
  //     .request(options)
  //     .then(function (response) {
  //       setProductOrder(response.data);
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // };
  // useEffect(() => {
  //   TotalOrder();
  // }, []);
  const LowProduct = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard/low-stock`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        setLowValue(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  useEffect(() => {
    LowProduct();
  }, []);
  const TotalSeller = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard/seller/total-count`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        setSellerCount(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  useEffect(() => {
    TotalSeller();
  }, []);
  const PendingProduct = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard/product/pending-count`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        setPendingProductCoun(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  useEffect(() => {
    PendingProduct();
  }, []);
  const OutofStock = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard/product/stock-status`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        setOutOfStock(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  useEffect(() => {
    OutofStock();
  }, []);
  const PendingPayout = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard/count-pending-payouts`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setPendingPayout(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  useEffect(() => {
    PendingPayout();
  }, []);
  const PendingOrders = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard/pending-orders/count`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        setPendingOrders(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  useEffect(() => {
    PendingOrders();
  }, []);
  const TotalOrders = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard/count-orders`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setTotalOrders(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    TotalOrders();
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard/latest-sellers`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      )
      .then((res) => {
        setlatestSelller(res.data.data);
      });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = latestSelller.length;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // to show the data infetched array of table
  const adminNameList = latestSelller?.map((person) => ({
    id: person._id,
  }));
  const visiblePersons = latestSelller
    .slice(startIndex, endIndex)
    .map((person) => ({
      id: person._id, // Use _id as the id property
      uuid: person.uuid,
      fullName: `${person.firstName} ${person.lastName}`,
      email: person.email,
      userRole: person.userRole,
      city: person.city,
      phone: person.phone,
      country: person.country,
      createdAt: person?.createdAt
        ? new Date(person.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
      state: person.state,
      status: person.status,
    }));
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin-dashboard/last-four-products`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      )
      .then((res) => {
        setlastProduct(res.data.data);
      });
  }, []);
  const [currentPages, setCurrentPages] = useState(1);
  const itemsPerPages = 10;
  const totalItemss = lastProduct.length;

  const startIndexs = (currentPages - 1) * itemsPerPages;
  const endIndexs = startIndexs + itemsPerPages;

  const latestproduct = lastProduct
    .slice(startIndexs, endIndexs)
    .map((personn) => ({
      productName: personn.productName, // Use _id as the id property
      productType: personn.productType,
      finalPrice: personn.finalPrice,
      variations: personn.variations
    }));

  const SearchData = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/search/latest-popular-search-terms`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setSearchProduct(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  useEffect(() => {
    SearchData();
  }, []);
  return (
    <Layout userType="admin">
      <>
        <div>
          <h2 className={`text-blue-950 mb-4 text-2xl  noto-font`}>
            Dashboard
          </h2>
        </div>
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex flex-col justify-between">
            <div className="grid md:gap-5 md:grid-cols-3 grid-cols-1 gap-4 mb-6">
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
                  <p className="text-blue-950">Total Sales</p>
                </div>
                <div className="font-medium text-4xl  text-primary mb-2.5">
                  <h1 className="font-medium text-4xl text-primary mb-2.5">
                    {totalSell?.totalOrderPrice !== undefined &&
                    !isNaN(parseFloat(totalSell?.totalOrderPrice))
                      ? `CA$ ${parseFloat(totalSell?.totalOrderPrice).toFixed(
                          2
                        )}`
                      : "0"}
                  </h1>
                </div>
                {/* <div className="flex items-center  gap-4">
                  <Menu as="div" className="relative ">
                    <div>
                      <Menu.Button
                        className={`flex items-center justify-center rounded-full cursor-pointer py-2.5  gap-2 text-center text-slate-600 transition-colors ease-in text-xs font-medium`}
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
                                selectedMenuItem === "This Month"
                              } flex items-center justify-center py-1 text-xs font-medium text-slate-600`}
                              onClick={() => handleMenuItemClick("This Month")}
                            >
                              This Month
                            </button>
                          </Menu.Item>

                          <Menu.Item>
                            <button
                              className={`${
                                selectedMenuItem === "Last Month"
                              } flex items-center justifycenter py-1 text-xs font-medium text-slate-600`}
                              onClick={() => handleMenuItemClick("Last Month")}
                            >
                              Last Month
                            </button>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              className={`${
                                selectedMenuItem === "This Year"
                              } flex items-center justify-center py-1 text-xs font-medium text-slate-600`}
                              onClick={() => handleMenuItemClick("This Year")}
                            >
                              This Year
                            </button>
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div> */}
              </div>
              <div className="px-4 py-5 bg-orange-100 rounded">
                <div className="flex gap-3 items-center mb-4">
                  <div className="px-2.5 py-1.5 bg-orange-50 rounded-full">
                    <FontAwesomeIcon
                      icon={faBagShopping}
                      className="text-primary"
                    />
                  </div>
                  <p className="text-blue-950">Number of Orders</p>
                </div>
                <h1 className="font-medium text-4xl text-primary mb-2.5">
                  {productOrder.totalOrders ? productOrder.totalOrders : "0"}
                </h1>
                {/* <div className="flex items-center  gap-4">
                  <Menu as="div" className="relative ">
                    <div>
                      <Menu.Button
                        className={`flex items-center justify-center rounded-full cursor-pointer py-2.5  gap-2 text-center text-slate-600 transition-colors ease-in text-xs font-medium`}
                      >
                        {ordersNumber}
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
                                selectedMenuItem === "This Month"
                              } flex items-center justify-center py-1 text-xs font-medium text-slate-600`}
                              onClick={() => handleOrdersNumber("This Month")}
                            >
                              This Month
                            </button>
                          </Menu.Item>

                          <Menu.Item>
                            <button
                              className={`${
                                selectedMenuItem === "Last Month"
                              } flex items-center justifycenter py-1 text-xs font-medium text-slate-600`}
                              onClick={() => handleOrdersNumber("Last Month")}
                            >
                              Last Month
                            </button>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              className={`${
                                selectedMenuItem === "This Year"
                              } flex items-center justify-center py-1 text-xs font-medium text-slate-600`}
                              onClick={() => handleOrdersNumber("This Year")}
                            >
                              This Year
                            </button>
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div> */}
              </div>
              <div className="px-4 py-5 bg-orange-100 rounded">
                <div className="flex gap-3 items-center mb-4">
                  <div className="px-2.5 py-1.5 bg-orange-50 rounded-full">
                    <FontAwesomeIcon
                      icon={faChartColumn}
                      className="text-primary"
                    />
                  </div>
                  <p className="text-blue-950">Average Order Value</p>
                </div>
                <h1 className="font-medium text-4xl  text-primary mb-2.5">
                  {orderValue.averageOrderPrice !== undefined &&
                  !isNaN(parseFloat(orderValue.averageOrderPrice))
                    ? `CA$ ${parseFloat(orderValue.averageOrderPrice).toFixed(
                        2
                      )}`
                    : "0"}
                </h1>
                {/* <div className="flex items-center  gap-4">
                  <Menu as="div" className="relative ">
                    <div>
                      <Menu.Button
                        className={`flex items-center justify-center rounded-full cursor-pointer py-2.5  gap-2 text-center text-slate-600 transition-colors ease-in text-xs font-medium`}
                      >
                        {ordersValue}
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
                                ordersValue === "This Month"
                              } flex items-center justify-center py-1 text-xs font-medium text-slate-600`}
                              onClick={() => handleOrdersValue("This Month")}
                            >
                              This Month
                            </button>
                          </Menu.Item>

                          <Menu.Item>
                            <button
                              className={`${
                                ordersValue === "Last Month"
                              } flex items-center justifycenter py-1 text-xs font-medium text-slate-600`}
                              onClick={() => handleOrdersValue("Last Month")}
                            >
                              Last Month
                            </button>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              className={`${
                                ordersValue === "This Year"
                              } flex items-center justify-center py-1 text-xs font-medium text-slate-600`}
                              onClick={() => handleOrdersValue("This Year")}
                            >
                              This Year
                            </button>
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div> */}
              </div>
            </div>
            <div className="grid md:gap-10 md:grid-cols-2.5 lg:grid-cols-2">
              <div>
                <ChartPieAdmin />
              </div>
              {/* <div className="px-7 py-7 rounded bg-orange-100">
                <h3 className={`text-xl text-blue-950 mb-7 noto-font`}>
                  Customer Support
                </h3>{" "}
                <div className="grid grid-cols-2 gap-12">
                  <div className="bg-orange-50/50 px-5 py-5">
                    {" "}
                    <div className="flex gap-4 ">
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
                              fill="#ea580c"
                              stroke="#ea580c"
                              strokeWidth="0.2"
                            />
                            <path
                              id="Path_2418"
                              data-name="Path 2418"
                              d="M104.2,112.768a6.276,6.276,0,1,0,6.276-6.276A6.276,6.276,0,0,0,104.2,112.768Zm6.276-5.411a5.411,5.411,0,1,1-5.411,5.411A5.41,5.41,0,0,1,110.471,107.358Zm0,0"
                              transform="translate(-104.195 -100.73)"
                              fill="#ea580c"
                              stroke="#ea580c"
                              strokeWidth="0.2"
                            />
                            <path
                              id="Path_2420"
                              data-name="Path 2420"
                              d="M213.069,4.544V.433a.433.433,0,1,0-.866,0V4.544a.433.433,0,1,0,.866,0Zm0,0"
                              transform="translate(-206.36 0)"
                              fill="#ea580c"
                              stroke="#ea580c"
                              strokeWidth="0.2"
                            />
                            <path
                              id="Path_2421"
                              data-name="Path 2421"
                              d="M273.069,42.38V40.433a.433.433,0,0,0-.866,0V42.38a.433.433,0,0,0,.866,0Zm0,0"
                              transform="translate(-263.114 -37.836)"
                              fill="#ea580c"
                              stroke="#ea580c"
                              strokeWidth="0.2"
                            />
                            <path
                              id="Path_2422"
                              data-name="Path 2422"
                              d="M153.069,42.38V40.433a.433.433,0,1,0-.866,0V42.38a.433.433,0,0,0,.866,0Zm0,0"
                              transform="translate(-149.606 -37.836)"
                              fill="#ea580c"
                              stroke="#ea580c"
                              strokeWidth="0.2"
                            />
                          </g>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-4xl text-blue-950 mb-1.5">17</h3>
                        <p className="text-blue-950">Open Tickets</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    {" "}
                    <div>
                      <div className="mb-7">
                        <h3 className="text-3xl text-blue-950  font-medium mb-2.5">
                          4%
                        </h3>
                        <p className="text-blue-950 text-sm">
                          Average Response Time
                        </p>
                      </div>
                      <div>
                        <h3 className="text-3xl text-blue-950  font-medium mb-2.5">
                          4%
                        </h3>
                        <p className="text-blue-950 text-sm">
                          Average Response Time
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className=" flex flex-row gap-10 items-start justify-start ">
            {/* <div className="px-5 py-6 w-[350px] bg-orange-100/25 2xl:w-[290px] mb-7 shrink-0">
              <div className="flex items-start mb-2.5">
                <div className="px-2.5 ">
                  <FontAwesomeIcon
                    icon={faArrowTrendUp}
                    className="text-primary"
                  />
                </div>
              </div>
              <p className="font-medium text-blue-950 mb-5">
                Popular Products in Low Stock
              </p>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-blue-950 text-sm">Banded Weave Loafers</p>
                  <p className="text-[#EA0C0C] text-sm ">1 left</p>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-blue-950 text-sm">Folarin Bag Set</p>
                  <p className="text-blue-950 text-sm ">3 left</p>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-blue-950 text-sm">Nadia Bag</p>
                  <p className="text-blue-950 text-sm ">3 left</p>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-blue-950 text-sm">Brenny Bag</p>
                  <p className="text-blue-950 text-sm ">4 left</p>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-blue-950 text-sm">Brenny Bag</p>
                  <p className="text-blue-950 text-sm ">5 left</p>
                </div>
              </div>
            </div> */}
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3">
              <div className="px-5 py-6 bg-orange-100 shrink-0 rounded">
                <div className="flex mb-2.5 gap-3 items-center">
                  <div className="">
                    <FontAwesomeIcon
                      icon={faArrowTrendUp}
                      className="text-primary"
                    />
                  </div>
                  <p className="text-blue-950 font-medium ">Out of Stock</p>
                </div>
                <h2 className="text-4xl font-medium text-blue-950">
                  {outOfStock.outOfStockCount !== null &&
                  outOfStock.outOfStockCount !== 0
                    ? outOfStock.outOfStockCount
                    : "-"}
                </h2>
                <p className="text-slate-600 font-medium">Products</p>
              </div>
              <div className="px-5 py-6 bg-orange-100 shrink-0 rounded">
                <div className="flex mb-2.5 gap-3 items-center">
                  <div className="">
                    <FontAwesomeIcon
                      icon={faBagShopping}
                      className="text-primary"
                    />
                  </div>
                  <Link
                    href="/admin/product"
                    className="text-blue-950 font-medium "
                  >
                    Low Product count
                  </Link>
                </div>
                <h2 className="text-4xl font-medium text-blue-950">
                  {" "}
                  {outOfStock.lowStockCount || "0"}
                </h2>
                <p className="text-slate-600 font-medium">Products</p>
              </div>
              <div className="px-5 py-6 bg-orange-100 shrink-0 rounded">
                <div className="flex mb-2.5 gap-3 items-center">
                  <div className="">
                    <FontAwesomeIcon icon={faUser} className="text-primary" />
                  </div>
                  <Link
                    href="/admin/seller-management"
                    className="text-blue-950 font-medium "
                  >
                    Total Seller Count
                  </Link>
                </div>
                <h2 className="text-4xl font-medium text-blue-950">
                  {sellerCount.totalSellersCount
                    ? sellerCount.totalSellersCount
                    : "0"}
                </h2>
                <p className="text-slate-600 font-medium">Sellers</p>
              </div>
              <div className="px-5 py-6 bg-orange-100 shrink-0 rounded">
                <div className="flex mb-2.5 gap-3 items-center">
                  <div className="">
                    <FontAwesomeIcon
                      icon={faBagShopping}
                      className="text-primary"
                    />
                  </div>
                  <Link
                    href="/admin/product"
                    className="text-blue-950 font-medium "
                  >
                    Pending Product Count
                  </Link>
                </div>
                <h2 className="text-4xl font-medium text-blue-950">
                  {pendingProductCount.pendingProductCount !== null &&
                  pendingProductCount.pendingProductCount !== 0
                    ? pendingProductCount.pendingProductCount
                    : "0"}
                </h2>
                <p className="text-slate-600 font-medium">Products</p>
              </div>
              <div className="px-5 py-6 bg-orange-100 shrink-0 rounded">
                <div className="flex mb-2.5 gap-3 items-center">
                  <div className="">
                    <FontAwesomeIcon
                      icon={faArrowTrendUp}
                      className="text-primary"
                    />
                  </div>
                  <Link
                    href="/admin/commission"
                    className="text-blue-950 font-medium "
                  >
                    Pending Pay Out Count
                  </Link>
                </div>
                <h2 className="text-4xl font-medium text-blue-950">
                  {pendingPayout.pendingPayoutsCount !== null &&
                  pendingPayout.pendingPayoutsCount !== 0
                    ? pendingPayout.pendingPayoutsCount
                    : "0"}
                </h2>
                {/* <p className="text-slate-600 font-medium">Products</p> */}
              </div>
              <div className="px-5 py-6 bg-orange-100 shrink-0 rounded">
                <div className="flex mb-2.5 gap-3 items-center">
                  <div className="">
                    <FontAwesomeIcon
                      icon={faChartColumn}
                      className="text-primary"
                    />
                  </div>
                  <Link
                    href="/admin/order-management"
                    className="text-blue-950 font-medium "
                  >
                    Total Orders Count
                  </Link>
                </div>
                <h2 className="text-4xl font-medium text-blue-950">
                  {totalOrders.totalOrders ? totalOrders.totalOrders : "0"}
                </h2>
                <p className="text-slate-600 font-medium">Orders</p>
              </div>
              <div className="px-5 py-6 bg-orange-100 shrink-0 rounded">
                <div className="flex mb-2.5 gap-3 items-center">
                  <div className="">
                    <FontAwesomeIcon
                      icon={faChartColumn}
                      className="text-primary"
                    />
                  </div>
                  <Link
                    href="/admin/order-management"
                    className="text-blue-950 font-medium "
                  >
                    Pending Orders Count
                  </Link>
                </div>
                <h2 className="text-4xl font-medium text-blue-950">
                  {pendingOrders.pendingOrdersCount !== null &&
                  pendingOrders.pendingOrdersCount !== 0
                    ? pendingOrders.pendingOrdersCount
                    : "0"}
                </h2>
                <p className="text-slate-600 font-medium">Products</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-[#D8D8D8]">
          <div className="flex flex-nowrap gap-9 py-5 bg-orange-100 pl-5 pr-5 overflow-auto">
            <button
              onClick={() => handleTabClick("table1")}
              className={`text-blue-950 font-medium min-w-[max-content] ${
                activeTab === "table1" &&
                "underline underline-offset-[25px] decoration-primary decoration-4 text-primary"
              }`}
            >
              Latest Selling Products
            </button>
            <button
              onClick={() => handleTabClick("table2")}
              className={`text-blue-950 font-medium min-w-[max-content] ${
                activeTab === "table2" &&
                "underline underline-offset-[25px] decoration-primary decoration-4 text-primary"
              }`}
            >
              Latest Sellers
            </button>
            <button
              onClick={() => handleTabClick("table4")}
              className={`text-blue-950 font-medium min-w-[max-content] ${
                activeTab === "table4" &&
                "underline underline-offset-[25px] decoration-primary decoration-4 text-primary"
              }`}
            >
              Latest Search Terms
            </button>
          </div>
          <div
            id="table1"
            style={{ display: activeTab === "table1" ? "block" : "none" }}
            className="relative overflow-x-auto"
          >
            {latestproduct && latestproduct.length > 0 ? (
              <table className="text-sm w-full border-separate border-spacing-0 bg-orange-50">
                <thead className="text-left text-sm font-medium text-white border-b  border-[#D8D8D8]">
                  <tr>
                    <td
                      scope="col"
                      className="px-6 py-3 text-blue-950 text-sm font-semibold"
                    >
                      Product Name
                    </td>
                    <td
                      scope="col"
                      className="text-blue-950 text-sm font-semibold px-6 py-3"
                    >
                      Product Type
                    </td>
                    <td
                      scope="col"
                      className="text-blue-950 text-sm font-semibold px-6 py-3"
                    >
                      Price
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {latestproduct?.map((user, index) => (
                    <tr key={index}>
                      <td
                        scope="row"
                        className="px-6 py-4 text-blue-950 text-sm"
                      >
                        {user.productName}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 text-blue-950 text-sm"
                      >
                        {user.productType}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 text-blue-950 text-sm"
                      >
                        {user.productType == "Customizable"
                          ? `CA$ ${parseFloat((user?.variations?.[0]?.finalPrice || user?.variations?.[0]?.price || 0))}`
                          : `CA$ ${parseFloat(user.finalPrice)?.toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-5  text-blue-950  ">Loading ...</p>
            )}
          </div>
          <div
            id="table2"
            style={{ display: activeTab === "table2" ? "block" : "none" }}
            className="relative overflow-x-auto"
          >
            {visiblePersons && visiblePersons.length > 0 ? (
              <table className="text-sm w-full border-separate border-spacing-0 bg-orange-50">
                <thead className="text-left text-sm font-semibold text-white border-b  border-[#D8D8D8]">
                  <tr className="">
                    <td
                      scope="col"
                      className="px-6 py-3 text-blue-950 text-sm font-semibold"
                    >
                      Seller ID
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-blue-950 text-sm font-semibold"
                    >
                      Seller Name
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-blue-950 text-sm font-semibold"
                    >
                      Seller Email
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-blue-950 text-sm font-semibold"
                    >
                      Country
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 text-blue-950 text-sm font-semibold"
                    >
                      State/Province
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {visiblePersons?.map((user, index) => (
                    <tr key={index} className="">
                      <td
                        scope="row"
                        className="px-6 py-4 text-blue-950 text-sm"
                      >
                        {" "}
                        {user.uuid}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 text-blue-950 text-sm"
                      >
                        {user?.fullName}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 text-blue-950 text-sm"
                      >
                        {user.email}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 text-blue-950 text-sm"
                      >
                        {user.country}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 text-blue-950 text-sm"
                      >
                        {user.state}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-5  text-blue-950  ">Loading ...</p>
            )}
          </div>
          <div
            id="table4"
            style={{ display: activeTab === "table4" ? "block" : "none" }}
            className="relative overflow-x-auto"
          >
            {searchProduct && searchProduct.length > 0 ? (
              <table className="text-sm w-full border-separate border-spacing-0 bg-orange-50">
                <thead className="text-left text-sm font-semibold text-white border-b  border-[#D8D8D8]">
                  <tr className="">
                    <td className="px-6 py-3 text-blue-950 text-sm font-semibold">
                      Keyword
                    </td>
                    <td className="px-6 py-3 text-blue-950 text-sm font-semibold">
                      Count
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {searchProduct?.map((user, index) => (
                    <tr key={index} className="">
                      <td
                        scope="row"
                        className="px-6 py-4 text-blue-950 text-sm"
                      >
                        {user._id}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 text-blue-950 text-sm"
                      >
                        {user.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-5  text-blue-950  ">Loading ...</p>
            )}
          </div>
        </div>
      </>
    </Layout>
  );
};

export default Index;
