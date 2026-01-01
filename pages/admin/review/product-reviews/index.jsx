import Layout from "@/components/Layout";
import {
  faAngleLeft,
  faAngleRight,
  faStarHalfAlt,
  faStar as farStar,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useEffect, useState } from "react";

import { faStar } from "@fortawesome/free-solid-svg-icons";

import { Field, Form, Formik } from "formik";

//const noto = Noto_Serif({ subsets: ["latin"] });

const Index = () => {
  const [value, setValue] = useState(0);
  const [review, setReview] = useState([]);
  useEffect(() => {
    axios
      .create({
        headers: {
          "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
        },
      })
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews`)
      .then((res) => {
        setReview(res.data);
      });
  }, []);
  //

  const [currentPage, setCurrentPage] = useState(1);
  const [isDisabled, setDisabled] = useState(true);
  const itemsPerPage = 10;
  const totalItems = review.length;

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

  const visibleReview = Array.isArray(review)
    ? review.slice(startIndex, endIndex)
    : [];
  //

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
  return (
    <>
      {" "}
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
      <Layout userType="admin">
        <div className="viewOnly">
          <div>
            <Formik>
              <Form className="st-form reviewInput">
                <div>
                  {visibleReview.length === 0 ? (
                    <div>
                      <p className="pl-9 py-9 font-medium text-blue-950 text-sm ">
                        No Reviews added
                      </p>
                    </div>
                  ) : (
                    visibleReview.map((admin, index) => (
                      <div className="mb-20" key={index} id={admin._id}>
                        <div className="flex justify-between items-center mb-9 border-b">
                          <h2
                            className={`text-2xl text-blue-950 font-medium mb-[18px] noto-font `}
                          >
                            {admin?.UserId?.firstName} {admin?.UserId?.lastName}
                          </h2>
                        </div>

                        <div>
                          <div className="grid gap-12 md:grid-cols-3 mb-9 ">
                            <div className="relative pointer-events-none">
                              <div>
                                {" "}
                                <label
                                  htmlFor="productName"
                                  className="text-base text-blue-950"
                                >
                                  Product Name
                                </label>
                              </div>
                              <div className="mt-3">
                                <Field
                                  type="text"
                                  name="productName"
                                  id="productName"
                                  placeholder={
                                    admin.productId.productName
                                      ? admin.productId.productName
                                      : "-"
                                  }
                                  className="pointer-events-none"
                                />
                              </div>
                            </div>

                            <div className="relative col-span-2 pointer-events-none">
                              <div>
                                <label
                                  htmlFor="Title"
                                  className="text-base  text-blue-950 "
                                >
                                  Title
                                </label>
                              </div>
                              <div className="mt-3">
                                {" "}
                                <Field
                                  type="text"
                                  name="Title"
                                  id="Title"
                                  placeholder={admin.title ? admin.title : "-"}
                                  className="pointer-events-none"
                                />
                              </div>
                            </div>
                          </div>{" "}
                          <div className="flex gap-24 mb-9 pointer-events-none">
                            <div>
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
                                  if (star <= Math.floor(admin.avgRating)) {
                                    // Full star
                                    starIcon = faStar;
                                  } else if (
                                    star === Math.ceil(admin.avgRating) &&
                                    admin.avgRating % 1 !== 0
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

                            <div>
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
                                  if (star <= Math.floor(admin.price)) {
                                    // Full star
                                    starIcon = faStar;
                                  } else if (
                                    star === Math.ceil(admin.price) &&
                                    admin.price % 1 !== 0
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

                            <div>
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
                                  if (star <= Math.floor(admin.value)) {
                                    // Full star
                                    starIcon = faStar;
                                  } else if (
                                    star === Math.ceil(admin.value) &&
                                    admin.value % 1 !== 0
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

                            <div>
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
                                  if (star <= Math.floor(admin.quality)) {
                                    // Full star
                                    starIcon = faStar;
                                  } else if (
                                    star === Math.ceil(admin.quality) &&
                                    admin.quality % 1 !== 0
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
                                  className="text-base text-blue-950 pointer-events-none"
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
                                    admin.reviewText ? admin.reviewText : "-"
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {visibleReview && visibleReview.length > 0 && (
                  <div className="pagination flex text-sm items-center justify-end text-bodyText gap-x-6 my-9">
                    <div className="">
                      <button
                        type="button"
                        className={` flex gap-2 items-center text-gray-500  ${
                          currentPage === 1
                            ? "cursor-not-allowed opacity-50"
                            : "hover:text-primary"
                        }`}
                        onClick={prevPage}
                        disabled={currentPage === 1}
                      >
                        <FontAwesomeIcon
                          icon={faAngleLeft}
                          className="h-[8px]"
                        />{" "}
                        Previous{" "}
                      </button>
                    </div>

                    <div>
                      <div className="">
                        <button
                          type="button"
                          className={` flex gap-2 items-center text-gray-500  ${
                            currentPage === Math.ceil(totalItems / itemsPerPage)
                              ? "cursor-not-allowed opacity-50"
                              : "hover:text-primary"
                          }`}
                          onClick={nextPage}
                          disabled={
                            currentPage === Math.ceil(totalItems / itemsPerPage)
                          }
                        >
                          Next
                          <FontAwesomeIcon
                            icon={faAngleRight}
                            className="h-[8px] "
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Form>
            </Formik>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
