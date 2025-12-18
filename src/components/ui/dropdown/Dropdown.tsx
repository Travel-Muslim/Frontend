import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  value?: string;
  onClick?: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  selectedId?: string;
  onSelect?: (item: DropdownItem) => void;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
}

export default function Dropdown({
  items,
  placeholder = 'Select an option',
  selectedId,
  onSelect,
  className = '',
  buttonClassName = '',
  menuClassName = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(
    items.find((item) => item.id === selectedId) || null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: DropdownItem) => {
    setSelectedItem(item);
    setIsOpen(false);

    if (item.onClick) {
      item.onClick();
    }

    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Dropdown Button */}
      <button
        onClick={handleToggle}
        className={`
          flex items-center justify-between gap-3
          bg-white border-2 border-gray-200
          rounded-[10px] px-4 py-3
          min-w-[200px] w-full
          text-left text-base text-gray-700
          hover:border-gray-300
          transition-colors
          ${buttonClassName}
        `}
      >
        <span className="flex-1 truncate">
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute top-full left-0 right-0 mt-2
            bg-white border border-gray-200 rounded-[10px]
            shadow-lg
            overflow-hidden
            z-50
            ${menuClassName}
          `}
        >
          <div className="max-h-[300px] overflow-y-auto">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`
                  w-full text-left px-4 py-3
                  text-base text-gray-700
                  hover:bg-gray-50
                  transition-colors
                  ${selectedItem?.id === item.id ? 'bg-purple-50 font-semibold' : ''}
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Demo Component
export function DropdownDemo() {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const monthItems: DropdownItem[] = [
    { id: 'nov', label: 'November', value: '11' },
    { id: 'oct', label: 'Oktober', value: '10' },
    { id: 'sep', label: 'September', value: '9' },
    { id: 'aug', label: 'Agustus', value: '8' },
    { id: 'jul', label: 'Juli', value: '7' },
    { id: 'jun', label: 'Juni', value: '6' },
  ];

  const categoryItems: DropdownItem[] = [
    { id: '1', label: 'Winter Outfit untuk Hijabers' },
    { id: '2', label: 'Packing Wajib Musim Dingin' },
    { id: '3', label: 'Foto Cantik di Hanok Village' },
    { id: '4', label: 'Tips Traveling ke Korea' },
    { id: '5', label: 'Kuliner Halal Korea' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Dropdown Component
          </h1>
          <p className="text-gray-600">
            Dynamic dropdown with custom items and click handlers
          </p>
        </div>

        {/* Example 1: Month Dropdown */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Example 1: Month Selector
          </h2>
          <Dropdown
            items={monthItems}
            placeholder="Pilih Bulan"
            onSelect={(item) => {
              setSelectedMonth(item.label);
              console.log('Selected month:', item);
            }}
          />
          {selectedMonth && (
            <p className="mt-4 text-gray-600">
              Selected: <span className="font-semibold">{selectedMonth}</span>
            </p>
          )}
        </div>

        {/* Example 2: Category Dropdown */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Example 2: Article Category
          </h2>
          <Dropdown
            items={categoryItems}
            placeholder="Pilih Kategori Artikel"
            onSelect={(item) => {
              setSelectedCategory(item.label);
              console.log('Selected category:', item);
            }}
            className="w-full"
          />
          {selectedCategory && (
            <p className="mt-4 text-gray-600">
              Selected:{' '}
              <span className="font-semibold">{selectedCategory}</span>
            </p>
          )}
        </div>

        {/* Example 3: With Custom Click Handlers */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Example 3: With Custom Actions
          </h2>
          <Dropdown
            items={[
              {
                id: '1',
                label: 'Action 1',
                onClick: () => alert('Action 1 clicked!'),
              },
              {
                id: '2',
                label: 'Action 2',
                onClick: () => alert('Action 2 clicked!'),
              },
              {
                id: '3',
                label: 'Action 3',
                onClick: () => alert('Action 3 clicked!'),
              },
            ]}
            placeholder="Select Action"
          />
        </div>

        {/* Usage Example */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Usage Example
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {`const items = [
  { id: 'nov', label: 'November', value: '11' },
  { id: 'oct', label: 'Oktober', value: '10' },
  { id: 'sep', label: 'September', value: '9' },
];

<Dropdown
  items={items}
  placeholder="Pilih Bulan"
  onSelect={(item) => {
    console.log('Selected:', item);
  }}
/>`}
          </pre>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Dynamic items array support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Custom click handlers per item</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Click outside to close</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Chevron animation (rotate on open)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Selected state highlighting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Scrollable menu for long lists</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Fully customizable styling</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
