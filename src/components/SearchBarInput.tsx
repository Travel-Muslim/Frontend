import React from "react";
import searchIcon from "../assets/icon/search.png";
import "./SearchBarInput.css";

interface SearchBarInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
}

export default function SearchBarInput({
  placeholder = "Cari...",
  value = "",
  onChange,
  onSearch,
  className = "",
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
    if (e.key === "Enter") {
      onSearch?.(internalValue);
    }
  };

  return (
    <div className={`searchbar-input ${className}`} data-name="Search Bar">
      <div className="searchbar-input__inner">
        <div className="searchbar-input__icon-wrap" data-name="search">
          <img src={searchIcon} alt="Search" className="searchbar-input__icon" />
        </div>

        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="searchbar-input__field"
        />
      </div>
    </div>
  );
}
