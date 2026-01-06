import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";

import { getAllPostsForNewData } from "@/lib/api";
import { calculateSurcharge } from "@/utils/pricingUtils";

// ✅ tree-shake friendly date-fns imports
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import axios from "axios";

// ✅ Lazy-load big UI blocks
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

const CategoryCard = dynamic(() => import("@/components/CategoryCard"));
const BestProductsCard = dynamic(() => import("@/components/BestProductsCard"));
const DiscountedItemCard = dynamic(() => import("@/components/DiscountedItemCard"));
const ReviewCard = dynamic(() => import("@/components/ReviewCard"));
const FavShopCard = dynamic(() => import("@/components/ShopCard"));
const Faqs = dynamic(() => import("@/components/Faq"));


// Fetcher function for SWR
const fetcher = (url) => axios.create({
  headers: {
    "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
  },
}).get(url).then(res => res.data);

// Skeleton component for loading states
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="bg-gray-300 h-48 w-full rounded-md mb-4"></div>
    <div className="bg-gray-300 h-4 w-3/4 rounded mb-2"></div>
    <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
  </div>
);

export default function Index({ allPosts, categoryPosts, cart, addToCart }) {
  const [images, setImages] = useState([]);
  const [mobileImages, setMobileImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageMbIndex, setCurrentImagMbeIndex] = useState(0);
  const [banner, setBanner] = useState(null);

  const morePosts = allPosts && allPosts.edges ? allPosts.edges : [];
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState();
  const [showFailureMessage, setShowFailureMessage] = useState();
  const router = useRouter();

  useEffect(() => {
    if (images.length === 0 || mobileImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setCurrentImagMbeIndex(
        (prevIndex) => (prevIndex + 1) % mobileImages.length
      );
    }, 5000);
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [images.length, mobileImages.length]); // Only depend on length, not the arrays themselves

  const [favShops, setFavShops] = useState([]);
  const [userCurrency, setUserCurrency] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const [sellerInfo, setSellerInfo] = useState(null);
  const [showProfileIncompleteModal, setShowProfileIncompleteModal] = useState(false);

  // SWR hooks for data fetching
  const { data: bestSellingData, error: bestSellingError } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/products/best/Product`, fetcher);
  const { data: discountedData, error: discountedError } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/products/discounted/Product`, fetcher);
  const { data: newArrivalData, error: newArrivalError } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/products/newArrival/Product`, fetcher);
  const { data: reviewsData, error: reviewsError } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews/best/review`, fetcher);
  const { data: categoryData, error: categoryError } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/products/bestSelling/Product`, fetcher);

  // Computed states using useMemo
  const bestSellingProducts = useMemo(() => {
    if (!bestSellingData) return [];
    const responseData = Array.isArray(bestSellingData) ? bestSellingData : bestSellingData.products;
    const bestSelling = [];
    responseData.forEach((data, index) => {
      if (index < 4) bestSelling.push(data.productDetails);
    });
    return calculateSurcharge(bestSelling);
  }, [bestSellingData]);

  const mostDiscountedProducts = useMemo(() => {
    if (!discountedData) return [];
    const responseData = Array.isArray(discountedData) ? discountedData : discountedData.products;
    return calculateSurcharge(responseData);
  }, [discountedData]);

  const newArrival = useMemo(() => {
    if (!newArrivalData) return [];
    const responseData = Array.isArray(newArrivalData) ? newArrivalData : newArrivalData.products;
    return calculateSurcharge(responseData, userInfo);
  }, [newArrivalData, userInfo]);

  const reviews = reviewsData || [];

  const bestSellingCategory = useMemo(() => {
    if (!categoryData) return [];
    const responseData = Array.isArray(categoryData) ? categoryData : categoryData.products;
    return responseData.map((item) => ({
      Category: item?.productDetails?.Category,
      SubCategory: item?.productDetails?.SubCategory,
    }));
  }, [categoryData]);

  const getSellerInfo = useCallback(async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const id = userData?.sellerId;
      if (!id) return;
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${id}`,
        {
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        }
      );
      setSellerInfo(response.data);

      // Check profileSetup
      const profileSetup = response.data?.profileSetup;
      const isComplete = profileSetup &&
        profileSetup.basicInfo === true &&
        profileSetup.sellerDetails === true &&
        profileSetup.sellerPolicies === true &&
        profileSetup.shippingConfig === true &&
        profileSetup.paymentInfo === true;
      
      setShowProfileIncompleteModal(!isComplete);
    } catch (error) {
      console.error("Error fetching seller info:", error);
      setSellerInfo(null);
    }
  }, []);




  const getSettingsAndDetails = useCallback(async () => {
    setLoading(true);
    try {
      const axiosInstance = axios.create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      });

      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/settings/all/types`
      );

      if (response?.data?.settings?.length) {
        const shopIds = [];
        
        for (let setting of response.data.settings) {
          let content = {};
          try {
            content = typeof setting.content === 'string' 
              ? JSON.parse(setting.content) 
              : setting.content;
          } catch (error) {
            content = setting.content;
          }

          if (setting?.type === "upload-single-image" && content?.length) {
            setBanner(content[0]);
          } else if (setting?.type === "upload-images" && content?.length) {
            setImages(content.map((item) => item.imageUrl));
            setMobileImages(content.map((item) => item.imageUrl));
          } else if (setting?.type === "shops" && content?.length) {
            shopIds.push(...content.map((seller) => seller?.id));
          }
        }

        // Fetch shops in a single batch request
        if (shopIds.length > 0) {
          const shopsResponse = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/sellerByIds`,
            { ids: shopIds }
          );
          if (shopsResponse.data) {
            setFavShops(shopsResponse.data);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    let userCurrency =
      userInfo?.currency && userInfo.currencyRate ? userInfo?.currency : false;
    setUserCurrency(userCurrency);
    setUserCountry(userInfo?.country);
    getSellerInfo();
    getSettingsAndDetails();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/subscription`,
        {
          body: JSON.stringify({
            email: email,
          }),
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
          method: "POST",
        }
      );

      const { error } = await res.json();

      if (error) {
        setShowSuccessMessage(false);
        setShowFailureMessage(true);
        setEmail("");
      } else if (res.status === 200) {
        setShowSuccessMessage(true);
        setShowFailureMessage(false);
        setEmail("");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setShowSuccessMessage(false);
      setShowFailureMessage(true);
    } finally {
      setLoading(false);
    }
  }, [email]);

  const currentUrl = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`;
  const jsonLd1 = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AFOMA Marketplace - A Decentralized Marketplace for Artists and Artisans",
    url: "https://afomamarketplace.com",
    headline: "Discover Unique Creations on AFOMA Marketplace",
    description:
      "AFOMA Marketplace connects global artists and artisans with a platform to showcase their handmade crafts. Shop fashion, home decor, personal care products, toys, and more.",
    mainEntity: {
      "@type": "OfferCatalog",
      name: "AFOMA Marketplace Product Categories",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Fashion",
          description:
            "Upgrade your style with exquisite handmade fashion products - Shop now and elevate your wardrobe!",
          url: "https://afomamarketplace.com/fashion",
        },
        {
          "@type": "Offer",
          name: "Jewelry & Accessories",
          description:
            "Adorn yourself with elegance - Discover and own your exquisite handmade jewelry and accessories today!",
          url: "https://afomamarketplace.com/jewelry-accessories",
        },
        {
          "@type": "Offer",
          name: "Home & Living",
          description:
            "Curate your dream home with handcrafted comfort and style. Explore our Home and Living collection of artisanal treasures just for you!",
          url: "https://afomamarketplace.com/home-living",
        },
        {
          "@type": "Offer",
          name: "Toys & Games",
          description:
            "Welcome to our captivating world of Toys, where you'll find an enchanting array of handmade and artisanal creations, sparking joy and imagination.",
          url: "https://afomamarketplace.com/toys-games",
        },
        {
          "@type": "Offer",
          name: "Art & Collectibles",
          description:
            "Explore a realm of artistic wonders and cherished treasures curated to captivate collectors and art enthusiasts.",
          url: "https://afomamarketplace.com/art-collectibles",
        },
        {
          "@type": "Offer",
          name: "Stationery & Paper Goods",
          description:
            "Explore the Artisanal Tapestry of Stationery and Paper Goods - Where Every Stroke Echoes Creativity.",
          url: "https://afomamarketplace.com/stationery-paper-goods",
        },
        {
          "@type": "Offer",
          name: "Personal Care & Bath Products",
          description:
            "Immerse yourself in our curated collection of handcrafted Personal Care and Bath Products, designed to rejuvenate and elevate your self-care routine with artisanal excellence.",
          url: "https://afomamarketplace.com/personal-care",
        },
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "AFOMA Marketplace",
      logo: {
        "@type": "ImageObject",
        url: "https://afomamarketplace.com/_next/image?url=%2Fassets%2Fhomepage%2FAFOMA_Marketplace_logo%20-%20login-register.png&w=256&q=75",
      },
    },
    author: {
      "@type": "Organization",
      name: "AFOMA Marketplace Team",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://afomamarketplace.com/",
        },
      ],
    },
  };
  const jsonLd2 = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How can I become a seller on the artisanal marketplace?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can sign up and register as a seller to showcase your handmade crafts and products.",
        },
      },
      {
        "@type": "Question",
        name: "What type of products can I sell on the marketplace?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can sell handmade items, fashion, home decor, stationery, personal care products, and more.",
        },
      },
      {
        "@type": "Question",
        name: "How are transactions processed on the marketplace?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Transactions are processed securely through our platform with multiple payment options available.",
        },
      },
      {
        "@type": "Question",
        name: "What should I consider about shipping costs for international purchases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Shipping costs depend on the destination, and sellers are encouraged to provide clear shipping policies.",
        },
      },
    ],
  };
  const jsonLd3 = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AFOMA Marketplace",
    url: "https://afomamarketplace.com",
    logo: "https://afomamarketplace.com/_next/image?url=%2Fassets%2Fhomepage%2FAFOMA_Marketplace_logo%20-%20login-register.png&w=256&q=75",
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@afoma.io",
      contactType: "Customer Service",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://facebook.com/afomamarketplace",
      "https://twitter.com/afomamarketplace",
      "https://instagram.com/afomamarketplace",
    ],
  };

  const scrollContainerRef = useRef(null);

  // Memoized scroll functions to prevent unnecessary re-renders
  const scroll = useCallback((direction) => {
    if (scrollContainerRef.current) {
      // Get the width of a single card (adjust as needed if dynamic width)
      const cardWidth = scrollContainerRef.current.children[0]?.offsetWidth + 6 || 300; // 6px for the space-x-6 margin

      // Calculate the scroll amount (one card at a time)
      const scrollAmount = direction === "right" ? cardWidth : -cardWidth;

      // Smooth scroll to the new position
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth", // This ensures smooth scrolling
      });
    }
  }, []);

  const scrollReviewContainerRef = useRef(null);

  // Memoized scroll function for reviews
  const scrollReview = useCallback((direction) => {
    if (scrollReviewContainerRef.current) {
      // Get the width of a single card (adjust as needed if dynamic width)
      const cardWidth =
        scrollReviewContainerRef.current.children[0]?.offsetWidth + 6 || 300; // 6px for the space-x-6 margin

      // Calculate the scroll amount (one card at a time)
      const scrollAmount = direction === "right" ? cardWidth : -cardWidth;

      // Smooth scroll to the new position
      scrollReviewContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth", // This ensures smooth scrolling
      });
    }
  }, []);

  const scrollNewArrivalContainerRef = useRef(null);

  // Memoized scroll function for new arrivals
  const scrollNewArrival = useCallback((direction) => {
    if (scrollNewArrivalContainerRef.current) {
      // Get the width of a single card (adjust as needed if dynamic width)
      const cardWidth =
        scrollNewArrivalContainerRef.current.children[0]?.offsetWidth + 6 || 300; // 6px for the space-x-6 margin

      // Calculate the scroll amount (one card at a time)
      const scrollAmount = direction === "right" ? cardWidth : -cardWidth;

      // Smooth scroll to the new position
      scrollNewArrivalContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth", // This ensures smooth scrolling
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>
          Shop Unique Handmade Goods & Support Artisans | AFOMA Marketplace
        </title>
        <meta
          property="title"
          content="AFOMA Marketplace – Handmade Creations, Delivered Globally"
        />
        <meta
          property="description"
          content="Discover one-of-a-kind handmade products from talented artisans worldwide on AFOMA Marketplace. Shop jewelry, home décor, fashion, and gifts — while supporting global creativity and small businesses. Join our community today!"
        />
        {/*  */}
        <meta
          property="og:title"
          content="Shop Unique Handmade Goods & Support Artisans | AFOMA Marketplace"
        />
        <meta
          property="og:description"
          content="Discover one-of-a-kind handmade products from talented artisans worldwide on AFOMA Marketplace. Shop jewelry, home décor, fashion, and gifts — while supporting global creativity and small businesses. Join our community today!"
        />
        <link
          rel="canonical"
          href="https://afomamarketplace.com/"
          data-next-head=""
        />
        <meta property="og:image" content="/home-banner-thumbnail.jpg" />
        <meta property="og:image:width" content="843" />
        <meta property="og:image:height" content="529" />

        {/*  */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="A Decentralized Marketplace for Artists and Artisans"
        />
        <meta
          name="twitter:description"
          content="Are you an artist or artisan seeking an alternative and affordable handicraft marketplace to sell your crafts to the global market? Then join our waitlist to gain access to exclusive promotions and be first in line for exciting deals in our upcoming launch!"
        />
        <meta name="twitter:image" content="/home-banner-thumbnail.jpg" />
        <meta property="twitter:image:width" content="843" />
        <meta property="twitter:image:height" content="529" />

        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd1),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd2),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd3),
          }}
        />
      </Head>
      <section>
        <Header cart={cart} addToCart={addToCart}/>
      </section>
      <section className="overflow-hidden">
        <div
          onClick={() => {
            if (images[currentImageIndex]?.includes("ksu-shade-art.png")) {
              window.open(
                "https://afomamarketplace.com/shop/ksu-shade-art",
                "_blank"
              );
            } else {
              document
                .getElementById("category-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="cursor-pointer"
        >
          <Image
            key={`${images[currentImageIndex]}-${currentImageIndex}-desk`}
            src={images[currentImageIndex] || '/placeholder.jpg'}
            width={1920}
            height={700}
            className="w-full lg:min-h-[300px] lg:max-h-[700px] md:block hidden transition-opacity ease-in-out animate-fade object-cover"
            alt="Hero Banner"
            priority={currentImageIndex === 0}
            loading={currentImageIndex === 0 ? "eager" : "lazy"}
            sizes="100vw"
          />
          <Image
            key={`${mobileImages[currentImageMbIndex]}-${currentImageMbIndex}-mob`}
            src={mobileImages[currentImageMbIndex] || '/placeholder.jpg'}
            width={768}
            height={700}
            className="w-full lg:min-h-[300px] lg:max-h-[700px] md:hidden flex transition-opacity ease-in-out animate-fade object-cover"
            alt="Hero Banner"
            priority={currentImageMbIndex === 0}
            loading={currentImageMbIndex === 0 ? "eager" : "lazy"}
            sizes="100vw"
          />
        </div>
        <div className="max-w-screen-xl mx-auto px-4 py-8 md:pt-10 md:pb-12">
          <div className="max-w-[920px] mx-auto ">
            <h1
              className={`text-2xl md:text-3xl xl:text-4xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-center mb-5 noto-font`}
            >
              Shop Small, Empower Big
            </h1>
            <span className="sr-only">
              Handmade Goods by Global Artisans
            </span>
            <div className="md:px-[70px] mb-6 md:mb-12">
              <h2 className="font-medium text-center text-blue-950">
                  Buy Authentic Handmade Products That Empower Artisans Around The World.
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4  justify-start gap-4 ">
            <div className="flex gap-3">
              <div className="w-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                >
                  <defs>
                    <clipPath id="clipPath">
                      <path
                        id="path2454"
                        d="M0-682.665H36v36H0Z"
                        transform="translate(0 682.665)"
                        fill="#1F628E"
                      />
                    </clipPath>
                  </defs>
                  <g id="g2448" transform="translate(0 682.665)">
                    <g id="g2450" transform="translate(0 -682.665)">
                      <g id="g2452" clipPath="url(#clipPath)">
                        <g id="g2458" transform="translate(4.797 2.27)">
                          <path
                            id="path2460"
                            d="M0-300.381a16.6,16.6,0,0,1,4.906-11.826,16.646,16.646,0,0,1,11.838-4.9"
                            transform="translate(0 317.103)"
                            fill="none"
                            stroke="#1F628E"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            strokeDasharray="0 30"
                          />
                        </g>
                        <g id="g2462" transform="translate(7.609 5.083)">
                          <path
                            id="path2464"
                            d="M-3.723-293.044a13.977,13.977,0,0,1-.207-2.4A13.921,13.921,0,0,1,10-309.358a14.094,14.094,0,0,1,1.691.1"
                            transform="translate(3.931 309.358)"
                            fill="none"
                            stroke="#1F628E"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </g>
                        <g id="g2466" transform="translate(14.656 31.088)">
                          <path
                            id="path2468"
                            d="M-245.417-1.08A13.892,13.892,0,0,1-250.045.51a14.066,14.066,0,0,1-5.79-.315,13.868,13.868,0,0,1-3.244-1.335"
                            transform="translate(259.079 1.14)"
                            fill="none"
                            stroke="#1F628E"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </g>
                        <g id="g2470" transform="translate(29.538 7.601)">
                          <path
                            id="path2472"
                            d="M0,0A13.874,13.874,0,0,1,5.9,10.188,13.736,13.736,0,0,1,1.541,21.53"
                            fill="none"
                            stroke="#1F628E"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </g>
                        <g id="g2474" transform="translate(19.309 21.717)">
                          <path
                            id="path2476"
                            d="M-259.289-71.662c-1.975-.438-3.965-.806-5.955-1.174a3.41,3.41,0,0,1-1.314-.435,2.554,2.554,0,0,1-.947-1.55c-.09-.367-.251-.841-.629-.83a.743.743,0,0,0-.494.314,7.136,7.136,0,0,0-1.683,3.714c-.16,1.19-.062,2.534-.863,3.429a12.31,12.31,0,0,1-1.263,1,4.012,4.012,0,0,0-1.287,2.549"
                            transform="translate(273.723 75.651)"
                            fill="none"
                            stroke="#1F628E"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </g>
                        <g id="g2478" transform="translate(19.112 5.262)">
                          <path
                            id="path2480"
                            d="M-3.464,0a3.38,3.38,0,0,0-.141.483A2.165,2.165,0,0,0-2.442,2.992a4.9,4.9,0,0,1,1.013.3c.852.522.428,1.849.779,2.784C-.372,6.816.4,7.276.7,8a6.724,6.724,0,0,1,.069,2.568c.012.865.638,1.9,1.482,1.7.79-.185.951-1.216,1.421-1.877.649-.915,1.9-1.1,3.01-1.292A29.145,29.145,0,0,0,11.372,7.79"
                            transform="translate(3.657)"
                            fill="none"
                            stroke="#1F628E"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </g>
                        <g id="g2482" transform="translate(9.283 10.718)">
                          <path
                            id="path2484"
                            d="M-4.651-190.986a8.616,8.616,0,0,1-.237-.885c-.3-1.772,2.435-3.121,2.526-5.1.069-1.493-1.017-2.777-1.4-4.221-.037-.14-.066-.283-.089-.426"
                            transform="translate(4.91 201.618)"
                            fill="none"
                            stroke="#1F628E"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </g>
                        <g id="g2486" transform="translate(23.223 0.527)">
                          <path
                            id="path2488"
                            d="M-122.572-61.189c0,2.547-1.945,5.764-2.9,7.188a.608.608,0,0,1-1.016-.008c-.948-1.461-2.91-4.775-2.91-7.18a3.409,3.409,0,0,1,3.412-3.406A3.409,3.409,0,0,1-122.572-61.189Z"
                            transform="translate(129.396 64.596)"
                            fill="none"
                            stroke="#1F628E"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </g>
                        <g id="g2490" transform="translate(25.4 2.776)">
                          <path
                            id="path2492"
                            d="M-44.367-22.148A1.234,1.234,0,0,1-45.6-20.915a1.234,1.234,0,0,1-1.235-1.233A1.234,1.234,0,0,1-45.6-23.381,1.234,1.234,0,0,1-44.367-22.148Z"
                            transform="translate(46.837 23.381)"
                            fill="none"
                            stroke="#1F628E"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </g>
                        <g id="g2494" transform="translate(0.527 21.438)">
                          <path
                            id="path2496"
                            d="M0-89.264v8.439a.627.627,0,0,0,.627.627h12.8a.627.627,0,0,0,.627-.627V-93.606a.627.627,0,0,0-.627-.627H.627A.627.627,0,0,0,0-93.606V-92"
                            transform="translate(0 94.233)"
                            fill="none"
                            stroke="#1F628E"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </g>
                        <path
                          id="path2498"
                          d="M103.582-270.3H98.9v-5.842h4.68Z"
                          transform="translate(-93.687 297.581)"
                          fill="none"
                          stroke="#1F628E"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-950 mb-1.5 ">
                  Global Reach
                </p>
                <p className="text-sm font-light text-slate-600">
                  Global delivery available
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38.75"
                  height="31"
                  viewBox="0 0 38.75 31"
                >
                  <g
                    id="Layer_2"
                    data-name="Layer 2"
                    transform="translate(-1.5 -3.5)"
                  >
                    <path
                      id="Path_1556"
                      data-name="Path 1556"
                      d="M39.763,6.656l-7.75-3.1a.775.775,0,0,0-.577,0l-7.75,3.1a.775.775,0,0,0-.487.719v8.01A8.57,8.57,0,0,0,27.34,22.7l3.987,2.392a.775.775,0,0,0,.8,0L35.6,23v8.68a1.273,1.273,0,0,1-1.271,1.271H4.321A1.273,1.273,0,0,1,3.05,31.684V14.35H20.875a.775.775,0,0,0,0-1.55H3.05V10.971A1.273,1.273,0,0,1,4.321,9.7H20.875a.775.775,0,1,0,0-1.55H4.321A2.823,2.823,0,0,0,1.5,10.971V31.679A2.823,2.823,0,0,0,4.321,34.5H34.329a2.823,2.823,0,0,0,2.821-2.821V21.945a8.57,8.57,0,0,0,3.1-6.563V7.375a.775.775,0,0,0-.487-.719ZM38.7,15.385a7.009,7.009,0,0,1-3.388,5.983l-3.587,2.153-3.587-2.153a7.009,7.009,0,0,1-3.388-5.983V7.9l6.975-2.79L38.7,7.9Z"
                      fill="#1F628E"
                    />
                    <path
                      id="Path_1557"
                      data-name="Path 1557"
                      d="M19.824,10.546a.775.775,0,1,0-1.1,1.1l2.068,2.066a.775.775,0,0,0,1.1,0l4.134-4.134a.775.775,0,1,0-1.1-1.1l-3.585,3.587Z"
                      transform="translate(9.35 2.613)"
                      fill="#1F628E"
                    />
                    <path
                      id="Path_1558"
                      data-name="Path 1558"
                      d="M5.275,19.5a.775.775,0,1,0,0,1.55h6.2a.775.775,0,0,0,0-1.55Z"
                      transform="translate(1.65 8.8)"
                      fill="#1F628E"
                    />
                  </g>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-950 mb-1.5 ">
                  Secure Payments
                </p>
                <p className="text-sm font-light text-slate-600">
                  Shop with peace of mind
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30.112"
                  height="33.516"
                  viewBox="0 0 30.112 33.516"
                >
                  <g id="support" transform="translate(-26)">
                    <g
                      id="Group_26193"
                      data-name="Group 26193"
                      transform="translate(26)"
                    >
                      <g id="Group_26192" data-name="Group 26192">
                        <path
                          id="Path_1560"
                          data-name="Path 1560"
                          d="M49.868,23.806l-3.111-1.037L45.64,20.535a7.17,7.17,0,0,0,1.941-3.793l.139-.835h1.191a1.966,1.966,0,0,0,1.964-1.964V9.819a9.819,9.819,0,1,0-19.638,0v4.124a1.967,1.967,0,0,0,1.309,1.851v.767a1.966,1.966,0,0,0,1.964,1.964h.575a7.1,7.1,0,0,0,1.1,1.7c.093.107.189.21.288.31l-1.116,2.233-3.111,1.037A9.649,9.649,0,0,0,26,32.861a.655.655,0,0,0,.655.655h28.8a.655.655,0,0,0,.655-.655A9.649,9.649,0,0,0,49.868,23.806Zm-.3-9.862a.655.655,0,0,1-.655.655h-1c.166-1.289.277-2.661.322-4.011,0-.038,0-.075,0-.113h1.328ZM33.2,14.6a.655.655,0,0,1-.655-.655V10.474h1.329q0,.1.007.206v.007h0c.046,1.314.155,2.65.318,3.91h-1Zm1.309,2.618a.655.655,0,0,1-.655-.655v-.655h.537l.139.835c.027.159.059.317.1.474Zm-.653-8.052H32.571a8.51,8.51,0,0,1,16.97,0H48.256a6.63,6.63,0,0,0-6.614-6.546H40.47A6.63,6.63,0,0,0,33.856,9.164ZM40.47,3.928h1.172a5.323,5.323,0,0,1,5.306,5.329c0,.206,0,.385-.005.549,0,0,0,0,0,.006l-.819-.117A10.519,10.519,0,0,1,40.21,6.738a.655.655,0,0,0-.463-.192A5.922,5.922,0,0,0,35.193,8.7,5.321,5.321,0,0,1,40.47,3.928ZM35.985,17.216a37.416,37.416,0,0,1-.786-6.353l.881-1.175a4.608,4.608,0,0,1,3.407-1.826,11.84,11.84,0,0,0,6.45,3.128l.964.138c-.064,1.367-.2,2.739-.385,4h0c-.06.406-.107.667-.228,1.4A5.56,5.56,0,0,1,42.343,21a5.15,5.15,0,0,1-5.782-2.473H37.9a1.967,1.967,0,0,0,1.851,1.309h1.309a1.964,1.964,0,1,0,0-3.928H39.747a1.965,1.965,0,0,0-1.852,1.309Zm3.706,5.107a6.566,6.566,0,0,0,2.435.055L40.97,23.6Zm.378,2.23-2.076,2.2a24.942,24.942,0,0,1-1.466-3.4l.78-1.559Zm4.624-2.984.891,1.781a24.934,24.934,0,0,1-1.466,3.4L41.9,24.527Zm-5.6-3.7a.655.655,0,0,1,.655-.655h1.309a.655.655,0,0,1,0,1.309H39.747A.655.655,0,0,1,39.092,17.871ZM27.335,32.207a8.273,8.273,0,0,1,5.322-7.159l2.755-.918a26.24,26.24,0,0,0,1.863,4.042l0,.007h0a26.248,26.248,0,0,0,1.792,2.736l.805,1.293Zm13.721-.584L40.168,30.2q-.015-.024-.032-.047a24.959,24.959,0,0,1-1.475-2.2L41,25.479l2.46,2.46a24.931,24.931,0,0,1-1.48,2.212C41.944,30.194,41.989,30.126,41.056,31.623Zm1.179.584.805-1.293a26.238,26.238,0,0,0,1.8-2.758l.01-.017v0A26.22,26.22,0,0,0,46.7,24.129l2.755.918a8.273,8.273,0,0,1,5.322,7.159Z"
                          transform="translate(-26)"
                          fill="#1F628E"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-950 mb-1.5 ">
                  Customer Support
                </p>
                <p className="text-sm font-light text-slate-600">
                  Always here to help
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33.514"
                  height="33.515"
                  viewBox="0 0 33.514 33.515"
                >
                  <path
                    id="wallet"
                    d="M32.4,18.535V11.729a1.65,1.65,0,0,0-.559-1.236V6.143a1.676,1.676,0,0,0-1.676-1.676H26.377a7.2,7.2,0,0,0-8.746-2.113A7.251,7.251,0,0,0,5.586,4.468H3.351A3.363,3.363,0,0,0,0,7.819V30.162a3.355,3.355,0,0,0,3.351,3.351h27.37A1.676,1.676,0,0,0,32.4,31.837V25.032a1.676,1.676,0,0,0,1.117-1.573V20.108A1.676,1.676,0,0,0,32.4,18.535ZM30.721,6.143v3.91H27.833a7.3,7.3,0,0,0,.1-1.117,7.215,7.215,0,0,0-.819-3.351h3.054A.559.559,0,0,1,30.721,6.143Zm-5.062-.79a6,6,0,0,1,1.04,4.7H14.635a6.138,6.138,0,0,1,11.025-4.7ZM12.289,1.116a6.127,6.127,0,0,1,4.337,1.79A7.163,7.163,0,0,0,13.5,10.053H6.825a6.129,6.129,0,0,1,5.463-8.937ZM1.117,7.819A2.243,2.243,0,0,1,3.351,5.585H5.23a7.2,7.2,0,0,0,.352,4.469H3.469A2.322,2.322,0,0,1,1.123,8.025a1.718,1.718,0,0,1-.006-.2ZM30.721,32.4H3.351a2.234,2.234,0,0,1-2.234-2.234V25.693H4.8a1.124,1.124,0,0,1,.861.4l.908,1.092a2.269,2.269,0,1,0,.861-.712l-.91-1.094A2.234,2.234,0,0,0,4.8,24.576H1.117V22.342h9.575a2.234,2.234,0,1,0,0-1.117H1.117V18.99H4.8a2.239,2.239,0,0,0,1.72-.8l.911-1.095a2.207,2.207,0,0,0,.95.223,2.249,2.249,0,1,0-1.811-.936l-.907,1.09a1.126,1.126,0,0,1-.863.4H1.117v-7.6a3.542,3.542,0,0,0,2.352.894H30.721a.559.559,0,0,1,.559.559v6.7H28.487a3.351,3.351,0,0,0,0,6.7H31.28v6.7A.559.559,0,0,1,30.721,32.4ZM8.379,27.369a1.117,1.117,0,1,1-1.117,1.117A1.117,1.117,0,0,1,8.379,27.369Zm3.351-5.586A1.117,1.117,0,1,1,12.847,22.9,1.117,1.117,0,0,1,11.73,21.783Zm-4.469-6.7A1.117,1.117,0,1,1,8.379,16.2,1.117,1.117,0,0,1,7.261,15.08ZM32.4,23.459a.559.559,0,0,1-.559.559H28.487a2.234,2.234,0,1,1,0-4.469h3.351a.559.559,0,0,1,.559.559Z"
                    transform="translate(0 0.002)"
                    fill="#1F628E"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-950 mb-1.5 ">
                  Rewards+
                </p>
                <p className="text-sm font-light text-slate-600">
                  Earn rewards,reap benefits
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="category-section" className="bg-white overflow-hidden">
        <div className="container mx-auto py-2">
          <h2
            className={`text-2xl md:text-3xl xl:text-4xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-left mb-0 px-6 pt-10 noto-font`}
          >
            Shop Our Most Popular Categories
          </h2>
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
                Array.from({length: 4}, (_, i) => <SkeletonCard key={i} />)
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white overflow-hidden">
        <div className="container mx-auto p-8">
          <h2
            className={`text-2xl md:text-3xl xl:text-4xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-left mb-0 noto-font`}
          >
            New Arrivals
          </h2>

          <div className="relative">
            <button
              onClick={() => scrollNewArrival("left")}
              className="absolute top-1/2 left-[-28px] lg:left-[-35px] transform -translate-y-1/2 bg-white text-black w-8 h-8 rounded-full border border-black shadow-md z-10 flex items-center justify-center"
            >
              ‹
            </button>

            <div
              ref={scrollNewArrivalContainerRef}
              className="overflow-x-auto py-8 px-3 scrollbar-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="flex space-x-6 justify-around">
                {newArrival?.length ? (
                  newArrival.map((product, index) => (
                    <DiscountedItemCard
                      key={index}
                      product={product}
                      userCurrency={userCurrency}
                      userCountry={userCountry}
                    />
                  ))
                ) : (
                  Array.from({length: 6}, (_, i) => <SkeletonCard key={i} />)
                )}
              </div>
            </div>

            <button
              onClick={() => scrollNewArrival("right")}
              className="absolute top-1/2 right-[-35px] lg:right-[-40px] transform -translate-y-1/2 bg-white text-black w-8 h-8 rounded-full border border-black shadow-md z-10 flex items-center justify-center"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white overflow-hidden">
        <div className="container mx-auto py-5">
          <h2
            className={`text-2xl md:text-3xl xl:text-4xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-left mb-0 px-8 noto-font`}
          >
            Best Selling Products
          </h2>
          <div className="overflow-x-auto p-10">
            <div className="flex justify-around">
              {bestSellingProducts?.length ? (
                bestSellingProducts.map((product, index) => (
                  <BestProductsCard
                    key={index}
                    data={product}
                    userCurrency={userCurrency}
                    userCountry={userCountry}
                  />
                ))
              ) : (
                Array.from({length: 4}, (_, i) => <SkeletonCard key={i} />)
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white overflow-hidden">
        <div className="container mx-auto p-8">
          <h2
            className={`text-2xl md:text-3xl xl:text-4xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-left mb-0 noto-font`}
          >
            Most Discounted Products
          </h2>

          <div className="relative">
            <button
              onClick={() => scroll("left")}
              className="absolute top-1/2 left-[-28px] lg:left-[-35px] transform -translate-y-1/2 bg-white text-black w-8 h-8 rounded-full border border-black shadow-md z-10 flex items-center justify-center"
            >
              ‹
            </button>

            <div
              ref={scrollContainerRef}
              className="overflow-x-auto py-8 px-3 scrollbar-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="flex space-x-6 justify-around">
                {mostDiscountedProducts?.length ? (
                  mostDiscountedProducts.map((product, index) => (
                    <DiscountedItemCard
                      key={index}
                      product={product}
                      userCurrency={userCurrency}
                      userCountry={userCountry}
                    />
                  ))
                ) : (
                  Array.from({length: 6}, (_, i) => <SkeletonCard key={i} />)
                )}
              </div>
            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute top-1/2 right-[-35px] lg:right-[-40px] transform -translate-y-1/2 bg-white text-black w-8 h-8 rounded-full border border-black shadow-md z-10 flex items-center justify-center"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {banner?.imageUrl && (
        <section className="bg-white overflow-hidden">
          <div className="container mx-auto p-5 relative w-full h-auto">
            <Image
              src={banner?.imageUrl || ""}
              alt={banner?.fileName || "Banner"}
              width={1200}
              height={400}
              className="w-full h-auto object-contain"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </section>
      )}

      {favShops?.length ? (
        <section className="bg-white overflow-hidden">
          <div className="container mx-auto py-5">
            {/* <h1
        className={`text-2xl md:text-3xl xl:text-4xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-left mb-5 noto-font`}
      >
        Best Shops
      </h1> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {" "}
              {/* Use grid to divide into 4 columns */}
              <div className="col-span-1 lg:col-span-2">
                {" "}
                {/* 1/4 width */}
                {/* Content for 1/4 width goes here */}
                <div className="flex flex-col items-center justify-center p-4 h-full">
                  <p
                    className={`text-3xl md:text-3xl xl:text-5xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-left mb-0  noto-font`}
                  >
                    Shop Spotlight: Discover Unique Finds from Our Featured
                    Sellers!
                  </p>
                  {/* <h2 className="`text-2xl md:text-3xl xl:text-4xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-left mb-0 noto-font`">Explore original items from shops</h2> Added margin-bottom to add space between h2 and button */}
                  {/* Button */}
                  {/* <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all duration-300">
              Click Me
            </button> */}
                </div>
              </div>
              <div className="col-span-1 lg:col-span-3 overflow-x-auto pt-12 pb-12 px-10 overflow-y-hidden">
                {" "}
                {/* 1/3 width for shops container */}
                <div className="flex justify-around space-x-6">
                  {favShops.map((shop, index) => (
                    <FavShopCard key={index} data={shop} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        ""
      )}

      <section className="bg-orange-50 overflow-hidden">
        <div className="container mx-auto p-8">
          {/* Parent container with grid layout to display the cards in a responsive manner */}
          <h2
            className={`text-2xl md:text-3xl xl:text-4xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-left mb-0 noto-font`}
          >
            See What Buyers Are Saying!
          </h2>
          <p className="font-bold text-primary mb-3.5">
            See what buyers love about our amazing sellers. Shop with confidence and support talented creators!
          </p>
          <div className="relative">
            <button
              onClick={() => scrollReview("left")}
              className="absolute top-1/2 left-[-28px] lg:left-[-35px] transform -translate-y-1/2 bg-orange-50 text-black w-8 h-8 rounded-full border border-black shadow-md z-10 flex items-center justify-center"
            >
              ‹
            </button>
            <div
              ref={scrollReviewContainerRef}
              className="overflow-x-auto py-8 px-3 scrollbar-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="flex space-x-6 justify-around">
                {reviews?.length ? (
                  reviews.map((review, index) => (
                    <ReviewCard key={index} data={review} />
                  ))
                ) : (
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-950 border-solid"></div>
                )}
              </div>

              <button
                onClick={() => scrollReview("right")}
                className="absolute top-1/2 right-[-35px] lg:right-[-40px] transform -translate-y-1/2 bg-orange-50 text-black w-8 h-8 rounded-full border border-black shadow-md z-10 flex items-center justify-center"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-orange-50 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4 py-12 md:py-20">
          <div className="flex  flex-col-reverse md:flex-row gap-6 md:gap-10 items-start lg:gap-18 mb-8 md:mb-10">
            <Image
              src={
                "/assets/homepage/A_Marketplace_for_all_Artists_&_Artisans.png"
              }
              alt="Water_hyacinth_cowries"
              className="shrink-0 md:w-[377px] lg:w-[477px]"
              width={477}
              height={426}
              loading="lazy"
            />
            <div>
              <h2 className="text-2xl md:text-3xl xl:text-4xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-blue-950 text-left mb-0 noto-font mb-3.5">
                ABOUT AFOMA MARKETPLACE{" "}
              </h2>
              <p className="text-blue-950 mb-6 ">
                AFOMA Marketplace is a global platform where buyers discover handmade, ethical goods crafted by talented artisans — especially those in emerging markets.
              </p>
              <p className="text-blue-950 mb-6 ">
                We offer a curated selection of fashion, jewelry, home decor, and cultural gifts, while ensuring every purchase supports fair wages, sustainable income, and creative independence for makers worldwide.
              </p>
              <p className="text-blue-950 mb-6 ">
                Powered by Web3 technology and Artificial Intelligence, we’re building a transparent and inclusive commerce model — where artisans are rewarded, empowered, and involved in shaping their own future.
              </p>
              <p className="text-blue-950 mb-6 ">
                Whether you’re shopping for meaningful products or supporting creative entrepreneurs, AFOMA makes every purchase count — for you and the world.
              </p>
            </div>
          </div>
          <div className="grid gap-4 lg:gap-9 md:grid-cols-2 lg:grid-cols-3 mb-4 md:mb-4">
            <div>
              <h4 className="text-lg lg:text-2xl text-blue-950 mb-4 font-medium">
                The Problem
              </h4>
              <p className="text-blue-950">
                Marginalized artisans struggle to access the global market,
                while others lack fair income due to high fees from online
                marketplaces.
              </p>
            </div>
            <div>
              <h4 className="text-lg lg:text-2xl text-blue-950 mb-4 font-medium">
                Our Solution
              </h4>
              <p className="text-blue-950">
                A marketplace devoid of barriers and high fees for artisans
                seeking to sell their goods directly to their local community
                and global market.
              </p>
            </div>
            <div>
              <h4 className="text-lg lg:text-2xl text-blue-950 mb-4 font-medium">
                Our Promise
              </h4>
              <p className="text-blue-950">
                We will offer transparency, a sustainable and fair income to all
                creators. We will promote inclusion, equity and support
                communities in need.
              </p>
            </div>
          </div>
          <div className="flex">
            {/* <Link href="/category" className="buttonprimary">
              {" "}
              Find your favorites
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
            </Link> */}
          </div>
        </div>
      </section>
      <section className="bg-white overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4 py-8 md:py-10 lg:py-18">
          <div className="max-w-[640px] mx-auto mb-8 md:mb-16">
            <p
              className={`text-blue-950 text-center text-2xl md:text-3xl lg:text-4xl lg:tracking-[-0.72px] mb-5 noto-font`}
            >
              Blogs
            </p>
            <p className="text-blue-950 text-center">
              From handmade shopping tips to artisan success stories, the AFOMA Blog helps buyers and sellers thrive in the world of ethical, creative, and cultural craftsmanship.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-9 mb-6 md:mb-12 ">
            {morePosts.length > 0 &&
              morePosts.slice(0, 3).map(({ node, index }) => (
                <div
                  className="border border-slate-200 rounded-sm hover:bg-orange-100 transition-colors ease-in"
                  key={node.title + index}
                >
                  <div className="relative">
                    {node.featuredImage && (
                      <div className="relative overflow-hidden h-52 w-full">
                        <div className="sm:mx-0">
                          {node.slug ? (
                            <Link
                              href={`/blogs/${node.slug}`}
                              aria-label={node.title}
                            >
                              {
                                <Image
                                  // fill
                                  alt={`Cover Image for ${node.title}`}
                                  src={node?.featuredImage?.node.sourceUrl}
                                  className="object-cover"
                                  loading="lazy"
                                  width={500}
                                  height={500}
                                />
                              }
                            </Link>
                          ) : (
                            <Image
                              // fill
                              alt={`Cover Image for ${node.title}`}
                              src={node?.featuredImage?.node.sourceUrl}
                              className="object-cover"
                              width={500}
                              height={500}
                              loading="lazy"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <dl className="text-sm my-4 text-slate-600">
                      <dt className="sr-only">Date</dt>
                      <dd className="whitespace-nowrap leading-6">
                        <time dateTime={node.date}>
                          {format(parseISO(node.date), "LLLL	d, yyyy")}
                        </time>
                      </dd>
                    </dl>
                    <p className="text-xl font-bold tracking-tight text-blue-950 line-clamp-2">
                      <Link
                        href={`/blogs/${node.slug}`}
                        dangerouslySetInnerHTML={{ __html: node.title }}
                      ></Link>
                    </p>
                    <div
                      className="mt-2 mb-4 prose prose-slate prose-a:relative prose-a:z-10 line-clamp-2 text-slate-600"
                      dangerouslySetInnerHTML={{ __html: node.excerpt }}
                    />
                    <Link href={`/blogs/${node.slug}`} legacyBehavior>
                      <p
                        className="text-sm font-bold text-blue-950 flex items-center gap-1"
                        rel="noreferrer"
                      >
                        <span className="absolute sm:rounded-2xl"></span>
                        <span className="relative">
                          Read more
                          <span className="sr-only">{node.title}</span>
                        </span>
                        <svg
                          className="relative mt-px overflow-visible ml-2.5 text-gray-700"
                          width="3"
                          height="6"
                          viewBox="0 0 3 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M0 0L3 3L0 6"></path>
                        </svg>
                      </p>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex items-center justify-center">
            <Link href="/blogs" className="buttonprimary">
              {" "}
              View all blogs
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
      </section>
      <section className="bg-white overflow-hidden">
        <Faqs />
      </section>
      <section className="bg-blue-950 overflow-hidden">
        <div
          className="max-w-screen-lg mx-auto px-4   py-8 md:py-14"
          id="notify"
        >
          <div className="max-w-[920px] mx-auto ">
            <p
              className={`text-lg xl:text-4xl xl:leading-[60px] tracking-[-0.72px] xl:tracking-[-0.96px] text-white text-center mb-5 noto-font `}
            >
              Shop Smarter, Save More!
            </p>
            <div className="md:px-[70px] mb-6 md:mb-9">
              <p className="text-center text-white">
                Join our newsletter and be the first to discover exclusive
                deals, new arrivals, and special offers!
                <br /> Sign up now & receive a one-time coupon code for your
                next order on AFOMA Marketplace!
              </p>
            </div>
            <div>
              <form
                className="flex flex-col w-full gap-4 xl:flex-row items-center justify-center"
                onSubmit={handleSubmit}
                method="POST"
              >
                <input
                  type="email"
                  name="email"
                  value={email}
                  data-aos="fade-up"
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  required
                  placeholder="Enter your email address"
                  className="placeholder:text-slate-600 text-sm text-gray-700 border border-slate-200 rounded sm:w-80 w-full px-5 py-4"
                />
                <button
                  type="submit"
                  className={`py-4 px-10 text-sm bg-primary rounded text-white font-bold cursor-pointer text-center hover:bg-primaryHover transition-colors ease-in inline-flex items-center justify-center disabled:cursor-progress disabled:hover:bg-primary disabled:opacity-50`}
                  disabled={loading}
                >
                  Subscribe Now
                  {loading && (
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-slate-200 animate-spin fill-white ml-2"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  )}
                </button>
              </form>
              <div className="mx-auto">
                {showSuccessMessage ? (
                  <p className="text-green-500 font-semibold text-sm my-5 text-center">
                    You're in! Welcome to the AFOMA Community.
                  </p>
                ) : (
                  <p className="text-green-500 font-semibold text-sm my-5 text-center"></p>
                )}
                {showFailureMessage ? (
                  <p className="text-red-500 font-semibold text-sm my-5 text-center">
                    Oops! Something went wrong, please try again.
                  </p>
                ) : (
                  <p className="text-red-500 font-semibold text-sm my-5 text-center"></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <Footer />
      </section>
      {showProfileIncompleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              maxWidth: 400,
              boxShadow: "0 2px 16px 0 rgba(0,0,0,0.13)",
              textAlign: "center",
            }}
          >
            <h2 className="font-medium text-center text-blue-950">
              Complete Your Profile
            </h2>
            <p>Please complete all required sections of your profile.</p>
            <div className="mt-6 mb-1">
              {/* Profile setup verification with tick/cross */}
              {(() => {
                const profileSetup =
                  sellerInfo?.profileSetup || userInfo?.profileSetup || {};
                const checklist = [
                  {
                    label: "Basic Information",
                    checked: !!profileSetup.basicInfo,
                  },
                  {
                    label: "Seller Details",
                    checked: !!profileSetup.sellerDetails,
                  },
                  {
                    label: "Seller Policies",
                    checked: !!profileSetup.sellerPolicies,
                  },
                  {
                    label: "Shipping Configuration",
                    checked: !!profileSetup.shippingConfig,
                  },
                  {
                    label: "Payment Information",
                    checked: !!profileSetup.paymentInfo,
                  },
                ];
                return (
                  <ul style={{ textAlign: "left", margin: "0 auto", padding: 0, maxWidth: 290 }}>
                    {checklist.map((item) => (
                      <li
                        key={item.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 15,
                          marginBottom: 6,
                          color: "inherit",
                        }}
                      >
                        {item.checked ? (
                          // Tick
                          <svg
                            style={{ marginRight: 5 }}
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="9" cy="9" r="9" fill="#198754" />
                            <path
                              d="M5 9.5L8 12L13 7"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          // Cross
                          <svg
                            style={{ marginRight: 5 }}
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="9" cy="9" r="9" fill="#D63031" />
                            <path
                              d="M6.5 6.5L11.5 11.5"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M11.5 6.5L6.5 11.5"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                        {item.label}
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <button
                style={{
                  background: "#ED7D31",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 18px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={() => {
                  let id = sellerInfo?._id || userInfo?._id;
                  if (id) {
                    router.push(
                      `/seller/my-account/basic-information?id=${id}#basicInformation`
                    );
                    setShowProfileIncompleteModal(false);
                  }
                }}
              >
                Complete Profile
              </button>
              <button
                style={{
                  background: "#f3f3f3",
                  color: "#3e3e3e",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 18px",
                  cursor: "pointer",
                }}
                onClick={() => setShowProfileIncompleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const getStaticProps = async ({ preview = false }) => {
  try {
    const allPosts = await getAllPostsForNewData(preview);
    return {
      props: { allPosts, preview },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: { error: true },
    };
  }
};
