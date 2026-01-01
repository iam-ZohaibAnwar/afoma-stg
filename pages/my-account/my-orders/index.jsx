import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MyAccountSidebar from "@/components/MyAccountSidebar";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

//const noto = Noto_Serif({ subsets: ["latin"] });

const My_Orders = ({ cart, addToCart }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  const [persons, setPersons] = useState([]);
  const [editData, setEditData] = useState({});
  const [selectedGender, setSelectedGender] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const accessToken = userData?.token; // Assuming the token is stored in userData
    if (!userData) {
      return;
    }
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/getOrders/ByUserId/${userData.userId}`,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then((res) => {
        setPersons(res.data.reversedOrders);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
        } else {
          console.error("Error fetching orders:", error);
        }
      });
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust this based on your requirements
  const totalItems = persons?.length;
  const nextPage = () => {
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visiblePersons = persons?.slice(startIndex, endIndex);
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
  const onViewClick = (id) => {
    router.push(`/my-account/my-orders/view?id=${id}`);
  };

  return (
    <>
      <section>
        <Header cart={cart} addToCart={addToCart} />
      </section>
      <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mt-4 mb-4 lg:mt-6 lg:mb-6 max-w-screen-xl mx-auto px-4">
        <Link href="/">Home</Link>
        <FontAwesomeIcon icon={faAngleRight} size="sm" />
        <Link href="/my-account/account-details" className="text-primary">
          My account
        </Link>
      </div>

      <div className="max-w-screen-xl mx-auto lg:grid lg:grid-cols-6 gap-4 md:gap-6 px-4 mb-10">
        <div className="col-span-2">
          <MyAccountSidebar />
        </div>
        <div className="col-span-4">
          <div className="p-4 xl:p-6 bg-orange-100 rounded">
            <h1
              className={`text-2xl xl:text-4xl text-blue-950 mb-5 noto-font `}
            >
              My Orders
            </h1>
            <div className="border border-b text-slate-600/30 mb-4"></div>
            {persons && persons.length > 0 && (
              <p className="text-blue-950 text-base font-semibold mb-4">
                {persons.length} orders
              </p>
            )}
            {persons && persons.length > 0 ? (
              <div>
                {/* Heading Section - Print only once */}
                <div className="hidden  md:block">
                  <div className="bg-orange-100 rounded flex flex-col md:flex-row flex-wrap gap-2 xl:gap-4 relative">
                    <div className="hidden lg:block md:block xl:block">
                      <div className="flex gap-7 lg:flex-col md:flex-col md:w-60 xl:w-64">
                        <p className="text-blue-950 md:text-base lg:text-lg font-semibold mb-5">
                          Order Id
                        </p>
                      </div>
                    </div>
                    <div className="hidden lg:block md:block xl:block">
                      <div className="flex gap-7 xl:flex-col md:flex-col md:w-40 xl:w-44">
                        <p className="text-blue-950 md:text-base lg:text-lg font-semibold mb-5">
                          Purchased Date
                        </p>
                      </div>
                    </div>

                    <div className="hidden lg:block md:block xl:block">
                      <div className="flex gap-7 xl:flex-col md:flex-col md:w-32 xl:w-44">
                        <p className="text-blue-950 md:text-base lg:text-lg font-semibold mb-5">
                          Status
                        </p>
                      </div>
                    </div>
                    <div className="hidden lg:block md:block xl:block">
                      <div className="flex gap-7 xl:flex-col md:flex-col md:w-28 xl:w-44">
                        <p className="text-blue-950 md:text-base lg:text-lg font-semibold mb-5">
                          Action
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details */}

                {visiblePersons.map(
                  (order) =>
                    order.paymentStatus === "PaymentDone" && (
                      <div key={order._id}>
                        <div className="block md:hidden mt-5">
                          <p className="text-slate-600 text-sm mb-4">
                            Order No.
                            {order._id
                              ? `AM${order._id.substring(0, 6).toUpperCase()}`
                              : "-"}
                          </p>
                        </div>

                        <div
                          // key={item._id}
                          className="bg-orange-100 rounded flex flex-col md:flex-row flex-wrap gap-2 xl:gap-4 relative mt-5 border-b border-slate-600/30"
                        >
                          {/* Item Details */}

                          <div className="hidden md:block">
                            <div className="flex gap-7 xl:flex-col md:flex-col md:w-60 xl:w-64 mb-2 md:mb-8">
                              <p className="text-blue-950 text-base">
                                {order._id ? `AM${order._id.substring(0, 6).toUpperCase()}` : "-"}
                              </p>
                            </div>
                          </div>

                          <div className="hidden md:block">
                            <div className="flex gap-7 text-blue-950 text-base md:w-40 xl:w-44 mb-2 md:mb-8">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )
                                : "-"}
                            </div>
                          </div>

                          <div className="hidden lg:block md:block xl:block">
                            <div className="flex gap-7 xl:flex-col md:flex-col md:w-32 xl:w-44 mb-2 md:mb-8">
                              <p className="text-blue-950 text-base mb-3">
                                <div className="flex text-center items-center gap-2 flex-wrap">
                                  {" "}
                                  <div className="rounded-full h-1 w-1 bg-black shrink-0"></div>
                                  {order.status ? order.status : "-"}
                                </div>
                              </p>
                            </div>
                          </div>
                          <div className="hidden lg:block md:block xl:block">
                            <div className="flex gap-7 xl:flex-col md:flex-col w-28 mb-2 md:mb-8">
                              <p className="text-blue-950 text-base mb-3">
                                {" "}
                                <button
                                  className="underline text-blue-950 hover:text-primary"
                                  onClick={() => onViewClick(order._id)}
                                >
                                  View
                                </button>
                              </p>
                            </div>
                          </div>

                          <div className="block md:hidden">
                            <div className="flex flex-wrap">
                              {/* Total */}

                              {/* <div className="flex gap-7 xl:flex-col md:flex-col  xl:w-[100px] mb-2 md:mb-8">
                  <p className="text-blue-950 text-base font-semibold lg:font-normal">
                    CA${order.subTotal ? order.subTotal : "-"}
                  </p>
                </div> */}

                              {/* Order Number */}
                              <div className="hidden lg:block md:block xl:block">
                                <div className="flex gap-7 xl:flex-col md:flex-col  xl:w-[225px] mb-2 md:mb-8">
                                  <p className="text-blue-950 text-base">
                                    {order._id ? order._id : "-"}
                                  </p>
                                </div>
                              </div>
                              <div className=" flex flex-wrap gap-2">
                                <div className="lg:hidden block">
                                  <div className="flex text-blue-950 text-base gap-7 w-36 mb-2 md:mb-8">
                                    {order.createdAt
                                      ? new Date(
                                          order.createdAt
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })
                                      : "-"}
                                  </div>
                                </div>

                                {/* Status */}
                                <div className="flex gap-7 xl:flex-col md:flex-col  xl:w-[100px] mb-2 md:mb-8 discview">
                                  <p className="text-blue-950 text-base mb-3">
                                    <div className="flex text-center items-center gap-2 flex-wrap">
                                      {" "}
                                      <div className="rounded-full h-1 w-1 bg-black shrink-0"></div>
                                      {order.status ? order.status : "-"}
                                    </div>
                                  </p>
                                </div>

                                <div className="flex gap-7 xl:flex-col md:flex-col  xl:w-[100px] mb-2 md:mb-8">
                                  <p className="text-blue-950 text-base mb-3">
                                    {" "}
                                    <button
                                      className="underline text-blue-950 hover:text-primary"
                                      onClick={() => onViewClick(order._id)}
                                    >
                                      View
                                    </button>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            ) : (
              <div className="py-20">
                <>
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="132.976"
                      height="138.785"
                      viewBox="0 0 132.976 138.785"
                    >
                      <g transform="translate(-12.187 0.5)" opacity="0.27">
                        <path
                          d="M124.677,227.279,143.956,208H108.037L95.581,220.456l2.86,2.86,11.271-11.272h24.48l-13.213,13.212H66.57L49.313,208H13.394l19.279,19.279L13.394,246.558H75.2l14.4-14.4v53.495H37.555V251.007H33.511V289.7h90.329V246.558h20.117ZM47.638,212.045,60.85,225.257H36.371L23.158,212.045Zm25.885,30.469H23.158L36.37,229.3H86.735Zm46.272,43.142H93.64V229.3h26.155Zm4.045-53.494,10.352,10.352H123.839Z"
                          transform="translate(0 -151.915)"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                        <path
                          d="M177.632,83.061l16.221-6.725a23.588,23.588,0,1,0-9.5-9.5Zm10.705-17.406a19.546,19.546,0,1,1,6.7,6.7l-.874-.526-9.053,3.753,3.753-9.053Z"
                          transform="translate(-119.953 -23.372)"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                        <path
                          d="M142.337,12.673A6.336,6.336,0,1,0,136,6.336,6.344,6.344,0,0,0,142.337,12.673Zm0-8.628a2.292,2.292,0,1,1-2.292,2.292A2.294,2.294,0,0,1,142.337,4.045Z"
                          transform="translate(-89.547)"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                        <path
                          d="M408,126.337A6.336,6.336,0,1,0,414.336,120,6.344,6.344,0,0,0,408,126.337Zm6.336-2.292a2.292,2.292,0,1,1-2.292,2.292A2.295,2.295,0,0,1,414.336,124.045Z"
                          transform="translate(-288.205 -87.643)"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                        <path
                          d="M239.607,97.567l5.123-5.123,5.123,5.123,7.713-7.713-5.123-5.123,5.123-5.123-7.713-7.713-5.123,5.123-5.123-5.123-7.713,7.713,5.123,5.123-5.123,5.123Zm-1.994-17.96,1.994-1.994,5.123,5.123,5.123-5.123,1.994,1.994-5.123,5.123,5.123,5.123-1.994,1.994-5.123-5.123-5.123,5.123-1.994-1.994,5.123-5.123Z"
                          transform="translate(-159.584 -52.509)"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                        <path
                          d="M91.949,84.443h4.045V79.994h4.449V75.949H95.994V71.5H91.949v4.449H87.5v4.045h4.449Z"
                          transform="translate(-54.124 -52.221)"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                        <path
                          d="M379.949,36.443h4.045V31.994h4.449V27.949h-4.449V23.5h-4.045v4.449H375.5v4.045h4.449Z"
                          transform="translate(-264.468 -17.163)"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                        <path
                          d="M159.5,456h4.314v4.045H159.5Z"
                          transform="translate(-106.71 -333.045)"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                        <path
                          d="M191.5,456h4.314v4.045H191.5Z"
                          transform="translate(-130.082 -333.045)"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                        <path
                          d="M223.5,456h4.314v4.045H223.5Z"
                          transform="translate(-153.453 -333.045)"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                        <path
                          d="M333.056,415.655l3.019-3.019v10.217h4.045V412.636l3.019,3.019,2.86-2.86-7.9-7.9-7.9,7.9Z"
                          transform="translate(-231.38 -295.719)"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                      </g>
                    </svg>
                  </div>
                  <h1
                    className={`text-2xl xl:text-3xl text-center justify-center text-blue-950 mt-7 noto-font`}
                  >
                    No Orders Yet
                  </h1>

                  <p className="text-slate-600 text-sm mt-3  text-center justify-center">
                    Discover unique handicrafts at best deals.
                  </p>
                </>
              </div>
            )}
            <div>
              {visiblePersons && visiblePersons.length > 0 && (
                <div className="pagination flex text-sm items-center justify-end text-bodyText gap-x-6 my-9">
                  <div className="">
                    <button
                      className={`flex gap-2 items-center text-gray-500  ${
                        currentPage === 1
                          ? "cursor-not-allowed opacity-50"
                          : "hover:text-primary"
                      }`}
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" />{" "}
                      Previous
                    </button>
                  </div>

                  <div>
                    <div className="">
                      <button
                        className={`flex gap-2 items-center text-gray-500  ${
                          currentPage === Math.ceil(totalItems / itemsPerPage)
                            ? "cursor-not-allowed opacity-50"
                            : "hover:text-primary"
                        }`}
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={
                          currentPage === Math.ceil(totalItems / itemsPerPage)
                        }
                      >
                        Next
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          className="h-[8px]"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden">
        <Footer />
      </section>
    </>
  );
};

export default My_Orders;
