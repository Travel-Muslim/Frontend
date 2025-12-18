import React from 'react';

interface SearchBarInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
}

export default function SearchBarInput({
  placeholder = 'Cari...',
  value = '',
  onChange,
  onSearch,
  className = '',
}: SearchBarInputProps) {
  const [internalValue, setInternalValue] = React.useState(value);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(internalValue);
    }
  };

  return (
    <div
      className={`w-full bg-white rounded-md border border-[#ededed] shadow-[0_18px_30px_rgba(0,0,0,0.15)] ${className}`}
      data-name="Search Bar"
    >
      <div className="flex items-center gap-3 px-4 py-3 min-h-[66px]">
        <div
          className="flex items-center justify-center p-1.5"
          data-name="search"
        >
          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
          >
            <path
              d="M23.5 23.5L18.0625 18.0625M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z"
              stroke="#ABABAB"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 font-inter font-normal text-xl md:text-[22px] text-[#444444] bg-transparent border-none outline-none placeholder:text-[#ababab]"
        />
      </div>
    </div>
  );
}
