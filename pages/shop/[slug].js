import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { calculateSurcharge } from "@/utils/pricingUtils";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

//const noto = Noto_Serif({ subsets: ["latin"] });

const SellerInfoPage = ({ cart, sellerInfo, addToCart }) => {
  const [expandedIndex, setExpandedIndex] = useState(null); // Track expanded FAQ index
  const [faqOne, setFaqOne] = useState(false);
  const [faqTwo, setFaqTwo] = useState(false);
  const [faqThree, setFaqThree] = useState(false);
  const [faqFour, setFaqFour] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState(null);
  const [error, setError] = useState(false);
  const [seller, setSeller] = useState("");
  const [sellerStoreName, setSellerStoreName] = useState("");
  const [sellerStoreDesc, setSellerStoreDesc] = useState("");
  const [sellerStoreLogo, setSellerStoreLogo] = useState("");
  const [sellerStoreBanner, setSellerStoreBanner] = useState("");
  const [sellerInstagram, setSellerInstagram] = useState("");
  const [sellerFacebook, setSellerFacebook] = useState("");
  const [sellerTwitter, setSellerTwitter] = useState("");
  const [userCurrency, setUserCurrency] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [reviews, setReviews] = useState(null);
  const [about, setAbout] = useState([]);
  const [averageRating, setAverageRating] = useState(undefined);

  const [visibleProducts, setVisibleProducts] = useState(12);
  const [shopPause, setShopPause] = useState(false);

  const loadMore = () => {
    setVisibleProducts((prev) => prev + 12);
  };
  const router = useRouter();

  const slug = router.query.slug;

  const getSellerInfo = () => {
    setLoading(true);
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/store/${slug}`,
    };
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        if (response.data.userRole === "seller") {
          if(response.data.shop_status == 0){
            setShopPause(true)
          }
          setSeller(response.data);
          setSellerStoreName(response.data.storeTitle);
          setSellerStoreDesc(response.data.storeDesc);
          setSellerStoreLogo(response.data.storeLogo);
          setSellerStoreBanner(response.data.storeBanner);
          setSellerInstagram(response.data.instagram);
          setSellerFacebook(response.data.facebook);
          setSellerTwitter(response.data.twitter);
          getProductsBySellerId(response.data._id);
          getReviewsBySellerId(response.data._id)
          setError(false);
        } else {
        }
        setLoading(false);
      })
      .catch(function (error) {
        console.error("Error:", error);
        setError(true);
        setLoading(false);
      });
  };

  const getProductsBySellerId = (sellerId) => {
    const productsOptions = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/by/${sellerId}`,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(productsOptions)
      .then(function (response) {
        const approvedProducts = response.data.filter(
          (product) => product.productStatus === "Approved" && product.status == 1
        );
        const updatedProducts = calculateSurcharge(approvedProducts)
        setAllProducts(updatedProducts);
      })
      .catch(function (error) {
        console.error(`Error fetching products for Seller ${sellerId}:`, error);
      });
  };

  const getReviewsBySellerId = (sellerId) => {
    const reviewsOptions = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/seller/${sellerId}`,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(reviewsOptions)
      .then(function (response) {
        const reviewsData = response.data.data
        if (reviewsData?.length) {
          setReviews(reviewsData);
          
          // Calculate the average rating
          const totalRating = reviewsData?.reduce((sum, review) => sum + review.avgRating, 0);
          const avgRating = totalRating / reviewsData.length;
          setAverageRating(avgRating);
        } else {
          setReviews([]);
          setAverageRating(0);
          setCurrentPageReview(0)

        }
      })
      .catch(function (error) {
        console.error(`Error fetching products for Seller ${sellerId}:`, error);
      });
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price); // Ensure it's a number
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  };

  const applySurcharge = (approvedProducts) => {
    let userInfo = JSON.parse(localStorage.getItem("userInfo")) || {}
    let userCurrency = (userInfo?.currency && userInfo.currencyRate) ? userInfo?.currency : false
    if (userInfo.country) setUserCountry(userInfo.country)
    setUserCurrency(userCurrency)
    approvedProducts = calculateSurcharge(approvedProducts)
  }
  // References for sections
  const productsRef = useRef(null);
  const reviewsRef = useRef(null);
  const aboutRef = useRef(null);

  const headerHeight = 80; // Adjust this based on your sticky header height

  useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem("userInfo")) || {}
    setUserCountry(userInfo.country)
    setUserCurrency(userInfo?.currency)
    const handleScroll = () => {
      const productSection = productsRef.current?.getBoundingClientRect();
      const reviewSection = reviewsRef.current?.getBoundingClientRect();
      const aboutSection = aboutRef.current?.getBoundingClientRect();

      if (productSection && productSection.bottom <= headerHeight + 50) {
        setActiveTab("reviews");
      }
      if (reviewSection && reviewSection.bottom <= headerHeight + 50) {
        setActiveTab("about");
      }
      if (productSection && productSection.top > headerHeight) {
        setActiveTab("products");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll function with offset
  const scrollToSection = (sectionRef) => {
    if (sectionRef.current) {
      const yOffset = -headerHeight - 10; // Adjust to ensure section is fully visible
      const y = sectionRef.current.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };


  useEffect(() => {
    if (slug) {
      getSellerInfo();
    }
  }, [slug]);

  const truncateText = (text, charLimit) => {
    if (text.length > charLimit) {
      return text.substring(0, charLimit) + "...";
    }
    return text;
  };

  const handleCopyLinkClick = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("Link copied to clipboard!");
  };

  const currentUrl = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`;

  const imageUrl =
    sellerInfo && sellerInfo.storeLogo
      ? sellerInfo.storeLogo
      : `${process.env.NEXT_PUBLIC_URL}/default-seller-banner.jpg`;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Check out this store: ${sellerInfo ? sellerInfo?.storeTitle : ""
    } ${currentUrl}`
  )}`;



  const productsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate start and end indices for the products to display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProducts?.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculate total pages
  const totalPages = Math.ceil(allProducts?.length / productsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToProducts(); // Scroll to the products section
  };

  // Handle next and previous page buttons
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    scrollToProducts(); // Scroll to the products section
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    scrollToProducts(); // Scroll to the products section
  };

  // Scroll to the products section by ID
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);  // Set this flag to false after the first render
      return;  // Prevent scroll on the first render
    }
    scrollToProducts(); // Scroll to the products section when the page changes
  }, [currentPage]); // This effect will run every time currentPage is updated
  


  const reviewsPerPage = 2; // Adjust this value based on how many reviews you want to show per page
  const reviewsRefReview = useRef(null);

  const [currentPageReview, setCurrentPageReview] = useState(1);

  // Calculate total pages based on reviews length and reviews per page
  const totalPagesReview = Math.ceil(reviews?.length / reviewsPerPage);

  // Calculate which reviews to display for the current page
  const indexOfLastReview = currentPageReview * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews?.slice(indexOfFirstReview, indexOfLastReview);

  // Handle page change
  const handlePageChangeReview = (pageNumber) => {
    setCurrentPageReview(pageNumber);
    scrollToReviews(); // Scroll to the reviews section
  };

  // Handle next and previous page buttons
  const handleNextReview = () => {
    if (currentPageReview < totalPagesReview) {
      setCurrentPageReview(currentPageReview + 1);
      scrollToReviews(); // Scroll to the reviews section
    }
  };

  const handlePreviousReview = () => {
    if (currentPageReview > 1) {
      setCurrentPageReview(currentPageReview - 1);
      scrollToReviews(); // Scroll to the reviews section
    }
  };

  // Scroll to the reviews section by ID
  const scrollToReviews = () => {
    if (reviewsRefReview.current) {
      reviewsRefReview.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={`https://staging.afomamarketplace.com/shop/${slug}`}/>
        <title>{sellerInfo?.storeTitle}</title>
        <meta property="og:title" content={sellerInfo?.storeTitle} />
        <meta property="og:description" content={sellerInfo?.storeDesc} />
        <meta name="title" content={sellerInfo?.storeTitle} />
        <meta name="description" content={sellerInfo?.storeDesc} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/*  */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={sellerInfo?.storeTitle} />
        <meta name="twitter:description" content={sellerInfo?.storeDesc} />
        <meta name="twitter:image" content={imageUrl} />
        <meta property="twitter:image:width" content="1200" />
        <meta property="twitter:image:height" content="630" />
      </Head>

      <section>
        <Header cart={cart} addToCart={addToCart} />
      </section>
      <section className="bg-white">
        <div className="bg-orange-50">
          {sellerStoreBanner ? (
            <img
              src={sellerStoreBanner}
              alt="Store Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/default-seller-banner.jpg" // Replace with the actual path to your default image
              alt="Default Banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>



        <div className="max-w-screen-xl mx-auto px-4 mt-4 pb-8">
          <div className="flex gap-4 flex-row items-center xl:gap-10">
            <div className="shrink-0">
              {sellerStoreLogo ? (
                <Image
                  src={sellerStoreLogo}
                  alt="Store Logo"
                  height={200}
                  width={200}
                  quality={100}
                  className="h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] md:h-[150px] md:w-[150px] lg:h-[180px] lg:w-[180px] xl:h-[200px] xl:w-[200px] object-cover rounded-sm"
                />
              ) : (
                <Image
                  src="/default-seller-logo.jpg"
                  alt="Default Logo"
                  height={200}
                  width={200}
                  quality={100}
                  className="h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] md:h-[150px] md:w-[150px] lg:h-[180px] lg:w-[180px] xl:h-[200px] xl:w-[200px] object-cover rounded-sm"
                />
              )}
            </div>

            <div className="lg:mt-16 flex-1 min-w-0">
              <div className="flex flex-row items-center gap-2 xl:gap-2 mb-2">
                {sellerStoreName && (
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug tracking-tight text-blue-950 noto-font break-words max-w-full">
                    {sellerStoreName}
                  </h1>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="border border-gray-300 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-950">🚚 Smooth Dispatch</h3>
              <p className="text-slate-600 text-sm">Has a history of dispatching on time with tracking.</p>
            </div>

            <div className="border border-gray-300 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-950">⚡ Products</h3>
              <p className="text-slate-600 text-sm">
              Shop listed {allProducts ? (
                  <strong>{allProducts.length}</strong>
                ) : (
                  <strong>no</strong>
                )} Products.
              </p>
            </div>



            <div className="border border-gray-300 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-950">🌟 Rate Reviews</h3>
              <p className="text-slate-600 text-sm">
              {averageRating? "Average review rating is ":""}
                <strong>
                  {averageRating === undefined
                    ? 'Loading...'
                    : averageRating === 0
                      ? 'No ratings yet'
                      : averageRating}
                </strong>
              </p>

            </div>
          </div>
        </div>
      </section>
      <section className="bg-white">
        {/* Sticky Tabs */}
        <div className="w-full bg-white sticky top-0 z-50 shadow-md py-6">
          <div className="max-w-screen-xl mx-auto pl-5 pt-2 lg:pl-10">
            <div className="flex gap-8">
              <button
                className={`text-xl font-medium ${activeTab === "products" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                onClick={() => scrollToSection(productsRef)}
              >
                Products
              </button>
              <button
                className={`text-xl font-medium ${activeTab === "reviews" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                onClick={() => scrollToSection(reviewsRef)}
              >
                Reviews
              </button>
              <button
                className={`text-xl font-medium ${activeTab === "about" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                onClick={() => scrollToSection(aboutRef)}
              >
                About
              </button>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-screen-xl mx-auto px-4 py-8 md:py-10 lg:py-18">
          <div ref={productsRef}>
            <div id="products" className="pb-5 mb-9 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#D8D8D8]">
              <h2 className="text-blue-950 text-2xl lg:text-4xl font-bold mb-5">
                Seller&apos;s Collections
              </h2>

              {loading && <p>Loading...</p>}
              {error && <p>Error loading data</p>}

              {allProducts && allProducts.length > 0 ? (
                <p className="text-blue-950">{allProducts.length} results</p>
              ) : null}
            </div>
            {allProducts && allProducts.length > 0 ? (
              <>
                <div className="flex flex-col">
                  <div>
                    <div className="flex flex-wrap gap-8 mb-4 md:mb-9 xl:mb-12 justify-center">
                      {!loading ? (
                        <>
                          {error && <p>Error - Something went wrong!</p>}
                          {allProducts &&
                            // allProducts.slice(0, visibleProducts).map((data) => (
                            currentProducts.map((data) => (
                              <div key={data?._id} className="relative">
                                <div>
                                  <div className="w-[320px] h-[320px] max-w-[320px] max-h-[320px] relative overflow-visible group bg-white border border-slate-200 rounded">
                                    <div className="absolute inset-0 bg-yellow-950/[55%] opacity-0 group-hover:opacity-100 transition-opacity rounded"></div>
                                    <img
                                      src={data?.images[0]?.imageUrl}
                                      alt={data?.images[0]?.altText}
                                      className="h-full w-full rounded"
                                    />
                                    <div className="absolute bg-orange-50 w-8 h-8 rounded-full right-5 top-5 flex items-center justify-center">
                                      <button
                                        className="container flex items-center justify-center opacity-50"
                                        disabled
                                        title="Coming soon..."
                                      >
                                        <svg
                                          id="like_1_"
                                          data-name="like (1)"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="17.563"
                                          height="15.516"
                                          viewBox="0 0 17.563 15.516"
                                          className=""
                                        >
                                          <g
                                            id="Group_26207"
                                            data-name="Group 26207"
                                            transform="translate(0 0)"
                                          >
                                            <path
                                              id="Path_2296"
                                              data-name="Path 2296"
                                              d="M16.281,31.36a4.424,4.424,0,0,0-7.063.508,6.734,6.734,0,0,0-.437.709,6.728,6.728,0,0,0-.437-.709,4.424,4.424,0,0,0-7.063-.508A5.323,5.323,0,0,0,0,34.9a6.519,6.519,0,0,0,1.8,4.277,39.973,39.973,0,0,0,4.494,4.2c.68.579,1.382,1.178,2.131,1.833l.022.02a.515.515,0,0,0,.678,0l.022-.02c.748-.655,1.451-1.254,2.131-1.833a39.968,39.968,0,0,0,4.494-4.2,6.519,6.519,0,0,0,1.8-4.277A5.324,5.324,0,0,0,16.281,31.36ZM10.606,42.589c-.586.5-1.189,1.013-1.825,1.566-.636-.553-1.239-1.066-1.825-1.566C3.387,39.547,1.029,37.538,1.029,34.9a4.3,4.3,0,0,1,1.024-2.855,3.435,3.435,0,0,1,2.612-1.176,3.469,3.469,0,0,1,2.839,1.6,6.1,6.1,0,0,1,.788,1.566.515.515,0,0,0,.978,0,6.1,6.1,0,0,1,.788-1.566,3.4,3.4,0,0,1,5.451-.423A4.3,4.3,0,0,1,16.533,34.9C16.533,37.538,14.175,39.547,10.606,42.589Z"
                                              transform="translate(0 -29.836)"
                                              fill="#172554"
                                            />
                                          </g>
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="absolute bottom-9 hover:visible flex items-center justify-center left-0 right-0">
                                      <div className="flex items-center justify-center ">
                                        <Link
                                          href={`/category/${data.Category.slug
                                            }/${data?.SubCategory?.slug}${data?.childCategory?.slug
                                              ? `/${data?.childCategory?.slug}`
                                              : ""
                                            }/${data?.slug}`}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity buttonprimary"
                                        >
                                          Shop Now
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="7.477"
                                            height="13.14"
                                            viewBox="0 0 7.477 13.14"
                                          >
                                            <path
                                              id="Down_Arrow_3_"
                                              d="M26.166,46.727a.559.559,0,0,1-.4-.164l-5.606-5.606a.561.561,0,0,1,.793-.793l5.21,5.21,5.21-5.21a.561.561,0,0,1,.793.793l-5.606,5.606a.559.559,0,0,1-.4.164Z"
                                              transform="translate(-39.625 32.764) rotate(-90)"
                                              fill="#fff"
                                              stroke="#fff"
                                              strokeWidth="0.75"
                                            />
                                          </svg>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="font-medium mt-3 mb-1 text-blue-950 hover:text-primary ">
                                    <Link
                                      href={`/category/${data.Category.slug}/${data?.SubCategory?.slug
                                        }${data?.childCategory?.slug
                                          ? `/${data?.childCategory?.slug}`
                                          : ""
                                        }/${data?.slug}`}
                                    >
                                      {truncateText(data?.productName, 35)}
                                    </Link>
                                  </p>
                                </div>
                                <div>
                                  <p className="font-bold mb-2 text-lg text-blue-950">
                                    {data?.productType !== "Customizable" &&
                                      data.discountCode &&
                                      parseFloat(data.discountCode) > 0 ? (
                                      <>
                                        <div>
                                          <span className="text-blue-950 font-bold mr-2">
                                            {userCurrency ? userCurrency : "CA$"}{" "}
                                            {parseFloat(data.surTotalAmount ? data.surTotalAmount : data.finalPrice).toFixed(2)}
                                          </span>
                                          <span className="text-red-700 font-normal line-through  text-sm">
                                            {" "}
                                            {userCurrency ? userCurrency : "CA$"}{" "}
                                            {formatPrice(parseFloat(data.surTotalAmountBDis ? data.surTotalAmountBDis : data.totalPrice).toFixed(2))}
                                          </span>
                                          <span>
                                            {" "}
                                            <span className="text-orange-700 font-normal text-sm">
                                              {" "}
                                              ({data.discountCode}% off)
                                            </span>
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <>
                                          {data &&
                                            data.productType === "Customizable" &&
                                            data.variations &&
                                            data.variations.length && (
                                              <>
                                                <span className="text-blue-950 font-bold mr-2">
                                                  {userCurrency ? userCurrency : "CA$"}{" "}
                                                  {formatPrice(parseFloat(
                                                    data.variations[0].finalPrice || data.variations[0]?.surTotalAmount
                                                      ? data.variations[0]?.surTotalAmount
                                                      : (data.variations[0].finalPrice ? data.variations[0].finalPrice : data.variations[0].price)
                                                  ).toFixed(2))}
                                                </span>
                                                {data.discountCode &&
                                                  parseFloat(data.discountCode) >
                                                  0 && (
                                                    <>
                                                      <span className="text-red-700 font-normal line-through  text-sm">
                                                        {" "}
                                                        {userCurrency ? userCurrency : "CA$"}{" "}
                                                        {formatPrice(parseFloat(
                                                          data.variations[0]
                                                            ?.surTotalAmountBDis ?
                                                            data.variations[0]
                                                              ?.surTotalAmountBDis
                                                            : data.variations[0]
                                                              ?.totalPrice
                                                        ).toFixed(2))}
                                                      </span>
                                                      <span>
                                                        {" "}
                                                        <span className="text-orange-700 font-normal text-sm">
                                                          {" "}
                                                          ({data.discountCode}%
                                                          off)
                                                        </span>
                                                      </span>
                                                    </>
                                                  )}
                                              </>
                                            )}
                                        </>
                                        <>
                                          {data?.productType !==
                                            "Customizable" && (
                                              <>
                                                {userCurrency ? userCurrency : "CA$"}{" "}
                                                {formatPrice(parseFloat(
                                                  data?.surTotalAmount ? data?.surTotalAmount : data.finalPrice
                                                ).toFixed(2))}
                                              </>
                                            )}
                                        </>
                                      </>
                                    )}
                                  </p>
                                  {((data?.seller?.country == userCountry && data?.seller?.shippingConfigId?.domestic?.flat_rate &&
                                    data?.seller?.shippingConfigId?.domestic?.flat_rate_options?.free_shipping) ||
                                    (data?.seller?.country == userCountry && data?.seller?.shippingConfigId?.international?.flat_rate &&
                                      data?.seller?.shippingConfigId?.international?.flat_rate_options?.free_shipping) || 
                                      (data?.freeDelivery && data?.seller?.country == userCountry)
                                  ) && data.productType != "Downloadable" ? (
                                    <div className="mb-2 px-[8px] py-[2px] text-[11px] bg-[#a0e193] rounded-full w-[max-content]">
                                      Free Shipping
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            ))}
                        </>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                    <div>
                      {/* <div className="flex justify-center">
                      {allProducts && visibleProducts < allProducts.length && (
                        <button className="buttonprimary" onClick={loadMore}>
                        Load more
                        </button>
                        )}
                        </div> */}


                      {allProducts.length && (
                        <>
                          {/* Pagination controls */}
                          <div className="flex justify-center items-center mt-4">
                            {/* Previous Button */}
                            <button
                              className="buttonprimary mx-2"
                              onClick={handlePrevious}
                              disabled={currentPage === 1}
                            >
                              {'<'}
                            </button>

                            {/* Page Number Buttons */}
                            {Array.from({ length: totalPages }, (_, index) => (
                              <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 mx-1 ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-gray-200'
                                  }`}
                              >
                                {index + 1}
                              </button>
                            ))}

                            {/* Next Button */}
                            <button
                              className="buttonprimary mx-2"
                              onClick={handleNext}
                              disabled={currentPage === totalPages}
                            >
                              {'>'}
                            </button>
                          </div>

                          {/* Current Page Info moved to the next line */}
                          <div className="flex justify-center mt-2">
                            <span>
                              {currentPage} of {totalPages}
                            </span>
                          </div>
                        </>)}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              shopPause ? (<div className="py-8 text-center">
                <>
                <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" opacity="0.5"/><path d="M8 9.5c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54C8.801 8 9.034 8 9.5 8s.699 0 .883.076a1 1 0 0 1 .54.541c.077.184.077.417.077.883v5c0 .466 0 .699-.076.883a1 1 0 0 1-.541.54C10.199 16 9.966 16 9.5 16s-.699 0-.883-.076a1 1 0 0 1-.54-.541C8 15.199 8 14.966 8 14.5zm5 0c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54C13.801 8 14.034 8 14.5 8s.699 0 .883.076a1 1 0 0 1 .54.541c.077.184.077.417.077.883v5c0 .466 0 .699-.076.883a1 1 0 0 1-.541.54c-.184.077-.417.077-.883.077s-.699 0-.883-.076a1 1 0 0 1-.54-.541C13 15.199 13 14.966 13 14.5z"/></g></svg>
                    </div>
                    <h1
                    className={`text-2xl xl:text-4xl text-center justify-center text-blue-950 mt-7 noto-font`}
                  >
                    Shop on Pause!
                  </h1>

                  <p className="text-slate-600 text-sm mt-3  text-center justify-center">
                    This seller’s taking a short break — check back soon for fresh finds!
                  </p>
                  <p className="text-slate-600 text-sm mt-3  text-center justify-center">
                  In the meantime, check out other amazing products or shops on AFOMA Marketplace!
                  </p>
                </>
              </div>) : (
                <div className="py-24">
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
                      className={`text-2xl xl:text-4xl text-center justify-center text-blue-950 mt-7 noto-font`}
                    >
                      No Products Added
                    </h1>

                    <p className="text-slate-600 text-sm mt-3  text-center justify-center">
                      You have not listed any product.
                    </p>
                  </>
                </div>
              )
            )}
          </div>

          <div ref={reviewsRef} className="mt-20">
            <h2 className="text-blue-950 text-2xl lg:text-4xl font-bold mb-5">Reviews</h2>

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">Error loading data</p>}

            {currentReviews?.length > 0 ? (
              currentReviews?.map((review, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border-b border-gray-300">
                  {/* Product Image */}
                  <img
                    src={review.productId?.images?.[0]?.imageUrl || "/placeholder.jpg"}
                    alt="Product"
                    className="w-16 h-16 object-cover rounded-md"
                  />

                  {/* Review Content */}
                  <div className="flex-1">
                    {/* User Name & Stars */}
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-blue-900">{review.UserId.firstName + " " + review.UserId.lastName}</p>
                      {/* Star Rating */}
                      <div className="flex text-yellow-500">
                        {Array.from({ length: review.rating || 5 }).map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L0 6.91l6.561-.955L10 0l3.439 5.955L20 6.91l-5.245 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-sm text-gray-600 mt-1">{review.reviewText}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}

            {/* Pagination Controls */}
            {reviews?.length ? (
              <>
                <div className="flex justify-center items-center mt-4">
                  {/* Previous Button */}
                  <button
                    className="buttonprimary mx-2"
                    onClick={handlePreviousReview}
                    disabled={currentPageReview === 1}
                  >
                    {'<'}
                  </button>

                  {/* Page Number Buttons */}
                  {Array.from({ length: totalPagesReview }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChangeReview(index + 1)}
                      className={`px-3 py-1 mx-1 ${currentPageReview === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    className="buttonprimary mx-2"
                    onClick={handleNextReview}
                    disabled={currentPageReview === totalPagesReview}
                  >
                    {'>'}
                  </button>
                </div>

                {/* Current Page Info moved to the next line */}
                <div className="flex justify-center mt-2">
                  <span>
                    {currentPageReview} of {totalPagesReview}
                  </span>
                </div>
              </>
            ):""}
          </div>


          <div ref={aboutRef} className="mt-20 p-6 bg-white shadow-lg rounded-lg">
            {/* Header */}
            <h2 className="text-blue-950 text-2xl lg:text-4xl font-bold mb-5">
              About {seller?.storeTitle}
            </h2>

            {/* Seller Info */}
            <div className="flex items-center gap-5 border-b pb-4">
              {/* Profile Image */}
              <img
                src={seller?.userProfile || "/default-user.png"}
                alt="Seller Profile"
                className="w-16 h-16 rounded-full object-cover border"
              />

              <div>
                <p className="text-lg font-semibold text-gray-900">{seller?.firstName + " " + seller?.lastName}</p>
                <p className="text-sm text-gray-600">{seller?.city + ", " + seller?.state + ", " + seller?.country|| "-"}</p>
              </div>
            </div>

            {/* Store Description */}
            {sellerStoreDesc && (
              <p className="text-gray-700 text-sm mt-4 leading-relaxed">
                {sellerStoreDesc}
              </p>
            )}

            {/* Social Links & Share */}
            <div className="flex items-center gap-4 mt-5">
              {/* Social Icons */}
              <div className="flex gap-3">
                {sellerFacebook && (
                  <Link href={sellerFacebook} target="_blank">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full hover:bg-blue-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 7.011 13.09">
                        <path
                          d="M8.161,7.363l.364-2.369H6.251V3.457a1.185,1.185,0,0,1,1.336-1.28H8.62V.16A12.6,12.6,0,0,0,6.786,0a2.892,2.892,0,0,0-3.1,3.189V4.994H1.609V7.363H3.69V13.09H6.251V7.363Z"
                          transform="translate(-1.609)"
                          fill="#fff"
                        />
                      </svg>
                    </div>
                  </Link>
                )}
                {sellerTwitter && (
                  <Link href={sellerTwitter} target="_blank">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full hover:bg-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 8.961 8.101">
                        <path
                          d="M33.856,48h1.375l-3,3.431L35.761,56.1H33L30.829,53.27,28.352,56.1H26.975l3.213-3.672L26.8,48h2.835l1.957,2.588Zm-.483,7.278h.761l-4.914-6.5H28.4Z"
                          transform="translate(-26.8 -48)"
                          fill="#fff"
                        />
                      </svg>
                    </div>
                  </Link>
                )}
                {sellerInstagram && (
                  <Link href={sellerInstagram} target="_blank">
                    <div className="w-8 h-8 flex items-center justify-center bg-pink-500 rounded-full hover:bg-pink-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 11.932 11.932">
                        <path
                          d="M8.949,0H2.983A2.992,2.992,0,0,0,0,2.983V8.949a2.992,2.992,0,0,0,2.983,2.983H8.949a2.992,2.992,0,0,0,2.983-2.983V2.983A2.992,2.992,0,0,0,8.949,0ZM5.966,8.452A2.486,2.486,0,1,1,8.452,5.966,2.486,2.486,0,0,1,5.966,8.452ZM9.2,3.48a.746.746,0,1,1,.746-.746A.746.746,0,0,1,9.2,3.48Z"
                          fill="#fff"
                        />
                      </svg>
                    </div>
                  </Link>
                )}
              </div>

              {/* Share Button */}
              <div className="relative">
                <Menu as="div">
                  <Menu.Button className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gray-900">
                    <FontAwesomeIcon color="#fff" icon={faShareNodes} />
                  </Menu.Button>

                  <Transition as={Fragment}>
                    <Menu.Items className="absolute top-[25px] mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ">
                      <div className="px-3 py-1">
                        <Menu.Item>
                          <Link
                            href={`mailto:?subject=Check this out on Afoma Marketplace&body==${seller?.storeTitle}  ${currentUrl}`}
                          >
                            <button className="text-blue-950 relative hover:opacity-50 hover:cursor">
                              <div className="flex gap-1 flex-row items-center">
                                <Image
                                  src={"/assets/icons/email-circular.svg"}
                                  width={25}
                                  height={25}
                                />
                                <p className="group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-1.5 py-2 text-sm hover:text-primary">
                                  Email
                                </p>
                              </div>
                            </button>
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link
                            title="Facebook"
                            href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                            target="_blank"
                          >
                            <button className="text-blue-950 relative hover:opacity-50 hover:cursor">
                              <div className="flex gap-1 flex-row items-center">
                                <Image
                                  src={
                                    "/assets/icons/facebook-circular.svg"
                                  }
                                  width={25}
                                  height={25}
                                />
                                <p className="group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-1.5 py-2 text-sm hover:text-primary">
                                  Facebook
                                </p>
                              </div>
                            </button>
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link
                            title="Whatsapp"
                            href={whatsappShareUrl}
                            target="_blank"
                          >
                            <button className="text-blue-950 relative hover:opacity-50 hover:cursor">
                              <div className="flex gap-1 flex-row items-center">
                                <Image
                                  src={"/assets/icons/whatsapp.svg"}
                                  width={25}
                                  height={25}
                                />
                                <p className="group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-1.5 py-2 text-sm hover:text-primary">
                                  WhatsApp
                                </p>
                              </div>
                            </button>
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link
                            title="X"
                            href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${seller?.storeTitle}&hashtags=afomamarketplace`}
                            target="_blank"
                          >
                            <button className="text-blue-950 relative hover:opacity-50 hover:cursor">
                              <div className="flex gap-1 flex-row items-center">
                                <Image
                                  src={
                                    "https://m.media-amazon.com/images/G/01/share-icons/x-circular.svg"
                                  }
                                  width={25}
                                  height={25}
                                />
                                <p className="group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-1.5 py-2 text-sm hover:text-primary">
                                  X
                                </p>
                              </div>
                            </button>
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            title="Copy Link"
                            className="text-blue-950 relative hover:opacity-50 hover:cursor"
                            onClick={handleCopyLinkClick}
                          >
                            <div className="flex gap-1 flex-row items-center">
                              <Image
                                src={"/assets/icons/link-circular.svg"}
                                width={25}
                                height={25}
                              />
                              <p className="group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-1.5 py-2 text-sm hover:text-primary">
                                Copy Link
                              </p>
                            </div>
                          </button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          {((seller?.storePolicy?.cancellationPolicy || seller?.storePolicy?.returnPolicy || seller?.storePolicy?.faqList?.length) &&
            <div  className="my-20 p-6 bg-white shadow-lg rounded-lg">
              {/* Store Policies Section */}
              <div className="mt-8">
                {/* <div className="space-y-6"> */}
                {/* Cancellation Policy */}
                {seller?.storePolicy?.cancellationPolicy && (<>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 pb-2 border-gray-300">
                    Store Policies
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <div className="col-span-1">
                      <label htmlFor="cancellationPolicy" className="text-lg font-medium text-gray-800">
                        Cancellation Policy:
                      </label>
                    </div>
                    <div className="flex flex-col flex-row items-start col-span-3">
                      {/* <div className="text-lg text-gray-600">
                        {seller?.storePolicy?.cancellationPolicy ? "Yes" : "No"}
                      </div> */}
                      {seller?.storePolicy?.cancellationPolicy && seller?.storePolicy?.cancellationPolicyTime && (
                        <div className="text-sm text-gray-500">
                          I accept order cancellations within {seller?.storePolicy?.cancellationPolicyTime} hours of purchase. After this timeframe, cancellations may not be possible. Feel free to contact me with any questions.
                        </div>
                      )}
                    </div>

                  </div>
                </>
                )}
                <br />

                {/* Return Policy */}
                {seller?.storePolicy?.returnPolicy && (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <div className="col-span-1">
                      <label htmlFor="returnPolicy" className="text-lg font-medium text-gray-800">
                        Return Policy:
                      </label>
                    </div>
                    <div className="flex flex-col flex-row items-start col-span-3">
                      {/* <div className="text-lg text-gray-600">
                        {seller?.storePolicy?.returnPolicy ? "Yes" : "No"}
                      </div> */}
                      {seller?.storePolicy?.returnPolicy && seller?.storePolicy?.returnPolicyDetails && (
                        <div className="text-sm text-gray-500">
                          {seller?.storePolicy?.returnPolicyDetails}
                        </div>
                      )}
                      {seller?.storePolicy?.returnPolicy && !seller?.storePolicy?.returnPolicyDetails && (
                        <div className="text-sm text-gray-500">
                          Returns and exchanges are subject to the seller's discretion. If you have an issue with your order, please contact the seller within 7 days of delivery. Buyers may be responsible for return shipping costs.
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <br />
                <br />
                {(seller?.storePolicy?.faqList?.length &&
                  <div className="space-y-6">
                    <div>
                      <h2
                        className={`text-2xl font-semibold text-gray-900 mb-4 border-b-2 pb-2 border-gray-300`}
                      >
                        FAQs
                      </h2>
                      <div className="py-3 ">
                        {seller?.storePolicy?.faqList?.map((faq, index) => (
                          <div className="p-3 border-b border-b-inputBorder" key={index}>
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => {
                                // Toggle the expanded FAQ index
                                setExpandedIndex(expandedIndex === index ? null : index);
                              }}
                            >
                              <p className="font-medium md:text-lg text-blue-950">{faq.question}</p>
                              <div className="shrink-0">
                                <svg
                                  width="14.381"
                                  height="8.152"
                                  viewBox="0 0 14.381 8.152"
                                  className={expandedIndex === index ? "-rotate-180" : "rotate-0"}
                                >
                                  <path
                                    id="FAQ_dropdown_icon"
                                    data-name="FAQ dropdown icon"
                                    d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                                    transform="translate(-19.625 -39.625)"
                                    fill="#172554"
                                    stroke="#172554"
                                    strokeWidth="0.75"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div
                              className={`${expandedIndex === index ? "h-fit" : "h-0"
                                } overflow-hidden transition-all ease-in-out`}
                            >
                              <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">{faq.answer}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>)}


        </div>
      </section>
      <section className="bg-blue-950 overflow-hidden">
        <div className="flex flex-col xl:flex-row gap-5 px-5 py-10 items-center justify-center">
          {/* Image container with responsive wrapping */}
          <div className="flex flex-wrap justify-center gap-5 w-full xl:w-[63%]">
            <img className="max-w-full sm:max-w-[45%] md:max-w-[30%]" src="/assets/shop-banner-1-c.png" alt="image" />
            <img className="max-w-full sm:max-w-[45%] md:max-w-[30%]" src="/assets/shop-banner-2-c.png" alt="image" />
            <img className="max-w-full sm:max-w-[45%] md:max-w-[30%]" src="/assets/shop-banner-3-c.png" alt="image" />
          </div>
          {/* Text container with proper width to avoid overlap */}
          <div className="text-center xl:text-left mt-5 xl:mt-0 xl:ml-8 w-full xl:w-auto min-w-0">
            <h2 className="text-xl sm:text-3xl xl:text-3xl text-orange-50 font-semibold">
              SUPPORT SMALL BUSINESSES. <br />
              SHOP LOCAL. SHOP UNIQUE!
            </h2>
            <p className="text-orange-50 text-sm mt-3">
              Every purchase makes a difference. Explore our curated collections today!
            </p>
          </div>
        </div>
      </section>




      {/* <section className="bg-blue-950 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4 py-8 md:py-20">
          <div className="flex flex-col md:flex-row gap-6 md:gap-20 xl:gap-48 md:items-center justify-center">
            <div className="md:w-[414px] lg:w-[514px]">
              <h6 className="text-sm md:text-base text-white font-bold mb-3.5">
                MAXIMIZE YOUR PROFIT
              </h6>
              <h2
                className={`text-orange-50  text-2xl md:text-3xl lg:text-4xl lg:tracking-[-0.72px] mb-5 noto-font`}
              >
                Register as a Seller Today!
              </h2>
              <p className="text-orange-50 mb-6 md:mb-9">
                Share your handcrafted masterpieces with a worldwide community
                of art lovers, igniting a journey of creativity and recognition.
              </p>
              <div className="flex">
                <Link href="" className="buttonprimary">
                  {" "}
                  Start selling
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="7.477"
                    height="13.14"
                    viewBox="0 0 7.477 13.14"
                  >
                    <path
                      id="Down_Arrow_3_"
                      d="M26.166,46.727a.559.559,0,0,1-.4-.164l-5.606-5.606a.561.561,0,0,1,.793-.793l5.21,5.21,5.21-5.21a.561.561,0,0,1,.793.793l-5.606,5.606a.559.559,0,0,1-.4.164Z"
                      transform="translate(-39.625 32.764) rotate(-90)"
                      fill="#fff"
                      stroke="#fff"
                      strokeWidth="0.75"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg md:text-2xl xl:text-3xl xl:tracking-[-0.6px] text-orange-50 mb-5 md:mb-7">
                Simple Pricing Plan
              </h3>
              <div className="flex gap-2.5 items-start mb-5">
                <FontAwesomeIcon
                  icon={faSquareCheck}
                  className="text-white text-lg mt-1"
                />
                <p className="text-orange-50 font-light">
                  No overhead charges or hidden fees
                </p>
              </div>
              <div className="flex gap-2.5 items-start">
                <FontAwesomeIcon
                  icon={faSquareCheck}
                  className="text-white text-lg mt-1"
                />
                <p className="text-orange-50 font-light">
                  We choose simplicity and transparency
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="bg-white">
        <div className="max-w-screen-sm mx-auto px-4 py-8 md:py-16 xl:py-32">
          <div>
            <h2
              className={`text-blue-950 xl:tracking-[-0.72px] mb-8 md:mb-9 text-2xl lg:text-4xl noto-font`}
            >
              FAQs
            </h2>
            <div>
              <div className="px-3 pb-3  border-b border-b-inputBorder  xl:pb-6">
                <div
                  className="flex items-center justify-between cursor-pointer "
                  onClick={() => {
                    setFaqOne(!faqOne);
                    setFaqTwo(false);
                    setFaqThree(false);
                    setFaqFour(false);
                  }}
                >
                  <p className="font-medium md:text-lg text-blue-950">
                    What payment methods are accepted on the SELLITIC
                    marketplace?
                  </p>
                  <div className="shrink-0">
                    <svg
                      width="14.381"
                      height="8.152"
                      viewBox="0 0 14.381 8.152"
                      className={faqOne ? "-rotate-180" : "rotate-0"}
                    >
                      <path
                        id="FAQ_dropdown_icon"
                        data-name="FAQ dropdown icon"
                        d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                        transform="translate(-19.625 -39.625)"
                        fill="#172554"
                        stroke="#172554"
                        strokeWidth="0.75"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  className={`${faqOne ? "h-fit" : "h-0"
                    }  overflow-hidden transition-all ease-in-out`}
                >
                  <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                    Becoming a seller is easy! Click the &quot;Become a
                    Seller&quot; or &quot;Register as a Seller&quot; button on
                    our website, and follow the step-by-step registration
                    process. Once approved, you can showcase your unique
                    handmade creations to our global audience.
                  </p>
                </div>
              </div>

              <div className="p-3  border-b border-b-inputBorder  xl:py-6">
                <div
                  className="flex items-center justify-between cursor-pointer "
                  onClick={() => {
                    setFaqOne(false);
                    setFaqTwo(!faqTwo);
                    setFaqThree(false);
                    setFaqFour(false);
                  }}
                >
                  <p className="font-medium md:text-lg text-slate-800">
                    Can I track the shipment of my order?
                  </p>
                  <div className="shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14.381"
                      height="8.152"
                      viewBox="0 0 14.381 8.152"
                      className={faqTwo ? "-rotate-180" : "rotate-0"}
                    >
                      <path
                        id="FAQ_dropdown_icon"
                        data-name="FAQ dropdown icon"
                        d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                        transform="translate(-19.625 -39.625)"
                        fill="#172554"
                        stroke="#172554"
                        strokeWidth="0.75"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  className={`${faqTwo ? "h-fit" : "h-0"
                    }  overflow-hidden transition-all ease-in-out`}
                >
                  <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                    We welcome a wide range of artisanal products, including
                    handmade crafts, unique artworks, jewelry, home decor, and
                    more. You can list them for sale as long as your creations
                    are authentic, handcrafted, and comply with our marketplace
                    policies.
                  </p>
                </div>
              </div>

              <div className="p-3  border-b border-b-inputBorder  xl:py-6">
                <div
                  className="flex items-center justify-between cursor-pointer "
                  onClick={() => {
                    setFaqOne(false);
                    setFaqTwo(false);
                    setFaqThree(!faqThree);
                    setFaqFour(false);
                  }}
                >
                  <p className="font-medium md:text-lg text-slate-800">
                    How are transactions processed on the marketplace?
                  </p>
                  <div className="shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14.381"
                      height="8.152"
                      viewBox="0 0 14.381 8.152"
                      className={faqThree ? "-rotate-180" : "rotate-0"}
                    >
                      <path
                        id="FAQ_dropdown_icon"
                        data-name="FAQ dropdown icon"
                        d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                        transform="translate(-19.625 -39.625)"
                        fill="#172554"
                        stroke="#172554"
                        strokeWidth="0.75"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  className={`${faqThree ? "h-fit" : "h-0"
                    }  overflow-hidden transition-all ease-in-out`}
                >
                  <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                    Our marketplace leverages flexible payment options,
                    including cryptocurrency. When a customer purchases your
                    product, the payment is held in escrow until the order is
                    successfully delivered, providing peace of mind for both
                    buyers and sellers.
                  </p>
                </div>
              </div>

              <div className="p-3   xl:py-6">
                <div
                  className="flex items-center justify-between cursor-pointer "
                  onClick={() => {
                    setFaqOne(false);
                    setFaqTwo(false);
                    setFaqThree(false);
                    setFaqFour(!faqFour);
                  }}
                >
                  <p className="font-medium md:text-lg text-slate-800">
                    What should I consider about shipping costs for
                    international purchases?
                  </p>
                  <div className="shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14.381"
                      height="8.152"
                      viewBox="0 0 14.381 8.152"
                      className={faqFour ? "-rotate-180" : "rotate-0"}
                    >
                      <path
                        id="FAQ_dropdown_icon"
                        data-name="FAQ dropdown icon"
                        d="M26.785,47.4a.615.615,0,0,1-.436-.181l-6.169-6.169a.617.617,0,0,1,.872-.872l5.733,5.733,5.733-5.733a.617.617,0,1,1,.872.872l-6.169,6.169a.615.615,0,0,1-.436.181Z"
                        transform="translate(-19.625 -39.625)"
                        fill="#172554"
                        stroke="#172554"
                        strokeWidth="0.75"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  className={`${faqFour ? "h-fit" : "h-0"
                    }  overflow-hidden transition-all ease-in-out`}
                >
                  <p className="text-blue-950 pt-3 xl:pt-6 xl:text-base">
                    Shipping costs for international purchases may vary based on
                    your location and the seller&apos;s location. Please be
                    aware that your country&apos;s regulations may incur customs
                    duties on the delivery of your product. Despite the
                    potential of incurring higher charges for international
                    shipping, rest assured that your chosen artisanal creations
                    will be carefully packaged and delivered with care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <section>
        <Footer />
      </section>
    </>
  );
};

export async function getServerSideProps(context) {
  const slug = context.query.slug;

  try {
    if (slug) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/store/${slug}`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      if (response.data && response.data.userRole === "seller") {
        return {
          props: {
            sellerInfo: response.data,
          },
        };
      } else {
        return {
          notFound: true,
        };
      }
    } else {
      return {
        notFound: true,
      };
    }
  } catch (e) {
    // console.log("Error fetching product data:", e);
    return {
      notFound: true,
    };
  }
}

export default SellerInfoPage;
