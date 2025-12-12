import { useState, useRef } from "react";
import "./AddCommentForm.css";
import calendarPng from "../assets/icon/calendar.png";

const svgPaths = {
  // Calendar outline icon for date input
  p29da7c00:
    "M5 7a2 2 0 0 1 2-2h2V3h2v2h6V3h2v2h2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7zm2 4h16v12H7V11z",
  // Star icon for rating
  pa8fc380:
    "M30 5l7.725 15.65L55 23.175l-12.5 12.175L45.45 55 30 46.4 14.55 55 17.5 35.35 5 23.175l17.275-2.525L30 5z",
  // Edit/pencil icon for submit button
  p3750b800:
    "M11 22h10M17.5 3.5a2.121 2.121 0 0 1 3 3L8 19l-4 1 1-4 12.5-12.5z",
};

interface AddCommentFormProps {
  onSubmit?: (data: {
    name?: string;
    date: string;
    rating: number;
    topic: string;
    comment: string;
  }) => void;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="acf-star" viewBox="0 0 60 60" aria-hidden="true">
      <path
        d={svgPaths.pa8fc380}
        stroke="#fbbf24"
        fill={filled ? "#fbbf24" : "transparent"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.23"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="acf-edit" viewBox="0 0 30 30" aria-hidden="true">
      <path d={svgPaths.p3750b800} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function CalendarIcon() {
  return <img src={calendarPng} alt="" className="acf-calendar-img" />;
}

export default function AddCommentForm({ onSubmit }: AddCommentFormProps) {
  const [date, setDate] = useState("");
  const [rating, setRating] = useState(0);
  const [topic, setTopic] = useState("");
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = () => {
    if (onSubmit && date && rating > 0 && topic && comment) {
      onSubmit({ name: "User", date, rating, topic, comment });
    }
  };

  return (
    <div className="acf-card">
      <div className="acf-card__header">
        <h3>Tambahkan komentar anda</h3>
        <p>Bagikan pendapat, pengalaman, atau masukan anda, karena pendapat anda berarti!</p>
      </div>

      <div className="acf-field">
        <label>Tambahkan Judul Topik*</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Masukkan judul topik"
        />
      </div>

      <div className="acf-grid">
        <div className="acf-field">
          <label>Tanggal*</label>
          <div className="acf-date">
            <input
              ref={dateInputRef}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="mm/dd/yyyy"
            />
            <span
              className="acf-date__icon"
              onClick={() => {
                const el = dateInputRef.current;
                if (!el) return;
                const picker = (el as HTMLInputElement & { showPicker?: () => void }).showPicker;
                if (typeof picker === "function") {
                  picker();
                } else {
                  el.focus();
                }
              }}
              role="button"
              aria-label="Pilih tanggal"
            >
              <CalendarIcon />
            </span>
          </div>
        </div>

        <div className="acf-field">
          <label>Rating anda*</label>
          <div className="acf-rating" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className="acf-rating__btn"
                onMouseEnter={() => setHoverRating(star)}
                onClick={() => setRating(star)}
                aria-label={`Pilih rating ${star}`}
              >
                <StarIcon filled={star <= (hoverRating || rating)} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="acf-field">
        <label>Tambahkan Komentar*</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Masukkan komentar anda"
        />
      </div>

      <div className="acf-submit-wrap">
        <button type="button" className="acf-submit" onClick={handleSubmit}>
          <EditIcon />
          <span>Tambahkan Komentar</span>
        </button>
      </div>
    </div>
  );
}
