import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import Button from '../button/Button';

interface PopupNotifikasiProps {
  variant:
    | 'success'
    | 'error'
    | 'whatsapp'
    | 'whatsapp-success'
    | 'whatsapp-failed'
    | 'confirm';
  title: string;
  description: string;
  buttonText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onButtonClick?: () => void;
}

export default function PopupNotifikasi({
  variant,
  title,
  description,
  buttonText,
  isOpen,
  onClose,
  onConfirm,
  onButtonClick,
}: PopupNotifikasiProps) {
  if (!isOpen) return null;

  const getIconConfig = () => {
    switch (variant) {
      case 'success':
        return {
          icon: <Check className="w-16 h-16 text-white" strokeWidth={3} />,
          bgColor: 'bg-[#FFB4C4]',
          iconSize: 'w-28 h-28',
        };
      case 'error':
        return {
          icon: <X className="w-16 h-16 text-white" strokeWidth={3} />,
          bgColor: 'bg-[#FFB4C4]',
          iconSize: 'w-28 h-28',
        };
      case 'confirm':
        return {
          icon: (
            <AlertCircle className="w-16 h-16 text-white" strokeWidth={3} />
          ),
          bgColor: 'bg-[#FFB4C4]',
          iconSize: 'w-28 h-28',
        };
      case 'whatsapp':
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="136"
              height="136"
              viewBox="0 0 136 136"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M67.875 135.75C76.7885 135.75 85.6147 133.994 93.8496 130.583C102.085 127.172 109.567 122.173 115.87 115.87C122.173 109.567 127.172 102.085 130.583 93.8496C133.994 85.6147 135.75 76.7885 135.75 67.875C135.75 58.9615 133.994 50.1353 130.583 41.9004C127.172 33.6654 122.173 26.1829 115.87 19.8801C109.567 13.5773 102.085 8.57771 93.8496 5.16668C85.6147 1.75564 76.7885 -1.32821e-07 67.875 0C49.8734 2.68244e-07 32.6092 7.15109 19.8801 19.8801C7.1511 32.6092 0 49.8734 0 67.875C0 85.8766 7.1511 103.141 19.8801 115.87C32.6092 128.599 49.8734 135.75 67.875 135.75ZM66.1253 95.3267L103.834 50.0767L92.2497 40.4233L59.8205 79.3308L43.0403 62.543L32.3764 73.207L55.0014 95.832L60.8386 101.669L66.1253 95.3267Z"
                fill="#FFB4C4"
              />
            </svg>
          ),
          bgColor: 'bg-[#FFB4C4]',
          iconSize: 'w-32 h-32',
        };
      case 'whatsapp-success':
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="136"
              height="136"
              viewBox="0 0 136 136"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M67.875 135.75C76.7885 135.75 85.6147 133.994 93.8496 130.583C102.085 127.172 109.567 122.173 115.87 115.87C122.173 109.567 127.172 102.085 130.583 93.8496C133.994 85.6147 135.75 76.7885 135.75 67.875C135.75 58.9615 133.994 50.1353 130.583 41.9004C127.172 33.6654 122.173 26.1829 115.87 19.8801C109.567 13.5773 102.085 8.57771 93.8496 5.16668C85.6147 1.75564 76.7885 -1.32821e-07 67.875 0C49.8734 2.68244e-07 32.6092 7.15109 19.8801 19.8801C7.1511 32.6092 0 49.8734 0 67.875C0 85.8766 7.1511 103.141 19.8801 115.87C32.6092 128.599 49.8734 135.75 67.875 135.75ZM66.1253 95.3267L103.834 50.0767L92.2497 40.4233L59.8205 79.3308L43.0403 62.543L32.3764 73.207L55.0014 95.832L60.8386 101.669L66.1253 95.3267Z"
                fill="white"
              />
            </svg>
          ),
          bgColor: 'bg-[#25D366]',
          iconSize: 'w-32 h-32',
        };
      case 'whatsapp-failed':
        return {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="136"
              height="136"
              viewBox="0 0 136 136"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M67.875 135.75C76.7885 135.75 85.6147 133.994 93.8496 130.583C102.085 127.172 109.567 122.173 115.87 115.87C122.173 109.567 127.172 102.085 130.583 93.8496C133.994 85.6147 135.75 76.7885 135.75 67.875C135.75 58.9615 133.994 50.1353 130.583 41.9004C127.172 33.6654 122.173 26.1829 115.87 19.8801C109.567 13.5773 102.085 8.57771 93.8496 5.16668C85.6147 1.75564 76.7885 -1.32821e-07 67.875 0C49.8734 2.68244e-07 32.6092 7.15109 19.8801 19.8801C7.1511 32.6092 0 49.8734 0 67.875C0 85.8766 7.1511 103.141 19.8801 115.87C32.6092 128.599 49.8734 135.75 67.875 135.75ZM45.5 63.25L67.875 85.625L90.25 63.25L102.5 75.5L80.125 97.875L102.5 120.25L90.25 132.5L67.875 110.125L45.5 132.5L33.25 120.25L55.625 97.875L33.25 75.5L45.5 63.25Z"
                fill="white"
              />
            </svg>
          ),
          bgColor: 'bg-[#EF4444]',
          iconSize: 'w-32 h-32',
        };
      default:
        return {
          icon: <Check className="w-16 h-16 text-white" />,
          bgColor: 'bg-[#F9A8D4]',
          iconSize: 'w-28 h-28',
        };
    }
  };

  const iconConfig = getIconConfig();

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-[10px] shadow-2xl max-w-md w-full p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        {/* Icon Circle */}
        <div
          className={`${iconConfig.bgColor} ${iconConfig.iconSize} rounded-full flex items-center justify-center mb-6 shadow-lg`}
        >
          {iconConfig.icon}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          {title}
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>

        {/* Buttons */}
        {variant === 'confirm' ? (
          <div className="flex gap-3 w-full max-w-[280px]">
            <Button
              variant="light-pink-hover-dark-pink"
              className="flex-1 py-3"
              onClick={onClose}
            >
              {'Batal'}
            </Button>
            <Button
              variant="light-pink-hover-dark-pink"
              className="flex-1 py-3"
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
            >
              {'Ya'}
            </Button>
          </div>
        ) : (
          <Button
            variant="light-pink-hover-dark-pink"
            className="w-full max-w-[220px] py-3"
            onClick={handleButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}

// Demo Component
export function PopupNotifikasiDemo() {
  const [openPopup, setOpenPopup] = React.useState<string | null>(null);

  const popups = [
    {
      id: 'whatsapp',
      variant: 'whatsapp' as const,
      title: 'Lanjutkan Pembayaran',
      description: 'Lanjutkan pembayaran melalui WhatsApp',
      buttonText: 'Bayar',
    },
    {
      id: 'whatsapp-success',
      variant: 'whatsapp-success' as const,
      title: 'Pembayaran Berhasil',
      description:
        'Pembayaran Anda melalui WhatsApp berhasil diproses. Terima kasih telah mempercayai layanan kami!',
      buttonText: 'Selesai',
    },
    {
      id: 'whatsapp-failed',
      variant: 'whatsapp-failed' as const,
      title: 'Pembayaran Gagal',
      description:
        'Pembayaran melalui WhatsApp tidak berhasil diproses. Silakan coba lagi atau hubungi customer service kami.',
      buttonText: 'Coba Lagi',
    },
    {
      id: 'success',
      variant: 'success' as const,
      title: 'Berhasil Mengunduh Tiket',
      description: 'Tiket perjalanan Anda berhasil diunduh',
      buttonText: 'Oke',
    },
    {
      id: 'error',
      variant: 'error' as const,
      title: 'Pembayaran Gagal',
      description: 'Terjadi kesalahan saat memproses pembayaran Anda',
      buttonText: 'Coba Lagi',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-3 text-center">
          Popup Notifikasi
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Click the buttons to see different notification variants
        </p>

        {/* Demo Buttons */}
        <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Try Different Variants
          </h2>

          <button
            onClick={() => setOpenPopup('whatsapp')}
            className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Show WhatsApp Popup
          </button>

          <button
            onClick={() => setOpenPopup('success')}
            className="w-full bg-[#F9A8D4] hover:bg-[#F472B6] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Show Success Popup
          </button>

          <button
            onClick={() => setOpenPopup('error')}
            className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Show Error Popup
          </button>
        </div>

        {/* Usage Example */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Usage Example
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {`<PopupNotifikasi
  variant="success"
  title="Berhasil Mengunduh Tiket"
  description="Tiket perjalanan Anda berhasil diunduh"
  buttonText="Oke"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onButtonClick={() => {
    console.log('Button clicked');
    setIsOpen(false);
  }}
/>`}
          </pre>
        </div>
      </div>

      {/* Render Popups */}
      {popups.map((popup) => (
        <PopupNotifikasi
          key={popup.id}
          variant={popup.variant}
          title={popup.title}
          description={popup.description}
          buttonText={popup.buttonText}
          isOpen={openPopup === popup.id}
          onClose={() => setOpenPopup(null)}
          onButtonClick={() => {
            console.log(`${popup.variant} button clicked`);
            setOpenPopup(null);
          }}
        />
      ))}
    </div>
  );
}
