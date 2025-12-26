import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  primaryColor?: string;
  textColor?: string;
  activeTextColor?: string;
  disabledBgColor?: string;
  disabledTextColor?: string;
  buttonBgColor?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 6,
  totalItems = 0,
  primaryColor = '#B49DE4',
  textColor = '#ffffff  ',
  activeTextColor = '#ffffff',
  disabledBgColor = '#F3F4F6',
  disabledTextColor = '#9CA3AF',
  buttonBgColor = '#FFFFFF',
}) => {
  const [hoveredButton, setHoveredButton] = useState<number | string | null>(
    null
  );

  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push('ellipsis-start');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 4) {
        for (let i = 2; i <= Math.max(5, currentPage + 1); i++) {
          if (i < totalPages) pages.push(i);
        }
      } else if (currentPage >= totalPages - 3) {
        for (
          let i = Math.min(totalPages - 4, currentPage - 1);
          i < totalPages;
          i++
        ) {
          if (i > 1) pages.push(i);
        }
      } else {
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push('ellipsis-end');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  const pageNumbers = getPageNumbers();

  return (
    <div className={`bg-transparent p-6`}>
      <div className="text-center space-y-4">
        <p className={`text-[${textColor}] text-sm`}>
          Menampilkan {startItem} - {endItem} dari {totalItems} destinasi
        </p>

        <div className="flex items-center justify-center space-x-2 flex-wrap">
          <button
            onClick={() => !isPrevDisabled && onPageChange(currentPage - 1)}
            onMouseEnter={() => !isPrevDisabled && setHoveredButton('prev')}
            onMouseLeave={() => setHoveredButton(null)}
            disabled={isPrevDisabled}
            className={`${
              isPrevDisabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : `hover:bg-[${primaryColor}] hover:text-white text-[${textColor}]`
            } w-10 h-10 flex items-center justify-center rounded-sm transition-all`}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          {pageNumbers.map((page, index) => {
            if (typeof page === 'string') {
              return (
                <span
                  key={page}
                  className={`w-10 h-10 flex items-center justify-center text-${textColor}`}
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            const isHovered = hoveredButton === page;

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                onMouseEnter={() => setHoveredButton(page)}
                onMouseLeave={() => setHoveredButton(null)}
                className={`${
                  isActive
                    ? `bg-[${primaryColor}] text-[#ffffff] transform scale-110 shadow-md`
                    : isHovered
                      ? `bg-[${primaryColor}] opacity-60 contrast-100 border-[${primaryColor}] text-[${activeTextColor}]`
                      : 'bg-white text-gray-700 border-gray-200'
                } w-10 h-10 flex items-center justify-center rounded-sm transition-all`}
                aria-label={`Page ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => !isNextDisabled && onPageChange(currentPage + 1)}
            onMouseEnter={() => !isNextDisabled && setHoveredButton('next')}
            onMouseLeave={() => setHoveredButton(null)}
            disabled={isNextDisabled}
            className={`${
              isNextDisabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : `hover:bg-[${primaryColor}] hover:text-white text-[${textColor}]`
            } w-10 h-10 flex items-center justify-center rounded-sm transition-all`}
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
