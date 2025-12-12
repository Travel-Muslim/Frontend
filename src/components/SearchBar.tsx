import { useState, useEffect, useRef, useMemo } from "react";
import type { Destination } from "../api/destinations";

interface SearchBarProps {
  destinations?: Destination[];
  loading?: boolean;
  onSearch?: (from: string, to: string, date: string) => void;
  className?: string;
}

export default function SearchBar({ destinations = [], loading = false, onSearch, className = "" }: SearchBarProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [openField, setOpenField] = useState<"from" | "to" | "date" | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const { fromOptions, toOptions, dateOptions } = useMemo(() => {
    const unique = <T,>(arr: T[]) => Array.from(new Set(arr));
    const toOpts = unique(
      (destinations || [])
        .map((d) => d.location)
        .filter((v): v is string => Boolean(v))
    );
    const fromOpts = unique(
      (destinations || [])
        .map((d) => d.airport)
        .filter((v): v is string => Boolean(v))
    );
    const dateOpts = unique(
      (destinations || [])
        .flatMap((d) => d.period ?? [])
        .filter((v): v is string => Boolean(v))
    );
    return {
      fromOptions: fromOpts,
      toOptions: toOpts,
      dateOptions: dateOpts,
    };
  }, [destinations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpenField(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    onSearch?.(from, to, departDate);
  };

  const renderDropdown = (
    field: "from" | "to" | "date",
    items: string[],
    setter: (value: string) => void
  ) => {
    if (openField !== field) return null;
    if (!items.length) {
      return (
        <div className="search-dropdown-menu empty" role="listbox">
          <div className="search-dropdown-option" aria-disabled>
            {loading ? "Memuat data..." : "Belum ada data"}
          </div>
        </div>
      );
    }
    return (
      <div className="search-dropdown-menu" role="listbox">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className="search-dropdown-option"
            onClick={() => {
              setter(item);
              setOpenField(null);
            }}
          >
            {item}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div ref={rootRef} className={`search-bar-wrapper ${className}`.trim()}>
      <div className="search-bar">
        <div className="search-field">
          <span className="search-label">{from || "Dari"}</span>
          <button
            type="button"
            className="search-dropdown"
            aria-haspopup="listbox"
            aria-expanded={openField === "from"}
            onClick={() => setOpenField(openField === "from" ? null : "from")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {renderDropdown("from", fromOptions, setFrom)}
        </div>

        <div className="search-divider" />

        <div className="search-field">
          <span className="search-label">{to || "Ke"}</span>
          <button
            type="button"
            className="search-dropdown"
            aria-haspopup="listbox"
            aria-expanded={openField === "to"}
            onClick={() => setOpenField(openField === "to" ? null : "to")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {renderDropdown("to", toOptions, setTo)}
        </div>

        <div className="search-divider" />

        <div className="search-field">
          <span className="search-label">{departDate || "Pergi"}</span>
          <button
            type="button"
            className="search-dropdown"
            aria-haspopup="listbox"
            aria-expanded={openField === "date"}
            onClick={() => setOpenField(openField === "date" ? null : "date")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {renderDropdown("date", dateOptions, setDepartDate)}
        </div>

        <button type="button" className="search-btn" aria-label="Cari Destinasi" onClick={handleSearch}>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" />
            <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Cari Destinasi</span>
        </button>
      </div>
    </div>
  );
}
