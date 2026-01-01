import { useRouter } from "next/router";
import React from "react";

const ReviewCard = ({ data, index }) => {
  const router = useRouter();
  // Function to render stars based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Full stars
    const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Half star if rating has a decimal of .5 or more
    const emptyStars = 5 - fullStars - halfStars; // Empty stars to fill up to 5

    return (
      <>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, index) => (
          <svg
            key={`full-${index}`}
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            stroke="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 15l-3.866 2.032a1 1 0 01-1.45-1.054l1.137-4.529-3.594-3.243a1 1 0 01.553-1.724l4.582-.379L6.77 3.29A1 1 0 018.092 2h3.816a1 1 0 011.322 1.29l-1.213 4.956 4.581.379a1 1 0 01.553 1.724l-3.593 3.243 1.136 4.529a1 1 0 01-1.45 1.054L10 15z"
              clipRule="evenodd"
            />
          </svg>
        ))}

        {/* Half star */}
        {halfStars === 1 && (
          <svg
            key="half"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            stroke="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 15l-3.866 2.032a1 1 0 01-1.45-1.054l1.137-4.529-3.594-3.243a1 1 0 01.553-1.724l4.582-.379L6.77 3.29A1 1 0 018.092 2h3.816a1 1 0 011.322 1.29l-1.213 4.956 4.581.379a1 1 0 01.553 1.724l-3.593 3.243 1.136 4.529a1 1 0 01-1.45 1.054L10 15z"
              clipRule="evenodd"
            />
          </svg>
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <svg
            key={`empty-${index}`}
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
            stroke="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 15l-3.866 2.032a1 1 0 01-1.45-1.054l1.137-4.529-3.594-3.243a1 1 0 01.553-1.724l4.582-.379L6.77 3.29A1 1 0 018.092 2h3.816a1 1 0 011.322 1.29l-1.213 4.956 4.581.379a1 1 0 01.553 1.724l-3.593 3.243 1.136 4.529a1 1 0 01-1.45 1.054L10 15z"
              clipRule="evenodd"
            />
          </svg>
        ))}
      </>
    );
  };

  return (
    <div
      onClick={() => {
        let isMobile = window.innerWidth < 768;
        let hashTarget = isMobile
          ? "#customerReviewsMobile"
          : "#customerReviews";
        router.push(
          `category/${data?.productId?.Category?.slug}/${
            data?.productId?.SubCategory?.slug
          }${
            data?.productId?.childCategory?.slug
              ? "/" + data?.productId?.childCategory?.slug
              : ""
          }/${data?.productId?.slug}${hashTarget}`
        );
      }}
      className="cursor-pointer lg:min-w-[600px] min-w-[400px] col-span-1 mx-auto my-8 bg-white shadow-lg rounded-lg h-[200px] lg:h-[300px] grid grid-cols-3 grid-rows-1 gap-4"
    >
      {/* Left: Image */}
      <div className="col-span-1 h-full">
        <img
          src={data?.productId?.images?.[0]?.imageUrl || ""}
          alt="Review image"
          className="object-cover w-full h-full rounded-l-lg"
        />
      </div>

      {/* Right: Review content */}
      <div className="col-span-2 pl-0 p-3 flex flex-col justify-around">
        <div className="px-2">
          {/* Stars */}
          <div className="flex mb-2">
            {renderStars(data?.avgRating || 0)}{" "}
            {/* Use the renderStars function */}
          </div>

          {/* Reviewer name */}
          <h3 className="lg:text-xl md:text-lg text-md font-bold text-gray-900">{`${data?.UserId?.firstName} ${data?.UserId?.lastName}`}</h3>
          {/* Review text */}
          {/* <p className="lg:text-md md:text-sm text-sm mt-2 text-gray-600">{data?.reviewText}</p> */}
          <p className="text-gray-600 mt-2 overflow-hidden text-ellipsis line-clamp-2 md:line-clamp-4">
            {data?.reviewText}
          </p>
        </div>
        <div className="px-5">
          {/* Product name */}
          <h3 className="lg:text-lg md:text-md text-sm font-semibold text-gray-700">
            {data?.productId?.productName.length > 25
              ? data?.productId?.productName.slice(0, 25) + "..."
              : data?.productId?.productName}
          </h3>
          {/* Price */}
          {/* <p className="lg:text-md md:text-sm text-sm mt-2 text-gray-600">{data?.productId?.variations?.length ? "$" + data?.productId?.variations?.[0]?.finalPrice : "$" + data?.productId?.totalPrice || "$" + data?.productId?.price}</p> */}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
