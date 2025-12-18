import React from 'react';
import { Calendar, MapPin, Utensils, Building2, Bus } from 'lucide-react';

export interface ItineraryDay {
  day: number;
  destinations: string[];
  meals: string[];
  mosques: string[];
  transportation: string[];
}

export interface ItineraryTableProps {
  title?: string;
  startDate?: string;
  endDate?: string;
  days?: ItineraryDay[];
  className?: string;
}

export default function ItineraryTable({
  title = 'Korea Halal Tour',
  startDate = '10 Desember 2025',
  endDate = '16 Desember 2025',
  days = [],
  className = '',
}: ItineraryTableProps) {
  const headers = [
    { icon: Calendar, label: 'Hari', color: 'bg-purple-300' },
    { icon: MapPin, label: 'Destinasi', color: 'bg-purple-300' },
    { icon: Utensils, label: 'Makan', color: 'bg-purple-300' },
    { icon: Building2, label: 'Masjid', color: 'bg-purple-300' },
    { icon: Bus, label: 'Transportasi', color: 'bg-purple-300' },
  ];

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      {/* Title Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-base sm:text-lg text-pink-400 font-medium">
          {startDate} - {endDate}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-5 gap-3 mb-3">
            {headers.map((header, index) => (
              <div
                key={index}
                className={`${header.color} rounded-md p-4 flex flex-col items-center justify-center gap-2 h-[120px]`}
              >
                <header.icon className="w-8 h-8 text-white" strokeWidth={2} />
                <span className="text-white font-semibold text-lg">
                  {header.label}
                </span>
              </div>
            ))}
          </div>

          {/* Day Rows */}
          {days.map((dayData, dayIndex) => (
            <div key={dayIndex} className="grid grid-cols-5 gap-3 mb-3">
              {/* Day Column */}
              <div className="bg-purple-300 rounded-md p-4 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  Hari {dayData.day}
                </span>
              </div>

              {/* Destinations Column */}
              <div className="bg-white rounded-md border-2 border-pink-200 p-4 min-h-[100px]">
                {dayData.destinations.length > 0 ? (
                  <ul className="space-y-1">
                    {dayData.destinations.map((dest, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 leading-relaxed"
                      >
                        • {dest}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">-</p>
                )}
              </div>

              {/* Meals Column */}
              <div className="bg-white rounded-md border-2 border-pink-200 p-4 min-h-[100px]">
                {dayData.meals.length > 0 ? (
                  <ul className="space-y-1">
                    {dayData.meals.map((meal, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 leading-relaxed"
                      >
                        • {meal}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">-</p>
                )}
              </div>

              {/* Mosques Column */}
              <div className="bg-white rounded-md border-2 border-pink-200 p-4 min-h-[100px]">
                {dayData.mosques.length > 0 ? (
                  <ul className="space-y-1">
                    {dayData.mosques.map((mosque, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 leading-relaxed"
                      >
                        • {mosque}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">-</p>
                )}
              </div>

              {/* Transportation Column */}
              <div className="bg-white rounded-md border-2 border-pink-200 p-4 min-h-[100px]">
                {dayData.transportation.length > 0 ? (
                  <ul className="space-y-1">
                    {dayData.transportation.map((transport, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 leading-relaxed"
                      >
                        • {transport}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">-</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Demo Component
export function ItineraryTableDemo() {
  const sampleItinerary: ItineraryDay[] = [
    {
      day: 1,
      destinations: [
        'Berkumpul di Bandara Soekarno-Hatta untuk penerbangan menuju ke Incheon',
      ],
      meals: ['Makan di board selama perjalanan'],
      mosques: ['Sholat di pesawat selama perjalanan'],
      transportation: ['Pesawat internasional + bus bandara menuju hotel'],
    },
    {
      day: 2,
      destinations: [
        'Berangkat ke Ahsan',
        'Bada Hyanggil Theme Park',
        'Nojeokkong Fall Park',
      ],
      meals: [
        'Sarapan di board',
        'Makan siang dan malam di Eid di Yongsan-gu, Seoul',
      ],
      mosques: ['Masjid Ansan'],
      transportation: ['City tour Ansan menggunakan bus pariwisata'],
    },
    {
      day: 3,
      destinations: [
        'Nami Island dan belajar membuat kimbab',
        'Bukchon Hanok Village',
        'Dongdaemun',
      ],
      meals: ['Kervan (Cabang Itaewon) di Yongsan-gu, Seoul'],
      mosques: ['Mushola Nami Island'],
      transportation: ['Bus pariwisata'],
    },
    {
      day: 4,
      destinations: [
        'Gyeongbok Palace',
        'Belanja di Amethyst Showcase',
        'Starfield Library',
      ],
      meals: ['Jipbob Kimunsaeng di Yongsan-gu, Seoul'],
      mosques: ['Mushola COEX MALL'],
      transportation: ['Bus pariwisata'],
    },
    {
      day: 5,
      destinations: [
        'Local Cosmetic Shop',
        'Hongdae Youth Avenue',
        'Myeongdong Street',
      ],
      meals: ["Café D'asti di Jung-gu, Seoul"],
      mosques: ['Masjid Itaewon'],
      transportation: ['Bus pariwisata'],
    },
    {
      day: 6,
      destinations: ['Belanja di Local Supermarket Korea sebelum ke airport'],
      meals: [
        'Asalam di Jeju-do, Jeju-si dan makan di board selama perjalanan pulang',
      ],
      mosques: ['Jeju Central Masjid'],
      transportation: ['Bus pariwisata → Bandara Incheon'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 text-center">
          Itinerary Table Component
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Flexible itinerary table for travel packages
        </p>

        {/* Full Example */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">
            Complete 6-Day Korea Tour
          </h2>
          <ItineraryTable
            title="Korea Halal Tour"
            startDate="10 Desember 2025"
            endDate="16 Desember 2025"
            days={sampleItinerary}
          />
        </div>

        {/* Short Example */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">
            Short 3-Day Example
          </h2>
          <ItineraryTable
            title="Bali Weekend Getaway"
            startDate="15 Januari 2026"
            endDate="17 Januari 2026"
            days={[
              {
                day: 1,
                destinations: ['Tanah Lot Temple', 'Seminyak Beach'],
                meals: ['Welcome dinner di Warung Halal'],
                mosques: ['Masjid Agung Bali'],
                transportation: ['Bus pariwisata dari airport'],
              },
              {
                day: 2,
                destinations: [
                  'Ubud Monkey Forest',
                  'Tegalalang Rice Terrace',
                  'Ubud Art Market',
                ],
                meals: [
                  'Lunch di Bebek Bengil',
                  'Dinner di Nasi Ayam Kedewatan',
                ],
                mosques: ['Mushola Hotel'],
                transportation: ['Bus pariwisata'],
              },
              {
                day: 3,
                destinations: ['Belanja oleh-oleh', 'Transfer ke airport'],
                meals: ['Breakfast di hotel'],
                mosques: ['Mushola Airport'],
                transportation: ['Bus pariwisata ke airport'],
              },
            ]}
          />
        </div>

        {/* Custom Styled Example */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">
            Custom Styled Example
          </h2>
          <ItineraryTable
            title="Turki Heritage Tour"
            startDate="1 Maret 2026"
            endDate="8 Maret 2026"
            days={[
              {
                day: 1,
                destinations: ['Tiba di Istanbul', 'City tour Istanbul'],
                meals: ['Makan malam Turkish cuisine'],
                mosques: ['Blue Mosque'],
                transportation: ['Private van'],
              },
              {
                day: 2,
                destinations: [
                  'Hagia Sophia',
                  'Topkapi Palace',
                  'Grand Bazaar',
                ],
                meals: ['Lunch & Dinner di restoran halal lokal'],
                mosques: ['Suleymaniye Mosque'],
                transportation: ['Walking tour + metro'],
              },
            ]}
            className="shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
