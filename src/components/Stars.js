import React from "react";
import { FaStar, FaStarHalf } from "react-icons/fa";

export default ({ value }) => {
  if (!value) return null;

  // database values (0-6) converted to stars (0 to 3 stars with half steps)
  switch (value) {
    case 1:
      return (
        <span className="stars">
          <FaStarHalf />
        </span>
      );
    case 2:
      return (
        <span className="stars">
          <FaStar />
        </span>
      );
    case 3:
      return (
        <span className="stars">
          <FaStar />
          <FaStarHalf />
        </span>
      );
    case 4:
      return (
        <span className="stars">
          <FaStar />
          <FaStar />
        </span>
      );
    case 5:
      return (
        <span className="stars">
          <FaStar />
          <FaStar />
          <FaStarHalf />
        </span>
      );
    case 6:
      return (
        <span className="stars">
          <FaStar />
          <FaStar />
          <FaStar />
        </span>
      );
    default:
      return null;
  }
};
