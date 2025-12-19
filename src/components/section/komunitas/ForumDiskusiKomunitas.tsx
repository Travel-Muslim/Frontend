import { useState, ReactNode } from 'react';
import CardKomentar from '../../ui/card-komentar/CardKomentar';
import type { CommunityPost } from '../../../api/community';

interface ForumDiskusiKomunitasProps {
  discussions: CommunityPost[];
  selectedMonth: string;
  monthOptions: string[];
  onMonthChange: (month: string) => void;
  sidebar?: ReactNode;
}

export default function ForumDiskusiKomunitas({
  discussions,
  selectedMonth,
  monthOptions,
  onMonthChange,
  sidebar,
}: ForumDiskusiKomunitasProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <section className="w-full bg-gradient-to-b from-white to-pink-50/20 py-8 md:py-10 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-5 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Main Content - Forum Discussion */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                {/* Title */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  Forum Diskusi
                </h2>

                {/* Month Filter Dropdown */}
                <div className="relative w-full md:w-auto">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full md:w-44 px-4 py-2 bg-[#B49DE4] hover:bg-[#9B84D4] text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-between shadow-md text-sm"
                  >
                    <span>{selectedMonth}</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${
                        showDropdown ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-64 overflow-y-auto">
                      {monthOptions.map((month) => (
                        <button
                          key={month}
                          onClick={() => {
                            onMonthChange(month);
                            setShowDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${
                            month === selectedMonth
                              ? 'bg-purple-100 text-purple-700 font-medium'
                              : 'text-gray-700'
                          }`}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Discussion List */}
              <div className="space-y-4">
                {discussions.length > 0 ? (
                  discussions.map((discussion) => (
                    <CardKomentar
                      key={discussion.id}
                      variant="full"
                      avatar={
                        discussion.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${discussion.author}`
                      }
                      name={discussion.author}
                      rating={discussion.rating || 0}
                      date={discussion.timeAgo || discussion.createdAt}
                      title={discussion.title}
                      comment={discussion.body}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      Belum ada diskusi tersedia
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Latest Commenters */}
          {sidebar && (
            <div className="lg:col-span-1">
              <div className="sticky top-4">{sidebar}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
