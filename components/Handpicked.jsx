import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
//import { Noto_Serif } from "next/font/google";
import toast from "react-hot-toast";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Handpicked = () => {
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState(null);
  const [error, setError] = useState(false);

  const getAllProducts = () => {
    setLoading(true);

    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        setAllProducts(response.data);
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

  const addToWishlist = (productId) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "POST", // Change the method to POST
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/wishlist`,
      data: { User: userData?.userId, product: productId },
    };

    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        toast.success("Product added to wishlist");
        // Handle any additional logic if needed
      })
      .catch(function (error) {
        console.error("Error adding to wishlist:", error);
        toast.error("Error adding to wishlist");
        // Handle errors
      });
  };

  return (
    <>
      {" "}
      <div className="bg-orange-50 p-6 md:p-12 xl:p-16 " id="fashion">
        <div className="max-w-[640px] mx-auto">
          <h2
            className={`text-blue-950 xl:tracking-[-0.72px] mb-5 text-2xl lg:text-4xl text-center noto-font`}
          >
            Community Pick of the Month
          </h2>
          <p className="text-blue-950 text-center mb-5 md:mb-9">
            Explore a curated selection of handmade treasures celebrated and
            endorsed by our vibrant community.
          </p>
        </div>

        {/* <div className="grid md:grid-cols-3 justify-center gap-9 mb-4 md:mb-9">
          {!loading ? (
            <>
              {error && <p>Error - Something went wrong!</p>}
              {allProducts && allProducts.length > 0 ? (
                allProducts.slice(0, 3).map((data) => (
                  <div key={data?._id} className="relative">
                    <div className="w-[285px] md:w-auto flex flex-col justify-between">
                      <div>
                        <div className="relative  overflow-visible group bg-white border border-slate-200 rounded">
                          <div className="absolute inset-0 bg-yellow-950/[55%] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                          <Image
                            src={data?.images[0]?.imageUrl}
                            alt={data?.productName}
                            width={285}
                            height={350}
                            className="h-[350px] w-[285px]"
                          />
                          <div className="absolute bg-orange-50 w-8 h-8 rounded-full right-5 top-5 flex items-center justify-center">
                            <button
                              onClick={() => addToWishlist(data?._id)}
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
                                className="text-red-500 hidden hover:block"
                              />
                            </button>
                          </div>
                          <div className="absolute bg-orange-50 w-8 h-8 rounded-full right-5 top-16 flex items-center justify-center">
                            <Link href="#">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12.561"
                                height="12.561"
                                viewBox="0 0 12.561 12.561"
                              >
                                <g
                                  id="Group_26309"
                                  data-name="Group 26309"
                                  transform="translate(-495.75 -3420.75)"
                                >
                                  <line
                                    id="Line_9"
                                    data-name="Line 9"
                                    y2="11.061"
                                    transform="translate(502.03 3421.5)"
                                    fill="none"
                                    stroke="#172554"
                                    strokeLinecap="round"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    id="Line_10"
                                    data-name="Line 10"
                                    y2="11.061"
                                    transform="translate(507.561 3427.03) rotate(90)"
                                    fill="none"
                                    stroke="#172554"
                                    strokeLinecap="round"
                                    strokeWidth="1.5"
                                  />
                                </g>
                              </svg>
                            </Link>
                          </div>
                          <div className="absolute bottom-9   hover:visible  flex items-center justify-center left-0 right-0">
                            <div className="flex items-center justify-center ">
                              <Link
                                href={`/product/${data?.slug}`}
                                className="opacity-0 group-hover:opacity-100 transition-opacity  buttonprimary "
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

                        <p className="font-medium mt-3 mb-1 text-blue-950 hover:text-primary">
                          <Link href={`/product/${data?.slug}`}>
                            {data?.productName}
                          </Link>
                        </p>
                      </div>
                      <div>
                        <p className="font-bold mb-3 text-lg text-blue-950">
                          CA${data?.price}
                        </p>
                        <p className="text-slate-600 text-sm underline">
                          <Link href={`/seller?slug=${data?.seller?.storeSlug}`}>
                            {data?.seller?.firstName} {data?.seller?.lastName}
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center justify-center flex items-center mb-5 md:mb-9">
                  <Image
                    src={"/Coming Soon - AFOMA Marketplace.png"}
                    alt="Coming Soon"
                    height={366}
                    width={876}
                  />
                </div>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div> */}

        <div className="text-center justify-center flex items-center">
          <Image
            src={"/Coming Soon - AFOMA Marketplace.png"}
            alt="Coming Soon"
            height={366}
            width={876}
            loading="lazy"
          />
        </div>
      </div>
    </>
  );
};

export default Handpicked;
