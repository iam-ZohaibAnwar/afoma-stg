import Layout from "@/components/Layout";
import ReviewModal from "@/components/ReviewModal";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  faAngleLeft,
  faStarHalfAlt,
  faStar as farStar,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Field, Form, Formik } from "formik";
//import { Noto_Serif } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [existingReview, setExistingReview] = useState(undefined);

  const openWriteReviewModal = async () => {
    if (review && review.replyReviewId) {
      setReviewLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      const options = {
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/${review.replyReviewId}`,
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
          if (response && response.data) {
            setExistingReview(response.data);
          }
        })
        .catch(function (error) {
          setExistingReview({
            title: review.title,
            value: review.value,
            quality: review.quality,
            price: review.price,
          });
          setReviewLoading(false);
        })
        .finally(() => {
          setReviewLoading(false);
          setReviewModalOpen(true);
        });
    } else if (review) {
      setExistingReview({
        title: review.title,
        value: review.value,
        quality: review.quality,
        price: review.price,
      });
      setReviewModalOpen(true);
    }
  };

  const handleCloseWriteReviewModal = () => {
    setReviewModalOpen(false);
  };

  const handleReviewSubmit = (reviewData) => {
    if (reviewData && review && review.sellerId && review.productId) {
      setReviewLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      if (reviewData && reviewData.id) {
        updateCustomerReview(reviewData.id);
        return;
      } else {
        const options = {
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/`,
          data: {
            productId: review.productId,
            sellerId: review.sellerId,
            UserId: userData?.userId,
            value: reviewData?.valueRating,
            quality: reviewData?.qualityRating,
            price: reviewData?.priceRating,
            reviewText: reviewData.comment,
            title: reviewData.heading,
            reviewStatus: "Pending",
            isReply: true,
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
            if (response && response.data && response.data._id) {
              updateCustomerReview(response.data._id);
            }
            setReviewLoading(false);
          })
          .catch(function (error) {
            setReviewLoading(false);
            if (error.response.data && error.response.data.error) {
              toast.error(error.response.data.error);
            } else {
              toast.error("Server error.");
            }
          })
          .finally(() => {
            setReviewLoading(false);
          });
      }
    }
  };

  const updateCustomerReview = (replyReviewId) => {
    if (review && replyReviewId) {
      const userData = JSON.parse(localStorage.getItem("user"));
      const options = {
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/${review._id}`,
        data: {
          replyReviewId: replyReviewId.toString(),
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
          if (response && response.data && response.data._id) {
            setReview(response.data);
            setSelectedMenuItem(response.data.reviewStatus);
            toast.success("Review posted for review!");
          }
          setReviewLoading(false);
        })
        .catch(function (error) {
          setReviewLoading(false);
          if (error.response.data && error.response.data.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error("Server error.");
          }
        })
        .finally(() => {
          setReviewLoading(false);
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
                    <div>
                      <div className="pl-9 py-9 font-medium text-blue-950 text-sm">
                        Loading...
                      </div>
                    </div>
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
                          <div
                            className="dashboard-button-primary"
                            onClick={() => {
                              openWriteReviewModal();
                            }}
                            disabled={reviewLoading}
                          >
                            Write Reply
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
                                Product Id
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
        {reviewModalOpen && review && review.sellerId && review.productId && (
          <ReviewModal
            reviewsData={existingReview}
            isOpen={reviewModalOpen}
            onClose={handleCloseWriteReviewModal}
            onSubmit={handleReviewSubmit}
            disabled={true}
            isReply={true}
          />
        )}
      </Layout>
    </>
  );
};

export default Index;
