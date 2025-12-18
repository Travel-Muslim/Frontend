import React from 'react';

interface SnackBarItem {
  id: string;
  label: string;
  value?: string;
}

interface SnackBarProps {
  items: SnackBarItem[];
  activeId: string;
  onItemClick: (id: string) => void;
  className?: string;
}

export default function SnackBar({
  items,
  activeId,
  onItemClick,
  className = '',
}: SnackBarProps) {
  return (
    <div
      className={`bg-white rounded-[10px] shadow-lg p-2 flex items-center gap-2 flex-wrap ${className}`}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`
              flex-1 min-w-fit px-6 py-3 rounded-[10px] font-semibold text-base
              transition-all duration-200 ease-out
              ${
                isActive
                  ? 'bg-[#B49DE4] text-white shadow-md'
                  : 'bg-transparent text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

// Demo Component
export function SnackBarDemo() {
  const [activeContinentId, setActiveContinentId] = React.useState('asia');
  const [activeBookingId, setActiveBookingId] = React.useState('booking-saya');
  const [activeDetailId, setActiveDetailId] = React.useState('booking');

  const continents: SnackBarItem[] = [
    { id: 'asia', label: 'Asia' },
    { id: 'eropa', label: 'Eropa' },
    { id: 'amerika', label: 'Amerika' },
    { id: 'afrika', label: 'Afrika' },
  ];

  const bookingTabs: SnackBarItem[] = [
    { id: 'booking-saya', label: 'Booking Saya' },
    { id: 'daftar-riwayat', label: 'Daftar Riwayat Booking' },
  ];

  const detailTabs: SnackBarItem[] = [
    { id: 'itenary', label: 'Itenary' },
    { id: 'booking', label: 'Booking' },
    { id: 'testimoni', label: 'Testimoni' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            SnackBar Component
          </h1>
          <p className="text-gray-600">
            Dynamic, clickable snackbar with multiple columns support
          </p>
        </div>

        {/* Example 1: 4 Columns - Continents */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            4 Columns - Continent Filter
          </h2>
          <SnackBar
            items={continents}
            activeId={activeContinentId}
            onItemClick={(id) => {
              setActiveContinentId(id);
              console.log('Selected continent:', id);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Active: <span className="font-semibold">{activeContinentId}</span>
          </p>
        </div>

        {/* Example 2: 2 Columns - Booking Tabs */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            2 Columns - Booking Tabs
          </h2>
          <SnackBar
            items={bookingTabs}
            activeId={activeBookingId}
            onItemClick={(id) => {
              setActiveBookingId(id);
              console.log('Selected booking tab:', id);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Active: <span className="font-semibold">{activeBookingId}</span>
          </p>
        </div>

        {/* Example 3: 3 Columns - Detail Tabs */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            3 Columns - Detail Tabs
          </h2>
          <SnackBar
            items={detailTabs}
            activeId={activeDetailId}
            onItemClick={(id) => {
              setActiveDetailId(id);
              console.log('Selected detail tab:', id);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Active: <span className="font-semibold">{activeDetailId}</span>
          </p>
        </div>

        {/* Example 4: Many Columns */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Many Columns - Flexible Layout
          </h2>
          <SnackBar
            items={[
              { id: '1', label: 'Tab 1' },
              { id: '2', label: 'Tab 2' },
              { id: '3', label: 'Tab 3' },
              { id: '4', label: 'Tab 4' },
              { id: '5', label: 'Tab 5' },
              { id: '6', label: 'Tab 6' },
            ]}
            activeId="1"
            onItemClick={(id) => console.log('Selected:', id)}
          />
        </div>

        {/* Usage Example Code */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Usage Example
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {`const items = [
  { id: 'asia', label: 'Asia' },
  { id: 'eropa', label: 'Eropa' },
  { id: 'amerika', label: 'Amerika' },
  { id: 'afrika', label: 'Afrika' },
];

const [activeId, setActiveId] = useState('asia');

<SnackBar
  items={items}
  activeId={activeId}
  onItemClick={(id) => {
    setActiveId(id);
    console.log('Selected:', id);
  }}
/>`}
          </pre>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Dynamic number of columns (2, 3, 4, or more)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Clickable items with callback support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Active state management with purple highlight</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Smooth transitions and hover effects</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Responsive flex layout with wrap support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Consistent design system (purple #B49DE4)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
