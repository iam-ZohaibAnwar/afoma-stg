import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// =====================
// FontAwesome Icons
// =====================
import {
  faArrowLeft,
  faArrowRight,
  faCircleUser,
  faPlus,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import {
  faAngleDown,
  faAngleRight,
  faAngleUp,
  faMinus,
  faShareNodes,
  faStar as farStar,
} from "@fortawesome/pro-regular-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// =====================
// Headless UI (used)
// =====================
import { Menu, Transition } from "@headlessui/react";

// =====================
// Utils / Context
// =====================
import {
  categoryMapIdPrd,
  categoryMapIdStg,
  subCategoryMapIdPrd,
  subCategoryMapIdStg,
} from "@/lib/categoryMap";
import { calculateSurcharge } from "@/utils/pricingUtils";
import { useCart } from "@/context/CartProvider";

// =====================
// Lazy Loaded Components (BIG PERF WIN 🚀)
// =====================
const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"));
const ProductCardComponent = dynamic(() => import("@/components/ProductCard"));
const CategoryCard = dynamic(() => import("@/components/CategoryCard"));
const StarRating = dynamic(() => import("@/components/StarRating"));

const ModalImageViewer = dynamic(
  () => import("@/components/ModalImageViewer"),
  { ssr: false }
);

const ProductViewModel = dynamic(
  () => import("@/components/ProductViewModel"),
  { ssr: false }
);

const FacebookPixel = dynamic(
  () => import("@/components/FacebookPixel"),
  { ssr: false }
);

// =====================
// Slider (Client-only)
// =====================
const Slider = dynamic(() => import("react-slick"), { ssr: false });

// Slider styles (required)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function ProductDetail({ product, pageData }) {
  const { cart, addToCart } = useCart();
  useEffect(() => {  console.log("Product Detail Page Rendered");
  console.log('product :>> ', cart);}, []);

  const [productAsDisabled, setProductAsDisabled] = useState(false);

  const formatPrice = (price) => {
    const numericPrice = Number(price); // Ensure it's a number
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  };

  const sliderRef = useRef(null);
  const settings = {
    infinite: true,
    speed: 1000,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [loadingProductCount, setLoadingProductCount] = useState(0);
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const router = useRouter();

  const [productCount, setProductCount] = useState(0);
  const [allProducts, setAllProducts] = useState(undefined);

  const [reviews, setReviews] = useState(undefined);
  const [allReviews, setAllReviews] = useState(undefined);

  const [isOpen, setIsOpen] = useState(false);

  const [variations, setVariations] = useState([]);
  const [textArea, setTextArea] = useState();
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const [countS, setCountS] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isViewProductDetailModalOpen, setIsViewProductDetailModalOpen] =
    useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isShared, setIsShared] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(9);
  const [categoryName, setCategoryName] = useState("");
  const [userCurrency, setUserCurrency] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [count, setCount] = useState(1);
  const [seller, setSeller] = useState("");
  const [isOpenPolicy, setIsOpenPolicy] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState(undefined);
  const [recentlyViewedProducts, setRecentlyViewedProducts] =
    useState(undefined);
  const [bestSellingCategory, setBestSellingCategory] = useState([]);

  const currentUrl = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`;
  const { query } = router;
  const productId =
    query.productId.length > 2
      ? query.productId[2]
      : query.productId.length > 1
      ? query.productId[1]
      : query.productId[0];
  const childCategoryId = query.productId && query.productId.length > 1 ? query.productId[0] : null;
  let canonicalUrl = `https://afomamarketplace.com/category/${
    query.categoryId
  }${query.subCategoryId ? `/${query.subCategoryId}` : ""}${childCategoryId ? `/${childCategoryId}` : ""}/${productId}`;
  const isProduct =
    process.env.NEXT_PUBLIC_BASE_URL ==
    "https://development.afomamarketplace.com"
      ? subCategoryMapIdStg[productId?.toLowerCase()]
      : subCategoryMapIdPrd[productId?.toLowerCase()];

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

  const getProductFromSameCategory = (category) => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/category/${category}`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    return axios.request(options);
  };

  const toggleDescriptionVisibility = () => {
    setShowMoreDescription(!showMoreDescription); // Toggle visibility
  };

  const generateStarIcons = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className="text-amber-400 cursor-pointer"
        />
      );
    }

    if (halfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half"
          icon={faStarHalfAlt}
          className="text-amber-400 cursor-pointer"
        />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={farStar}
          className="text-slate-600 cursor-pointer"
        />
      );
    }

    return stars;
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
        const imageIndex = product?.images?.findIndex(
          (img) => img.imageUrl === filteredVariation.image
        );
        if (imageIndex !== -1) {
          handleImageClick({ imageUrl: filteredVariation.image });
          // setSelectedImage(product.images[imageIndex]); // Update state with selected image
          sliderRef.current?.slickGoTo(imageIndex); // Move slider to selected index
        }
      }
    }
  };

  // Customizable Product variations
  const attributeArray = [];
  if (
    product &&
    product?.productType === "Customizable" &&
    variations !== null &&
    variations.length > 0
  ) {
    Object.keys(variations[0]).forEach((attribute) => {
      if (
        attribute !== "inventory" &&
        attribute !== "quantity" &&
        attribute !== "price" &&
        attribute !== "image" &&
        attribute !== "totalPrice" &&
        attribute !== "finalPrice" &&
        attribute !== "surTotalAmount" &&
        attribute !== "surTotalAmountBDis" &&
        attribute !== "currencyPrice"
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
    variations && variations.length > 0
      ? variations[0]?.surTotalAmount
        ? variations[0]?.surTotalAmount
        : variations[0].finalPrice
      : null;

  const initialActualPrice =
    variations && variations.length > 0
      ? variations[0]?.surTotalAmountBDis ||
        variations[0]?.surTotalAmount ||
        variations[0].totalPrice
      : null;

  const initialPriceSurcharge =
    variations && variations.length > 0
      ? variations[0].finalPrice || variations[0].price
      : null;

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
            attribute !== "image" &&
            attribute !== "totalPrice" &&
            attribute !== "finalPrice" &&
            attribute !== "surTotalAmount" &&
            attribute !== "surTotalAmountBDis"
        ).length;
      // If all attributes are selected, return the selected variation's price
      // Otherwise, return the initial price
      // product.surTotalAmount = selectedVariation?.finalPrice || selectedVariation?.totalPrice || selectedVariation?.price || initialPrice
      return (
        selectedVariation?.surTotalAmount ||
        selectedVariation?.finalPrice ||
        initialPrice
      );
    } else {
      return initialPrice;
    }
  };

  const getPriceForSelectedAttributesWithOutSurcharge = () => {
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
            attribute !== "image" &&
            attribute !== "price" &&
            attribute !== "totalPrice" &&
            attribute !== "finalPrice" &&
            attribute !== "surTotalAmount" &&
            attribute !== "surTotalAmountBDis"
        ).length;
      // If all attributes are selected, return the selected variation's price
      // Otherwise, return the initial price
      // product.surTotalAmount = selectedVariation?.finalPrice || selectedVariation?.totalPrice || selectedVariation?.price || initialPrice
      return (
        selectedVariation?.finalPrice ||
        selectedVariation?.price ||
        initialPrice
      );
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
            attribute !== "image" &&
            attribute !== "price" &&
            attribute !== "totalPrice" &&
            attribute !== "finalPrice" &&
            attribute !== "surTotalAmount" &&
            attribute !== "surTotalAmountBDis"
        ).length;

      // If all attributes are selected, return the selected variation's price
      // Otherwise, return the initial price
      return (
        selectedVariation?.surTotalAmountBDis ||
        selectedVariation?.surTotalAmount ||
        selectedVariation?.totalPrice ||
        initialActualPrice
      );
    } else {
      return initialActualPrice;
    }
  };

  const calculatedPrice =
    Object.keys(selectedAttributes).length > 0
      ? getPriceForSelectedAttributes() || " "
      : initialPrice || " ";

  const calculatedPriceSurcharge =
    Object.keys(selectedAttributes).length > 0
      ? getPriceForSelectedAttributesWithOutSurcharge() || " "
      : initialPriceSurcharge || " ";

  const calculatedActualPrice =
    Object.keys(selectedAttributes).length > 0
      ? getActualPriceForSelectedAttributes() || " "
      : initialActualPrice || " ";

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
    if (countS < product?.quantity) {
      setCountS(countS + 1);
    }
  };

  const decrementS = () => {
    if (countS > 1) {
      setCountS(countS - 1);
    }
  };

  const handleCopyLinkClick = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("Link copied to clipboard!");
    setIsShared(false);
  };

  useEffect(() => {
    setCount(1); // Reset count to 1 whenever variations change
  }, [selectedAttributes]);

  const handleImageClick = (image, viewModal = false, index = 0) => {
    setSelectedImage(image);
    setSelectedVideo(null);
    if (viewModal) {
      setIsViewProductDetailModalOpen(false);
      setIsImageModalOpen(true);
    }
    setSelectedImageIndex(index);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setSelectedImage(null);
  };

  const reviewsPerPage = 2; // Number of reviews per page

  // Calculate indices for slicing
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

  // Slicing current reviews
  const currentReviews = allReviews?.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(
    allReviews ? allReviews.length / reviewsPerPage : 0
  );

  // Generate page numbers
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getAllReviews = async () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/single/${product?._id}`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        if (response && response.data) {
          const sortedReviews = response.data.sort((a, b) => {
            const timestampA = new Date(a.createdAt).getTime();
            const timestampB = new Date(b.createdAt).getTime();
            return timestampB - timestampA;
          });
          setAllReviews(response.data);
        } else {
          setAllReviews([]);
        }
      })
      .catch(function (error) {
        setAllReviews([]);
        console.error(error);
      });
  };

  const getReviews = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/average-review/${product?._id}`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        const reviews = response.data;
        setReviews(reviews);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Check out this product: ${product?.productName} ${currentUrl}`
  )}`;

  const loadMore = () => {
    setVisibleProducts((prev) => prev + 30);
  };

  const getSellerInfo = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/store/${product?.seller?.storeSlug}`,
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
          setSeller(response.data);
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  };

  // Non-blocking fetch for recently viewed - doesn't block route changes
  useEffect(() => {
    if (!product?._id) return;
    
    // Update localStorage immediately (synchronous, no blocking)
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const updated = [
      product._id,
      ...viewed.filter((id) => id !== product._id),
    ];
    localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(updated.slice(0, 5))
    );
    
    // Fetch in background - non-blocking, doesn't prevent route changes
    if (updated.length > 1) {
      // Use requestIdleCallback for non-critical data fetching
      const fetchRecentlyViewed = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/products/byIds/${updated.join(",")}`,
            {
              headers: {
                "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
              },
              timeout: 5000, // Fast timeout to not block
            }
          );
          if (response?.data?.length > 0) {
            setRecentlyViewedProducts(
              response.data
                .filter((data) => data?._id !== product?._id)
                .slice(0, 3)
            );
          }
        } catch (error) {
          // Silently fail - don't block UI
          console.warn("Failed to load recently viewed:", error);
        }
      };
      
      // Use setTimeout to defer to next tick, allowing route to change instantly
      setTimeout(fetchRecentlyViewed, 0);
    }
  }, [product?._id]);

  useEffect(() => {
    if (product && product?.status === 0) {
      setProductAsDisabled(true);
    }
    if(product?.seller?.storeSlug) getSellerInfo();
    let userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    setUserCountry(userInfo.country);
    setUserCurrency(userInfo?.currency);
    if (!isProduct) {
      if (product) product = calculateSurcharge([product])?.[0];
      let id =
        process.env.NEXT_PUBLIC_BASE_URL ==
        "https://development.afomamarketplace.com"
          ? subCategoryMapIdStg[productId?.toLowerCase()]
          : subCategoryMapIdPrd[productId?.toLowerCase()];
      const fetchProductRelate = async () => {
        if (product && !id) {
          setLoadingProductCount(true);
          pushEventAddToCart("view_item")
          const sellerId = product?.seller?._id;
          const variationsArray = product?.variations;
          if (product?.images && product?.images.length > 0) {
            setSelectedImage(product?.images[0]);
          }
          setVariations(
            variationsArray.map((variation) => ({
              ...variation,
              surTotalAmount: variation.surTotalAmount || variation.price,
              surTotalAmountBDis:
                variation.surTotalAmountBDis || variation.price,
              totalPrice: variation.totalPrice || variation.price,
              finalPrice: variation.finalPrice || variation.price,
            }))
          );
          // Fetch the number of products for the seller
          const countResponse = await getSellerProductCount(sellerId);
          const approvedProducts = countResponse.data.filter(
            (product) =>
              product?.productStatus === "Approved" && product.status == 1
          );
          setProductCount(approvedProducts.length);
          setAllProducts(approvedProducts);
          setLoadingProductCount(false);
          // Fetch reviews
          getReviews();
          getAllReviews();
          getBestCategoryProducts();
          const categoryProducts = await getProductFromSameCategory(
            product?.Category?.name
          );
          if (categoryProducts.data.length > 0) {
            setCategoryProducts(
              categoryProducts.data
                .filter((data) => {
                  const viewed =
                    JSON.parse(localStorage.getItem("recentlyViewed")) || [];
                  return (
                    !viewed.includes(data._id) &&
                    data.seller?._id != product?.seller?._id &&
                    data._id !== product?._id
                  );
                })
                .slice(0, 6)
            );
          }
        }
      };
      if (product && !id) {
        fetchProductRelate();
      }
    } else {
      // Non-blocking fetch - allows instant route changes
      const fetchData = async () => {
        try {
          // Removed setLoading(true) - no blocking state
          let id =
            process.env.NEXT_PUBLIC_BASE_URL ==
            "https://development.afomamarketplace.com"
              ? subCategoryMapIdStg[productId.toLowerCase()]
              : subCategoryMapIdPrd[productId.toLowerCase()];
          if (id) {
            // Make the API call using the categoryID
            const response = await axios
              .create({
                headers: {
                  "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
                },
                timeout: 5000, // Fast timeout
              })
              .get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/products/search/related/${id}`
              );

            if (response.data) {
              // Check if response.data is defined
              const approvedProducts = response.data.products
                ? response.data.products.filter(
                    (product) =>
                      product.productStatus === "Approved" &&
                      product.status == 1
                  )
                : [];
              setCategoryName(response.data.category?.name);
              pushEventViewSearchList(approvedProducts, id)
              setProducts(approvedProducts);
              setError(false);
            } else {
              // Handle the case when response.data is undefined
              setProducts([]);
              setError(true);
            }
          } else {
            // Handle the case when categoryID is not available
            setError(true);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Handle 404 response
            setProducts([]); // Set an empty array or handle it as per your requirements
            setError(false);
          } else {
            console.error("Error:", error);
            setError(true);
          }
        }
        // Removed setLoading(false) - no blocking loading state
      };

      // Defer fetch to next tick - allows route to change instantly
      setTimeout(fetchData, 0);
    }
  }, [isProduct, productId]);

  const getBestCategoryProducts = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/bestSelling/Product`,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        const responseData = Array.isArray(response.data)
          ? response.data
          : response.data.products;

        const bestCategories = responseData.map((item) => {
          return {
            Category: item?.productDetails?.Category,
            SubCategory: item?.productDetails?.SubCategory,
          };
        });
        setBestSellingCategory(bestCategories);
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const checkSelectedVariantInCart = () => {
    const selectedVariant =
      attributeArray && Array.isArray(attributeArray) && attributeArray.length
        ? attributeArray
            .map((variation) => variation.attributeValue.replace(/\s+/g, ""))
            .join("_")
        : null;
    if (product && selectedVariant) {
      const uniqueId = `${product._id}_${selectedVariant}`;
      return uniqueId in cart ? true : false;
    }
    return false;
  };

  const handleChatWithSeller = () => {
    try {
      // Only run on client side
      if (typeof window === "undefined") return;
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("Please login to chat with the seller.");
        return;
      }
      console.log('product?.seller :>> ', product?.seller);
      const receiverId = product?.seller?.userRole === "seller"
        ? product?.seller?.userId
        : product?.seller?._id;
      if (!receiverId) {
        toast.error("Unable to initiate chat with the seller.");
        return;
      }
      // Use window.history.state.navigation for Next.js 13+ compatibility, fallback to older push for others
      router.push({
        pathname: '/chat',
        query: {},
      }, undefined, { shallow: false, state: { receiverId } });
    } catch (error) {
      console.log("Error initiating chat with seller:", error);
      toast.error("Error initiating chat with seller.");
    }
  };

  const showChatButton = () => {
    if (typeof window === "undefined") return false;
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return false;
    try {
      const user = JSON.parse(storedUser);
      console.log('user :>> ', user);
      console.log('product.seller :>> ', product.seller);
      return product?.seller?.userId && user?.userId && product.seller.userId !== user.userId;
    } catch (err) {
      return false;
    }
  };


  const pushEventAddToCart = (event, quantity = 0) => {
    const price = product.variations?.[0]?.finalPrice
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: event,
      ecommerce: {
        items: [
          {
            item_id: product._id,
            item_name: product.productName,
            item_brand: product?.seller?.storeSlug,
            item_category: product?.Category?.name,
            item_category2: product?.SubCategory?.name,
            price: product?.productType === "Customizable" ? price : product?.finalPrice,
            quantity: quantity,
            currency: "CAD",
            google_business_vertical: "retail"
          },
        ],
      },
    });
  }

  const pushEventViewSearchList = (products, id) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    const items = products.map(product => {
      return {
        item_id: product._id,
        item_name: product.productName,
        item_brand: product?.seller?.storeSlug,
        item_category: product?.Category?.name,
        item_category2: product?.SubCategory?.name,
        price: product.totalAmount || product?.finalPrice,
        currency: "CAD",
        google_business_vertical: "retail"
      };
    });

    window.dataLayer.push({
      event: "view_item_list",
      item_list_id: id,
      item_list_name: childCategoryId,

      ecommerce: {
        items: items
      },
    });
  }

  return (
    <>
      {!isProduct ? (
        <>
          <Head>
            <link
              rel="canonical"
              href={canonicalUrl}
            />
            <title>{product?.metaTitle}</title>
            <meta
              property="og:title"
              content={
                product?.metaTitle ? product?.metaTitle : product?.productName
              }
            />
            <meta
              property="og:description"
              content={
                product?.metaDesc ? product?.metaDesc : product?.description
              }
            />
            <meta
              name="title"
              content={
                product?.metaTitle ? product?.metaTitle : product?.productName
              }
            />
            <meta
              name="description"
              content={
                product?.metaDesc ? product?.metaDesc : product?.description
              }
            />
            <meta property="og:image" content={product?.images[0].imageUrl} />{" "}
            {/* Assuming 'image' holds the image URL */}
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            {/*  */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:title"
              content={
                product?.metaTitle ? product?.metaTitle : product?.productName
              }
            />
            <meta
              name="twitter:description"
              content={
                product?.metaDesc ? product?.metaDesc : product?.description
              }
            />
            <meta name="twitter:image" content={product?.images[0].imageUrl} />
            <meta property="twitter:image:width" content="1200" />
            <meta property="twitter:image:height" content="630" />
          </Head>

          <section>
            <Header cart={cart} addToCart={addToCart} />
            <FacebookPixel data={{ product: product, isProduct: true }} />
          </section>

          <section className=" bg-white">
            <div className="max-w-screen-xl mx-auto">
              <div className="flex flex-wrap gap-1.5 px-4 py-6 md:py-6 xl:pb-16">
                <Link
                  href="/"
                  className="text-slate-600 font-medium text-xs flex items-center gap-1.5"
                >
                  Home <FontAwesomeIcon icon={faAngleRight} />
                </Link>
                <Link
                  href="/category"
                  className="text-slate-600 font-medium text-xs flex items-center gap-1.5"
                >
                  Categories <FontAwesomeIcon icon={faAngleRight} />
                </Link>
                <p className="text-slate-600 font-medium text-xs flex items-center gap-1.5">
                  {product?.Category?.name ? (
                    <>
                      <Link href={`/category/${product?.Category.slug}`}>
                        {product?.Category.name}{" "}
                        <FontAwesomeIcon icon={faAngleRight} />
                      </Link>
                    </>
                  ) : null}
                </p>
                <p className="text-slate-600 font-medium text-xs flex items-center gap-1.5">
                  {product?.SubCategory?.name ? (
                    <>
                      <Link
                        href={`/category/${product?.Category.slug}/${product?.SubCategory.slug}`}
                      >
                        {product?.SubCategory.name}{" "}
                        <FontAwesomeIcon icon={faAngleRight} />
                      </Link>
                    </>
                  ) : null}
                </p>
                <p className="text-slate-600 font-medium text-xs flex items-center gap-1.5">
                  {product?.childCategory?.name ? (
                    <>
                      <Link
                        href={`/category/${product?.Category.slug}/${product?.SubCategory.slug}/${product?.childCategory.slug}`}
                      >
                        {product?.childCategory.name}{" "}
                        <FontAwesomeIcon icon={faAngleRight} />
                      </Link>
                    </>
                  ) : null}
                </p>
                <p className="text-primary font-medium text-xs flex items-center gap-1.5">
                  {product?.productName ? <>{product?.productName} </> : null}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="max-w-screen-lg mx-auto px-4 pb-9">
              <div className="sm:flex lg:grid lg:grid-cols-2 gap-6 md:gap-12 mb-12 md:mb-12 xl:mb-12">
                <div className="lg:flex lg:col-span-1 gap-5">
                  <div className="hidden lg:flex gap-4 shrink-0 items-start flex-col h-[380px] overflow-auto scrollbar">
                    {product && product?.images ? (
                      product?.images.map((image, index) => (
                        <div key={index}>
                          <Image
                            src={image.imageUrl}
                            alt={image.altText || "product_image"}
                            width={76}
                            height={84}
                            className="border-[1px] hover:border-primary h-[84px] w-[76px] rounded object-cover cursor-pointer"
                            onClick={() => handleImageClick(image)}
                            loading="lazy"
                            unoptimized={image.imageUrl?.includes("http")}
                          />
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="border-[1px] hover:border-primary h-[84px] w-[76px] rounded object-cover" />
                      </>
                    )}

                    {/* {product && product?.videos ? (
                      product?.videos.map((video, index) => (
                        <div key={index}>
                          <div
                            className="border-[2px] relative hover:border-primary h-[76px] w-[76px] cursor-pointer"
                            onClick={() => handleVideoClick(video)}
                          >
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
                      <>
                        <div className="border-[1px] hover:border-primary h-[84px] w-[76px] rounded object-cover" />
                      </>
                    )} */}
                  </div>
                  <div>
                    <div className="flex sm:justify-start justify-center">
                      <div className="relative  overflow-visible group bg-white border border-slate-200 rounded mb-6 md:mb-6">
                        <div className="absolute bg-orange-50 w-8 h-8 rounded-full right-5 top-5 flex items-center justify-center z-10">
                          <button
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
                          </button>
                        </div>
                        <Menu as="div">
                          <div>
                            <Menu.Button className="absolute cursor-pointer bg-orange-50 w-8 h-8 rounded-full right-5 top-16 flex items-center justify-center z-20">
                              <FontAwesomeIcon icon={faShareNodes} />
                            </Menu.Button>
                          </div>
                          <Transition as={Fragment}>
                            <Menu.Items className="absolute top-[100px] right-2 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ">
                              <div className="px-3 py-1">
                                <Menu.Item>
                                  <Link
                                    href={`mailto:?subject=Check this out on Afoma Marketplace&body=${product?.productName}  ${currentUrl}`}
                                  >
                                    <button className="text-blue-950 relative hover:opacity-50 hover:cursor">
                                      <div className="flex gap-1 flex-row items-center">
                                        <Image
                                          src={
                                            "/assets/icons/email-circular.svg"
                                          }
                                          width={25}
                                          height={25}
                                          alt="Email"
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
                                          alt="Facebook"
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
                                          alt="Whatsapp"
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
                                    href={`https://twitter.com/intent/tweet?text=${product?.productName}&url=${currentUrl}&hashtags=afomamarketplace`}
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
                                          alt="X"
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
                                        alt="Copy Link"
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
                        <div
                          className={`relative h-[285px] w-[285px] md:w-[380px] md:h-[380px] lg:hidden z-0 flex items-center justify-center ${
                            isShared ? "shared bg-black" : ""
                          } ${selectedVideo ? "bg-black" : ""}`}
                        >
                          <div
                            className={`absolute bg-black/[35%] opacity-0 ${
                              isShared ? "opacity-100 inset-0" : ""
                            } transition-opacity`}
                          ></div>
                          <Slider
                            {...settings}
                            ref={sliderRef}
                            className="sliderslick w-[285px] md:w-[380px] mx-auto"
                          >
                            {product &&
                              product?.images &&
                              product?.images.map((image, index) => (
                                <div key={index}>
                                  <Image
                                    src={image.imageUrl}
                                    alt={image.altText}
                                    width={380}
                                    height={380}
                                    className="h-[285px] w-[285px] md:w-[380px] md:h-[380px] object-cover z-10 rounded cursor-pointer"
                                    onClick={() =>
                                      handleImageClick(image, true, index)
                                    }
                                    loading="lazy"
                                    unoptimized={image.imageUrl?.includes("http")}
                                  />
                                </div>
                              ))}
                            {product &&
                              product?.videos &&
                              product?.videos.map((video, index) => (
                                <div key={index}>
                                  <div
                                    className="relative h-[285px] w-[285px] md:w-[380px] md:h-[380px]  cursor-pointer"
                                    onClick={() => handleVideoClick(video)}
                                  >
                                    {/* Load the video and capture the first frame */}
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
                          className={`relative hidden w-[285px] h-[285px] md:w-[380px] md:h-[380px] z-0 lg:flex  items-center justify-center ${
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
                              alt={selectedImage.altText || "product_image"}
                              className={`w-full h-full z-10 ${
                                isShared ? "shared-opacity" : ""
                              }`}
                              onClick={() => {
                                setSelectedImage(selectedImage);
                                setSelectedVideo(null);
                                setIsImageModalOpen(false);
                                setIsViewProductDetailModalOpen(true);
                                const index = product.images.findIndex(
                                  (img) =>
                                    img.imageUrl == selectedImage.imageUrl
                                );
                                setSelectedImageIndex(index);
                              }}
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
                            <p>Loading...</p>
                          )}
                        </div>
                        <div className="absolute bottom-9  left-16 hover:visible "></div>
                      </div>
                    </div>
                    <div id="customerReviews">
                      {/* Review Required */}
                      {reviews && allReviews && allReviews.length > 0 && (
                        <div className="mb-4">
                          <p
                            className={`text-blue-950 text-2xl lg:tracking-[-0.72px] mb-3 noto-font`}
                          >
                            Customer Reviews
                          </p>
                          <div>
                            <StarRating
                              avgValue={reviews.avgValue}
                              avgQuality={reviews.avgQuality}
                              avgPrice={reviews.avgPrice}
                            />
                          </div>
                        </div>
                      )}
                      <div className="sm:block hidden">
                        {allReviews ? (
                          <div>
                            {allReviews.length > 0 ? (
                              <>
                                <p className="text-blue-950 text-base font-semibold mb-3">
                                  All Product Reviews
                                </p>
                                <div>
                                  <div>
                                    {currentReviews.length > 0 ? (
                                      <>
                                        {currentReviews.map((review) => (
                                          <div key={review._id}>
                                            <div className="pb-2 mb-3 border-b">
                                              <div className="w-auto">
                                                <div className="flex items-center gap-1 mb-3">
                                                  {generateStarIcons(
                                                    review.avgRating
                                                  )}
                                                </div>
                                                <div className="w-auto">
                                                  <div className="flex items-center mb-1 gap-1">
                                                    <p className="text-sm text-slate-600 w-12">
                                                      Value
                                                    </p>
                                                    <div
                                                      className="w-[100px] h-2 rounded"
                                                      style={{
                                                        background: `linear-gradient(to right, #172554 ${
                                                          (review.value / 5) *
                                                          100
                                                        }%, transparent ${
                                                          (review.value / 5) *
                                                          100
                                                        }%)`,
                                                        border: `1px solid #172554`, // Use blue-950 color for the border
                                                      }}
                                                    ></div>
                                                    <p className="ml-1.5 text-[10px] text-slate-600">
                                                      {review.value}
                                                    </p>
                                                  </div>
                                                  <div className="flex items-center mb-1 gap-1">
                                                    <p className="text-sm text-slate-600 w-12">
                                                      Quality
                                                    </p>
                                                    <div
                                                      className="w-[100px] h-2 rounded"
                                                      style={{
                                                        background: `linear-gradient(to right, #172554 ${
                                                          (review.quality / 5) *
                                                          100
                                                        }%, transparent ${
                                                          (review.quality / 5) *
                                                          100
                                                        }%)`,
                                                        border: `1px solid #172554`, // Use blue-950 color for the border
                                                      }}
                                                    ></div>
                                                    <p className="ml-1.5 text-[10px] text-slate-600">
                                                      {review.quality}
                                                    </p>
                                                  </div>
                                                  <div className="flex items-center mb-2 gap-1">
                                                    <p className="text-sm text-slate-600 w-12">
                                                      Price
                                                    </p>
                                                    <div
                                                      className="w-[100px] h-2 rounded"
                                                      style={{
                                                        background: `linear-gradient(to right, #172554 ${
                                                          (review.price / 5) *
                                                          100
                                                        }%, transparent ${
                                                          (review.price / 5) *
                                                          100
                                                        }%)`,
                                                        border: `1px solid #172554`, // Use blue-950 color for the border
                                                      }}
                                                    ></div>
                                                    <p className="ml-1.5 text-[10px] text-slate-600">
                                                      {review.price}
                                                    </p>
                                                  </div>
                                                </div>
                                                <p className="text-blue-950 text-sm font-semibold mb-1.5">
                                                  {review.title}
                                                </p>
                                                <p className="text-blue-950 text-xs mb-2">
                                                  {review.reviewText}
                                                </p>
                                                {review.userDetail ? (
                                                  <div className="flex flex-wrap gap-3.5">
                                                    {review.userDetail &&
                                                    review.userDetail
                                                      .userProfileImage ? (
                                                      <img
                                                        src={
                                                          review.userDetail
                                                            .userProfileImage
                                                        }
                                                        alt={`${review.userDetail.userName}`}
                                                        className="w-6 h-6 rounded-full cursor-pointer"
                                                      />
                                                    ) : review.userDetail
                                                        ?.userName ? (
                                                      <>
                                                        <FontAwesomeIcon
                                                          icon={faCircleUser}
                                                          className="text-2xl text-gray-500/60 cursor-pointer"
                                                        />
                                                      </>
                                                    ) : (
                                                      <></>
                                                    )}
                                                    <p className="text-xs text-gray-500 py-1">
                                                      {
                                                        review.userDetail
                                                          ?.userName
                                                      }
                                                    </p>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                                {review.replyReviewId &&
                                                  review.replyReviewId
                                                    .createdAt &&
                                                  review.replyReviewId
                                                    .reviewStatus ==
                                                    "Approved" && (
                                                    <div className="flex items-center mt-2 reply border border-t border-b-0 border-r-0 border-l-0 pt-2">
                                                      <p className="text-blue-950 text-xs mb-1 pl-2 flex flex-col gap-[4px]">
                                                        <span className="text-[#959799] ">
                                                          Seller responded on{" "}
                                                          {formatDate(
                                                            review.replyReviewId
                                                              .createdAt
                                                          )}
                                                          :
                                                        </span>
                                                        <span>
                                                          {
                                                            review.replyReviewId
                                                              .reviewText
                                                          }
                                                        </span>
                                                      </p>
                                                    </div>
                                                  )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </>
                                    ) : (
                                      <></>
                                      // <p>
                                      //   No reviews available for this product.
                                      // </p>
                                    )}
                                  </div>

                                  <div className="pagination flex text-sm items-center justify-start text-bodyText gap-x-3 my-2">
                                    <button
                                      onClick={handlePreviousPage}
                                      disabled={currentPage === 1}
                                    >
                                      <FontAwesomeIcon
                                        icon={faArrowLeft}
                                        className="h-[8px]"
                                      />
                                    </button>

                                    <div className="flex gap-2 items-center">
                                      {Array.isArray(pageNumbers) ? (
                                        pageNumbers.map((pageNumber, index) => (
                                          <React.Fragment key={pageNumber}>
                                            {index === 0 && currentPage > 3 && (
                                              <span>...</span>
                                            )}
                                            {index >=
                                              Math.max(0, currentPage - 2) &&
                                              index <
                                                Math.min(
                                                  pageNumbers.length,
                                                  currentPage + 1
                                                ) && (
                                                <button
                                                  className={
                                                    pageNumber === currentPage
                                                      ? "bg-orange-100 h-6 w-6 rounded-full"
                                                      : ""
                                                  }
                                                  onClick={() =>
                                                    setCurrentPage(pageNumber)
                                                  }
                                                >
                                                  {pageNumber}
                                                </button>
                                              )}
                                            {index ===
                                              Math.min(
                                                pageNumbers.length - 1,
                                                currentPage + 1
                                              ) &&
                                              currentPage < totalPages - 2 && (
                                                <span>...</span>
                                              )}
                                          </React.Fragment>
                                        ))
                                      ) : (
                                        <p>Error: Invalid page numbers data</p>
                                      )}
                                    </div>

                                    <button
                                      onClick={handleNextPage}
                                      disabled={currentPage === totalPages}
                                    >
                                      <FontAwesomeIcon
                                        icon={faArrowRight}
                                        className="h-[8px]"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                              // <p className="text-orange-600 text-sm">
                              //   No reviews available for this product.
                              // </p>
                            )}
                          </div>
                        ) : (
                          <>
                            <p className="text-sm animate-pulse text-blue-950">
                              Loading reviews...
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <h3 className="text-blue-950 text-lg md:text-xl xl:text-2xl mb-0 font-medium">
                    {product?.productName}
                  </h3>

                  {product?.seller?.firstName && product?.seller?.lastName && (
                    <p className="text-sm text-blue-950 mb-2">
                      by{" "}
                      <Link
                        className="font-medium text-primary"
                        href={`/shop/${product?.seller?.storeSlug}`}
                      >
                        {product?.seller?.storeTitle
                          ? `${product?.seller.storeTitle}`
                          : ""}
                      </Link>
                    </p>
                  )}

                  {product?.productType === "Standard" && (
                    <div>
                      {product?.discountCode &&
                      parseFloat(product?.discountCode) > 0 ? (
                        <div>
                          <div className="flex gap-1 flex-row items-center ">
                            <p className="text-blue-950 text-lg md:text-xl xl:text-2xl font-semibold ">
                              {userCurrency ? userCurrency : "CA$"}{" "}
                              {formatPrice(
                                parseFloat(
                                  product?.surTotalAmount
                                    ? product?.surTotalAmount
                                    : product?.totalAmount
                                    ? product?.totalAmount
                                    : product?.finalPrice
                                ).toFixed(2)
                              )}
                            </p>
                            <h4 className="text-red-700  line-through  font-medium ">
                              {userCurrency ? userCurrency : "CA$"}{" "}
                              {formatPrice(
                                parseFloat(
                                  product?.surTotalAmountBDis
                                    ? product?.surTotalAmountBDis
                                    : product?.totalAmount
                                    ? product?.totalAmount
                                    : product?.price
                                ).toFixed(2)
                              )}
                            </h4>
                          </div>
                          <p className=" text-orange-700 mb-2">
                            {product && product?.discountCode
                              ? `${product?.discountCode}% off`
                              : ""}
                          </p>
                        </div>
                      ) : (
                        <h4 className="text-blue-950 text-lg md:text-xl xl:text-2xl font-semibold mb-2">
                          {product && product?.finalPrice
                            ? `${userCurrency ? userCurrency : "CA$"} 
                          ${formatPrice(
                            parseFloat(
                              product?.surTotalAmount
                                ? product?.surTotalAmount
                                : product?.finalPrice
                            ).toFixed(2)
                          )}`
                            : ""}
                        </h4>
                      )}
                    </div>
                  )}

                  {product?.productType === "Customizable" && (
                    <div>
                      <div className="flex gap-1 flex-row items-center">
                        <p className="text-blue-950 text-lg md:text-xl xl:text-2xl font-semibold mb-0">
                          {calculatedPrice
                            ? `${userCurrency ? userCurrency : "CA$"} 
                            ${formatPrice(
                              parseFloat(calculatedPrice).toFixed(2)
                            )}`
                            : ""}
                        </p>
                        {parseFloat(product?.discountCode) > 0 && (
                          <>
                            <h4 className="text-red-700  line-through  font-medium ">
                              {calculatedActualPrice
                                ? `${userCurrency ? userCurrency : "CA$"} 
                                ${formatPrice(
                                  parseFloat(calculatedActualPrice).toFixed(2)
                                )}`
                                : ""}
                            </h4>
                          </>
                        )}
                      </div>
                      {parseFloat(product?.discountCode) > 0 && (
                        <>
                          <p className=" text-orange-700 mb-2">
                            {product && product?.discountCode
                              ? `${product?.discountCode}% off`
                              : ""}
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {product?.productType === "Downloadable" && (
                    <div>
                      {product?.discountCode &&
                      parseFloat(product?.discountCode) > 0 ? (
                        <div>
                          <div className="flex gap-1 flex-row items-center ">
                            <p className="text-blue-950 text-lg md:text-xl xl:text-2xl font-semibold ">
                              {userCurrency ? userCurrency : "CA$"}{" "}
                              {formatPrice(
                                parseFloat(
                                  product?.surTotalAmount
                                    ? product?.surTotalAmount
                                    : product?.finalPrice
                                ).toFixed(2)
                              )}
                            </p>
                            <h4 className="text-red-700  line-through  font-medium ">
                              {userCurrency ? userCurrency : "CA$"}{" "}
                              {formatPrice(
                                parseFloat(
                                  product?.surTotalAmountBDis
                                    ? product?.surTotalAmountBDis
                                    : product?.totalPrice
                                    ? product?.totalPrice
                                    : product?.price
                                ).toFixed(2)
                              )}
                            </h4>
                          </div>
                          <p className=" text-orange-700 mb-2">
                            {product && product?.discountCode
                              ? `${product?.discountCode}% off`
                              : ""}
                          </p>
                        </div>
                      ) : (
                        <h4 className="text-blue-950 text-lg md:text-xl xl:text-2xl font-semibold mb-2">
                          {(product && product?.finalPrice) ||
                          product?.surTotalAmount
                            ? `${userCurrency ? userCurrency : "CA$"} 
                          ${formatPrice(
                            parseFloat(
                              product?.surTotalAmount
                                ? product?.surTotalAmount
                                : product?.finalPrice
                            ).toFixed(2)
                          )}`
                            : ""}
                        </h4>
                      )}
                    </div>
                  )}

                  {product?.productType === "Customizable" && (
                    <h4 className="text-blue-950 text-sm mb-2">
                      {calculateInventory() &&
                      calculateInventory() === "Out of Stock" ? (
                        <span className="text-red-700">Out of Stock</span>
                      ) : (
                        calculateInventory()
                      )}
                    </h4>
                  )}

                  {product?.productType === "Standard" && (
                    <h4 className="text-blue-950 text-sm mb-2">
                      {product?.inventory === "OutOffStock" ? (
                        <span className="text-red-700">Out of Stock</span>
                      ) : product?.inventory === "InStock" ? (
                        "In Stock"
                      ) : (
                        product?.inventory
                      )}
                    </h4>
                  )}

                  {product?.productType === "Downloadable" && (
                    <h4 className="text-blue-950 text-sm mb-2">
                      {product?.inventory === "OutOffStock" ? (
                        <span className="text-red-700">Out of Stock</span>
                      ) : product?.inventory === "InStock" ? (
                        "In Stock"
                      ) : (
                        product?.inventory
                      )}
                    </h4>
                  )}

                  {((product?.seller?.country == userCountry &&
                    product?.seller?.shippingConfigId?.domestic?.flat_rate &&
                    product?.seller?.shippingConfigId?.domestic
                      ?.flat_rate_options?.free_shipping) ||
                    (product?.seller?.country != userCountry &&
                      product?.seller?.shippingConfigId?.international
                        ?.flat_raproductte &&
                      product?.seller?.shippingConfigId?.international
                        ?.flat_rate_options?.free_shipping) ||
                    (product?.freeDelivery &&
                      product?.seller?.country == userCountry)) &&
                    product.productType != "Downloadable" && (
                      <div className="mb-3 px-[8px] py-[2px] text-[11px] bg-[#a0e193] rounded-full w-[max-content]">
                        Free Shipping
                      </div>
                    )}

                  {product?.productType === "Downloadable" ? (
                    <div className="mb-2 px-[8px] py-[2px] text-[11px] bg-primary rounded-full w-[max-content] text-white">
                      Downloadable
                    </div>
                  ) : (
                    ""
                  )}

                  {product?.productType === "Customizable" &&
                    variations &&
                    variations.length > 0 && (
                      <>
                        {Object.keys(variations[0]).map(
                          (attribute, index) =>
                            // Exclude inventory, quantity, and price attributes
                            attribute !== "inventory" &&
                            attribute !== "quantity" &&
                            attribute !== "price" &&
                            attribute !== "image" &&
                            attribute !== "totalPrice" &&
                            attribute !== "finalPrice" &&
                            attribute !== "surTotalAmount" &&
                            attribute !== "surTotalAmountBDis" &&
                            attribute !== "currencyPrice" && (
                              <Menu
                                key={index}
                                as="div"
                                className="relative inline-block text-left w-full mb-4"
                              >
                                <div className="flex w-full">
                                  <Menu.Button className="text-blue-950 py-3 px-4 border rounded w-full border-zinc-200 flex items-center justify-between mb-0 shadow-[0px_2px_4px_#0000000D]">
                                    {selectedAttributes[attribute] ? (
                                      <div>
                                        <span className="capitalize">
                                          {attribute}:{" "}
                                        </span>
                                        <span>{`${selectedAttributes[attribute]}`}</span>
                                      </div>
                                    ) : (
                                      <div>
                                        <span className="capitalize">
                                          {attribute}:
                                        </span>{" "}
                                        {variations[0][attribute]}
                                      </div>
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

                  <p className="font-semibold text-blue-950 mb-1">
                    Message for Seller
                  </p>
                  <input
                    type="textarea"
                    placeholder="Type here..."
                    value={textArea}
                    onChange={(e) => setTextArea(e.target.value)}
                    maxLength="250"
                    className="text-blue-950 w-full py-3.5 rounded px-4 border border-zinc-200 text-xs flex items-center justify-between mb-1.5 shadow-[0px_2px_4px_#0000000D]"
                  />
                  <p className="text-red-700 text-xs mb-5 md:mb-4">
                    Maximum characters: 250
                  </p>

                  {product?.productType === "Standard" && (
                    <div className="flex items-center gap-3 flex-wrap mb-6 md:mb-8">
                      <div className="w-24 bg-gray-300 flex items-center justify-between rounded-sm">
                        <button
                          className={`py-3 px-2.5 ${
                            product?.inventory === "OutOffStock" || countS <= 1
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                          onClick={decrementS}
                          disabled={
                            product?.inventory === "OutOffStock" || countS <= 1
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
                            product?.inventory === "OutOffStock" ||
                            countS >= product?.quantity
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                          onClick={incrementS}
                          disabled={
                            product?.inventory === "OutOffStock" ||
                            countS >= product?.quantity
                          }
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="text-gray-950 h-2 w-2"
                          />
                        </button>
                      </div>

                      <div className="flex items-center">
                        {product && product?._id in cart ? (
                          <button className="buttonprimarythre relative">
                            View cart
                            <Link href="/cart">
                              <span className="absolute top-0 left-0 h-full w-full"></span>
                            </Link>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const user = JSON.parse(
                                localStorage.getItem("user")
                              );
                              // if (user) {
                              let shippingOptions = [];
                              let shippingService = "";
                              let shippingRate = 0;
                              addToCart(
                                product?._id,
                                countS,
                                product?.quantity ? product?.quantity : "",
                                product?.finalPrice,
                                product,
                                textArea ? textArea : "",
                                shippingOptions,
                                shippingService,
                                shippingRate
                              );
                              pushEventAddToCart("add_to_cart", countS)
                              // } else {
                              //   setIsOpen(true);
                              // }
                            }}
                            className={`text-primary ease-in transition-colors rounded-sm hover:bg-or:text-base font-medium py-3 px-8 border border-primary ${
                              product?.inventory === "OutOffStock" ||
                              productAsDisabled
                                ? "disabled:cursor-not-allowed opacity-50"
                                : ""
                            }`}
                            disabled={
                              product?.inventory === "OutOffStock" ||
                              productAsDisabled
                            }
                            title={
                              productAsDisabled
                                ? "Product is disabled by seller"
                                : ""
                            }
                          >
                            Add to cart
                          </button>
                        )}
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
                          {calculateTotalQuantity(
                            selectedAttributes,
                            variations
                          )}
                        </p>
                      </div>
                    )}

                  {product?.productType === "Downloadable" && (
                    <div className="flex items-center gap-3 flex-wrap mb-6 md:mb-8">
                      <div className="flex items-center">
                        {product?._id in cart ? (
                          <button className="buttonprimarythre relative">
                            View cart
                            <Link href="/cart">
                              <span className="absolute top-0 left-0 h-full w-full"></span>
                            </Link>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const user = JSON.parse(
                                localStorage.getItem("user")
                              );
                              // if (user) {
                              let shippingOptions = [];
                              let shippingService = "";
                              let shippingRate = 0;
                              addToCart(
                                product?._id,
                                1,
                                product?.quantity ? product?.quantity : "",
                                product?.finalPrice,
                                product,
                                textArea ? textArea : "",
                                shippingOptions,
                                shippingService,
                                shippingRate
                              );
                              pushEventAddToCart("add_to_cart", 1)
                              // } else {
                              //   setIsOpen(true);
                              // }
                            }}
                            className={`text-primary ease-in transition-colors rounded-sm hover:bg-or:text-base font-medium py-3 px-8 border border-primary ${
                              product?.inventory === "OutOffStock" ||
                              productAsDisabled
                                ? "disabled:cursor-not-allowed opacity-50"
                                : ""
                            }`}
                            disabled={
                              product?.inventory === "OutOffStock" ||
                              productAsDisabled
                            }
                            title={
                              productAsDisabled
                                ? "Product is disabled by seller"
                                : ""
                            }
                          >
                            Add to cart
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {product?.productType === "Customizable" && (
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

                        <div className="flex items-center">
                          {checkSelectedVariantInCart() ? (
                            <button className="buttonprimarythre relative">
                              View cart
                              <Link href="/cart">
                                <span className="absolute top-0 left-0 h-full w-full"></span>
                              </Link>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const user = JSON.parse(
                                  localStorage.getItem("user")
                                );
                                // if (user) {
                                let shippingOptions = [];
                                let shippingService = "";
                                let shippingRate = 0;
                                let productId = product?._id;
                                if (
                                  attributeArray &&
                                  Array.isArray(attributeArray) &&
                                  attributeArray.length
                                ) {
                                  productId = `${productId}_${attributeArray
                                    .map((variation) =>
                                      variation.attributeValue.replace(
                                        /\s+/g,
                                        ""
                                      )
                                    )
                                    .join("_")}`;
                                }
                                addToCart(
                                  productId ? productId : product?._id,
                                  count,
                                  totalQuantity ? totalQuantity : "",
                                  calculatedPriceSurcharge,
                                  product,
                                  textArea ? textArea : "",
                                  shippingOptions,
                                  shippingService,
                                  shippingRate,
                                  attributeArray
                                );
                                pushEventAddToCart("add_to_cart", count)
                                // } else {
                                //   setIsOpen(true);
                                // }
                              }}
                              className={`text-primary ease-in transition-colors rounded-sm  text-sm xl:text-base font-medium py-3 px-8 border border-primary ${
                                calculateInventory() === "Out of Stock" ||
                                productAsDisabled
                                  ? "disabled:cursor-not-allowed opacity-50"
                                  : ""
                              }`}
                              disabled={
                                calculateInventory() === "Out of Stock" ||
                                productAsDisabled
                              }
                              title={
                                productAsDisabled
                                  ? "Product is disabled by seller"
                                  : ""
                              }
                            >
                              Add to cart
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pb-4 mb-4 border-b border-zinc-200">
                    <p className="text-blue-950 font-semibold mb-1">
                      Product description
                    </p>
                    <div style={{ whiteSpace: "pre-line" }}>
                      <p className="text-slate-600 text-sm mb-12 relative">
                        {product?.description && (
                          <>
                            {showMoreDescription
                              ? product?.description
                              : product?.description.slice(0, 300)}
                            {product?.description.length > 300 &&
                              !showMoreDescription && (
                                <span>
                                  <span>...</span>
                                  <span className="absolute -bottom-11 text-black px-4 py-2 border border-slate-200 left-0 right-0">
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
                                {/* {product?.description.slice(300)} */}
                                <span className="absolute -bottom-11 text-black px-4 py-2 border border-slate-200 left-0 right-0">
                                  <a
                                    onClick={toggleDescriptionVisibility}
                                    className="cursor-pointer font-medium flex items-center justify-center"
                                  >
                                    Show less{" "}
                                    <FontAwesomeIcon icon={faAngleUp} />
                                  </a>
                                </span>
                              </span>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {(product?.productType === "Standard" ||
                    product?.productType === "Downloadable") && (
                    <div className="pb-2 mb-4 border-b border-zinc-200">
                      <p className="text-blue-950 font-semibold mb-3">
                        Package details
                      </p>

                      {product?.productType === "Standard" && (
                        <>
                          <div className="flex gap-2.5 mb-3">
                            <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                            <p className="text-sm text-slate-600">
                              Package Length: {product?.length} cm
                            </p>
                          </div>
                          <div className="flex gap-2.5 mb-3">
                            <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                            <p className="text-sm text-slate-600">
                              Package Width: {product?.width} cm
                            </p>
                          </div>
                          <div className="flex gap-2.5 mb-3">
                            <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                            <p className="text-sm text-slate-600">
                              Package Height: {product?.height} cm
                            </p>
                          </div>
                          <div className="flex gap-2.5 mb-3">
                            <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                            <p className="text-sm text-slate-600">
                              Package Weight: {product?.weight} kg
                            </p>
                          </div>
                          <div className="flex gap-2.5 mb-3">
                            <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                            <p className="text-sm text-slate-600">
                              Dispatch time (Days): {product?.dispatchDays} days
                            </p>
                          </div>
                        </>
                      )}

                      {product?.productType === "Downloadable" && (
                        <>
                          <div className="flex gap-2.5 mb-3">
                            <div className="h-[5px] w-[5px] rounded-full bg-slate-600 mt-2"></div>
                            <p className="text-sm text-slate-600">
                              Download limit:{" "}
                              {product?.downloadableLink?.downloadLimit}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
               {showChatButton() && (
                  <div className="pb-4 mb-4 border-b border-zinc-200">
                    
                    <button
                      type="button"
                      className="w-full text-black px-4 py-2 border border-slate-200 cursor-pointer font-medium flex items-center justify-center"
                      onClick={handleChatWithSeller}
                      >
                      Chat with Seller
                    </button>
                      </div>
                )}

                  {product?.seller && (
                    <p className="text-blue-950 font-semibold mb-3">
                      Meet your seller
                    </p>
                  )}
                  <Link href={`/shop/${product?.seller?.storeSlug}`}>
                    <p className="font-medium text-blue-950 mb-3">
                      {product?.seller?.storeTitle
                        ? `${product?.seller.storeTitle}`
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
                          ? `${product?.seller.city}, ${product?.seller.state}, ${product?.seller.country}`
                          : ""}
                      </p>
                    </div>
                    {loadingProductCount && <p>Loading...</p>}
                    {!loadingProductCount && productCount > 0 && (
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
                    {seller?.storePolicy &&
                      (seller?.storePolicy?.cancellationPolic ||
                        seller?.storePolicy?.returnPolicy) && (
                        <div className="w-full pb-2 mb-4 border-t border-zinc-200 mt-6">
                          {/* Header with Toggle Button */}
                          <div
                            className="flex justify-between items-center py-2 border-b border-gray-300 cursor-pointer"
                            onClick={() => setIsOpenPolicy(!isOpenPolicy)}
                          >
                            <h3 className="text-blue-950 font-semibold mb-1 mt-1">
                              Cancel & Return Policies
                            </h3>

                            {/* SVG Icon for Toggle */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              className={`transition-transform duration-300 ${
                                isOpenPolicy ? "rotate-180" : ""
                              }`}
                            >
                              <path d="M12 15.586L6.707 10.293 5.293 11.707 12 18.414 18.707 11.707 17.293 10.293z"></path>
                            </svg>
                          </div>

                          {/* Dropdown Content */}
                          <div
                            className={`overflow-hidden transition-all duration-500 ${
                              isOpenPolicy
                                ? "max-h-96 opacity-100 pb-2 mb-4 border-b border-zinc-200"
                                : "max-h-0 opacity-0 "
                            }`}
                          >
                            <div className="py-3">
                              {seller?.storePolicy?.cancellationPolicy && (
                                <>
                                  <h4 className="text-md font-semibold text-blue-950">
                                    Cancellation Policy
                                  </h4>
                                  <p className="text-gray-700 text-sm">
                                    I accept order cancellations within{" "}
                                    {
                                      seller?.storePolicy
                                        ?.cancellationPolicyTime
                                    }{" "}
                                    hours of purchase.
                                  </p>
                                </>
                              )}

                              {seller?.storePolicy?.returnPolicy && (
                                <>
                                  <h4 className="text-md font-semibold text-blue-950 mt-3">
                                    Return Policy
                                  </h4>
                                  <p className="text-gray-700 text-sm">
                                    {seller?.storePolicy?.returnPolicyDetails}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    {product?.seller && product?.seller.phone ? (
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
                          href={`https://wa.me/${product?.seller.phone}`}
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

                  <div
                    className="sm:hidden block mt-4 border-t pt-4"
                    id="customerReviewsMobile"
                  >
                    {allReviews ? (
                      <div>
                        <p className="text-blue-950 text-base font-semibold mb-3">
                          Product Reviews
                        </p>
                        {allReviews.length > 0 ? (
                          <div>
                            <div>
                              {allReviews.length > 0 ? (
                                <>
                                  {currentReviews.map((review) => (
                                    <div key={review._id}>
                                      <div className="pb-3 mb-3 border-b">
                                        <div className="w-auto">
                                          <div className="flex items-center gap-1 mb-3">
                                            {generateStarIcons(
                                              review.avgRating
                                            )}
                                          </div>
                                          <div className="w-auto">
                                            <div className="flex items-center mb-1 gap-1">
                                              <p className="text-sm text-slate-600 w-12">
                                                Value
                                              </p>
                                              <div
                                                className="w-[100px] h-2 rounded"
                                                style={{
                                                  background: `linear-gradient(to right, #172554 ${
                                                    (review.value / 5) * 100
                                                  }%, transparent ${
                                                    (review.value / 5) * 100
                                                  }%)`,
                                                  border: `1px solid #172554`, // Use blue-950 color for the border
                                                }}
                                              ></div>
                                              <p className="ml-1.5 text-[10px] text-slate-600">
                                                {review.value}
                                              </p>
                                            </div>
                                            <div className="flex items-center mb-1 gap-1">
                                              <p className="text-sm text-slate-600 w-12">
                                                Quality
                                              </p>
                                              <div
                                                className="w-[100px] h-2 rounded"
                                                style={{
                                                  background: `linear-gradient(to right, #172554 ${
                                                    (review.quality / 5) * 100
                                                  }%, transparent ${
                                                    (review.quality / 5) * 100
                                                  }%)`,
                                                  border: `1px solid #172554`, // Use blue-950 color for the border
                                                }}
                                              ></div>
                                              <p className="ml-1.5 text-[10px] text-slate-600">
                                                {review.quality}
                                              </p>
                                            </div>
                                            <div className="flex items-center mb-2 gap-1">
                                              <p className="text-sm text-slate-600 w-12">
                                                Price
                                              </p>
                                              <div
                                                className="w-[100px] h-2 rounded"
                                                style={{
                                                  background: `linear-gradient(to right, #172554 ${
                                                    (review.price / 5) * 100
                                                  }%, transparent ${
                                                    (review.price / 5) * 100
                                                  }%)`,
                                                  border: `1px solid #172554`, // Use blue-950 color for the border
                                                }}
                                              ></div>
                                              <p className="ml-1.5 text-[10px] text-slate-600">
                                                {review.price}
                                              </p>
                                            </div>
                                          </div>
                                          <p className="text-blue-950 text-sm font-semibold mb-1.5">
                                            {review.title}
                                          </p>
                                          <p className="text-blue-950 text-xs mb-2">
                                            {review.reviewText}
                                          </p>
                                          {review.userDetail ? (
                                            <div className="flex flex-wrap gap-3.5">
                                              {review.userDetail &&
                                              review.userDetail
                                                .userProfileImage ? (
                                                <img
                                                  src={
                                                    review.userDetail
                                                      .userProfileImage
                                                  }
                                                  alt={`${review.userDetail.userName}`}
                                                  className="w-6 h-6 rounded-full cursor-pointer"
                                                />
                                              ) : review.userDetail
                                                  ?.userName ? (
                                                <>
                                                  <FontAwesomeIcon
                                                    icon={faCircleUser}
                                                    className="text-2xl text-gray-500/60 cursor-pointer"
                                                  />
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                              <p className="text-xs text-gray-500 py-1">
                                                {review.userDetail?.userName}
                                              </p>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          {review.replyReviewId &&
                                          review.replyReviewId.createdAt &&
                                          review.replyReviewId.reviewStatus ==
                                            "Approved" ? (
                                            <div className="flex items-center mt-2 reply border border-t border-b-0 border-r-0 border-l-0 pt-2">
                                              <p className="text-blue-950 text-xs mb-1 pl-2 flex flex-col gap-[4px]">
                                                <span className="text-[#959799] ">
                                                  Seller responded on{" "}
                                                  {formatDate(
                                                    review.replyReviewId
                                                      .createdAt
                                                  )}
                                                  :
                                                </span>
                                                <span>
                                                  {
                                                    review.replyReviewId
                                                      .reviewText
                                                  }
                                                </span>
                                              </p>
                                            </div>
                                          ) : (
                                            " "
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <></>
                                // <p>No reviews available for this product.</p>
                              )}
                            </div>

                            <div className="pagination flex text-sm items-center justify-start text-bodyText gap-x-3 my-2">
                              {/* Previous Page Button */}
                              <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="disabled:opacity-50"
                              >
                                <FontAwesomeIcon
                                  icon={faArrowLeft}
                                  className="h-[8px]"
                                />
                              </button>

                              {/* Page Numbers with Ellipses */}
                              <div className="flex gap-2 items-center">
                                {pageNumbers.map((pageNumber) => (
                                  <button
                                    key={pageNumber}
                                    className={`${
                                      pageNumber === currentPage
                                        ? "bg-orange-100 h-6 w-6 rounded-full"
                                        : ""
                                    }`}
                                    onClick={() => setCurrentPage(pageNumber)}
                                  >
                                    {pageNumber}
                                  </button>
                                ))}
                              </div>

                              {/* Next Page Button */}
                              <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="disabled:opacity-50"
                              >
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  className="h-[8px]"
                                />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <></>
                          // <p className="text-orange-600 text-sm">
                          //   No reviews available for this product.
                          // </p>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="text-sm animate-pulse text-blue-950">
                          Loading reviews...
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {allProducts && allProducts.length && (
                <div className="mb-8 md:mb-10 xl:mb-14">
                  <h2
                    className={`text-blue-950 text-center lg:text-start md:ml-4 lg:ml-0 text-2xl lg:tracking-[-0.72px] mb-6 md:mb-6 noto-font`}
                  >
                    More From This Seller
                  </h2>
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 justify-center gap-9 mb-4 md:mb-9">
                    {allProducts
                      .filter((data) => {
                        const viewed =
                          JSON.parse(localStorage.getItem("recentlyViewed")) ||
                          [];
                        return (
                          !viewed.includes(data._id) &&
                          data.seller?._id === product?.seller?._id &&
                          data._id !== product?._id
                        );
                      })
                      .slice(0, 3)
                      .map((data) => (
                        <div key={data._id}>
                          <ProductCardComponent data={data} />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {categoryProducts && categoryProducts.length > 0 && (
                <div className="mb-8 md:mb-10 xl:mb-14">
                  <h2
                    className={`text-blue-950 text-center lg:text-start md:ml-4 lg:ml-0 text-2xl lg:tracking-[-0.72px] mb-6 md:mb-6 noto-font`}
                  >
                    You May Also Like
                  </h2>
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 justify-center gap-9 mb-4 md:mb-9">
                    {categoryProducts.map((data) => (
                      <div key={data._id}>
                        <ProductCardComponent data={data} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently Viewed - Always render section, load content in background */}
              <div className="mb-8 md:mb-10 xl:mb-14">
                <h2
                  className={`text-blue-950 text-center lg:text-start md:ml-4 lg:ml-0 text-2xl lg:tracking-[-0.72px] mb-6 md:mb-6 noto-font`}
                >
                  Recently Viewed
                </h2>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 justify-center gap-9 mb-4 md:mb-9">
                  {recentlyViewedProducts && recentlyViewedProducts.length > 0 ? (
                    recentlyViewedProducts.map((data) => (
                      <div key={data._id}>
                        <ProductCardComponent data={data} />
                      </div>
                    ))
                  ) : (
                    // Show placeholder or nothing while loading - doesn't block route
                    null
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* <section className="bg-blue-950 overflow-hidden">
            <div className="max-w-screen-xl mx-auto px-4 py-8 md:py-20">
              <div className="">
                <h6 className="text-sm md:text-base text-white font-bold mb-3.5">
                  MAXIMIZE YOUR PROFIT
                </h6>
                <div className="flex flex-col md:flex-row gap-6 md:gap-20 xl:gap-48  justify-start">
                  <div className="md:w-[414px] lg:w-[514px]">
                    <h2
                      className={`text-orange-50  text-2xl md:text-3xl lg:text-4xl lg:tracking-[-0.72px] mb-5 noto-font`}
                    >
                      Register as a Seller Today!
                    </h2>
                    <p className="text-orange-50 mb-6 md:mb-9">
                      Share your handcrafted masterpieces with a worldwide
                      community of art lovers, igniting a journey of creativity
                      and recognition.
                    </p>
                    <div className="flex">
                      <Link
                        href="/register-as-a-seller"
                        className="buttonprimary"
                      >
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
                    <div className="flex gap-2.5 items-center mb-5">
                      <FontAwesomeIcon
                        icon={faSquareCheck}
                        className="text-white text-lg"
                      />
                      <p className="text-orange-50 font-light">
                        No overhead charges or hidden fees
                      </p>
                    </div>
                    <div className="flex gap-2.5 items-center">
                      <FontAwesomeIcon
                        icon={faSquareCheck}
                        className="text-white text-lg"
                      />
                      <p className="text-orange-50 font-light">
                        We choose simplicity and transparency
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section> */}

          {/* <section className="bg-white">
            <Faq className="bg-white" />
          </section> */}

          {/* <section className="bg-blue-950">
            <div className="max-w-[740px] mx-auto px-4 py-8 md:py-20">
              <h2
                className={`text-orange-50 text-center text-2xl md:text-3xl lg:text-4xl lg:tracking-[-0.72px] mb-5 noto-font`}
              >
                Bringing Hidden Creatives to Light
              </h2>
              <p className="text-orange-50 text-center mb-6 md:mb-12">
                Illuminating the world of talented artisans, celebrating their
                unseen masterpieces, and providing a platform for their
                craftsmanship to shine bright and flourish on the global stage
                of artistry and innovation.
              </p>
              <div className="flex items-center justify-center">
                <Link href="/join-as-a-seller" className="buttonprimary">
                  {" "}
                  Showcase Your Talent
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
          </section> */}
          <section className="bg-white overflow-hidden">
            <div className="relative">
              <div className="container mx-auto py-2">
                <h1
                  className={`text-xl md:text-2xl xl:text-3xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-left mb-0 px-6 pt-10 noto-font`}
                >
                  Shop Our Most Popular Categories
                </h1>
                <div className="overflow-x-auto p-10">
                  <div className="flex space-x-6 justify-around">
                    {bestSellingCategory?.length ? (
                      bestSellingCategory.map((category, index) => (
                        <CategoryCard
                          key={index}
                          data={category}
                          image={`/assets/Sub-Category Images/${
                            category?.SubCategory?.slug || ""
                          }.jpg`}
                          title={category?.SubCategory?.name}
                        />
                      ))
                    ) : (
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-950 border-solid"></div>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 block md:hidden pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </section>
          <section>
            <Footer />
          </section>

          {/* <Transition appear show={isOpen} as={Fragment}>
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
                        <Link href={`/sign-in?redirect=${router.asPath}`}>
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
          </Transition> */}
        </>
      ) : (
        <>
          <Head>
            <title>{pageData?.title}</title>
            <meta property="og:title" content={pageData?.metaTitle} />
            <meta name="description" content={pageData?.metaDescription} />
            <meta
              property="og:description"
              content="Are you an artist or artisan seeking an alternative and affordable handicraft marketplace to sell your crafts to the global market? Then join our waitlist to gain access to exclusive promotions and be first in line for exciting deals in our upcoming launch!"
            />
          </Head>
          <section>
            <Header cart={cart} addToCart={addToCart}/>
          </section>
          <section id="products" className="bg-white ">
            <div className="max-w-screen-xl mx-auto px-4 2 py-8 md:py-10 lg:py-18">
              <div className="pb-5 mb-8 flex flex-col md:flex-row items-start md:justify-between gap-4 border-b border-[#D8D8D8]">
                {/* Remove blocking loading - show immediately */}
                <>
                  <h2 className="text-blue-950 xl:tracking-[-0.72px] text-2xl lg:text-4xl">
                    {categoryName || "Products"}
                  </h2>
                  {products && products.length > 0 && (
                    <p className="text-blue-950">{products.length} results</p>
                  )}
                </>
              </div>

              <div className="flex flex-col">
                {" "}
                <div>
                  {/* Remove blocking loading state - render immediately */}
                  <>
                    {error && <p>Error - Something went wrong!</p>}
                    {products && products.length > 0 ? (
                      <div className="flex flex-wrap gap-8 mb-4 md:mb-9 xl:mb-12 justify-center">
                        {products.slice(0, visibleProducts).map((data) => (
                          <div key={data._id}>
                            <ProductCardComponent data={data} />
                          </div>
                        ))}
                      </div>
                    ) : products && products.length === 0 && !error ? (
                      <div className="text-center justify-center flex items-center mb-5 md:mb-9">
                        <Image
                          src={"/Coming Soon - AFOMA Marketplace.png"}
                          alt="Coming Soon"
                          height={466}
                          width={976}
                          loading="lazy"
                        />
                      </div>
                    ) : null}
                  </>
                  <div>
                    <div className="flex justify-center">
                      {products && visibleProducts < products.length && (
                        <button className="buttonprimary" onClick={loadMore}>
                          Load more
                        </button>
                      )}
                    </div>
                  </div>
                </div>{" "}
              </div>
            </div>
          </section>
          <section>
            <Footer />
          </section>
        </>
      )}
      {isImageModalOpen &&
      product &&
      product.images &&
      product.images.length ? (
        <ModalImageViewer
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          images={product.images}
          selectedIndex={selectedImageIndex}
        />
      ) : (
        ""
      )}
      {isViewProductDetailModalOpen &&
      product &&
      product.images &&
      product.images.length ? (
        <ProductViewModel
          isOpen={isViewProductDetailModalOpen}
          onClose={() => setIsViewProductDetailModalOpen(false)}
          media={product.images}
          initialIndex={selectedImageIndex}
        />
      ) : (
        ""
      )}
    </>
  );
}

// ==============================
// Axios Client (singleton)
// ==============================
const apiClient = axios.create({
  timeout: 3000,
  headers: {
    "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
    Connection: "keep-alive",
  },
});

// ==============================
// Environment
// ==============================
const isStaging =
  process.env.NEXT_PUBLIC_BASE_URL ===
  "https://development.afomamarketplace.com";

// ==============================
// Static Lookups
// ==============================
const validQueries = new Set(["body-oils", "hair-oils"]);

const pageDataMap = {
  "body-oils": {
    title: "Natural Body Oils for Dry and Sensitive Skin | AFOMA",
    metaTitle: "Natural Body Oils for Dry and Sensitive Skin | AFOMA",
    metaDescription:
      "Browse a collection of natural body oils formulated for dry skin, sensitive skin, and more.",
  },
  "hair-oils": {
    title: "Hair Oils | Natural Oils for All Hair Types | AFOMA",
    metaTitle: "Hair Oils | Natural Oils for All Hair Types | AFOMA",
    metaDescription:
      "Discover a variety of natural hair oils at AFOMA.",
  },
  default: {
    title: "",
    metaTitle: "",
    metaDescription: "",
  },
};

// ==============================
// In-memory Cache (FULL PAGE)
// ==============================
const productCache = new Map();
const CACHE_TTL = 10_000; // 10 seconds

// ==============================
// getServerSideProps
// ==============================
export async function getServerSideProps({ query, res }) {
  // ---- Normalize query ONCE
  const categorySlug = query?.categoryId?.toLowerCase();
  const subCategorySlug = query?.subCategoryId?.toLowerCase();
  const productId = query?.productId || [];
  const slug = productId.at(-1)?.toLowerCase();

  // ---- Basic URL validation
  if (!slug || productId.length > 2) {
    return { notFound: true };
  }

  // ---- Map IDs
  const categoryMap = isStaging ? categoryMapIdStg : categoryMapIdPrd;
  const subCategoryMap = isStaging ? subCategoryMapIdStg : subCategoryMapIdPrd;

  const categoryId = categoryMap[categorySlug];
  const subCategoryId = subCategoryMap[subCategorySlug];
  const childCategoryId = subCategoryMap[slug];

  if (!categoryId || !subCategoryId) {
    return { notFound: true };
  }

  // ---- Static category page (no product)
  if (childCategoryId) {
    return {
      props: {
        product: null,
        pageData: validQueries.has(slug)
          ? pageDataMap[slug]
          : null,
      },
    };
  }

  // ---- Serve from cache
  if (productCache.has(slug)) {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
    );
    return { props: productCache.get(slug) };
  }

  try {
    // ==========================
    // Fetch product
    // ==========================
    const { data: product } = await apiClient.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/slug/${slug}`
    );

    // ---- Strong URL validation
    if (
      product?.Category?.slug !== categorySlug ||
      product?.SubCategory?.slug !== subCategorySlug ||
      (product?.childCategory &&
        product?.childCategory?.slug !== productId[0]?.toLowerCase())
    ) {
      return { notFound: true };
    }

    // ==========================
    // Parallel Fetches
    // ==========================
    const [
      sellerRes,
      reviewsRes,
      allReviewsRes,
      bestSellingRes,
      categoryProductsRes,
      sellerProductsRes,
    ] = await Promise.allSettled([
      apiClient.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sellers/store/${product.seller?.storeSlug}`),
      apiClient.get(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews/average-review/${product._id}`),
      apiClient.get(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews/single/${product._id}`),
      apiClient.get(`${process.env.NEXT_PUBLIC_BASE_URL}/products/bestSelling/Product`),
      apiClient.get(`${process.env.NEXT_PUBLIC_BASE_URL}/products/category/${product.Category?.name}`),
      apiClient.get(`${process.env.NEXT_PUBLIC_BASE_URL}/products/by/${product.seller?._id}`),
    ]);

    // ==========================
    // Process responses
    // ==========================
    const seller =
      sellerRes.status === "fulfilled" &&
      sellerRes.value?.data?.userRole === "seller"
        ? sellerRes.value.data
        : null;

    const reviews =
      reviewsRes.status === "fulfilled"
        ? reviewsRes.value?.data
        : null;

    const allReviews =
      allReviewsRes.status === "fulfilled"
        ? allReviewsRes.value.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        : [];

    const bestSellingCategory =
      bestSellingRes.status === "fulfilled"
        ? (Array.isArray(bestSellingRes.value.data)
            ? bestSellingRes.value.data
            : bestSellingRes.value.data?.products || []
          ).map((i) => ({
            Category: i?.productDetails?.Category,
            SubCategory: i?.productDetails?.SubCategory,
          }))
        : [];

    const categoryProducts =
      categoryProductsRes.status === "fulfilled"
        ? categoryProductsRes.value.data
            .filter(
              (p) =>
                p._id !== product._id &&
                p.seller?._id !== product.seller?._id
            )
            .slice(0, 6)
        : [];

    let productCount = 0;
    let allProducts = [];

    if (sellerProductsRes.status === "fulfilled") {
      const approved = sellerProductsRes.value.data.filter(
        (p) => p.productStatus === "Approved" && p.status === 1
      );
      productCount = approved.length;
      allProducts = approved;
    }

    // ==========================
    // Final props object
    // ==========================
    const props = {
      product,
      pageData: null,
      seller,
      reviews,
      allReviews,
      bestSellingCategory,
      categoryProducts,
      productCount,
      allProducts,
    };

    // ---- Cache full payload
    productCache.set(slug, props);
    setTimeout(() => productCache.delete(slug), CACHE_TTL);

    // ---- CDN cache hint
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
    );

    return { props };
  } catch (error) {
    console.error("Product SSR error:", error);
    return { notFound: true };
  }
}

export default ProductDetail;
