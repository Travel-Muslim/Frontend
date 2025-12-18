import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#6d4891] text-white font-inter w-full max-w-[100vw] overflow-x-hidden box-border">
      {/* Using px-[clamp] values with custom properties to simulate original clamp values */}
      <div
        className="max-w-[1400px] w-full mx-auto flex flex-col gap-[clamp(24px,4vh,40px)] box-border py-[clamp(40px,6vh,70px)] px-[clamp(20px,4vw,48px)]"
        style={{
          padding:
            'clamp(40px, 6vh, 70px) clamp(20px, 4vw, 48px) clamp(24px, 3vh, 40px)',
        }}
      >
        <div
          className="grid gap-[clamp(24px,4vw,48px)_clamp(20px,3vw,32px)] w-full items-start box-border"
          style={{
            gridTemplateColumns:
              'repeat(auto-fit, minmax(clamp(180px, 25vw, 220px), 1fr))',
          }}
        >
          {/* Column 1: Halaman */}
          <div className="flex flex-col gap-[clamp(8px,1.5vh,12px)] text-left">
            <h4
              className="text-[clamp(1.05rem,1.2vw+0.2rem,1.25rem)] font-bold leading-[1.3] m-0 mb-[clamp(4px,0.5vh,8px)]"
              style={{ fontSize: 'clamp(1.05rem, 1.2vw + 0.2rem, 1.25rem)' }}
            >
              Halaman
            </h4>
            <div className="flex flex-col gap-[clamp(2px,0.3vh,4px)] mb-[clamp(8px,1.5vh,14px)]">
              <Link
                to="/home"
                className="text-white no-underline text-[clamp(0.875rem,1vw+0.1rem,1rem)] font-medium transition-opacity duration-200 hover:opacity-80 hover:transform hover:translate-x-[3px] leading-[1.5] inline-block"
              >
                Home
              </Link>
              <Link
                to="/cari-destinasi"
                className="text-white no-underline text-[clamp(0.875rem,1vw+0.1rem,1rem)] font-medium transition-opacity duration-200 hover:opacity-80 hover:transform hover:translate-x-[3px] leading-[1.5] inline-block"
              >
                Destinasi
              </Link>
              <Link
                to="/wishlist"
                className="text-white no-underline text-[clamp(0.875rem,1vw+0.1rem,1rem)] font-medium transition-opacity duration-200 hover:opacity-80 hover:transform hover:translate-x-[3px] leading-[1.5] inline-block"
              >
                Wishlist
              </Link>
              <Link
                to="/riwayat"
                className="text-white no-underline text-[clamp(0.875rem,1vw+0.1rem,1rem)] font-medium transition-opacity duration-200 hover:opacity-80 hover:transform hover:translate-x-[3px] leading-[1.5] inline-block"
              >
                Riwayat
              </Link>
              <Link
                to="/artikel"
                className="text-white no-underline text-[clamp(0.875rem,1vw+0.1rem,1rem)] font-medium transition-opacity duration-200 hover:opacity-80 hover:transform hover:translate-x-[3px] leading-[1.5] inline-block"
              >
                Artikel
              </Link>
              <Link
                to="/komunitas"
                className="text-white no-underline text-[clamp(0.875rem,1vw+0.1rem,1rem)] font-medium transition-opacity duration-200 hover:opacity-80 hover:transform hover:translate-x-[3px] leading-[1.5] inline-block"
              >
                Komunitas
              </Link>
            </div>
          </div>

          {/* Column 2: Tentang Kami */}
          <div className="flex flex-col gap-[clamp(8px,1.5vh,12px)] text-left">
            <h4
              className="text-[clamp(1.05rem,1.2vw+0.2rem,1.25rem)] font-bold leading-[1.3] m-0 mb-[clamp(4px,0.5vh,8px)]"
              style={{ fontSize: 'clamp(1.05rem, 1.2vw + 0.2rem, 1.25rem)' }}
            >
              Tentang Kami
            </h4>
            <div className="flex flex-col gap-[clamp(2px,0.3vh,4px)] mb-[clamp(8px,1.5vh,14px)]">
              <p className="text-[clamp(0.75rem,0.9vw+0.1rem,0.875rem)] text-[rgba(255,255,255,0.8)] m-0 leading-[1.4]">
                Telepon
              </p>
              <p className="m-0 text-[clamp(0.9rem,1vw+0.1rem,1rem)] font-semibold leading-[1.4]">
                081765219854
              </p>
            </div>
            <div className="flex flex-col gap-[clamp(2px,0.3vh,4px)] mb-[clamp(8px,1.5vh,14px)]">
              <p className="text-[clamp(0.75rem,0.9vw+0.1rem,0.875rem)] text-[rgba(255,255,255,0.8)] m-0 leading-[1.4]">
                Email Support
              </p>
              <p className="m-0 text-[clamp(0.9rem,1vw+0.1rem,1rem)] font-semibold leading-[1.4]">
                saleema@gmail.com
              </p>
            </div>
          </div>

          {/* Column 3: Kantor Pusat */}
          <div className="flex flex-col gap-[clamp(8px,1.5vh,12px)] text-left">
            <h4
              className="text-[clamp(1.05rem,1.2vw+0.2rem,1.25rem)] font-bold leading-[1.3] m-0 mb-[clamp(4px,0.5vh,8px)]"
              style={{ fontSize: 'clamp(1.05rem, 1.2vw + 0.2rem, 1.25rem)' }}
            >
              Kantor Pusat
            </h4>
            <p
              className="text-[clamp(0.8rem,0.9vw+0.1rem,0.9rem)] m-0 leading-[1.6] text-[rgba(255,255,255,0.9)]"
              style={{ fontSize: 'clamp(0.8rem, 0.9vw + 0.1rem, 0.9rem)' }}
            >
              Jl. H. R. Rasuna Said No. 3, RT 6/RW 2, Kuningan, Karet Kuningan,
              Kecamatan Setiabudi, Kota Jakarta Selatan, DKI Jakarta 12950
            </p>
          </div>

          {/* Column 4: Brand & Social */}
          <div className="flex flex-col gap-[clamp(16px,2vh,22px)] items-start">
            <div className="flex items-center gap-[clamp(10px,1.5vw,14px)]">
              <div
                className="w-[clamp(48px,6vw,60px)] h-[clamp(48px,6vw,60px)] rounded-full bg-white flex items-center justify-center flex-shrink-0"
                style={{
                  width: 'clamp(48px, 6vw, 60px)',
                  height: 'clamp(48px, 6vw, 60px)',
                }}
              >
                <img
                  src="/logo.svg"
                  alt="Saleema"
                  className="w-[clamp(32px,4.5vw,44px)] h-auto"
                  style={{ width: 'clamp(32px, 4.5vw, 44px)' }}
                />
              </div>
              <div
                className="w-[clamp(1.5px,0.3vw,2px)] h-[clamp(40px,5vh,48px)] bg-[rgba(255,255,255,0.6)] flex-shrink-0"
                style={{
                  height: 'clamp(40px, 5vh, 48px)',
                  width: 'clamp(1.5px, 0.3vw, 2px)',
                }}
              />
              <div className="flex flex-col gap-[clamp(2px,0.5vh,6px)] leading-[1.2]">
                <span
                  className="text-[clamp(1.1rem,1.3vw+0.2rem,1.35rem)] font-bold m-0 leading-[1.2]"
                  style={{ fontSize: 'clamp(1.1rem, 1.3vw + 0.2rem, 1.35rem)' }}
                >
                  Saleema
                </span>
                <span
                  className="text-[clamp(0.9rem,1vw+0.1rem,1.05rem)] font-medium m-0 leading-[1.2]"
                  style={{ fontSize: 'clamp(0.9rem, 1vw + 0.1rem, 1.05rem)' }}
                >
                  Tour
                </span>
              </div>
            </div>

            <div className="flex gap-[clamp(10px,1.5vw,14px)] flex-wrap">
              <a
                href="https://www.instagram.com"
                className="w-[clamp(40px,5vw,48px)] h-[clamp(40px,5vw,48px)] rounded-full border border-[rgba(255,255,255,0.4)] flex items-center justify-center text-white transition-all duration-200 hover:bg-[rgba(255,255,255,0.2)] hover:transform hover:-translate-y-[3px] hover:border-[rgba(255,255,255,0.6)] flex-shrink-0 cursor-pointer"
                style={{
                  width: 'clamp(40px, 5vw, 48px)',
                  height: 'clamp(40px, 5vw, 48px)',
                }}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-[clamp(18px,2.5vw,22px)] h-[clamp(18px,2.5vw,22px)]"
                  style={{
                    width: 'clamp(18px, 2.5vw, 22px)',
                    height: 'clamp(18px, 2.5vw, 22px)',
                  }}
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com"
                className="w-[clamp(40px,5vw,48px)] h-[clamp(40px,5vw,48px)] rounded-full border border-[rgba(255,255,255,0.4)] flex items-center justify-center text-white transition-all duration-200 hover:bg-[rgba(255,255,255,0.2)] hover:transform hover:-translate-y-[3px] hover:border-[rgba(255,255,255,0.6)] flex-shrink-0 cursor-pointer"
                style={{
                  width: 'clamp(40px, 5vw, 48px)',
                  height: 'clamp(40px, 5vw, 48px)',
                }}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-[clamp(18px,2.5vw,22px)] h-[clamp(18px,2.5vw,22px)]"
                  style={{
                    width: 'clamp(18px, 2.5vw, 22px)',
                    height: 'clamp(18px, 2.5vw, 22px)',
                  }}
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com"
                className="w-[clamp(40px,5vw,48px)] h-[clamp(40px,5vw,48px)] rounded-full border border-[rgba(255,255,255,0.4)] flex items-center justify-center text-white transition-all duration-200 hover:bg-[rgba(255,255,255,0.2)] hover:transform hover:-translate-y-[3px] hover:border-[rgba(255,255,255,0.6)] flex-shrink-0 cursor-pointer"
                style={{
                  width: 'clamp(40px, 5vw, 48px)',
                  height: 'clamp(40px, 5vw, 48px)',
                }}
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-[clamp(18px,2.5vw,22px)] h-[clamp(18px,2.5vw,22px)]"
                  style={{
                    width: 'clamp(18px, 2.5vw, 22px)',
                    height: 'clamp(18px, 2.5vw, 22px)',
                  }}
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        className="mt-[clamp(24px,4vh,40px)] border-t border-[rgba(255,255,255,0.2)] pt-[clamp(16px,2.5vh,24px)] px-[clamp(12px,3vw,20px)] text-center font-medium text-[clamp(0.8rem,0.9vw+0.1rem,0.9rem)] text-[rgba(255,255,255,0.8)] box-border w-full max-w-[100%] overflow-x-hidden"
        style={{
          marginTop: 'clamp(24px, 4vh, 40px)',
          paddingTop: 'clamp(16px, 2.5vh, 24px)',
          paddingLeft: 'clamp(12px, 3vw, 20px)',
          paddingRight: 'clamp(12px, 3vw, 20px)',
          fontSize: 'clamp(0.8rem, 0.9vw + 0.1rem, 0.9rem)',
        }}
      >
        <p className="m-0 pb-5 break-words">
          ©2025 Saleema, Hak Cipta Dilindungi
        </p>
      </div>
    </footer>
  );
}
