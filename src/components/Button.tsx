import React, { ButtonHTMLAttributes } from 'react';
import arrowIcon from '../assets/icon/arrow.png';
import './Button.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'ghost'
    | 'purple-light'
    | 'pink-light'
    | 'teal-light'
    | 'teal-medium'
    | 'pink-danger'
    | 'white-hover-purple';
  className?: string;
  showArrows?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  showArrows = false,
  ...rest
}: Props) {
  return (
    <button className={`ui-btn ui-btn--${variant} ${className}`} {...rest}>
      <span className="ui-btn__label">{children}</span>
      {showArrows && (
        <span className="ui-btn__arrow" aria-hidden="true">
          <img src={arrowIcon} alt="" />
        </span>
      )}
    </button>
  );
}
