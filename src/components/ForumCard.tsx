import React from "react";
import starIcon from "../assets/icon/star.png";
import "./ForumCard.css";

interface ForumCardProps {
  avatar: string;
  name: string;
  rating: number;
  timeAgo: string;
  title: string;
  description: string;
}

function Star() {
  return (
    <div className="forum-card__star">
      <img src={starIcon} alt="star" />
    </div>
  );
}

export default function ForumCard({ avatar, name, rating, timeAgo, title, description }: ForumCardProps) {
  return (
    <div className="forum-card">
      <div className="forum-card__body">
        <div className="forum-card__text">
          <p className="forum-card__title">{title}</p>
          <p className="forum-card__desc">{description}</p>
        </div>

        <div className="forum-card__profile">
          <div className="forum-card__avatar">
            <img src={avatar} alt={name} />
          </div>
          <div className="forum-card__meta">
            <p className="forum-card__name">{name}</p>
            <div className="forum-card__rating-row">
              <div className="forum-card__rating">
                <Star />
                <span>{(typeof rating === "number" ? rating : Number(rating) || 0).toFixed(1)}</span>
              </div>
              <span className="forum-card__time">{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
