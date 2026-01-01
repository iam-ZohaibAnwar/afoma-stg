import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const RatingComponent = () => {
  const [valueRating, setValueRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [priceRating, setPriceRating] = useState(0);

  const handleStarClick = (category, rating) => {
    switch (category) {
      case "value":
        setValueRating(rating);
        break;
      case "quality":
        setQualityRating(rating);
        break;
      case "price":
        setPriceRating(rating);
        break;
      default:
        break;
    }
  };

  const submitRatings = () => {
    // Save ratings to the database or perform other actions
    //
    //
    //
    // Add logic to send the ratings to the server/database
  };

  return (
    <div className="flex flex-wrap gap-3 xl:gap-9 mb-6">
      {/* Value Rating */}
      <div className="flex items-center gap-1">
        <p className="text-sm text-slate-600 w-12">Value</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesomeIcon
              key={star}
              icon={faStar}
              className={`text-slate-600 cursor-pointer ${
                star <= valueRating ? "text-yellow-500" : ""
              }`}
              onClick={() => handleStarClick("value", star)}
            />
          ))}
        </div>
      </div>

      {/* Quality Rating */}
      <div className="flex items-center gap-1">
        <p className="text-sm text-slate-600 w-12">Quality</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesomeIcon
              key={star}
              icon={faStar}
              className={`text-slate-600 cursor-pointer ${
                star <= qualityRating ? "text-yellow-500" : ""
              }`}
              onClick={() => handleStarClick("quality", star)}
            />
          ))}
        </div>
      </div>

      {/* Price Rating */}
      <div className="flex items-center gap-1">
        <p className="text-sm text-slate-600 w-12">Price</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesomeIcon
              key={star}
              icon={faStar}
              className={`text-slate-600 cursor-pointer ${
                star <= priceRating ? "text-yellow-500" : ""
              }`}
              onClick={() => handleStarClick("price", star)}
            />
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button onClick={submitRatings} className="text-primary text-sm mb-9">
        Submit Ratings
      </button>
    </div>
  );
};

export default RatingComponent;
