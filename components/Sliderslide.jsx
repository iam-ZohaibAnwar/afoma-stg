import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  faAngleLeft,
  faAngleRight,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/pro-regular-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//import { Noto_Serif } from "next/font/google";
import { useRouter } from "next/router";
import axios from "axios";

//const noto = Noto_Serif({ subsets: ["latin"] });
const Sliderslide = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [allSellers, setAllSellers] = useState([]);
  const [sellerName, setsellersName] = useState([]);
  const [sellersData, setSellersData] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [sellerProductsMap, setSellerProductsMap] = useState({});
  const settings = {
    infinite: true,
    speed: 1000,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const sliderRef = useRef(null);

  const goToPrevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const goToNextSlide = () => {
    sliderRef.current.slickNext();
  };
  const [activeSection, setActiveSection] = useState("");

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 1.0 } // Adjust the threshold as needed
    );

    // Register scrollable sections
    const sections = document.querySelectorAll(".scrollable-section");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      // Clean up the observer
      observer.disconnect();
    };
  }, []);

  // const getAllSellers = () => {
  //   setLoading(true);

  //   const options = {
  //     method: "GET",
  //     url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers`,
  //   };

  //   axios
  //     .request(options)
  //     .then(function (response) {
  //       //
  //       // Assuming response.data is an array of sellers
  //       const sellersData = response.data.map((seller) => ({
  //         firstName: seller.firstName,
  //         lastName: seller.lastName,
  //         sellerId: seller._id,
  //       }));
  //       setsellersName(sellersData);
  //       //
  //       setAllSellers(response.data);
  //       setError(false);
  //     })
  //     .catch(function (error) {
  //       console.error("Error fetching all sellers:", error);
  //       setError(true);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  // useEffect(() => {
  //   getAllSellers();
  // }, []); // Empty dependency array to fetch sellers once when the component mounts

  // const getSellerProducts = async (sellerId) => {
  //   setLoading(true);

  //   try {
  //     const response = await axios.create({
  // headers: {
  // "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
  // },
  // }).get(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/products/by/${sellerId}`
  //     );
  //     //

  //     // Ensure that response.data is an array of products
  //     if (Array.isArray(response.data)) {
  //       setSellerProducts(response.data);
  //       setError(false);
  //     } else {
  //       console.error("Invalid product data format:", response.data);
  //       setError(true);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching seller products:", error);
  //     setError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   // Fetch products for each seller when allSellers changes
  //   allSellers.forEach((seller) => {
  //     getSellerProducts(seller._id);
  //   });
  // }, [allSellers]);

  // const [sellerProductsMap, setSellerProductsMap] = useState({});

  // useEffect(() => {
  //   // Fetch products for each seller when allSellers changes
  //   allSellers.forEach(async (seller) => {
  //     try {
  //       const response = await axios.create({
  //   headers: {
  //     "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
  //   },
  // }).get(
  //         `${process.env.NEXT_PUBLIC_BASE_URL}/products/by/${seller._id}`
  //       );
  //       //

  //       // Ensure that response.data is an array of products
  //       if (Array.isArray(response.data)) {
  //         // Update sellerProductsMap with products for the current seller
  //         setSellerProductsMap((prevMap) => ({
  //           ...prevMap,
  //           [seller._id]: response.data,
  //         }));
  //         setError(false);
  //       } else {
  //         console.error("Invalid product data format:", response.data);
  //         setError(true);
  //       }
  //     } catch (error) {
  //       console.error(
  //         `Error fetching products for seller ${seller.firstName} ${seller.lastName}:`,
  //         error
  //       );
  //       setError(true);
  //     }
  //   });
  // }, [allSellers]);

  // useEffect(() => {
  //   const sellerIdsToFetch = ["65795022b71f82c5f5d250e8", "sellerId2"]; // Replace with your desired seller IDs

  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const promises = sellerIdsToFetch.map(async (sellerId) => {
  //         const response = await axios.create({
  //   headers: {
  //     "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
  //   },
  // }).get(
  //           `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${sellerId}`
  //         );
  //         return response.data;
  //       });

  //       const sellers = await Promise.all(promises);
  //       setSellersData(sellers);
  //       setError(false);
  //     } catch (error) {
  //       console.error("Error fetching sellers:", error);
  //       setError(true);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const fetchProductsForSeller = async (sellerId) => {
    try {
      const response = await axios
        .create({
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        })
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/products/by/${sellerId}`);

      // Ensure that response.data is an array of products
      if (Array.isArray(response.data)) {
        // Update sellerProductsMap with products for the current seller
        setSellerProductsMap((prevMap) => ({
          ...prevMap,
          [sellerId]: response.data,
        }));
        setError(false);
      } else {
        console.error("Invalid product data format:", response.data);
        setError(true);
      }
    } catch (error) {
      console.error(`Error fetching products for seller ${sellerId}:`, error);
      setError(true);
    }
  };

  // useEffect(() => {
  //   const sellerIdsToFetch = [
  //     "658ff1057e11f16ce7f8e2b0",
  //     "6581427906d21d4e3fc01095",
  //   ]; // Replace with your desired seller IDs

  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const promises = sellerIdsToFetch.map(async (sellerId) => {
  //         const response = await axios.create({
  //   headers: {
  //     "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
  //   },
  // }).get(
  //           `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${sellerId}`
  //         );
  //         return response.data;
  //       });

  //       const sellers = await Promise.all(promises);
  //       setSellersData(sellers);
  //       setError(false);

  //       // Fetch products for each seller
  //       sellerIdsToFetch.forEach((sellerId) => {
  //         fetchProductsForSeller(sellerId);
  //       });
  //     } catch (error) {
  //       console.error("Error fetching sellers:", error);
  //       setError(true);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const sellerCustomMessages = {
  //   sellerId1: "Custom message for sellerId1",
  //   sellerId2: "Custom message for sellerId2",
  //   // Add more mappings as needed
  // };

  useEffect(() => {
    const sellerDataMapping = {
      "658ff1057e11f16ce7f8e2b0": {
        seller: null, // Initialize with seller data or set to null
        message: "Custom message for sellerId1",
      },
      "6581427906d21d4e3fc01095": {
        seller: null, // Initialize with seller data or set to null
        message: "Custom message for sellerId2",
      },
      // Add more mappings as needed
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const promises = Object.keys(sellerDataMapping).map(
          async (sellerId) => {
            const response = await axios
              .create({
                headers: {
                  "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
                },
              })
              .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${sellerId}`);
            return { id: sellerId, data: response.data };
          }
        );

        const sellers = await Promise.all(promises);
        const sellersDataWithMessages = sellers.map(({ id, data }) => ({
          ...data,
          customMessage: sellerDataMapping[id].message,
        }));

        setSellersData(sellersDataWithMessages);
        setError(false);

        // Fetch products for each seller
        sellers.forEach(({ id }) => {
          fetchProductsForSeller(id);
        });
      } catch (error) {
        console.error("Error fetching sellers:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <section className="bg-blue-950">
        <div className="max-w-screen-lg mx-auto py-6 md:py-20 px-4">
          <div className="lg:mr-[350px] mb-8 md:mb-16">
            <p className={`font-bold text-primary mb-3.5 `}>
              SHOWCASED ARTISANS
            </p>
            <h2
              className={`text-orange-50 xl:tracking-[-0.72px] mb-5 text-4xl noto-font`}
            >
              Meet the Creators of Products You Love!
            </h2>
            <p className="text-orange-50 mb-4">
              Celebrating the talents of exceptional artisans, each uniquely
              contributing to our diverse collection of handcrafted
              masterpieces.
            </p>
          </div>
          <div className="relative">
            <div className="hidden lg:block lg:absolute top-[50%] left-0">
              <button onClick={goToPrevSlide}>
                <div className="px-5 py-2 border group hover:bg-primary border-primary rounded-sm ">
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    className="text-primary group-hover:text-white text-[12px]"
                  />
                </div>
              </button>
            </div>
            <div>
              <Slider
                ref={sliderRef}
                {...settings}
                className="sliderslick lg:w-[813px] mx-auto"
              >
                {/* Required */}
                {sellersData.map((seller, index) => (
                  <div className="relative px-4" key={index}>
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center  md:gap-6 xl:gap-12 mb-6 lg:mb-9">
                        <div className="px-6 mb-6 md:mb-0 max-w-[448px] md:max-w-[331px] md:px-0 md:shrink-0">
                          {seller.userProfile ? (
                            <Image
                              src={seller.userProfile}
                              alt={`${seller.firstName} ${seller.lastName}`}
                              className="md:w-[331px] md:h-[294px]"
                              width={448}
                              height={394}
                            />
                          ) : (
                            // Fallback image when userProfile is blank
                            <Image
                              src="/default-userProfile.jpg"
                              alt={`${seller.firstName} ${seller.lastName}`}
                              className="md:w-[331px] md:h-[294px]"
                              width={448}
                              height={394}
                            />
                          )}
                          <div className="px-5 py-6 bg-orange-50">
                            <svg
                              id="quote"
                              xmlns="http://www.w3.org/2000/svg"
                              width="29.919"
                              height="21.47"
                              viewBox="0 0 29.919 21.47"
                            >
                              <path
                                id="Path_2346"
                                data-name="Path 2346"
                                d="M.877,0H12.143a.876.876,0,0,1,.877.877V12.143a.876.876,0,0,1-.877.877H7.386v7.573a.877.877,0,0,1-.877.877H3.693a.876.876,0,0,1-.831-.6L.045,12.42A.872.872,0,0,1,0,12.143V.877A.876.876,0,0,1,.877,0Zm0,0"
                                transform="translate(16.9)"
                                fill="#1F628E"
                              />
                              <path
                                id="Path_2347"
                                data-name="Path 2347"
                                d="M290.075,0h11.267a.876.876,0,0,1,.877.877V12.143a.876.876,0,0,1-.877.877h-4.757v7.573a.877.877,0,0,1-.877.877h-2.817a.877.877,0,0,1-.832-.6l-2.817-8.45a.88.88,0,0,1-.045-.277V.877A.876.876,0,0,1,290.075,0Zm0,0"
                                transform="translate(-289.199)"
                                fill="#1F628E"
                              />
                            </svg>
                            <h6 className="text-lg md:text-xl mt-5 mb-2 font-semibold text-blue-950">
                              {`${seller.firstName} ${seller.lastName}`}
                            </h6>

                            {/* <p className="text-blue-950">
                              Handcrafting brings me joy and fulfillment.
                              Grateful for the opportunity to share my passion
                              and to receive wonderful feedback.
                            </p> */}
                            <p className="text-blue-950">
                              {seller.customMessage ||
                                "Default message for the seller."}
                            </p>
                          </div>
                        </div>
                        <div>
                          {sellerProductsMap[seller._id]?.length > 0 ? (
                            sellerProductsMap[seller._id]
                              .slice(0, 3)
                              .map((product) => (
                                <div
                                  className="px-6 py-2"
                                  key={product.productId}
                                >
                                  <div className="flex gap-5 items-center">
                                    <Image
                                      src={product.images[0]?.imageUrl}
                                      alt={product.images[0]?.altText}
                                      width={155}
                                      height={156}
                                      className="w-[155px] h-[156px] shrink-0"
                                    />
                                    <div>
                                      <p className="font-medium text-orange-50 mb-3">
                                        {product.productName}
                                      </p>
                                      <h6 className="md:text-lg font-bold text-orange-50">
                                        {product.price}
                                      </h6>
                                    </div>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="text-red-500">
                              Products not available for this seller.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
            <div className="hidden lg:block lg:absolute top-[50%] right-0">
              <button onClick={goToNextSlide}>
                <div className="px-5 py-2 border border-primary group hover:bg-primary rounded-sm">
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className="text-primary group-hover:text-white text-[12px]"
                  />
                </div>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 lg:hidden mt-8 xl:mt-0">
            <button onClick={goToPrevSlide}>
              <div className="px-5 py-2 border group hover:bg-primary border-primary rounded-sm">
                <FontAwesomeIcon
                  icon={faAngleLeft}
                  className="text-primary group-hover:text-white text-[12px]"
                />
              </div>
            </button>
            <div>
              <button onClick={goToNextSlide}>
                <div className="px-5 py-2 border border-primary group hover:bg-primary rounded-sm">
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className="text-primary group-hover:text-white text-[12px]"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Sliderslide;
