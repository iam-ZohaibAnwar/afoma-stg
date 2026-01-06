import dynamic from "next/dynamic";
//import { Noto_Serif } from "next/font/google";

// Lazy load heavy components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const Faq = dynamic(() => import("@/components/Faq"), { ssr: false });
import {
  faAngleDown,
  faAngleRight,
  faShareNodes,
  faSquareCheck,
  faAngleUp,
  faMinus,
  faPlus,
  faCopy,
  faPlayCircle,
  faCircleArrowDownRight,
  faCircleArrowRight,
  faAngleLeft,
  faArrowLeft,
  faArrowRight,
  faStarHalfAlt,
  faStar as farStar,
} from "@fortawesome/pro-regular-svg-icons";
import {
  faCircleUser,
  faHeart,
  faStarHalf,
  faX,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition, Dialog } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

import React, { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { RWebShare } from "react-web-share";
import { getAllCategory, getAllPostsForHome } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { Formik, Form, Field } from "formik";

const Popover = dynamic(() => import("@/components/Mypopover"), { ssr: false });
const StarRating = dynamic(() => import("@/components/StarRating"), { ssr: false });
const RatingComponent = dynamic(() => import("@/components/RatingComponent"), { ssr: false });
import Head from "next/head";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { calculateSurcharge } from "@/utils/pricingUtils";

//const noto = Noto_Serif({ subsets: ["latin"] });

export default function Product_Detailed({
  allPosts,
  preview,
  categoryPosts,
  cart,
  addToCart,
}) {
  const edges = allPosts?.edges || [];
  const category = categoryPosts?.edges?.slice(0, -1) || [];
  const morePosts = edges;
  const [productCategoryID, setProductCategoryID] = useState(null);
  const [product, setProduct] = useState([]);
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [allProducts, setAllProducts] = useState(null);
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [textArea, setTextArea] = useState();
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [sellerProducts, setSellerProducts] = useState(null);
  const router = useRouter();
  const [productCategory, setProductCategory] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [userName, setUserName] = useState("");
  const [productCount, setProductCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [rating, setRating] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [productId, setProductId] = useState(null);
  const [countS, setCountS] = useState(1);
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [userData, setUserData] = useState();
  const [userId, setUserId] = useState(null);
  const [isShared, setIsShared] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [value, setValue] = useState(0);
  const [quality, setQuality] = useState(0);
  const [price, setPrice] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [existingReview, setExistingReview] = useState(null);
  const [reviewsRendered, setReviewsRendered] = useState(false);
  const sliderRef = useRef(null);

  const settings = {
    infinite: true,
    speed: 1000,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const getSellerProductCount = (sellerId) => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/by/${sellerId}`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };

    return axios.request(options);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const slug = router.query.id;
        if (slug) {
          const response = await axios
            .create({
              headers: {
                "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
              },
            })
            .get(`${process.env.NEXT_PUBLIC_BASE_URL}/products/slug/${slug}`);
          const categoryId = response.data.Category?._id;
          const productId = response.data._id;
          setCategoryId(categoryId);
          setProductId(productId);
          setProduct(response.data);
          const updatedProduct = calculateSurcharge([response.data])?.[0];
          const sellerId = response.data.seller?._id;
          const variationsArray = response.data.variations;
          setVariations(
            variationsArray.map((variation) => {
              return {
                ...variation,
                totalPrice: variation.totalPrice
                  ? variation.totalPrice
                  : variation.price,
                finalPrice: variation.finalPrice
                  ? variation.finalPrice
                  : variation.price,
              };
            })
          );

          // Fetch the number of products for the seller
          const countResponse = await getSellerProductCount(sellerId);
          const approvedProducts = countResponse.data.filter(
            (product) => product.productStatus === "Approved"
          );
          const productCount = approvedProducts.length;
          setProductCount(productCount);

          // getReviews(productId);
          // getAllReviews(productId);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData(); // Fetch data when the component mounts or when slug changes
    // Add 'slug' to the dependency array so that the effect runs when slug changes
  }, [router.query.id]);

  const getAllProducts = () => {
    setLoading(true);
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        // Filter products with productStatus "Approved"
        const approvedProducts = response.data.filter(
          (product) => product.productStatus === "Approved"
        );
        setAllProducts(approvedProducts);
        setError(false);
        setLoading(false);
      })
      .catch(function (error) {
        console.error("Error:", error);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const toggleDescriptionVisibility = () => {
    setShowMoreDescription(!showMoreDescription); // Toggle visibility
  };

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedMedia({
        type: "image",
        imageUrl: product.images[0].imageUrl,
      });
    }
  }, [product]);

  useEffect(() => {
    // Set the default selected image to the first image from the array
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleAttributeItemClick = (attribute, value) => {
    // Update the selectedAttributes state when an attribute value is selected
    setSelectedAttributes((prevSelectedAttributes) => ({
      ...prevSelectedAttributes,
      [attribute]: value,
    }));
    // You can also perform other actions based on the selected attribute and value
    if (variations && variations.length > 0) {
      const filteredVariation = variations.find((variation) => {
        return variation[attribute] === value;
      });
      if (filteredVariation && filteredVariation.image) {
        handleImageClick({ imageUrl: filteredVariation.image });
      }
    }
  };

  const attributeArray = [];
  if (
    product.productType === "Customizable" &&
    variations !== null &&
    variations.length > 0
  ) {
    Object.keys(variations[0]).forEach((attribute) => {
      if (
        attribute !== "inventory" &&
        attribute !== "quantity" &&
        attribute !== "price" &&
        attribute !== "totalPrice" &&
        attribute !== "finalPrice" &&
        attribute !== "image" &&
        attribute !== "currencyPrice" &&
        attribute !== "surTotalAmount" &&
        attribute !== "surTotalAmountBDis"
      ) {
        const attributeName = attribute;
        const attributeValue =
          selectedAttributes[attribute] !== undefined
            ? selectedAttributes[attribute]
            : `${variations[0][attribute]}`;
        attributeArray.push({ attributeName, attributeValue });
      }
    });
  }

  const getUniqueValues = (array, attribute) => {
    const values = new Set();
    array.forEach((item) => {
      if (item && item[attribute] !== undefined) {
        values.add(item[attribute]);
      }
    });
    return Array.from(values);
  };

  const initialPrice =
    variations && variations.length > 0 ? variations[0].finalPrice : null;

  const initialActualPrice =
    variations && variations.length > 0 ? variations[0].totalPrice : null;

  const getPriceForSelectedAttributes = () => {
    const selectedVariation = variations.find((variation) =>
      Object.entries(selectedAttributes).every(
        ([key, value]) => variation[key] === value
      )
    );

    if (selectedVariation) {
      // Check if all attributes are selected
      const allAttributesSelected =
        Object.keys(selectedAttributes).length ===
        Object.keys(variations[0]).filter(
          (attribute) =>
            attribute !== "inventory" &&
            attribute !== "quantity" &&
            attribute !== "price" &&
            attribute !== "totalPrice" &&
            attribute !== "finalPrice" &&
            attribute !== "image" &&
            attribute !== "currencyPrice" &&
            attribute !== "surTotalAmount" &&
            attribute !== "surTotalAmountBDis"
        ).length;

      // If all attributes are selected, return the selected variation's price
      // Otherwise, return the initial price
      return allAttributesSelected && selectedVariation.finalPrice
        ? selectedVariation.finalPrice
        : initialPrice;
    } else {
      return initialPrice;
    }
  };

  const getActualPriceForSelectedAttributes = () => {
    const selectedVariation = variations.find((variation) =>
      Object.entries(selectedAttributes).every(
        ([key, value]) => variation[key] === value
      )
    );

    if (selectedVariation) {
      // Check if all attributes are selected
      const allAttributesSelected =
        Object.keys(selectedAttributes).length ===
        Object.keys(variations[0]).filter(
          (attribute) =>
            attribute !== "inventory" &&
            attribute !== "quantity" &&
            attribute !== "price" &&
            attribute !== "totalPrice" &&
            attribute !== "finalPrice" &&
            attribute !== "image" &&
            attribute !== "currencyPrice"&&
            attribute !== "surTotalAmount" &&
            attribute !== "surTotalAmountBDis"
        ).length;

      // If all attributes are selected, return the selected variation's price
      // Otherwise, return the initial price
      return allAttributesSelected && selectedVariation.totalPrice
        ? selectedVariation.totalPrice
        : initialActualPrice;
    } else {
      return initialActualPrice;
    }
  };

  const calculatedPrice =
    Object.keys(selectedAttributes).length > 0
      ? getPriceForSelectedAttributes() || " "
      : initialPrice || " ";

  const calculatedActualPrice =
    Object.keys(selectedAttributes).length > 0
      ? getActualPriceForSelectedAttributes() || " "
      : initialActualPrice || " ";

  const [count, setCount] = useState(1);

  const totalQuantity = calculateTotalQuantity(selectedAttributes, variations);

  const increment = () => {
    // Limit increment if count is less than total quantity
    if (count < totalQuantity) {
      setCount(count + 1);
    }
  };

  // Decrement function
  const decrement = () => {
    // Limit decrement if count is greater than 1
    if (count > 1) {
      setCount(count - 1);
    }
  };

  function calculateTotalQuantity(selectedAttributes, variations) {
    // Check if there are selected attributes and variations
    if (!selectedAttributes || !variations || variations.length === 0) {
      return 0;
    }

    // Find the variation that matches the selected attributes
    const matchingVariation = variations.find((variation) => {
      for (const attribute in selectedAttributes) {
        if (selectedAttributes[attribute] !== variation[attribute]) {
          return false;
        }
      }
      return true;
    });

    // Return the quantity if a matching variation is found
    return matchingVariation ? matchingVariation.quantity : 0;
  }

  const calculateInventory = () => {
    if (variations) {
      const selectedVariation = variations.find((variation) =>
        Object.entries(selectedAttributes).every(
          ([key, value]) => variation[key] === value
        )
      );

      return selectedVariation ? selectedVariation.inventory : "Out of Stock";
    }
  };

  const incrementS = () => {
    if (countS < product.quantity) {
      setCountS(countS + 1);
    }
  };

  const decrementS = () => {
    if (countS > 1) {
      setCountS(countS - 1);
    }
  };

  useEffect(() => {
    setCount(1); // Reset count to 1 whenever variations change
  }, [selectedAttributes]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setSelectedVideo(null);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setSelectedImage(null);
  };

  const getUserData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const options = {
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/${user?.userId}`,
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          setUserData(response.data);
          setUserId(user?.userId);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const reviewsPerPage = 3; // Set the number of reviews to display per page

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = allReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(allReviews.length / reviewsPerPage);

  // Handle previous page

  useEffect(() => {
    // Check if the user has already given a review for the product
    const userReview = allReviews.find(
      (review) => review.UserId === userId && review.productId === productId
    );
    setExistingReview(userReview);
  }, [userId, allReviews, productId]);

  // Function to render reviews with usernames and profile images
  const handleBack = () => {
    router.back();
  };
  return (
    <>
      <Head>
        <title>{product.productName}</title>
        <meta property="og:title" content={product.productName} />
        <meta property="og:description" content={product.description} />
        <meta name="description" content={product.description} />
      </Head>

      <section>
        <Header cart={cart} addToCart={addToCart}/>
      </section>

      <section className=" bg-white">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-wrap gap-1.5 px-4 py-6 md:py-6 xl:pb-16">
            <div className="">
              <button
                type="button"
                className={` flex gap-1 items-center text-slate-600  hover:text-primary text-xs`}
                onClick={handleBack}
              >
                Back <FontAwesomeIcon icon={faAngleRight} className="h-[8px]" />
              </button>
            </div>
            <p className="text-primary font-medium text-xs flex items-center gap-1.5">
              {product?.productName ? <>{product.productName} </> : null}
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="max-w-screen-lg mx-auto px-4 pb-9">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex md:flex-row flex-col gap-6 md:gap-12 mb-2 md:mb-16 xl:mb-24">
              <div className="relative ">
                <div className="md:w-[304px] lg:w-[455px] md:shrink-0 lg:flex gap-5 top-10">
                  <div className="hidden lg:flex gap-4 shrink-0 items-start flex-col">
                    {product && product.images ? (
                      product.images.map((image, index) => (
                        <div key={index}>
                          <img
                            src={image.imageUrl}
                            alt={image.altText}
                            className="border-[1px] hover:border-primary h-[84px] w-[76px] object-cover rounded"
                            onClick={() => handleImageClick(image)}
                          />
                        </div>
                      ))
                    ) : (
                      <p>Loading image</p>
                    )}

                    {product && product.videos ? (
                      product.videos.map((video, index) => (
                        <div key={index}>
                          <div
                            className="border-[2px] relative hover:border-primary h-[76px] w-[76px] cursor-pointer"
                            onClick={() => handleVideoClick(video)}
                          >
                            {/* Load the video and capture the first frame */}
                            <FontAwesomeIcon
                              icon={faPlayCircle}
                              className="absolute top-6 left-6 text-gray-300 text-2xl"
                            />
                            <video
                              src={video.videoUrl}
                              className="h-full w-full"
                              preload="metadata"
                              muted
                              playsInline
                              crossOrigin="anonymous"
                            >
                              <p>
                                Your browser does not support the video tag.
                              </p>
                            </video>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Loading video</p>
                    )}
                  </div>

                  <div>
                    <div className="flex  justify-center">
                      <div className="relative  overflow-visible group bg-white border border-slate-200 rounded mb-6 md:mb-12">
                        <div className="absolute bg-orange-50 w-8 h-8 rounded-full right-5 top-5 flex items-center justify-center z-10">
                          <button
                            //onClick={() => addToWishlist(product?._id)}
                            className="container flex items-center justify-center z-10 opacity-50"
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
                            {/* <FontAwesomeIcon
                            icon={faHeart}
                            className="text-red-500 hidden hover:block opacity-50"
                            disabled
                            title="Coming soon..."
                          /> */}
                          </button>
                        </div>

                        <div
                          className={`relative h-[285px] w-[285px] md:w-[320px] md:h-[320px] lg:hidden z-0 flex items-center justify-center ${
                            isShared ? "shared bg-black" : ""
                          } ${selectedVideo ? "bg-black" : ""}`}
                        >
                          {/* Apply the specified background and opacity styles */}
                          <div
                            className={`absolute bg-black/[35%] opacity-0 ${
                              isShared ? "opacity-100 inset-0" : ""
                            } transition-opacity`}
                          ></div>
                          <Slider
                            {...settings}
                            ref={sliderRef}
                            className="sliderslick w-[285px] md:w-[320px] mx-auto"
                          >
                            {product &&
                              product.images &&
                              product.images.map((image, index) => (
                                <div key={index}>
                                  <img
                                    src={image.imageUrl}
                                    alt={image.altText}
                                    className="h-[285px] w-[285px] md:w-[320px] md:h-[320px]  object-cover z-10 rounded"
                                    onClick={() => handleImageClick(image)}
                                  />
                                </div>
                              ))}
                            {product &&
                              product.videos &&
                              product.videos.map((video, index) => (
                                <div key={index}>
                                  <div
                                    className="relative h-[285px] w-[285px] md:w-[320px] md:h-[320px]  cursor-pointer"
                                    onClick={() => handleVideoClick(video)}
                                  >
                                    <iframe
                                      src={video.videoUrl}
                                      preload="metadata"
                                      muted
                                      playsInline
                                      width="100%"
                                      height="100%"
                                      crossOrigin="anonymous"
                                    />
                                  </div>
                                </div>
                              ))}
                          </Slider>
                        </div>
                        <div
                          className={`relative hidden h-[285px] w-[285px] md:w-[380px] md:h-[380px] z-0 lg:flex items-center justify-center ${
                            isShared ? "shared bg-black" : ""
                          } ${selectedVideo ? "bg-black" : ""}`}
                        >
                          {/* Apply the specified background and opacity styles */}
                          <div
                            className={`absolute bg-black/[35%] opacity-0 ${
                              isShared ? "opacity-100 inset-0" : ""
                            } transition-opacity`}
                          ></div>

                          {selectedImage ? (
                            <img
                              src={selectedImage.imageUrl}
                              alt={selectedImage.altText}
                              className={`w-full h-full z-10 object-fill ${
                                isShared ? "shared-opacity" : ""
                              }`}
                            />
                          ) : selectedVideo ? (
                            <div
                              className={`video-container w-full h-full object-cover ${
                                isShared ? "shared-opacity" : ""
                              }`}
                            >
                              <iframe
                                src={selectedVideo.videoUrl}
                                title="Selected Video"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <p>Loading ...</p>
                          )}
                        </div>
                        <div className="absolute bottom-9  left-16 hover:visible "></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {product.productType === "Downloadable" ? (
                  <p className="text-primary font-medium text-xs mb-2">
                    DOWNLOADABLE
                  </p>
                ) : null}
                <h3 className="text-blue-950 text-lg md:text-xl xl:text-2xl mb-1">
                  {product.productName}
                </h3>
                <Link href={`/shop/${product?.seller?.storeSlug}`}>
                  {product?.seller?.firstName && product?.seller?.lastName && (
                    <p className="text-sm text-blue-950 mb-2">
                      by{" "}
                      {product?.seller?.storeTitle
                        ? `${product.seller.storeTitle}`
                        : ""}
                    </p>
                  )}
                </Link>
                {/* <p className="text-slte-600 text-xs mb-5">
                  Be the first to review this product
                </p> */}
                {!loading && (
                  <>
                    {error &&
                      error.response &&
                      error.response.status === 404 && (
                        <p className="text-slte-600 text-xs mb-5">
                          Be the first to review this product
                        </p>
                      )}
                  </>
                )}
                {product.productType === "Standard" && (
                  <div>
                    {product.discountCode &&
                    parseFloat(product.discountCode) > 0 ? (
                      <div>
                        <div className="flex gap-1 flex-row items-center ">
                          <p className="text-blue-950 text-lg md:text-xl xl:text-2xl font-semibold ">
                            CA$
                            {parseFloat(product.finalPrice).toFixed(2)}
                          </p>
                          <h4 className="text-red-700  line-through  font-medium ">
                            CA$
                            {parseFloat(
                              product.totalPrice
                                ? product.totalPrice
                                : product.price
                            ).toFixed(2)}
                          </h4>
                        </div>
                        <p className=" text-orange-700 mb-3">
                          {product && product.discountCode
                            ? `${product.discountCode}% off`
                            : ""}
                        </p>
                      </div>
                    ) : (
                      <h4 className="text-blue-950 text-lg md:text-xl xl:text-2xl font-semibold mb-4">
                        {product && product.finalPrice
                          ? `CA$${parseFloat(product.finalPrice).toFixed(2)}`
                          : ""}
                      </h4>
                    )}
                  </div>
                )}
                {product.productType === "Customizable" && (
                  <div>
                    <div className="flex gap-1 flex-row items-center">
                      <p className="text-blue-950 text-lg md:text-xl xl:text-2xl font-semibold mb-0">
                        {calculatedPrice
                          ? `CA$${parseFloat(calculatedPrice).toFixed(2)}`
                          : ""}
                      </p>
                      {parseFloat(product.discountCode) > 0 && (
                        <>
                          <h4 className="text-red-700  line-through  font-medium ">
                            {calculatedActualPrice
                              ? `CA$${parseFloat(calculatedActualPrice).toFixed(
                                  2
                                )}`
                              : ""}
                          </h4>
                        </>
                      )}
                    </div>
                    {parseFloat(product.discountCode) > 0 && (
                      <>
                        <p className=" text-orange-700 mb-3">
                          {product && product.discountCode
                            ? `${product.discountCode}% off`
                            : ""}
                        </p>
                      </>
                    )}
                  </div>
                )}
                {product.productType === "Downloadable" && (
                  <div>
                    {product.discountCode &&
                    parseFloat(product.discountCode) > 0 ? (
                      <div>
                        <div className="flex gap-1 flex-row items-center ">
                          <p className="text-blue-950 text-lg md:text-xl xl:text-2xl font-semibold ">
                            CA$
                            {parseFloat(product.finalPrice).toFixed(2)}
                          </p>
                          <h4 className="text-red-700  line-through  font-medium ">
                            CA$
                            {parseFloat(
                              product.totalPrice
                                ? product.totalPrice
                                : product.price
                            ).toFixed(2)}
                          </h4>
                        </div>
                        <p className=" text-orange-700 mb-3">
                          {product && product.discountCode
                            ? `${product.discountCode}% off`
                            : ""}
                        </p>
                      </div>
                    ) : (
                      <h4 className="text-blue-950 text-lg md:text-xl xl:text-2xl font-semibold mb-4">
                        {product && product.finalPrice
                          ? `CA$${parseFloat(product.finalPrice).toFixed(2)}`
                          : ""}
                      </h4>
                    )}
                  </div>
                )}
                {product?.freeDelivery ? (
                  <div className="mb-2 px-[8px] py-[2px] text-[11px] bg-[#a0e193] rounded-full w-[max-content]">
                    Free Domestic Delivery
                  </div>
                ) : (
                  ""
                )}
                {/* <div className="flex gap-2 mb-7">
                  <div className="flex-shrink-0">
                    <Image
                      src={"/assets/productdetailed/Rewards.png"}
                      alt="Rewards"
                      height={20}
                      width={20}
                      quality={100}
                    />
                  </div>
                  <p className="text-blue-950 text-sm">
                    Between 87 - 97 Reward Points will be used to purchase this
                    product
                  </p>
                </div> */}
                {product.productType === "Customizable" && (
                  <h4 className="text-blue-950 text-base mb-4">
                    {calculateInventory()}
                  </h4>
                )}
                {product.productType === "Standard" && (
                  <h4 className="text-blue-950 text-base mb-4">
                    {product.inventory === "OutOffStock"
                      ? "Out of Stock"
                      : product.inventory === "InStock"
                      ? "In Stock"
                      : product.inventory}
                  </h4>
                )}
                {product.productType === "Downloadable" && (
                  <h4 className="text-blue-950 text-base mb-4">
                    {product.inventory === "OutOffStock"
                      ? "Out of Stock"
                      : product.inventory === "InStock"
                      ? "In Stock"
                      : product.inventory}
                  </h4>
                )}
                {product.productType === "Customizable" &&
                  variations &&
                  variations.length > 0 && (
                    <>
                      {Object.keys(variations[0]).map(
                        (attribute, index) =>
                          // Exclude inventory, quantity, and price attributes
                          attribute !== "inventory" &&
                          attribute !== "quantity" &&
                          attribute !== "price" &&
                          attribute !== "finalPrice" &&
                          attribute !== "totalPrice" &&
                          attribute !== "image" &&
                          attribute !== "currencyPrice" && 
                          attribute !== "surTotalAmount" &&
                          attribute !== "surTotalAmountBDis" &&(
                            <Menu
                              key={index}
                              as="div"
                              className="relative inline-block text-left w-full"
                            >
                              <div className="flex w-full">
                                <Menu.Button className="text-blue-950 py-3 px-4 border rounded w-full border-zinc-200 flex items-center justify-between mb-1 shadow-[0px_2px_4px_#0000000D]">
                                  {selectedAttributes[attribute] ? (
                                    <span>{`${attribute}: ${selectedAttributes[attribute]}`}</span>
                                  ) : (
                                    <span>
                                      {attribute}: {variations[0][attribute]}
                                    </span>
                                  )}
                                  <FontAwesomeIcon
                                    icon={faAngleDown}
                                    className="ml-2 h-4 w-4 text-blue-950 hover:text-blue-950"
                                    aria-hidden="true"
                                  />
                                </Menu.Button>
                              </div>
                              <Transition as={Fragment}>
                                <Menu.Items className="absolute w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                                  {getUniqueValues(variations, attribute).map(
                                    (value, valueIndex) => (
                                      <Menu.Item key={valueIndex}>
                                        {({ active }) => (
                                          <button
                                            onClick={() =>
                                              handleAttributeItemClick(
                                                attribute,
                                                value
                                              )
                                            }
                                            className={`group flex w-full items-center gap-2 text-blue-950 font-medium rounded-md px-2 py-2 text-sm ${
                                              active ? "bg-gray-100" : ""
                                            }`}
                                          >
                                            {`${attribute}: ${value}`}
                                          </button>
                                        )}
                                      </Menu.Item>
                                    )
                                  )}
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          )
                      )}
                    </>
                  )}
                <p className="font-semibold text-blue-950 mb-0 mt-3">
                  Add your personalization
                </p>
                <p className="text-slate-600 mb-1.5 text-[13px]">
                  Add a unique touch or custom message to your order.
                </p>
                <input
                  type="textarea"
                  placeholder="Type here..."
                  value={textArea}
                  onChange={(e) => setTextArea(e.target.value)}
                  maxLength="250"
                  className="text-blue-950 w-full py-3.5 rounded px-4 border border-zinc-200 text-xs flex items-center justify-between mb-2.5 shadow-[0px_2px_4px_#0000000D]"
                />
                <p className="text-red-700 text-xs mb-5 md:mb-3">
                  Maximum characters: 250
                </p>
                {/* <button
                  className="buttonprimary mb-4"
                  onClick={() => {
                    const user = localStorage.getItem("user");
                    if (!user) {
                      setSignInOpen(true)
                    } else {
                      setSignInOpen(false);
                      setIsAvailabilityOpen(true);
                    }
                  }}
                >
                  Check availability
                </button> */}
                <Transition appear show={signInOpen} as={Fragment}>
                  <Dialog as="div" className="relative z-10" onClose={() => {}}>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                      <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full max-w-sm transform rounded overflow-hidden bg-orange-100 px-6 py-10 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title
                              as="h3"
                              className="text-xl text-center font-medium leading-6 text-gray-900"
                            >
                              You have to sign in first!
                            </Dialog.Title>

                            <div className="mt-6 text-center">
                              <Link href={"/sign-in"}>
                                <button type="button" className="buttonprimary">
                                  Sign In
                                </button>
                              </Link>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
                <Transition appear show={isAvailabilityOpen} as={Fragment}>
                  <Dialog as="div" className="relative z-10" onClose={() => {}}>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                      <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full max-w-sm transform rounded overflow-hidden bg-orange-100 px-6 py-10 text-left align-middle shadow-xl transition-all">
                            <div className="mt-6 text-center">
                              <button
                                type="button"
                                className="buttonprimary"
                                onClick={() => setIsAvailabilityOpen(false)}
                              >
                                Check
                              </button>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
                {product.productType === "Standard" && (
                  <div className="flex items-center gap-3 flex-wrap mb-6 md:mb-12">
                    <div className="w-24 bg-gray-300 flex items-center justify-between rounded-sm">
                      <button
                        className={`py-3 px-2.5 ${
                          product.inventory === "OutOffStock" || countS <= 1
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        onClick={decrementS}
                        disabled={
                          product.inventory === "OutOffStock" || countS <= 1
                        }
                      >
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="text-gray-950 h-2 w-2"
                        />
                      </button>
                      <div className="w-10 flex-shrink-0 bg-gray-200 py-3 px-2.5">
                        <p className="text-gray-950 text-sm text-center">
                          {countS}
                        </p>
                      </div>
                      <button
                        className={`py-3 px-2.5 ${
                          product.inventory === "OutOffStock" ||
                          countS >= product.quantity
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        onClick={incrementS}
                        disabled={
                          product.inventory === "OutOffStock" ||
                          countS >= product.quantity
                        }
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-gray-950 h-2 w-2"
                        />
                      </button>
                    </div>
                  </div>
                )}
                {selectedAttributes &&
                  variations &&
                  variations[0] &&
                  Object.keys(selectedAttributes).length ===
                    Object.keys(variations[0]).length && (
                    <div>
                      <p>
                        Selected Attributes:{" "}
                        {Object.keys(selectedAttributes).map(
                          (attribute, index) => (
                            <span key={index}>
                              {`${attribute}: ${selectedAttributes[attribute]} `}
                            </span>
                          )
                        )}
                      </p>
                      {/* Display the total quantity based on the selected attributes */}
                      <p>
                        Total Quantity:{" "}
                        {calculateTotalQuantity(selectedAttributes, variations)}
                      </p>
                    </div>
                  )}
                {product.productType === "Downloadable" && (
                  <div className="flex items-center gap-3 flex-wrap mb-6 md:mb-12"></div>
                )}
                {product.productType === "Customizable" && (
                  <>
                    <div className="flex items-center gap-3 flex-wrap mt-2.5 mb-6 md:mb-5">
                      <div className="w-24 bg-gray-300 flex items-center justify-between rounded-sm">
                        <button
                          className={`py-3 px-2.5 ${
                            calculateInventory() === "Out of Stock" ||
                            count <= 1
                              ? "disabled:cursor-not-allowed opacity-50"
                              : ""
                          }`}
                          onClick={decrement}
                          disabled={
                            calculateInventory() === "Out of Stock" ||
                            count <= 1
                          }
                        >
                          <FontAwesomeIcon
                            icon={faMinus}
                            className="text-gray-950 h-2 w-2"
                          />
                        </button>
                        <div className="w-10 flex-shrink-0 bg-gray-200 py-3 px-2.5">
                          <p className="text-gray-950 text-sm text-center">
                            {count}
                          </p>
                        </div>
                        <button
                          className={`py-3 px-2.5 ${
                            calculateInventory() === "Out of Stock" ||
                            count >= totalQuantity
                              ? "disabled:cursor-not-allowed opacity-50"
                              : ""
                          }`}
                          onClick={increment}
                          disabled={
                            calculateInventory() === "Out of Stock" ||
                            count >= totalQuantity
                          }
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="text-gray-950 h-2 w-2"
                          />
                        </button>
                      </div>

                      {/* <div className="flex items-center">
                        {product._id in cart ? (
                          <button className="buttonprimarythre relative">
                            View cart
                            <Link href="/cart">
                              <span className="absolute top-0 left-0 h-full w-full"></span>
                            </Link>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              addToCart(
                                product._id,
                                count,
                                totalQuantity ? totalQuantity : "",
                                calculatedPrice,
                                product,
                                textArea ? textArea : "",
                                attributeArray
                              );
                            }}
                            className={`text-primary ease-in transition-colors rounded-sm  text-sm xl:text-base font-medium py-3 px-8 border border-primary ${
                              calculateInventory() === "Out of Stock"
                                ? "disabled:cursor-not-allowed opacity-50"
                                : ""
                            }`}
                            disabled={calculateInventory() === "Out of Stock"}
                          >
                            Add to cart
                          </button>
                        )}
                      </div>
                      <div className="flex items-center">
                        <button
                          // href="#"
                          className={`buttonprimary ${
                            calculateInventory() === "Out of Stock"
                              ? "disabled:cursor-not-allowed opacity-50"
                              : ""
                          }`}
                        >
                          Buy now
                        </button>
                      </div> */}
                    </div>
                  </>
                )}

                <div className="pb-4 mb-3 border-b border-zinc-200">
                  <p className="text-blue-950 font-semibold mb-2.5">
                    Product description
                  </p>
                  <div style={{ whiteSpace: "pre-line" }}>
                    {" "}
                    {/* Wrap with a block-level element */}
                    <p className="text-slate-600 text-sm mb-12 relative">
                      {product.description && (
                        <>
                          {showMoreDescription
                            ? product.description
                            : product.description.slice(0, 300)}
                          {product.description.length > 300 &&
                            !showMoreDescription && (
                              <span className="">
                                <span>...</span>
                                <span className="absolute -bottom-11  text-black px-4 py-2 border border-slate-200 left-0 right-0  ">
                                  <a
                                    onClick={toggleDescriptionVisibility}
                                    className="cursor-pointer font-medium flex items-center justify-center"
                                  >
                                    Show more{" "}
                                    <FontAwesomeIcon icon={faAngleDown} />
                                  </a>
                                </span>
                              </span>
                            )}
                          {showMoreDescription && (
                            <span>
                              {/* {product.description.slice(300)} */}
                              <span className="absolute -bottom-11  text-black px-4 py-2 border border-slate-200 left-0 right-0  ">
                                <a
                                  onClick={toggleDescriptionVisibility}
                                  className="cursor-pointer font-medium flex items-center justify-center"
                                >
                                  Show less <FontAwesomeIcon icon={faAngleUp} />
                                </a>
                              </span>
                            </span>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {(product.productType === "Standard" ||
                  product.productType === "Downloadable") && (
                  <div className="pb-6 mb-6 border-b border-zinc-200">
                    <p className="text-blue-950 font-semibold mb-4">
                      Package details
                    </p>
                    {product.productType === "Standard" && (
                      <>
                        <div className="flex gap-2.5 mb-3">
                          <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                          <p className="text-sm text-slate-600">
                            Package Length: {product.length} cm
                          </p>
                        </div>
                        <div className="flex gap-2.5 mb-3">
                          <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                          <p className="text-sm text-slate-600">
                            Package Width: {product.width} cm
                          </p>
                        </div>
                        <div className="flex gap-2.5 mb-3">
                          <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                          <p className="text-sm text-slate-600">
                            Package Height: {product.height} cm
                          </p>
                        </div>
                        <div className="flex gap-2.5 mb-3">
                          <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                          <p className="text-sm text-slate-600">
                            Package Weight: {product.weight} kg
                          </p>
                        </div>
                        <div className="flex gap-2.5 mb-3">
                          <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                          <p className="text-sm text-slate-600">
                            Dispatch time (Days): {product.dispatchDays} days
                          </p>
                        </div>
                      </>
                    )}

                    {/* {product.productType === "Downloadable" && (
                      <>
                        <div className="flex gap-2.5 mb-3">
                          <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                          <p className="text-sm text-slate-600">
                            Download limit:{" "}
                            {product?.downloadableLink?.downloadLimit}
                          </p>
                        </div>
                      </>
                    )} */}
                  </div>
                )}

                {/* <div className="pb-4 mb-6 border-b border-zinc-200">
                  <p className="text-blue-950 font-semibold mb-2.5">
                    Product description
                  </p>
                  <p className="text-slate-600 text-sm mb-5">
                    {product.description && (
                      <>
                        {showMoreDescription
                          ? product.description
                          : product.description.slice(0, 300)}
                        {product.description.length > 300 &&
                          !showMoreDescription && (
                            <span>
                              <span>...</span>
                              <a
                                onClick={toggleDescriptionVisibility}
                                className="cursor-pointer font-medium"
                              >
                                Learn more{" "}
                                <FontAwesomeIcon icon={faAngleDown} />
                              </a>
                            </span>
                          )}
                        {showMoreDescription && (
                          <span>
                            {product.description.slice(300)}
                            <a
                              onClick={toggleDescriptionVisibility}
                              className="cursor-pointer font-medium"
                            >
                              Show less <FontAwesomeIcon icon={faAngleUp} />
                            </a>
                          </span>
                        )}
                      </>
                    )}
                  </p>
                </div> */}

                {/* <div className="pb-4 mb-6 border-b border-zinc-200">
                  <p className="text-blue-950 font-semibold mb-2.5">
                    Product description
                  </p>
                  <p
                    className="text-slate-600 text-sm mb-5"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {product.description && (
                      <>
                        {showMoreDescription
                          ? product.description
                          : product.description.slice(0, 300)}
                        {product.description.length > 300 &&
                          !showMoreDescription && (
                            <span>
                              <span>...</span>
                              <a
                                onClick={toggleDescriptionVisibility}
                                className="cursor-pointer font-medium"
                              >
                                Learn more{" "}
                                <FontAwesomeIcon icon={faAngleDown} />
                              </a>
                            </span>
                          )}
                        {showMoreDescription && (
                          <span>
                            {product.description.slice(300)}
                            <a
                              onClick={toggleDescriptionVisibility}
                              className="cursor-pointer font-medium"
                            >
                              Show less <FontAwesomeIcon icon={faAngleUp} />
                            </a>
                          </span>
                        )}
                      </>
                    )}
                  </p>
                </div> */}

                {product?.seller && (
                  <p className="text-blue-950 font-semibold mb-2">
                    Meet your seller
                  </p>
                )}
                <Link href={`/shop/${product?.seller?.storeSlug}`}>
                  <p className="font-medium text-blue-950 mb-3">
                    {product?.seller?.storeTitle
                      ? `${product.seller.storeTitle}`
                      : ""}
                  </p>
                </Link>
                <div>
                  <div
                    className={`flex gap-2 items-center mb-2 
                    ${
                      product?.seller?.city &&
                      product?.seller?.state &&
                      product?.seller?.country
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15.302"
                      height="15.305"
                      viewBox="0 0 11.931 15.702"
                    >
                      <path
                        id="Location"
                        d="M3.334,5.716A2.381,2.381,0,1,1,5.716,8.1,2.381,2.381,0,0,1,3.334,5.716ZM5.716,3.81A1.905,1.905,0,1,0,7.621,5.716,1.907,1.907,0,0,0,5.716,3.81Zm5.716,1.905c0,2.6-3.483,7.234-5.01,9.145a.9.9,0,0,1-1.411,0C3.456,12.949,0,8.317,0,5.716a5.716,5.716,0,0,1,11.431,0ZM5.716.476A5.239,5.239,0,0,0,.476,5.716a5.662,5.662,0,0,0,.53,2.072A18.936,18.936,0,0,0,2.337,10.3a48.764,48.764,0,0,0,3.045,4.266,.423.423,0,0,0,.667,0A48.879,48.879,0,0,0,9.094,10.3a19.113,19.113,0,0,0,1.331-2.51,5.69,5.69,0,0,0,.53-2.072A5.239,5.239,0,0,0,5.716.476Z"
                        transform="translate(0.25 0.25)"
                        fill="#172554"
                        stroke="#172554"
                        strokeWidth="0.5"
                      />
                    </svg>

                    <p className="text-blue-950 text-sm">
                      {product?.seller?.city &&
                      product?.seller?.state &&
                      product?.seller?.country
                        ? `${product.seller?.city}, ${product.seller?.state}, ${product.seller?.country}`
                        : ""}
                    </p>
                  </div>
                  {loading && <p>Loading...</p>}
                  {!loading && productCount > 0 && (
                    <div className="flex gap-2 items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15.302"
                        height="15.305"
                        viewBox="0 0 15.302 15.305"
                      >
                        <path
                          id="Product"
                          d="M19.011,7.664,11.756,4.037a.346.346,0,0,0-.309,0L4.191,7.664A.345.345,0,0,0,4,7.974v7.256a.346.346,0,0,0,.191.309l7.256,3.628a.346.346,0,0,0,.309,0l7.256-3.628a.346.346,0,0,0,.191-.309V7.974A.346.346,0,0,0,19.011,7.664ZM11.6,4.732l6.483,3.242L16.7,8.667,10.214,5.425Zm2.332,5.317L7.45,6.807l1.991-1,6.483,3.242Zm.259.643,2.073-1.037v2.57l-.663-.474a.345.345,0,0,0-.485.084l-.925,1.337Zm-7.515-3.5,6.483,3.242-1.559.78L5.118,7.974ZM4.691,8.533l6.565,3.282V18.3L4.691,15.015ZM11.947,18.3V11.815l1.555-.777v3.242a.346.346,0,0,0,.63.2l1.355-1.957.924.66a.345.345,0,0,0,.546-.281V9.31l1.555-.777v6.483Z"
                          transform="translate(-3.95 -3.948)"
                          fill="#172554"
                          stroke="#172554"
                          strokeWidth="0.1"
                        />
                      </svg>

                      <p className="text-blue-950 text-sm">
                        {productCount} products
                      </p>
                    </div>
                  )}
                  {product.seller && product.seller.phone ? (
                    <>
                      {" "}
                      {/* <div className="flex gap-2 items-center mb-2">
                        <svg
                          fill="#000000"
                          height="15px"
                          width="15px"
                          version="1.1"
                          viewBox="0 0 52 52"
                        >
                          <g>
                            <g>
                              <path
                                d="M26,0C11.663,0,0,11.663,0,26c0,4.891,1.359,9.639,3.937,13.762C2.91,43.36,1.055,50.166,1.035,50.237
			c-0.096,0.352,0.007,0.728,0.27,0.981c0.263,0.253,0.643,0.343,0.989,0.237L12.6,48.285C16.637,50.717,21.26,52,26,52
			c14.337,0,26-11.663,26-26S40.337,0,26,0z M26,50c-4.519,0-8.921-1.263-12.731-3.651c-0.161-0.101-0.346-0.152-0.531-0.152
			c-0.099,0-0.198,0.015-0.294,0.044l-8.999,2.77c0.661-2.413,1.849-6.729,2.538-9.13c0.08-0.278,0.035-0.578-0.122-0.821
			C3.335,35.173,2,30.657,2,26C2,12.767,12.767,2,26,2s24,10.767,24,24S39.233,50,26,50z"
                              />
                              <path
                                d="M42.985,32.126c-1.846-1.025-3.418-2.053-4.565-2.803c-0.876-0.572-1.509-0.985-1.973-1.218
			c-1.297-0.647-2.28-0.19-2.654,0.188c-0.047,0.047-0.089,0.098-0.125,0.152c-1.347,2.021-3.106,3.954-3.621,4.058
			c-0.595-0.093-3.38-1.676-6.148-3.981c-2.826-2.355-4.604-4.61-4.865-6.146C20.847,20.51,21.5,19.336,21.5,18
			c0-1.377-3.212-7.126-3.793-7.707c-0.583-0.582-1.896-0.673-3.903-0.273c-0.193,0.039-0.371,0.134-0.511,0.273
			c-0.243,0.243-5.929,6.04-3.227,13.066c2.966,7.711,10.579,16.674,20.285,18.13c1.103,0.165,2.137,0.247,3.105,0.247
			c5.71,0,9.08-2.873,10.029-8.572C43.556,32.747,43.355,32.331,42.985,32.126z M30.648,39.511
			c-10.264-1.539-16.729-11.708-18.715-16.87c-1.97-5.12,1.663-9.685,2.575-10.717c0.742-0.126,1.523-0.179,1.849-0.128
			c0.681,0.947,3.039,5.402,3.143,6.204c0,0.525-0.171,1.256-2.207,3.293C17.105,21.48,17,21.734,17,22c0,5.236,11.044,12.5,13,12.5
			c1.701,0,3.919-2.859,5.182-4.722c0.073,0.003,0.196,0.028,0.371,0.116c0.36,0.181,0.984,0.588,1.773,1.104
			c1.042,0.681,2.426,1.585,4.06,2.522C40.644,37.09,38.57,40.701,30.648,39.511z"
                              />
                            </g>
                          </g>
                        </svg>
                        <a
                          href={`https://wa.me/${product.seller.phone}`}
                          target="_blank"
                          className="text-blue-950 text-sm hover:text-primary hover:underline cursor-pointer"
                        >
                          Chat with us
                        </a>
                      </div> */}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
        <Footer />
      </section>
    </>
  );
}
