import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  bgColor?: string;
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
  bgColor = 'transparent',
  primaryColor = '#FFB4C4',
  textColor = '#4B5563',
  activeTextColor = '#FFFFFF',
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

  const getButtonStyle = (
    isActive: boolean,
    isDisabled: boolean,
    isHovered: boolean
  ): React.CSSProperties => {
    if (isDisabled) {
      return {
        backgroundColor: disabledBgColor,
        color: disabledTextColor,
        cursor: 'not-allowed',
        border: '1px solid transparent',
      };
    }

    if (isActive) {
      return {
        backgroundColor: primaryColor,
        color: activeTextColor,
        transform: 'scale(1.1)',
        boxShadow: `0 4px 12px ${primaryColor}66`,
        border: '1px solid transparent',
      };
    }

    if (isHovered) {
      return {
        backgroundColor: buttonBgColor,
        color: primaryColor,
        borderColor: primaryColor,
        border: `1px solid ${primaryColor}`,
      };
    }

    return {
      backgroundColor: buttonBgColor,
      color: textColor,
      border: '1px solid #E5E7EB',
    };
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      style={{
        backgroundColor: bgColor,
        padding: '24px',
        borderRadius: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <p
          style={{
            color: textColor,
            fontSize: '14px',
            margin: 0,
          }}
        >
          Menampilkan {startItem} - {endItem} dari {totalItems} destinasi
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => !isPrevDisabled && onPageChange(currentPage - 1)}
            onMouseEnter={() => !isPrevDisabled && setHoveredButton('prev')}
            onMouseLeave={() => setHoveredButton(null)}
            disabled={isPrevDisabled}
            style={{
              ...getButtonStyle(
                false,
                isPrevDisabled,
                hoveredButton === 'prev'
              ),
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          {pageNumbers.map((page, index) => {
            if (typeof page === 'string') {
              return (
                <span
                  key={page}
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: textColor,
                    fontSize: '14px',
                  }}
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
                style={{
                  ...getButtonStyle(isActive, false, isHovered),
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
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
            style={{
              ...getButtonStyle(
                false,
                isNextDisabled,
                hoveredButton === 'next'
              ),
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
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

const PaginationDemo: React.FC = () => {
  const [defaultPage, setDefaultPage] = useState(1);
  const [purplePage, setPurplePage] = useState(5);

  const totalPages = 20;
  const totalItems = 120;
  const itemsPerPage = 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
            Customizable Pagination Component
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            A flexible pagination component with customizable colors and smooth
            animations
          </p>
        </div>

        <div className="grid gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Default Theme (Pink)
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Using default color props
              </p>
            </div>
            <div className="p-6">
              <Pagination
                currentPage={defaultPage}
                totalPages={totalPages}
                onPageChange={setDefaultPage}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
              />
            </div>
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <code className="text-xs text-gray-600 dark:text-gray-300">
                primaryColor: #FFB4C4 (default pink)
              </code>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Purple Theme
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Custom purple color scheme
              </p>
            </div>
            <div className="p-6">
              <Pagination
                currentPage={purplePage}
                totalPages={totalPages}
                onPageChange={setPurplePage}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                bgColor="#F5F3FF"
                primaryColor="#8B5CF6"
                textColor="#6B7280"
                activeTextColor="#FFFFFF"
                disabledBgColor="#EDE9FE"
                disabledTextColor="#A78BFA"
                buttonBgColor="#FFFFFF"
              />
            </div>
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <code className="text-xs text-gray-600 dark:text-gray-300">
                primaryColor: #8B5CF6 (purple) | bgColor: #F5F3FF
              </code>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Color Props Reference
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'bgColor',
                    default: 'transparent',
                    desc: 'Background of pagination section',
                  },
                  {
                    name: 'primaryColor',
                    default: '#FFB4C4',
                    desc: 'Active states, borders, hover',
                  },
                  {
                    name: 'textColor',
                    default: '#4B5563',
                    desc: 'Info text color',
                  },
                  {
                    name: 'activeTextColor',
                    default: '#FFFFFF',
                    desc: 'Active button text',
                  },
                  {
                    name: 'disabledBgColor',
                    default: '#F3F4F6',
                    desc: 'Disabled button background',
                  },
                  {
                    name: 'disabledTextColor',
                    default: '#9CA3AF',
                    desc: 'Disabled button text',
                  },
                  {
                    name: 'buttonBgColor',
                    default: '#FFFFFF',
                    desc: 'Non-active button background',
                  },
                ].map((prop) => (
                  <div
                    key={prop.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div
                      className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600 flex-shrink-0"
                      style={{
                        backgroundColor:
                          prop.default === 'transparent'
                            ? '#FFFFFF'
                            : prop.default,
                        backgroundImage:
                          prop.default === 'transparent'
                            ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                            : undefined,
                        backgroundSize: '8px 8px',
                        backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-medium text-gray-800 dark:text-white">
                        {prop.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {prop.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PaginationDemo };
