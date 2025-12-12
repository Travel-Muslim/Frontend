import React from "react";
import Button from "./Button";

export interface ArticleCardProps {
  image: string;
  title: string;
  description: string;
  onReadClick?: () => void;
}

export default function ArticleCard({ image, title, description, onReadClick }: ArticleCardProps) {
  return (
    <div className="article-card-wrapper">
      <div className="article-card-container">
        {/* Article Image */}
        <div className="article-card-image-wrapper">
          {image ? (
            <img src={image} alt={title} className="article-card-image" />
          ) : (
            <div className="article-card-image-placeholder" />
          )}
        </div>

        {/* Article Content */}
        <div className="article-card-content">
          <div className="article-card-title-wrapper">
            <h3 className="article-card-title">{title}</h3>
          </div>
          <div className="article-card-description-wrapper">
            <p className="article-card-description">{description}</p>
          </div>
          
          {/* Read Button */}
          <div className="article-card-button-wrapper">
            <Button
              variant="purple-light"
              showArrows={false}
              onClick={onReadClick}
              className="article-read-button"
            >
              Lihat Artikel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
