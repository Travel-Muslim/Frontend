import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";
import wishlistIcon from "../assets/icon/wishlist.png";
import type { Destination } from "../api/destinations";
import { fetchDestinations } from "../api/destinations";
import { readRecentDestinations, pushRecentDestination } from "../utils/recentDestinations";

interface WishlistItem {
  id: string;
  image: string;
  location: string;
  title: string;
  price: string;
  region?: string;
  destination?: Destination;
}

type FilterOption = string;

const STORAGE_WISHLIST = "wishlist-liked-ids";

const formatCurrency = (value?: number) => (value ? `Rp${value.toLocaleString("id-ID")}` : "Rp0");

const deriveRegion = (dest: Destination): string => {
  const location = (dest.location || "").toLowerCase();
  const continent = (dest as any).continent ? String((dest as any).continent).toLowerCase() : "";
  if (continent.includes("eropa") || location.includes("eropa") || location.includes("europe")) return "Eropa";
  if (continent.includes("middle") || location.includes("arab") || location.includes("turki") || location.includes("dubai")) return "Middle East";
  return "Asia";
};

const mapDestinationToWishlistItem = (dest: Destination): WishlistItem => ({
  id: String(dest.id),
  image: dest.image || "",
  location: dest.location || "-",
  title: dest.title || "",
  price: formatCurrency(dest.price),
  region: deriveRegion(dest),
  destination: dest,
});

const readWishlistIds = (): string[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_WISHLIST);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Array<string | number>;
    return parsed.map((v) => String(v));
  } catch {
    return [];
  }
};

const writeWishlistIds = (ids: string[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(ids));
};

export default function Wishlist() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("All");
  const [activeSection, setActiveSection] = useState<"wishlist" | "recent">("wishlist");
  const [filterOpen, setFilterOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [recentDestinations, setRecentDestinations] = useState<Destination[]>(() => readRecentDestinations());
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => readWishlistIds());
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchDestinations()
      .then((data) => {
        if (active) setDestinations(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (activeSection !== "wishlist") {
      setFilterOpen(false);
    }
  }, [activeSection]);

  useEffect(() => {
    const handleStorage = () => {
      setRecentDestinations(readRecentDestinations());
      setWishlistIds(readWishlistIds());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const wishlistDestinations = useMemo(
    () => destinations.filter((dest) => wishlistIds.includes(String(dest.id))),
    [destinations, wishlistIds]
  );

  const wishlistItems = useMemo(() => wishlistDestinations.map(mapDestinationToWishlistItem), [wishlistDestinations]);

  const regionOptions: FilterOption[] = useMemo(() => {
    const set = new Set<FilterOption>(["All"]);
    wishlistItems.forEach((item) => {
      if (item.region) set.add(item.region);
    });
    return Array.from(set);
  }, [wishlistItems]);

  useEffect(() => {
    if (!regionOptions.includes(selectedFilter)) {
      setSelectedFilter(regionOptions[0] || "All");
    }
  }, [regionOptions, selectedFilter]);

  const handleDelete = (id: string) => {
    const updatedIds = wishlistIds.filter((val) => val !== id);
    setWishlistIds(updatedIds);
    writeWishlistIds(updatedIds);
    setAlertVisible(true);
  };

  const handleNavigate = (item: WishlistItem) => {
    const dest = wishlistDestinations.find((d) => String(d.id) === item.id) || item.destination;
    if (dest) {
      pushRecentDestination(dest);
      navigate(`/destinasi/${dest.id}`, { state: { dest } });
    } else {
      navigate(`/destinasi/${item.id}`);
    }
  };

  const handleFilterToggle = () => {
    if (activeSection !== "wishlist") return;
    setFilterOpen((prev) => !prev);
  };

  const handleFilterSelect = (option: FilterOption) => {
    setSelectedFilter(option);
    setFilterOpen(false);
  };

  const recentViewItems = useMemo(() => {
    const source = recentDestinations.length ? recentDestinations : destinations.slice(0, 3);
    return source.map(mapDestinationToWishlistItem);
  }, [recentDestinations, destinations]);

  const filteredWishlistItems = wishlistItems.filter((item) =>
    selectedFilter === "All" ? true : item.region === selectedFilter
  );
  const isWishlistActive = activeSection === "wishlist";
  const displayedItems = isWishlistActive ? filteredWishlistItems : recentViewItems;
  const showDeleteButton = activeSection === "wishlist";

  return (
    <div className="wishlist-page-wrapper">
      <div className="wishlist-page-container">
        <div className="wishlist-page-header">
          <div className="wishlist-page-title-wrapper">
            <h1 className="wishlist-page-title">Wishlist</h1>
          </div>
          {isWishlistActive && (
            <div className="wishlist-filter-wrapper">
              <div className="wishlist-filter-dropdown-wrapper" ref={filterRef}>
                <button
                  className="wishlist-filter-button"
                  type="button"
                  onClick={handleFilterToggle}
                  aria-haspopup="listbox"
                  aria-expanded={filterOpen}
                >
                  <span className="wishlist-filter-text">{selectedFilter}</span>
                  <div className="wishlist-chevron-icon" aria-hidden>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                {filterOpen && (
                  <div className="wishlist-filter-dropdown" role="listbox">
                    {regionOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`wishlist-filter-dropdown-item ${option === selectedFilter ? "active" : ""}`}
                        onClick={() => handleFilterSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="wishlist-section-tabs">
          <button
            className={`wishlist-section-tab ${activeSection === "wishlist" ? "active" : ""}`}
            onClick={() => setActiveSection("wishlist")}
            type="button"
          >
            Wishlist Destinasi
          </button>
          <button
            className={`wishlist-section-tab ${activeSection === "recent" ? "active" : ""}`}
            onClick={() => setActiveSection("recent")}
            type="button"
          >
            Destinasi Terakhir Dilihat
          </button>
        </div>

        <div className="wishlist-section-heading">
          <div className={`wishlist-section-heading-item ${isWishlistActive ? "active" : ""}`}>
            <h2>Wishlist Destinasi</h2>
            <div className="wishlist-section-underline" />
          </div>
          <div className={`wishlist-section-heading-item ${!isWishlistActive ? "active" : ""}`}>
            <h2>Destinasi Terakhir Dilihat</h2>
            <div className="wishlist-section-underline" />
          </div>
        </div>

        <div className="wishlist-content-area">
          {loading ? (
            <div className="wishlist-empty-state">
              <p className="wishlist-empty-text">Memuat destinasi...</p>
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="wishlist-empty-state">
              <p className="wishlist-empty-text">
                {activeSection === "wishlist"
                  ? "Belum ada destinasi pada wishlist Anda."
                  : "Belum ada destinasi terakhir dilihat."}
              </p>
            </div>
          ) : (
            <div className="wishlist-cards-grid">
              {displayedItems.map((item) => (
                <div
                  key={item.id}
                  className="wishlist-card-container"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleNavigate(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleNavigate(item);
                    }
                  }}
                >
                  <div className="wishlist-card-image-wrapper">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="wishlist-card-image" />
                    ) : (
                      <div className="wishlist-card-image-placeholder" />
                    )}
                  </div>
                  <div className="wishlist-card-body">
                    <div className="wishlist-card-location-row">
                      <div className="wishlist-location-icon-wrapper">
                        <div className="wishlist-location-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path
                              d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"
                              stroke="#444444"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle
                              cx="12"
                              cy="10"
                              r="3"
                              stroke="#444444"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="wishlist-location-text-wrapper">
                        <p className="wishlist-location-text">{item.location}</p>
                      </div>
                    </div>

                    <div className="wishlist-card-title-wrapper">
                      <p className="wishlist-card-title-text">{item.title}</p>
                    </div>

                    <div className="wishlist-card-footer-row">
                      <div className="wishlist-card-price-wrapper">
                        <p className="wishlist-card-price-text">{item.price}</p>
                      </div>
                      {showDeleteButton && (
                        <div className="wishlist-delete-button-wrapper">
                          <button
                            className="wishlist-delete-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            aria-label="Hapus dari wishlist"
                          >
                            <div className="wishlist-delete-icon">
                              <img src={wishlistIcon} alt="Wishlist Icon" className="wishlist-delete-icon-img" />
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {alertVisible && (
        <div className="wishlist-alert-overlay" role="alert">
          <div className="wishlist-alert-card">
            <div className="wishlist-alert-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
                <circle cx="24" cy="24" r="24" fill="#fbcbcb" />
                <path
                  d="M15 24L21 30L33 18"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Berhasil Menghapus Wishlist</h3>
            <p>Wishlist destinasi Anda berhasil dihapus</p>
            <button
              type="button"
              className="wishlist-alert-button"
              onClick={() => setAlertVisible(false)}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
