import React from 'react';
import { Calendar, MapPin, Utensils, Building2, Bus } from 'lucide-react';

export interface ItineraryDay {
  day: number;
  destinasi: string[];
  makan: string[];
  masjid: string[];
  transportasi: string[];
}

export interface ItineraryTableProps {
  title?: string;
  startDate?: string;
  endDate?: string;
  itenaries?: ItineraryDay[];
  className?: string;
}

export default function ItineraryTable({
  title,
  startDate,
  endDate,
  itenaries = [],
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
          {itenaries.map((dayData, dayIndex) => (
            <div key={dayIndex} className="grid grid-cols-5 gap-3 mb-3">
              {/* Day Column */}
              <div className="bg-purple-300 rounded-md p-4 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  Hari {dayData.day}
                </span>
              </div>

              {/* Destinations Column */}
              <div className="bg-white rounded-md border-2 border-pink-200 p-4 min-h-[100px]">
                {dayData.destinasi.length > 0 ? (
                  <ul className="space-y-1">
                    {dayData.destinasi.map((dest: string, idx: number) => (
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
                {dayData.makan.length > 0 ? (
                  <ul className="space-y-1">
                    {dayData.makan.map((meal: string, idx: number) => (
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
                {dayData.masjid.length > 0 ? (
                  <ul className="space-y-1">
                    {dayData.masjid.map((mosque: string, idx: number) => (
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
                {dayData.transportasi.length > 0 ? (
                  <ul className="space-y-1">
                    {dayData.transportasi.map(
                      (transport: string, idx: number) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-700 leading-relaxed"
                        >
                          • {transport}
                        </li>
                      )
                    )}
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
      destinasi: [
        'Berkumpul di Bandara Soekarno-Hatta untuk penerbangan menuju ke Incheon',
      ],
      makan: ['Makan di board selama perjalanan'],
      masjid: ['Sholat di pesawat selama perjalanan'],
      transportasi: ['Pesawat internasional + bus bandara menuju hotel'],
    },
    {
      day: 2,
      destinasi: [
        'Berangkat ke Ahsan',
        'Bada Hyanggil Theme Park',
        'Nojeokkong Fall Park',
      ],
      makan: [
        'Sarapan di board',
        'Makan siang dan malam di Eid di Yongsan-gu, Seoul',
      ],
      masjid: ['Masjid Ansan'],
      transportasi: ['City tour Ansan menggunakan bus pariwisata'],
    },
    {
      day: 3,
      destinasi: [
        'Nami Island dan belajar membuat kimbab',
        'Bukchon Hanok Village',
        'Dongdaemun',
      ],
      makan: ['Kervan (Cabang Itaewon) di Yongsan-gu, Seoul'],
      masjid: ['Mushola Nami Island'],
      transportasi: ['Bus pariwisata'],
    },
    {
      day: 4,
      destinasi: [
        'Gyeongbok Palace',
        'Belanja di Amethyst Showcase',
        'Starfield Library',
      ],
      makan: ['Jipbob Kimunsaeng di Yongsan-gu, Seoul'],
      masjid: ['Mushola COEX MALL'],
      transportasi: ['Bus pariwisata'],
    },
    {
      day: 5,
      destinasi: [
        'Local Cosmetic Shop',
        'Hongdae Youth Avenue',
        'Myeongdong Street',
      ],
      makan: ["Café D'asti di Jung-gu, Seoul"],
      masjid: ['Masjid Itaewon'],
      transportasi: ['Bus pariwisata'],
    },
    {
      day: 6,
      destinasi: ['Belanja di Local Supermarket Korea sebelum ke airport'],
      makan: [
        'Asalam di Jeju-do, Jeju-si dan makan di board selama perjalanan pulang',
      ],
      masjid: ['Jeju Central Masjid'],
      transportasi: ['Bus pariwisata → Bandara Incheon'],
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
            itenaries={sampleItinerary}
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
            itenaries={[
              {
                day: 1,
                destinasi: ['Tanah Lot Temple', 'Seminyak Beach'],
                makan: ['Welcome dinner di Warung Halal'],
                masjid: ['Masjid Agung Bali'],
                transportasi: ['Bus pariwisata dari airport'],
              },
              {
                day: 2,
                destinasi: [
                  'Ubud Monkey Forest',
                  'Tegalalang Rice Terrace',
                  'Ubud Art Market',
                ],
                makan: [
                  'Lunch di Bebek Bengil',
                  'Dinner di Nasi Ayam Kedewatan',
                ],
                masjid: ['Mushola Hotel'],
                transportasi: ['Bus pariwisata'],
              },
              {
                day: 3,
                destinasi: ['Belanja oleh-oleh', 'Transfer ke airport'],
                makan: ['Breakfast di hotel'],
                masjid: ['Mushola Airport'],
                transportasi: ['Bus pariwisata ke airport'],
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
            itenaries={[
              {
                day: 1,
                destinasi: ['Tiba di Istanbul', 'City tour Istanbul'],
                makan: ['Makan malam Turkish cuisine'],
                masjid: ['Blue Mosque'],
                transportasi: ['Private van'],
              },
              {
                day: 2,
                destinasi: ['Hagia Sophia', 'Topkapi Palace', 'Grand Bazaar'],
                makan: ['Lunch & Dinner di restoran halal lokal'],
                masjid: ['Suleymaniye Mosque'],
                transportasi: ['Walking tour + metro'],
              },
            ]}
            className="shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
