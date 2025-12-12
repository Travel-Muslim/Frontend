import React from "react";
import "./DestinationCard.css";
import Icon from "./Icon";
declare const require: any;

interface Props {
  image: string;
  location: string;
  title: string;
  price: string;
  isWished?: boolean;
  onWishlistClick?: () => void;
}

export default function DestinationCard({
  image,
  location,
  title,
  price,
  isWished = false,
  onWishlistClick,
}: Props) {
  let img: string;
  try {
    img = require(`../assets/images/${image}`);
  } catch {
    img = image;
  }

  return (
    <article className="dc-card">
      <div className="dc-media">
        <img src={img} alt={title} className="dc-image" loading="lazy" />

        <button className="dc-wish" onClick={onWishlistClick}>
          <Icon name={isWished ? "heart-filled" : "heart"} size={18} />
        </button>
      </div>

      <div className="dc-body">
        <div className="dc-location">
          <Icon name="map-pin" size={16} />
          <span>{location}</span>
        </div>

        <h3>{title}</h3>
        <strong style={{ color: "var(--accent)" }}>{price}</strong>
      </div>
    </article>
  );
}
