import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  faStarHalfAlt,
  faStar as farStar,
} from "@fortawesome/pro-regular-svg-icons";

const StarRating = ({ avgValue, avgQuality, avgPrice }) => {
  const getStarRating = (average) => {
    const maxStars = 5;

    if (average === null || isNaN(average) || average <= 0) {
      // No reviews, render all blank stars
      return Array.from({ length: maxStars }, (_, index) => (
        <FontAwesomeIcon
          key={`empty-${index}`}
          icon={farStar}
          className="text-slate-600 cursor-pointer"
        />
      ));
    }

    const roundedValue = Math.round(average * 2) / 2; // Corrected rounding to the nearest half
    const fullStars = Math.floor(roundedValue);
    const hasHalfStar = roundedValue % 1 !== 0;

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className="text-amber-400 cursor-pointer"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half"
          icon={faStarHalfAlt}
          className="text-amber-400 cursor-pointer"
        />
      );
    }

    const emptyStars = maxStars - stars.length;

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={farStar}
          className="text-slate-600 cursor-pointer"
        />
      );
    }

    return stars;
  };

  return (
    <>
      <div className="flex items-center mb-2 gap-4">
        <p className="text-sm text-slate-600 w-12">Value</p>
        <div className="flex items-center gap-1">{getStarRating(avgValue)}</div>
      </div>
      <div className="flex items-center mb-2 gap-4">
        <p className="text-sm text-slate-600 w-12">Quality</p>
        <div className="flex items-center gap-1">
          {getStarRating(avgQuality)}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-sm text-slate-600 w-12">Price</p>
        <div className="flex items-center gap-1">{getStarRating(avgPrice)}</div>
      </div>
    </>
  );
};

export default StarRating;
