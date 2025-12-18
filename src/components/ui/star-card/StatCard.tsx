// src/components/StatCard.tsx
import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
  variant?: 'default' | 'small';
}

export default function StatCard({
  value,
  label,
  className = '',
  variant = 'default',
}: StatCardProps) {
  // debug quick-check - buka console di browser saat halaman dimuat
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('StatCard render ->', { value, label });
  }

  const isSmall = variant === 'small';

  return (
    <div
      className={`
        bg-white 
        border border-[#f1e5ff] 
        rounded-[10px] sm:rounded-[14px]
        flex flex-col 
        items-center justify-center 
        gap-2
        shrink-0
        shadow-[0px_14px_24px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03)]
        focus:outline-[3px] focus:outline-[rgba(109,72,145,0.16)] focus:outline-offset-2
        ${
          isSmall
            ? 'px-3.5 py-3 min-w-[160px]'
            : 'px-5 py-[18px] sm:py-3 min-w-[3rem] w-[5.5rem]'
        }
        ${className}
      `}
      role="group"
      aria-label={`${label} ${value}`}
    >
      <div
        className={`
          text-[#444444] 
          font-inter font-bold 
          leading-none 
          whitespace-nowrap 
          text-center
          ${
            isSmall
              ? 'text-[clamp(18px,3.5vw,32px)]'
              : 'text-[clamp(1rem,3vw,1.2rem)] max-[420px]:text-xl'
          }
        `}
        aria-hidden="false"
      >
        {value}
      </div>
      <div
        className={`
          text-[#a0a0a0] 
          font-inter font-normal 
          text-center 
          leading-tight
          ${
            isSmall
              ? 'text-[clamp(12px,2vw,16px)]'
              : 'text-[clamp(0.6rem,2vw,0.8rem)] max-[420px]:text-xs'
          }
        `}
      >
        {label}
      </div>
    </div>
  );
}
