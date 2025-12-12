// src/components/StatCard.tsx
import React from "react";
import "./StatCard.css";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export default function StatCard({ value, label, className = "" }: StatCardProps) {
  // debug quick-check - buka console di browser saat halaman dimuat
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("StatCard render ->", { value, label });
  }

  return (
    <div className={`stat-card ${className}`} role="group" aria-label={`${label} ${value}`}>
      <div className="stat-value" aria-hidden="false">
        {value}
      </div>
      <div className="stat-label">
        {label}
      </div>
    </div>
  );
}
