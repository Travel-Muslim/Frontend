import React from "react";
import starIcon from "../assets/icon/star.png";
import "./RecentCommenters.css";

interface Commenter {
  avatar: string;
  name: string;
  rating: number;
}

interface RecentCommentersProps {
  commenters: Commenter[];
}

export default function RecentCommenters({ commenters }: RecentCommentersProps) {
  return (
    <div className="recent-card">
      <div className="recent-card__header">
        <p>Pengomentar Terbaru</p>
      </div>

      <div className="recent-card__list">
        {(commenters || []).map((c, i) => (
          <div className="recent-card__item" key={`${c.name}-${i}`}>
            <div className="recent-card__avatar">
              <img src={c.avatar} alt={c.name} />
            </div>
            <div className="recent-card__meta">
              <p className="recent-card__name">{c.name}</p>
              <div className="recent-card__rating">
                <img src={starIcon} alt="star" />
                <span>{(typeof c.rating === "number" ? c.rating : Number(c.rating) || 0).toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
