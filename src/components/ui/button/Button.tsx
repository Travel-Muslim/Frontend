import React, { ButtonHTMLAttributes } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'white-hover-light-purple'
    | 'light-purple-hover-dark-purple'
    | 'light-pink-hover-dark-pink'
    | 'light-teal-hover-dark-teal'
    | 'light-teal-hover-super-dark-teal'
    | 'dark-pink-hover-super-dark-pink';
  className?: string;
  showArrows?: boolean;
  disabled?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const variantStyles: Record<
  string,
  {
    bg: string;
    hover: string;
    text: string;
    hoverText: string;
    arrowColor: string;
    arrowHoverColor: string;
  }
> = {
  'white-hover-light-purple': {
    bg: '#FFFFFF',
    hover: '#B49DE4',
    text: '#444444',
    hoverText: '#FFFFFF',
    arrowColor: '#444444',
    arrowHoverColor: '#FFFFFF',
  },
  'light-purple-hover-dark-purple': {
    bg: '#B49DE4',
    hover: '#6D4891',
    text: '#FFFFFF',
    hoverText: '#FFFFFF',
    arrowColor: '#FFFFFF',
    arrowHoverColor: '#FFFFFF',
  },
  'light-pink-hover-dark-pink': {
    bg: '#F9A8D4',
    hover: '#DE93A3',
    text: '#FFFFFF',
    hoverText: '#FFFFFF',
    arrowColor: '#FFFFFF',
    arrowHoverColor: '#FFFFFF',
  },
  'light-teal-hover-dark-teal': {
    bg: '#2DD4BF',
    hover: '#1C756E',
    text: '#FFFFFF',
    hoverText: '#FFFFFF',
    arrowColor: '#FFFFFF',
    arrowHoverColor: '#FFFFFF',
  },
  'light-teal-hover-super-dark-teal': {
    bg: '#5EEAD4',
    hover: '#0D9488',
    text: '#FFFFFF',
    hoverText: '#FFFFFF',
    arrowColor: '#FFFFFF',
    arrowHoverColor: '#FFFFFF',
  },
  'dark-pink-hover-super-dark-pink': {
    bg: '#EC4899',
    hover: '#DB2777',
    text: '#FFFFFF',
    hoverText: '#FFFFFF',
    arrowColor: '#FFFFFF',
    arrowHoverColor: '#FFFFFF',
  },
};

export default function Button({
  children,
  variant = 'white-hover-light-purple',
  className = '',
  showArrows = false,
  disabled = false,
  style,
  ...rest
}: Props) {
  const [isHovered, setIsHovered] = React.useState(false);

  const colors = variantStyles[variant];

  const buttonStyle = {
    backgroundColor: isHovered && !disabled ? colors.hover : colors.bg,
    color: isHovered && !disabled ? colors.hoverText : colors.text,
    ...style,
  };

  const arrowColor =
    isHovered && !disabled ? colors.arrowHoverColor : colors.arrowColor;

  return (
    <button
      className={`
        inline-flex items-center justify-center 
        font-semibold rounded-${rest.rounded || 'sm'} 
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        min-w-15
        min-h-10 max-h-20 px-3 text-base gap-2
        sm:w-30 sm:h-10 sm:px-4 sm:text-base sm:gap-2
        md:w-50 md:h-14 md:px-4 md:text-base md:gap-2
        lg:w-50 lg:h-16 lg:px-3 lg:text-lg lg:gap-2.5
        ${className}
      `}
      style={buttonStyle}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {showArrows && (
        <ArrowLeft
          className="w-5 h-5 flex-shrink-0"
          style={{ color: arrowColor }}
        />
      )}
      <span className="flex-1 text-center">{children}</span>
      {showArrows && (
        <ArrowRight
          className="w-5 h-5 flex-shrink-0"
          style={{ color: arrowColor }}
        />
      )}
    </button>
  );
}

// Demo Component
export function ButtonDemo() {
  return (
    <div
      className="min-h-screen p-4 sm:p-6 md:p-8"
      style={{ backgroundColor: '#4B5563' }}
    >
      <div
        className="mx-auto space-y-6 md:space-y-8"
        style={{ maxWidth: '400px' }}
      >
        {/* Group 1 */}
        <div
          className="p-4 sm:p-6 rounded-lg space-y-3 sm:space-y-4"
          style={{ border: '2px dashed #8A38F5' }}
        >
          <h2
            className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
            style={{ color: '#FFFFFF' }}
          >
            Group 1
          </h2>
          <Button variant="white-hover-light-purple">Button</Button>
          <Button variant="light-purple-hover-dark-purple" showArrows>
            Button
          </Button>
          <Button variant="light-purple-hover-dark-purple" showArrows disabled>
            Button
          </Button>
        </div>

        {/* Group 2 */}
        <div
          className="p-4 sm:p-6 rounded-lg space-y-3 sm:space-y-4"
          style={{ border: '2px dashed #8A38F5' }}
        >
          <h2
            className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
            style={{ color: '#FFFFFF' }}
          >
            Group 2
          </h2>
          <Button variant="light-purple-hover-dark-purple" showArrows>
            Button
          </Button>
          <Button variant="light-purple-hover-dark-purple" showArrows>
            Button
          </Button>
          <Button variant="light-purple-hover-dark-purple" showArrows>
            Button
          </Button>
        </div>

        {/* Group 3 */}
        <div
          className="p-4 sm:p-6 rounded-lg space-y-3 sm:space-y-4"
          style={{ border: '2px dashed #8A38F5' }}
        >
          <h2
            className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
            style={{ color: '#FFFFFF' }}
          >
            Group 3
          </h2>
          <Button variant="light-teal-hover-dark-teal" showArrows>
            Button
          </Button>
          <Button variant="light-teal-hover-dark-teal" showArrows>
            Button
          </Button>
          <Button variant="light-teal-hover-super-dark-teal" showArrows>
            Button
          </Button>
        </div>

        {/* Group 4 */}
        <div
          className="p-4 sm:p-6 rounded-lg space-y-3 sm:space-y-4"
          style={{ border: '2px dashed #8A38F5' }}
        >
          <h2
            className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
            style={{ color: '#FFFFFF' }}
          >
            Group 4
          </h2>
          <Button variant="light-pink-hover-dark-pink" showArrows>
            Button
          </Button>
          <Button variant="dark-pink-hover-super-dark-pink" showArrows>
            Button
          </Button>
          <Button variant="dark-pink-hover-super-dark-pink" showArrows>
            Button
          </Button>
        </div>

        {/* All Variants Showcase */}
        <div
          className="p-4 sm:p-6 rounded-lg space-y-3 sm:space-y-4"
          style={{ border: '2px dashed #8A38F5' }}
        >
          <h2
            className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
            style={{ color: '#FFFFFF' }}
          >
            All Variants
          </h2>
          <Button variant="white-hover-light-purple" showArrows>
            White to Purple
          </Button>
          <Button variant="light-purple-hover-dark-purple" showArrows>
            Light to Dark Purple
          </Button>
          <Button variant="light-pink-hover-dark-pink" showArrows>
            Pink Variant
          </Button>
          <Button variant="light-teal-hover-dark-teal" showArrows>
            Teal Variant
          </Button>
          <Button variant="light-teal-hover-super-dark-teal" showArrows>
            Teal to Dark
          </Button>
          <Button variant="dark-pink-hover-super-dark-pink" showArrows>
            Dark Pink
          </Button>
        </div>
      </div>
    </div>
  );
}
