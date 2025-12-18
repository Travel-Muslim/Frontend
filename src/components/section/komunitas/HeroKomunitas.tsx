import { HeroKomunitasImage } from '@/assets/images';
import SearchBarInput from '../../ui/searchbar-input/SearchBarInput';

interface HeroKomunitasProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
}

export default function HeroKomunitas({
  searchQuery,
  onSearchChange,
  onSearch,
}: HeroKomunitasProps) {
  return (
    <section
      className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-16 pb-24 md:pb-28 lg:pb-32 z-10"
      style={{
        backgroundImage: `url(${HeroKomunitasImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-6 md:space-y-8">
        {/* Title */}
        <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight drop-shadow-lg">
          Komunitas Travel
        </h1>

        {/* Description */}
        <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed drop-shadow-md px-4">
          Akses langsung ke berbagai insight, tips halal-friendly, dan tanya
          <br className="hidden md:block" />
          jawab seputar destinasi. Tempat terbaik untuk merencanakan
          <br className="hidden md:block" />
          trip yang tenang.
        </p>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto pt-4">
          <SearchBarInput
            placeholder="Winter Outfit untuk Hijabers"
            value={searchQuery}
            onChange={onSearchChange}
            onSearch={onSearch}
          />
        </div>
      </div>
    </section>
  );
}
