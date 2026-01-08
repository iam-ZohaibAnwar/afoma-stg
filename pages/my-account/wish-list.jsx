import dynamic from "next/dynamic";

// Lazy load heavy components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const MyAccountSidebar = dynamic(() => import("@/components/MyAccountSidebar"), { ssr: false });
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Wish_List = ({ cart, addToCart }) => {
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(false);
  const [sellerfirstName, setSellerfirstName] = useState("");
  const [sellerlastName, setSellerlastName] = useState("");
  const [sellerId, setSellerId] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState({}); // State to track wishlist status
  const [visibleProducts, setVisibleProducts] = useState(9);

  const loadMore = () => {
    setVisibleProducts((prev) => prev + 9);
  };

  const initialValues = {
    sample1: "",
  };

  const handleSubmit = (values) => {};

  const getWishlist = () => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    // Fetch user ID from your authentication system or wherever it's stored
    const userId = userData?.userId; // Replace with your logic to get the user ID

    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/${userId}`, // Replace with your wishlist endpoint
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setWishlist(response.data);
        setSellerId(response.data?.product?.seller);
        setError(false);
        setLoading(false);

        const newIsInWishlist = {};
        response.data.forEach((item) => {
          newIsInWishlist[item._id] = true;
        });
        setIsInWishlist(newIsInWishlist);
      })
      .catch(function (error) {
        console.error("Error fetching wishlist:", error);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    getWishlist();
  }, []);

  const removeFromWishlist = (itemId) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?.userId;
    const options = {
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/${userId}/${itemId}`,
      headers: {
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };
    axios
      .request(options)
      .then(function () {
        // Update local state to reflect the removal
        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item._id !== itemId)
        );
        setIsInWishlist((prevIsInWishlist) => {
          const updatedIsInWishlist = { ...prevIsInWishlist };
          delete updatedIsInWishlist[itemId];
          return updatedIsInWishlist;
        });
      })
      .catch(function (error) {
        console.error("Error removing from wishlist:", error);
      });
  };

  const [sellerInfo, setSellerInfo] = useState({});

  const getSellerInfo = (sellerId, index) => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/sellers/${sellerId}`,
      headers: {
        Authorization: `Bearer ${userData?.accessToken}`,
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        // Update sellerInfo state with information for the current index
        setSellerInfo((prevSellerInfo) => ({
          ...prevSellerInfo,
          [index]: {
            sellerId: response.data._id, // Make sure to use the correct property for the sellerId
            firstName: response.data.firstName,
            lastName: response.data.lastName,
          },
        }));
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
    if (wishlist.length > 0) {
      wishlist.forEach((item, index) => {
        getSellerInfo(item.product.seller, index);
      });
    }
  }, [wishlist]);

  const shareProduct = (productId) => {
    const productLink = `https://your-website.com/product/${productId}`;
    // Copy product link to clipboard
    navigator.clipboard
      .writeText(productLink)
      .then(() => {})
      .catch((error) => {
        console.error("Error copying product link to clipboard:", error);
        // You can also show an error message to the user
      });
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
      <section>
        <Header cart={cart} addToCart={addToCart}/>
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
            <div className="flex justify-between items-center">
              <h1 className={`text-4xl text-blue-950 mb-5 noto-font `}>
                Wish List
              </h1>
              {/* <div className="flex items-center gap-1.5 ">
                <FontAwesomeIcon icon={faPen} className="h-3 w-3" />
                <button className="text-xs text-slate-600 cursor-pointer">
                  Edit wishlist
                </button>
              </div> */}
            </div>
            <div className="border border-b text-slate-600/30 mb-4"></div>
            <p className="text-blue-950 text-lg font-semibold mb-5">
              {wishlist.length} items in wish list
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-10 mb-9 md:mb-12 xl:mb-16  justify-center">
              {wishlist &&
                wishlist.slice(0, visibleProducts).map((item, index) => (
                  <div key={item._id}>
                    <div className="">
                      <div>
                        <div className="relative  overflow-visible group bg-white border border-slate-200 rounded">
                          <Image
                            src={
                              item.product.images[0]?.imageUrl ||
                              "/placeholder-image.png"
                            }
                            alt={item.product.productName}
                            width={230}
                            height={246}
                            className="h-[246px] w-[230px]"
                          />
                          <div className="absolute bg-orange-50 w-8 h-8 rounded-full right-12 top-5 flex items-center justify-center">
                            <Link
                              href="#"
                              className="container flex items-center justify-center"
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
                              <FontAwesomeIcon
                                icon={faHeart}
                                className="text-red-500"
                                onClick={() => removeFromWishlist(item._id)}
                              />
                            </Link>
                          </div>
                        </div>

                        <div>
                          <p className="text-blue-950 text-base font-medium mb-3 mt-3.5 hover:text-primary">
                            <Link href={`/product/${item?.product?.slug}`}>
                              {item.product.productName}
                            </Link>
                          </p>
                          <p className="text-blue-950 text-lg font-bold mb-3">
                            {item.product.price}
                          </p>
                          <p className="text-slate-600 text-sm underline">
                            <Link
                              href={`/seller?sellerId=${sellerInfo[index]?.sellerId}`}
                            >
                              {sellerInfo[index]?.firstName}{" "}
                              {sellerInfo[index]?.lastName}
                            </Link>
                          </p>

                          <div className="flex items-center gap-5 mt-9">
                            <div className="flex items-center justify-start col-span-3 ">
                              {item.product.inventory === "OutOffStock" ? (
                                <p className="text-red-500 font-semibold">
                                  Out of Stock
                                </p>
                              ) : (
                                <button
                                  className="buttonprimary flex gap-2 items-center"
                                  onClick={() => {
                                    // Only allow adding to cart if inventory is not "OutOffStock"
                                    if (
                                      item.product.inventory !== "OutOffStock"
                                    ) {
                                      // Add your logic to handle adding to cart
                                    }
                                  }}
                                >
                                  Add to cart
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
                                </button>
                              )}
                            </div>

                            {/* 
                          <div className="flex items-center gap-2.5">
                            <Image
                              src={"/assets/Share.png"}
                              alt="Share"
                              width={16}
                              height={16}
                            />
                            <button
                              type="button"
                              className="text-slate-600 cursor-pointer"
                              onClick={() => shareProduct(item._id)}
                            >
                              Share
                            </button>
                          </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div>
              <div className="flex justify-center">
                {wishlist && visibleProducts < wishlist.length && (
                  <button className="buttonprimary" onClick={loadMore}>
                    Load more
                  </button>
                )}
              </div>
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

export default Wish_List;
