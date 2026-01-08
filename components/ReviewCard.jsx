import { useRouter } from "next/router";
import React, { memo, useCallback, useMemo } from "react";
import Image from "next/image";

const ReviewCard = memo(({ data, index }) => {
  const router = useRouter();
  // Memoized function to render stars based on rating
  const renderStars = useCallback((rating) => {
    const fullStars = Math.floor(rating); // Full stars
    const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Half star if rating has a decimal of .5 or more
    const emptyStars = 5 - fullStars - halfStars; // Empty stars to fill up to 5

    return (
      <>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, idx) => (
          <svg
            key={`full-${idx}`}
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
        {[...Array(emptyStars)].map((_, idx) => (
          <svg
            key={`empty-${idx}`}
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
  }, []);

  // Memoize computed values
  const stars = useMemo(() => renderStars(data?.avgRating || 0), [data?.avgRating, renderStars]);
  const reviewerName = useMemo(() => `${data?.UserId?.firstName || ''} ${data?.UserId?.lastName || ''}`, [data?.UserId?.firstName, data?.UserId?.lastName]);
  const productName = useMemo(() => {
    const name = data?.productId?.productName || '';
    return name.length > 25 ? name.slice(0, 25) + "..." : name;
  }, [data?.productId?.productName]);

  const handleClick = useCallback(() => {
    if (typeof window === 'undefined') return;
    let isMobile = window.innerWidth < 768;
    let hashTarget = isMobile ? "#customerReviewsMobile" : "#customerReviews";
    router.push(
      `category/${data?.productId?.Category?.slug}/${data?.productId?.SubCategory?.slug}${
        data?.productId?.childCategory?.slug ? "/" + data?.productId?.childCategory?.slug : ""
      }/${data?.productId?.slug}${hashTarget}`
    );
  }, [data?.productId, router]);

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer lg:min-w-[600px] min-w-[400px] col-span-1 mx-auto my-8 bg-white shadow-lg rounded-lg h-[200px] lg:h-[300px] grid grid-cols-3 grid-rows-1 gap-4"
    >
      {/* Left: Image */}
      <div className="col-span-1 h-full relative">
        <Image
          src={data?.productId?.images?.[0]?.imageUrl || "/placeholder.jpg"}
          alt="Review image"
          fill
          className="object-cover rounded-l-lg"
          loading="lazy"
          sizes="(max-width: 768px) 133px, 200px"
        />
      </div>

      {/* Right: Review content */}
      <div className="col-span-2 pl-0 p-3 flex flex-col justify-around">
        <div className="px-2">
          {/* Stars */}
          <div className="flex mb-2">
            {stars}
          </div>

          {/* Reviewer name */}
          <h3 className="lg:text-xl md:text-lg text-md font-bold text-gray-900">{reviewerName}</h3>
          {/* Review text */}
          <p className="text-gray-600 mt-2 overflow-hidden text-ellipsis line-clamp-2 md:line-clamp-4">
            {data?.reviewText}
          </p>
        </div>
        <div className="px-5">
          {/* Product name */}
          <h3 className="lg:text-lg md:text-md text-sm font-semibold text-gray-700">
            {productName}
          </h3>
        </div>
      </div>
    </div>
  );
});

ReviewCard.displayName = "ReviewCard";

export default ReviewCard;
