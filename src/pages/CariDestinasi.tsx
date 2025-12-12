import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Destination } from "../api/destinations";
import { fetchDestinations } from "../api/destinations";
import searchIcon from "../assets/icon/search.png";
import mapPinIcon from "../assets/icon/map-pin.png";
import planeIcon from "../assets/icon/plane.png";
import calendarIcon from "../assets/icon/calendar.png";
import "./CariDestinasi.css";

const formatCurrency = (value?: number) => (value ? `Rp${value.toLocaleString("id-ID")}` : "");

const formatPeriod = (period?: string[]) => {
  if (!period || period.length === 0) return "";
  const parse = (value: string) => {
    const parts = value.split(" ");
    const month = parts[1];
    const year = parts[2];
    return { month, year };
  };
  const first = parse(period[0]);
  const last = parse(period[period.length - 1]);
  if (first.month && last.month) {
    if (first.year === last.year) return `${first.month} - ${last.month} ${first.year}`;
    return `${first.month} ${first.year} - ${last.month} ${last.year}`;
  }
  return period.join(", ");
};

function DestinationCard({ dest, onDetails }: { dest: Destination; onDetails: () => void }) {
  return (
    <article className="cd-card" role="listitem">
      <div className="cd-card-media">
        {dest.image ? <img src={dest.image} alt={dest.title} loading="lazy" /> : <div className="cd-image-placeholder" />}
      </div>
      <div className="cd-card-body">
        <div className="cd-card-title">{dest.title}</div>
        <div className="cd-card-meta">
          <div className="cd-meta-row">
            <span className="cd-meta-item">
              <img src={mapPinIcon} alt="" aria-hidden="true" />
              {dest.location}
            </span>
            <span className="cd-meta-bullet" />
            <span className="cd-meta-item">
              <img src={planeIcon} alt="" aria-hidden="true" />
              {dest.airline}
            </span>
          </div>
          <div className="cd-meta-row">
            <span className="cd-meta-item">
              <img src={calendarIcon} alt="" aria-hidden="true" />
              {formatPeriod(dest.period)}
            </span>
          </div>
        </div>
        <div className="cd-card-footer">
          <div className="cd-price-block">
            <span className="cd-price-label">Mulai dari</span>
            <span className="cd-price">{formatCurrency(dest.price)}</span>
          </div>
          <button type="button" className="cd-detail-btn" onClick={onDetails}>
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

export default function CariDestinasi() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? searchParams.get("to") ?? "");
  const [fromFilter, setFromFilter] = useState(searchParams.get("from") ?? "");
  const [dateFilter, setDateFilter] = useState(searchParams.get("date") ?? "");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Cari Destinasi | Saleema Tour";
  }, []);

  useEffect(() => {
    const incomingQ = searchParams.get("q") ?? searchParams.get("to") ?? "";
    const incomingFrom = searchParams.get("from") ?? "";
    const incomingDate = searchParams.get("date") ?? "";
    setQuery((prev) => (prev === incomingQ ? prev : incomingQ));
    setFromFilter((prev) => (prev === incomingFrom ? prev : incomingFrom));
    setDateFilter((prev) => (prev === incomingDate ? prev : incomingDate));
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchDestinations()
      .then((list) => {
        if (active) setDestinations(list);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) {
      next.set("q", value);
    } else {
      next.delete("q");
      next.delete("to");
    }
    setSearchParams(next);
  };

  const filteredDestinations = useMemo(() => {
    const q = query.trim().toLowerCase();
    const from = fromFilter.trim().toLowerCase();
    const date = dateFilter.trim().toLowerCase();
    return destinations.filter((dest) => {
      const base = [dest.title, dest.location, dest.airline].filter(Boolean).join(" ").toLowerCase();
      const fromText = `${dest.airport || ""} ${dest.location || ""}`.toLowerCase();
      const dateMatch = (dest.period ?? []).some((p) => p.toLowerCase().includes(date));
      const matchQ = q ? base.includes(q) : true;
      const matchFrom = from ? fromText.includes(from) : true;
      const matchDate = date ? dateMatch : true;
      return matchQ && matchFrom && matchDate;
    });
  }, [query, fromFilter, dateFilter, destinations]);

  const primaryDestinations = filteredDestinations.slice(0, 3);
  const secondaryDestinations = filteredDestinations.slice(3, 6);

  return (
    <div className="cd-page">
      <section className="cd-hero">
        <div className="cd-hero-inner">
          <h1>Cari Destinasi</h1>
          <p>
            Jelajahi setiap sudut dunia dan temukan destinasi impian anda untuk memberikan pengalaman
            perjalanan yang aman dan sesuai dengan kebutuhan Muslimah.
          </p>
          <div className="cd-search">
            <img src={searchIcon} alt="" aria-hidden="true" />
            <input
              type="text"
              value={query}
              placeholder="Cari Destinasi Tour"
              onChange={(e) => handleInputChange(e.target.value)}
              aria-label="Cari destinasi"
            />
          </div>
        </div>
      </section>

      <main className="cd-content">
        <section className="cd-section">
          <h2>Mulai pencarian destinasi sesuai minat perjalanan Anda</h2>
          <div className="cd-grid" role="list">
            {loading ? (
              <div className="cd-empty">Memuat destinasi...</div>
            ) : primaryDestinations.length === 0 ? (
              <div className="cd-empty">Destinasi tidak ditemukan.</div>
            ) : (
              primaryDestinations.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  dest={dest}
                  onDetails={() => navigate(`/destinasi/${dest.id}`, { state: { dest } })}
                />
              ))
            )}
          </div>
        </section>

        {!loading && secondaryDestinations.length > 0 && (
          <section className="cd-section cd-section--secondary">
            <h2>Destinasi terbaik untuk perjalanan Anda tersedia di sini</h2>
            <div className="cd-grid" role="list">
              {secondaryDestinations.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  dest={dest}
                  onDetails={() => navigate(`/destinasi/${dest.id}`, { state: { dest } })}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
