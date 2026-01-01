import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import RatingReview from "./RatingReview";

const ReviewModal = ({
  reviewsData,
  isOpen,
  onClose,
  onSubmit,
  disabled,
  isReply,
}) => {
  const [valueRating, setValueRating] = useState(
    reviewsData && reviewsData.value ? reviewsData.value : 1
  );
  const [qualityRating, setQualityRating] = useState(
    reviewsData && reviewsData.quality ? reviewsData.quality : 1
  );
  const [priceRating, setPriceRating] = useState(
    reviewsData && reviewsData.price ? reviewsData.price : 1
  );

  // Validation schema for the form
  const validationSchema = Yup.object().shape({
    heading: Yup.string().required("Heading is required"),
    comment: Yup.string().required("Comment is required"),
  });

  if (!isOpen) return null;

  const handleSubmit = (values) => {
    const reviewData = {
      valueRating,
      qualityRating,
      priceRating,
      ...values,
    };
    onSubmit(reviewData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-orange-50 rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Rate this product</h2>

        <Formik
          initialValues={{
            id: reviewsData ? reviewsData._id : undefined,
            heading: reviewsData ? reviewsData.title : "",
            comment: reviewsData ? reviewsData.reviewText : "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, isValid }) => (
            <Form>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Heading</label>
                <Field
                  as="input"
                  name="heading"
                  className={`bg-orange-100 border ${
                    errors.heading && touched.heading
                      ? "border-red-500"
                      : "border-[#47556980]"
                  } w-full text-sm font-medium text-slate-600 p-3.5 rounded`}
                  placeholder="Review heading..."
                  disabled={disabled}
                />
                {errors.heading && touched.heading && (
                  <div className="text-red-500 text-sm">{errors.heading}</div>
                )}
              </div>
              <div className="mb-2">
                <label className="mb-1 font-medium flex justify-between items-center">
                  <span>Comment</span>
                  {reviewsData && reviewsData.reviewStatus ? (
                    <>
                      {" "}
                      <div
                        className={`text-[13px] ${
                          reviewsData && reviewsData.reviewStatus === "Approved"
                            ? "text-green-800 "
                            : reviewsData &&
                              reviewsData.reviewStatus === "Disapproved"
                            ? "text-red-700 "
                            : reviewsData &&
                              reviewsData.reviewStatus === "Pending"
                            ? "text-yellow-600 "
                            : "text-gray-500 "
                        }`}
                      >
                        {reviewsData.reviewStatus}
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </label>
                <Field
                  as="textarea"
                  name="comment"
                  rows="3"
                  className={`bg-orange-100 border ${
                    errors.comment && touched.comment
                      ? "border-red-500"
                      : "border-[#47556980]"
                  } w-full text-sm font-medium text-slate-600 p-3.5 rounded`}
                  placeholder="Write your review..."
                />
                {errors.comment && touched.comment && (
                  <div className="text-red-500 text-sm">{errors.comment}</div>
                )}
              </div>

              <div className="mb-1">
                <label className="block mb-1 font-medium">Value</label>
                <RatingReview
                  rating={valueRating}
                  setRating={setValueRating}
                  disabled={disabled}
                />
              </div>

              <div className="mb-1">
                <label className="block mb-1 font-medium">Quality</label>
                <RatingReview
                  rating={qualityRating}
                  setRating={setQualityRating}
                  disabled={disabled}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Price</label>
                <RatingReview
                  rating={priceRating}
                  setRating={setPriceRating}
                  disabled={disabled}
                />
              </div>

              <>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-primary px-4 py-2 rounded mr-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  {!isReply || (isReply && !reviewsData._id) ? (
                    <>
                      <button
                        type="submit"
                        className={`bg-primary text-white px-4 py-2 rounded ${
                          !isValid || isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={!isValid || isSubmitting}
                      >
                        Submit
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </>

              {/* Submit and Cancel Buttons */}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReviewModal;
