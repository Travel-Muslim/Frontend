import React, { useState } from "react";
import "./StarRating.css";

interface StarRatingProps {
  rating?: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export default function StarRating({
  rating = 0,
  maxStars = 5,
  size = 40,
  interactive = false,
  onRatingChange,
  className = "",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleClick = (index: number) => {
    if (!interactive) return;
    setCurrentRating(index);
    onRatingChange?.(index);
  };

  const handleMouseEnter = (index: number) => {
    if (!interactive) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const displayRating = interactive ? hoverRating || currentRating : rating;

  return (
    <div className={`star-rating ${className}`}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starIndex = index + 1;
        const isFilled = starIndex <= displayRating;

        return (
          <button
            key={starIndex}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            className={`star-rating-button ${interactive ? "star-rating-button--interactive" : ""}`}
            disabled={!interactive}
            type="button"
            aria-label={`${starIndex} star${starIndex > 1 ? "s" : ""}`}
            title={`${starIndex} star${starIndex > 1 ? "s" : ""}`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={isFilled ? "#FBBF24" : "none"}
              stroke="#FBBF24"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
