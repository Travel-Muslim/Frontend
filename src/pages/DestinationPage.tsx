import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Destination } from "../api/destinations";
import { fetchDestination } from "../api/destinations";
import { pushRecentDestination } from "../utils/recentDestinations";
import { readReviews } from "../utils/reviews";
import type { UserReview } from "../utils/reviews";
import BookingForm, { type BookingFormData } from "../components/BookingForm";
import SuccessModal from "../components/SuccessModal";
import "./DestinationPage.css";
import mapPinIcon from "../assets/icon/map-pin.png";
import clockIcon from "../assets/icon/clock.png";
import calendarIcon from "../assets/icon/calendar.png";
import planeIcon from "../assets/icon/plane.png";
import airportIcon from "../assets/icon/airport.png";
import wishlistIcon from "../assets/icon/Heart.png";
import transportIcon from "../assets/icon/transport.png";
import mosqueIcon from "../assets/icon/mosque.png";
import foodIcon from "../assets/icon/food.png";
import starIcon from "../assets/icon/star.png";
import avatarDefault from "../assets/icon/avatar-default.svg";

type TabKey = "itenary" | "booking" | "testimoni";

const STORAGE_WISHLIST = "wishlist-liked-ids";
const WHATSAPP_LINK = "https://wa.me/628113446846";

type ItineraryDay = {
  day: string;
  destinasi: string[];
  makan: string[];
  masjid: string[];
  transportasi: string[];
};

const DEFAULT_ITINERARY: ItineraryDay[] = [
  {
    day: "Hari 1",
    destinasi: ["Rincian itinerary belum tersedia"],
    makan: [],
    masjid: [],
    transportasi: [],
  },
];

const formatPrice = (v?: number) => (v ? `Rp ${v.toLocaleString("id-ID")}` : "");

const formatPeriod = (period?: string[]) => {
  if (!period?.length) return "-";
  if (period.length === 1) return period[0];
  const first = period[0];
  const last = period[period.length - 1];
  return `${first.split(" ").slice(0, 3).join(" ")} - ${last.split(" ").slice(0, 3).join(" ")}`;
};

export default function DestinationPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stateDest = (location.state as { dest?: Destination } | undefined)?.dest;

  const [destination, setDestination] = useState<Destination | null>(stateDest ?? null);
  const [loading, setLoading] = useState(!stateDest);
  const [activeTab, setActiveTab] = useState<TabKey>("itenary");
  const [liked, setLiked] = useState(false);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [wishlistAlertOpen, setWishlistAlertOpen] = useState(false);

  useEffect(() => {
    if (destination?.title) {
      document.title = `${destination.title} | Saleema Tour`;
    }
  }, [destination?.title]);

  useEffect(() => {
    if (!id || stateDest) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    fetchDestination(id)
      .then((data) => {
        if (active) setDestination(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, stateDest]);

  useEffect(() => {
    if (!destination) return;
    const saved = localStorage.getItem(STORAGE_WISHLIST);
    if (saved) {
      try {
        const arr = JSON.parse(saved) as Array<string | number>;
        setLiked(arr.some((val) => String(val) === String(destination.id)));
      } catch {
        setLiked(false);
      }
    } else {
      setLiked(false);
    }
  }, [destination?.id]);

  useEffect(() => {
    if (!destination) return;
    pushRecentDestination(destination);
  }, [destination]);

  useEffect(() => {
    if (!destination) return;
    const destId = Number(destination.id);
    setUserReviews(readReviews(destId));
    const handler = () => setUserReviews(readReviews(destId));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [destination?.id]);

  const itinerary = useMemo(() => {
    if (destination?.itinerary?.length) {
      return destination.itinerary.map((item, idx) => ({
        day: item.day || `Hari ${idx + 1}`,
        destinasi: item.destinasi?.length ? item.destinasi : ["Destinasi belum tersedia"],
        makan: item.makan ?? [],
        masjid: item.masjid ?? [],
        transportasi: item.transportasi ?? [],
      }));
    }
    return DEFAULT_ITINERARY;
  }, [destination?.itinerary]);

  const toggleWishlist = () => {
    if (!destination) return;
    const saved = localStorage.getItem(STORAGE_WISHLIST);
    let arr: Array<string | number> = saved ? JSON.parse(saved) : [];
    if (arr.some((val) => String(val) === String(destination.id))) {
      arr = arr.filter((val) => String(val) !== String(destination.id));
      setLiked(false);
    } else {
      arr = [destination.id, ...arr];
      setLiked(true);
      setWishlistAlertOpen(true);
    }
    localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(arr));
  };

  const handleBooking = (data?: BookingFormData) => {
    if (!destination) return;
    navigate("/pembayaran", {
      state: {
        formData: data,
        dest: destination,
      },
    });
  };

  const handleContact = () => {
    window.open(WHATSAPP_LINK, "_blank");
  };

  const reviewsToShow = useMemo(
    () =>
      userReviews.map((r) => ({
        id: `u-${r.id}`,
        name: r.title || "Pengguna",
        rating: r.rating,
        text: r.text,
        image: r.image || "/avatar.jpg",
      })),
    [userReviews]
  );

  if (loading) {
    return (
      <div className="dp-page">
        <div className="dp-empty">Memuat detail destinasi...</div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="dp-page">
        <div className="dp-empty">
          Destinasi tidak ditemukan.
          <div className="dp-cta-row">
            <button className="dp-btn dp-btn-primary" onClick={() => navigate("/cari-destinasi")}>
              Kembali ke pencarian
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dp-page">
      <section className="dp-hero-new">
        <div className="dp-hero-card">
          <div className="dp-hero-left">
            {destination.image ? <img src={destination.image} alt={destination.title} /> : <div className="dp-image-placeholder" />}
          </div>
          <div className="dp-hero-right">
            <h1 className="dp-title">{destination.title}</h1>

            <div className="dp-meta-list">
              <div className="dp-meta-row">
                <div className="dp-meta-item">
                  <img src={mapPinIcon} alt="" />
                  <span>{destination.location}</span>
                </div>
                <div className="dp-meta-item">
                  <img src={clockIcon} alt="" />
                  <span>{destination.duration || "-"}</span>
                </div>
              </div>

              <div className="dp-meta-row">
                <div className="dp-meta-item">
                  <img src={calendarIcon} alt="" />
                  <span>{destination.period?.slice(0, 3).join(", ") || "-"}</span>
                </div>
              </div>

              <div className="dp-meta-row">
                <div className="dp-meta-item">
                  <img src={planeIcon} alt="" />
                  <span>{destination.airline || "-"}</span>
                </div>
                <div className="dp-meta-item">
                  <img src={airportIcon} alt="" />
                  <span>{destination.airport || "-"}</span>
                </div>
              </div>
            </div>

            <div className="dp-price-row">
              <div className="dp-price-label">Harga</div>
              <div className="dp-price-value">{formatPrice(destination.price)} / pax</div>
            </div>

            <div className="dp-cta-row">
              <button className={`dp-btn dp-btn-wishlist ${liked ? "active" : ""}`} onClick={toggleWishlist}>
                <img src={wishlistIcon} alt="" />
                {liked ? "Tersimpan di Wishlist" : "Tambahkan Ke Wishlist"}
              </button>
              <button className="dp-btn dp-btn-primary" onClick={() => handleBooking()}>
                Booking
              </button>
              <button className="dp-btn dp-btn-ghost" onClick={handleContact}>
                Hubungi CS
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="dp-tabs-new" role="tablist" aria-label="Konten destinasi">
        <button
          className={`dp-tab-new ${activeTab === "itenary" ? "active" : ""}`}
          onClick={() => setActiveTab("itenary")}
          role="tab"
          aria-selected={activeTab === "itenary"}
        >
          Itenary
        </button>
        <button
          className={`dp-tab-new ${activeTab === "booking" ? "active" : ""}`}
          onClick={() => setActiveTab("booking")}
          role="tab"
          aria-selected={activeTab === "booking"}
        >
          Booking
        </button>
        <button
          className={`dp-tab-new ${activeTab === "testimoni" ? "active" : ""}`}
          onClick={() => setActiveTab("testimoni")}
          role="tab"
          aria-selected={activeTab === "testimoni"}
        >
          Testimoni
        </button>
      </div>

      <main className="dp-content-new">
        {activeTab === "itenary" && (
          <section className="dp-itinerary-card" role="tabpanel">
            <h2 className="dp-section-title">{destination.title}</h2>
            <p className="dp-section-sub">{formatPeriod(destination.period)}</p>

            <div className="dp-itinerary-grid">
              <div className="dp-itinerary-head">
                <div className="head-cell">
                  <img src={calendarIcon} alt="" /> Hari
                </div>
                <div className="head-cell">
                  <img src={mapPinIcon} alt="" /> Destinasi
                </div>
                <div className="head-cell">
                  <img src={foodIcon} alt="" /> Makan
                </div>
                <div className="head-cell">
                  <img src={mosqueIcon} alt="" /> Masjid
                </div>
                <div className="head-cell">
                  <img src={transportIcon} alt="" /> Transportasi
                </div>
              </div>

              {itinerary.map((day) => (
                <div className="dp-itinerary-row" key={day.day}>
                  <div className="body-cell day-cell">{day.day}</div>
                  <div className="body-cell">{day.destinasi.map((i) => <div key={i}>- {i}</div>)}</div>
                  <div className="body-cell">{day.makan.map((i) => <div key={i}>- {i}</div>)}</div>
                  <div className="body-cell">{day.masjid.map((i) => <div key={i}>- {i}</div>)}</div>
                  <div className="body-cell">{day.transportasi.map((i) => <div key={i}>- {i}</div>)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "booking" && (
          <section className="dp-booking-card" role="tabpanel">
            <div className="dp-booking-header">
              <h2>Booking Sekarang</h2>
              <p>
                Lengkapi proses booking Anda dengan melanjutkan ke tahap pembayaran. Pastikan data sudah sesuai sebelum melanjutkan.
              </p>
            </div>
            <BookingForm onSubmit={handleBooking} />
          </section>
        )}

        {activeTab === "testimoni" && (
          <section className="dp-testimonial-card" role="tabpanel">
            <h3 className="dp-test-title">Testimoni Pengguna</h3>
            {reviewsToShow.length === 0 ? (
              <p className="dp-empty">Belum ada testimoni, jadilah yang pertama!</p>
            ) : (
              <div className="dp-test-grid-gallery">
                {reviewsToShow.map((t) => (
                  <article key={t.id} className="dp-test-card-gallery">
                    <div className="dp-test-image">
                      <img src={t.image || "/avatar.jpg"} alt={t.name} />
                    </div>
                    <div className="dp-test-body">
                      <div className="dp-test-meta-row">
                        <div className="dp-test-avatar">
                          <img src={t.image || avatarDefault} alt={t.name} />
                        </div>
                        <div className="dp-test-meta-text">
                          <div className="dp-test-name">{t.name}</div>
                          <div className="dp-test-rating">
                            <img src={starIcon} alt="" /> {t.rating}
                          </div>
                        </div>
                      </div>
                      <p className="dp-test-text">{t.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <SuccessModal
        isOpen={wishlistAlertOpen}
        onClose={() => setWishlistAlertOpen(false)}
        title="Berhasil Menambahkan Wishlist!"
        message="Wishlist destinasi Anda berhasil ditambahkan"
        primaryText="Selanjutnya"
        type="success"
      />
    </div>
  );
}
