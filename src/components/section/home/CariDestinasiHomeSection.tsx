import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import Button from '../../ui/button/Button';

interface SearchFormData {
  dari: string;
  ke: string;
  pergi: string;
}

export default function CariDestinasiHomeSection() {
  const [formData, setFormData] = useState<SearchFormData>({
    dari: '',
    ke: '',
    pergi: '',
  });

  const [dropdownOpen, setDropdownOpen] = useState<{
    dari: boolean;
    ke: boolean;
    pergi: boolean;
  }>({
    dari: false,
    ke: false,
    pergi: false,
  });

  const dariOptions = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Yogyakarta'];
  const keOptions = [
    'Korea Selatan',
    'Jepang',
    'Uzbekistan',
    'Turki',
    'Arab Saudi',
  ];
  const pergiOptions = [
    'Januari 2026',
    'Februari 2026',
    'Maret 2026',
    'April 2026',
    'Mei 2026',
  ];

  const handleSelect = (field: keyof SearchFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setDropdownOpen((prev) => ({ ...prev, [field]: false }));
  };

  const handleSearch = () => {
    console.log('Searching with:', formData);
    // Handle search logic
  };

  return (
    <section
      id="cari-destinasi-section"
      className="w-full py-12 md:py-16"
      style={{ backgroundColor: '#D8BFD8' }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Search Form Container */}
        <div className="bg-white rounded-[20px] shadow-2xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-6">
            {/* Dari Dropdown */}
            <div className="flex-1 relative">
              <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                Dari
              </label>
              <button
                className="w-full h-[56px] px-4 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-between hover:border-purple-300 transition-colors"
                onClick={() =>
                  setDropdownOpen((prev) => ({
                    ...prev,
                    dari: !prev.dari,
                    ke: false,
                    pergi: false,
                  }))
                }
              >
                <span
                  className={formData.dari ? 'text-gray-900' : 'text-gray-400'}
                >
                  {formData.dari || 'Pilih kota'}
                </span>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#B49DE4' }}
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </div>
              </button>
              {dropdownOpen.dari && (
                <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                  {dariOptions.map((option) => (
                    <button
                      key={option}
                      className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSelect('dari', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vertical Divider - Hidden on mobile */}
            <div className="hidden lg:block w-px bg-gray-300 self-stretch mt-8" />

            {/* Ke Dropdown */}
            <div className="flex-1 relative">
              <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                Ke
              </label>
              <button
                className="w-full h-[56px] px-4 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-between hover:border-purple-300 transition-colors"
                onClick={() =>
                  setDropdownOpen((prev) => ({
                    ...prev,
                    ke: !prev.ke,
                    dari: false,
                    pergi: false,
                  }))
                }
              >
                <span
                  className={formData.ke ? 'text-gray-900' : 'text-gray-400'}
                >
                  {formData.ke || 'Pilih destinasi'}
                </span>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#B49DE4' }}
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </div>
              </button>
              {dropdownOpen.ke && (
                <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                  {keOptions.map((option) => (
                    <button
                      key={option}
                      className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSelect('ke', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vertical Divider - Hidden on mobile */}
            <div className="hidden lg:block w-px bg-gray-300 self-stretch mt-8" />

            {/* Pergi Dropdown */}
            <div className="flex-1 relative">
              <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                Pergi
              </label>
              <button
                className="w-full h-[56px] px-4 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-between hover:border-purple-300 transition-colors"
                onClick={() =>
                  setDropdownOpen((prev) => ({
                    ...prev,
                    pergi: !prev.pergi,
                    dari: false,
                    ke: false,
                  }))
                }
              >
                <span
                  className={formData.pergi ? 'text-gray-900' : 'text-gray-400'}
                >
                  {formData.pergi || 'Pilih bulan'}
                </span>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#B49DE4' }}
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </div>
              </button>
              {dropdownOpen.pergi && (
                <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                  {pergiOptions.map((option) => (
                    <button
                      key={option}
                      className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSelect('pergi', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="flex items-end lg:flex-shrink-0 justify-center">
              <Button
                variant="light-purple-hover-dark-purple"
                onClick={handleSearch}
                className="w-full !min-w-[180px] !h-[56px] !text-base md:!text-lg gap-2 items-center cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  <span>Cari Destinasi</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
