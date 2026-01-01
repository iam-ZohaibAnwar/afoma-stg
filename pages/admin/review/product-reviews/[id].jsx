import Layout from "@/components/Layout";
import {
  faAngleLeft,
  faStarHalfAlt,
  faStar as farStar,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Menu, Transition } from "@headlessui/react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [reviewId, setReviewId] = useState(0);
  const [review, setReview] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");

  const getData = (id) => {
    setReviewId(id);
    setLoading(true);
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/${id}`,
    };
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .request(options)
      .then(function (response) {
        if (response.data) {
          setReview(response.data);
          setSelectedMenuItem(response.data.reviewStatus);
        }
      })
      .catch(function (error) {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const { id } = router?.query;
    if (router?.isReady && id) {
      getData(id);
    }
  }, [router?.query]);

  const handleBack = () => {
    router.back();
  };

  const handleStarClick = (category, rating) => {
    switch (category) {
      case "value":
        setValue(rating);
        break;
      case "quality":
        setQuality(rating);
        break;
      case "price":
        setPrice(rating);
        break;
    }
  };

  const handleMenuItemClick = (menuItem) => {
    if (menuItem) {
      const userData = JSON.parse(localStorage.getItem("user"));
      const options = {
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/${reviewId}/update-status`,
        data: {
          newStatus: menuItem,
        },
        headers: {
          Authorization: `Bearer ${userData?.accessToken}`,
        },
      };
      axios
        .create({
          headers: {
            "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
          },
        })
        .request(options)
        .then(function (response) {
          if (
            response &&
            response.data &&
            response.data.Data &&
            response.data.Data._id
          ) {
            toast.success("Status Updated");
            setSelectedMenuItem(response.data.Data.reviewStatus);
          }
        })
        .catch(function (error) {
          toast.error("Something Went Wrong");
        });
    }
  };

  return (
    <>
      {" "}
      <Head>
        <title>A Decentralized Marketplace for Artists and Artisans</title>
        <meta
          property="og:title"
          content="A Decentralized Marketplace for Artists and Artisans"
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
      <Layout userType="admin">
        <div className="viewOnly">
          <div>
            <Formik>
              <Form className="st-form reviewInput">
                <div>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="pl-9 py-9 font-medium text-blue-950 text-sm"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    <div className="mb-10">
                      <div className="md:flex justify-between items-center mb-12">
                        <h1
                          className={`text-2xl text-blue-950 font-medium mb-2 noto-font `}
                        >
                          {review?.UserId?.firstName} {review?.UserId?.lastName}{" "}
                          <span className="text-lg">{review?._id}</span>
                        </h1>
                        <div>
                          <div className="flex items-center justify-end gap-4">
                            <Menu as="div" className="relative">
                              <div>
                                <Menu.Button
                                  className={`flex items-center justify-center rounded-full ${
                                    selectedMenuItem === "Approved"
                                      ? "bg-green-800 text-white"
                                      : selectedMenuItem === "Pending"
                                      ? "bg-yellow-600 text-white"
                                      : selectedMenuItem === "Disapproved"
                                      ? "bg-red-700 text-white"
                                      : "bg-gray-500 text-white"
                                  } cursor-pointer py-2.5 px-4 gap-2 rounded-sm text-center hover:border-primaryHover transition-colors ease-in inline-flex items-center justify-center`}
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
                                        fill="#fff"
                                        stroke="#fff"
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
                                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded bg-orange-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                                  <div className="py-2">
                                    <Menu.Item>
                                      <p
                                        className={`${
                                          selectedMenuItem === "Approved"
                                            ? "hover:bg-orange-100 hover:text-primary"
                                            : "hover:bg-orange-100 productCategoryListhover:text-primary"
                                        } group flex w-full items-center gap-3 px-3.5 py-2`}
                                        onClick={() =>
                                          handleMenuItemClick("Approved")
                                        }
                                      >
                                        Approved
                                      </p>
                                    </Menu.Item>
                                    <Menu.Item>
                                      <p
                                        className={`${
                                          selectedMenuItem === "Pending"
                                            ? "hover:bg-warning-100 hover:text-warning"
                                            : "hover:bg-warning-100 hover:text-warning"
                                        } group flex w-full items-center gap-3 px-3.5 py-2`}
                                        onClick={() =>
                                          handleMenuItemClick("Pending")
                                        }
                                      >
                                        Pending
                                      </p>
                                    </Menu.Item>
                                    <Menu.Item>
                                      <p
                                        className={`${
                                          selectedMenuItem === "Disapproved"
                                            ? "hover:bg-orange-100 hover:text-primary"
                                            : "hover:bg-orange-100 hover:text-primary"
                                        } group flex w-full items-center gap-3 px-3.5 py-2`}
                                        onClick={() =>
                                          handleMenuItemClick("Disapproved")
                                        }
                                      >
                                        Disapproved
                                      </p>
                                    </Menu.Item>
                                  </div>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="grid gap-6 md:grid-cols-3 md:mb-8 mb-4">
                          <div className="relative ">
                            <div>
                              <label
                                htmlFor="productName"
                                className="text-base text-blue-950"
                              >
                                Product ID
                              </label>
                            </div>
                            <div className="mt-3">
                              <Field
                                type="text"
                                name="productName"
                                id="productName"
                                placeholder={
                                  review.productId ? review.productId : "-"
                                }
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="relative col-span-2 ">
                            <div>
                              <label
                                htmlFor="Title"
                                className="text-base  text-blue-950 "
                              >
                                Review Title
                              </label>
                            </div>
                            <div className="mt-3">
                              {" "}
                              <Field
                                type="text"
                                name="Title"
                                id="Title"
                                placeholder={review.title ? review.title : "-"}
                                className=""
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                        <div className="md:flex gap-16">
                          <div className="mb-6">
                            {" "}
                            <label
                              htmlFor="averageRating"
                              className="text-base text-blue-950"
                            >
                              Average Rating
                            </label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => {
                                let starIcon;
                                if (star <= Math.floor(review.avgRating)) {
                                  // Full star
                                  starIcon = faStar;
                                } else if (
                                  star === Math.ceil(review.avgRating) &&
                                  review.avgRating % 1 !== 0
                                ) {
                                  // Half star
                                  starIcon = faStarHalfAlt; // You need to import this icon
                                } else {
                                  // Empty star
                                  starIcon = farStar; // You need to import this icon
                                }

                                return (
                                  <FontAwesomeIcon
                                    key={star}
                                    icon={starIcon}
                                    className={`text-slate-300 cursor-pointer ${
                                      starIcon === faStar
                                        ? "text-yellow-500"
                                        : "text-yellow-500" // Use your different color
                                    }`}
                                    onClick={() =>
                                      handleStarClick("value", star)
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>

                          <div className="mb-6">
                            {" "}
                            <label
                              htmlFor="priceRating"
                              className="text-base text-blue-950"
                            >
                              Price Rating
                            </label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => {
                                let starIcon;
                                if (star <= Math.floor(review.price)) {
                                  // Full star
                                  starIcon = faStar;
                                } else if (
                                  star === Math.ceil(review.price) &&
                                  review.price % 1 !== 0
                                ) {
                                  // Half star
                                  starIcon = faStarHalfAlt; // You need to import this icon
                                } else {
                                  // Empty star
                                  starIcon = farStar; // You need to import this icon
                                }

                                return (
                                  <FontAwesomeIcon
                                    key={star}
                                    icon={starIcon}
                                    className={`text-slate-300 cursor-pointer ${
                                      starIcon === faStar
                                        ? "text-yellow-500"
                                        : "text-yellow-500" // Use your different color
                                    }`}
                                    onClick={() =>
                                      handleStarClick("value", star)
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>

                          <div className="mb-6">
                            {" "}
                            <label
                              htmlFor="valueRating"
                              className="text-base text-blue-950"
                            >
                              Value Rating
                            </label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => {
                                let starIcon;
                                if (star <= Math.floor(review.value)) {
                                  // Full star
                                  starIcon = faStar;
                                } else if (
                                  star === Math.ceil(review.value) &&
                                  review.value % 1 !== 0
                                ) {
                                  // Half star
                                  starIcon = faStarHalfAlt; // You need to import this icon
                                } else {
                                  // Empty star
                                  starIcon = farStar; // You need to import this icon
                                }

                                return (
                                  <FontAwesomeIcon
                                    key={star}
                                    icon={starIcon}
                                    className={`text-slate-300 cursor-pointer ${
                                      starIcon === faStar
                                        ? "text-yellow-500"
                                        : "text-yellow-500" // Use your different color
                                    }`}
                                    onClick={() =>
                                      handleStarClick("value", star)
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>

                          <div className="mb-6">
                            {" "}
                            <label
                              htmlFor="qualityRating"
                              className="text-base text-blue-950"
                            >
                              Quality Rating
                            </label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => {
                                let starIcon;
                                if (star <= Math.floor(review.quality)) {
                                  // Full star
                                  starIcon = faStar;
                                } else if (
                                  star === Math.ceil(review.quality) &&
                                  review.quality % 1 !== 0
                                ) {
                                  // Half star
                                  starIcon = faStarHalfAlt; // You need to import this icon
                                } else {
                                  // Empty star
                                  starIcon = farStar; // You need to import this icon
                                }

                                return (
                                  <FontAwesomeIcon
                                    key={star}
                                    icon={starIcon}
                                    className={`text-slate-300 cursor-pointer ${
                                      starIcon === faStar
                                        ? "text-yellow-500"
                                        : "text-yellow-500" // Use your different color
                                    }`}
                                    onClick={() =>
                                      handleStarClick("value", star)
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>{" "}
                        <div className=" ">
                          <div className="relative ">
                            <div>
                              {" "}
                              <label
                                htmlFor="review"
                                className="text-base text-blue-950 "
                              >
                                Review
                              </label>
                            </div>
                            <div className="mt-3">
                              <Field
                                as="textarea"
                                rows="4"
                                name="review"
                                id="review"
                                readOnly
                                placeholder={
                                  review.reviewText ? review.reviewText : "-"
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Form>
            </Formik>
          </div>
          <div className="">
            <button
              className={` flex gap-2 items-center text-primary `}
              onClick={handleBack}
            >
              <FontAwesomeIcon icon={faAngleLeft} className="h-[8px]" /> Back
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
