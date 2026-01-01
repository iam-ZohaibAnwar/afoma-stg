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
  const [coupons, setCoupons] = useState([]);
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

  const TotalSales = (id) => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/affiliate-dashboard/total-sales/${id}`,
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
        if(decoded.role == "affiliate"){
          TotalSales(userData.userId)
        }else{
          setTotalSale(0)
        }
      }catch(err){
        clearThirdWebAuthTokens()
        window.location.href = "/sign-in"
      }
    }
  }, []);



  return (
    <Layout userType="affiliate">
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
                
              </div>
            </div>
   
          </div>

        </div>

      </>
    </Layout>
  );
};

export default Index;
