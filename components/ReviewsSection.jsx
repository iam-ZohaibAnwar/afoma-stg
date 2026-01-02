import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { generateStarIcons, formatDate } from "@/utils/productUtils";

const ReviewsSection = ({
  product,
  reviews,
  allReviews,
  isMobile = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 2;

  const currentReviews = useMemo(() => {
    if (!reviews || !Array.isArray(reviews)) return [];
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    return reviews.slice(startIndex, endIndex);
  }, [reviews, currentPage]);

  const totalPages = useMemo(() => {
    if (!reviews || !Array.isArray(reviews)) return 0;
    return Math.ceil(reviews.length / reviewsPerPage);
  }, [reviews]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!reviews || !allReviews || reviews.length === 0 || allReviews.length === 0) {
    return null;
  }

  const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;

  return (
    <div className={`${isMobile ? "px-4" : ""} pb-4 mb-4 border-b border-zinc-200`}>
      <h3 className="text-blue-950 font-semibold mb-3">
        {isMobile ? "Customer Reviews" : "Customer Reviews"}
      </h3>

      {/* Overall Rating Summary */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          {generateStarIcons(averageRating).map((star, index) => (
            <FontAwesomeIcon
              key={star.key}
              icon={faStar}
              className={`text-sm ${
                star.type === 'full' ? 'text-yellow-400' :
                star.type === 'half' ? 'text-yellow-400' :
                'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-blue-950 font-medium">
          {averageRating.toFixed(1)} out of 5
        </span>
        <span className="text-slate-600">
          ({allReviews.length} reviews)
        </span>
      </div>

      {/* Rating Breakdown */}
      <div className="mb-6">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = allReviews.filter(review => Math.floor(review.rating) === rating).length;
          const percentage = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-2 mb-2">
              <span className="text-sm text-blue-950 w-8">{rating} star</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-slate-600 w-8">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {currentReviews.map((review, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {generateStarIcons(review.rating).map((star, starIndex) => (
                  <FontAwesomeIcon
                    key={star.key}
                    icon={faStar}
                    className={`text-sm ${
                      star.type === 'full' ? 'text-yellow-400' :
                      star.type === 'half' ? 'text-yellow-400' :
                      'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-blue-950 font-medium">
                {review.rating}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-2 text-sm text-slate-600">
              <span>By {review.customerName || "Anonymous"}</span>
              <span>{formatDate(review.createdAt)}</span>
            </div>

            {review.comment && (
              <p className="text-blue-950 text-sm mb-2">
                {review.comment}
              </p>
            )}

            {/* Review Metrics */}
            {review.value && review.quality && review.price && (
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="text-center">
                  <div className="text-sm text-blue-950 font-medium">Value</div>
                  <div className="flex justify-center mt-1">
                    {generateStarIcons(review.value).map((star, starIndex) => (
                      <FontAwesomeIcon
                        key={star.key}
                        icon={faStar}
                        className={`text-xs ${
                          star.type === 'full' ? 'text-yellow-400' :
                          star.type === 'half' ? 'text-yellow-400' :
                          'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-blue-950 font-medium">Quality</div>
                  <div className="flex justify-center mt-1">
                    {generateStarIcons(review.quality).map((star, starIndex) => (
                      <FontAwesomeIcon
                        key={star.key}
                        icon={faStar}
                        className={`text-xs ${
                          star.type === 'full' ? 'text-yellow-400' :
                          star.type === 'half' ? 'text-yellow-400' :
                          'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-blue-950 font-medium">Price</div>
                  <div className="flex justify-center mt-1">
                    {generateStarIcons(review.price).map((star, starIndex) => (
                      <FontAwesomeIcon
                        key={star.key}
                        icon={faStar}
                        className={`text-xs ${
                          star.type === 'full' ? 'text-yellow-400' :
                          star.type === 'half' ? 'text-yellow-400' :
                          'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-950 hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'text-blue-950 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-950 hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
