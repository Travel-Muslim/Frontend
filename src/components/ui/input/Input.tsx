import type { InputHTMLAttributes } from 'react';
import React, { useRef } from 'react';
import './Input.css';
import { HiddenPwIcon, SeePwIcon } from '../../../assets/icon';
import { Calendar, Upload, Minus, Plus } from 'lucide-react';
import Button from '../button/Button';

type InputProps = {
  label?: string;
  icon?: string; // URL or path to icon
  showPasswordToggle?: boolean;
  onPasswordToggle?: () => void;
  isPasswordVisible?: boolean;
  error?: string;
  variant?: 'default' | 'date' | 'upload' | 'number-control';
  onUploadClick?: () => void;
  uploadText?: string;
  onIncrement?: () => void;
  onDecrement?: () => void;
  value?: string | number;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  icon,
  showPasswordToggle = false,
  onPasswordToggle,
  isPasswordVisible = false,
  error,
  type = 'text',
  variant = 'default',
  onUploadClick,
  uploadText = 'Upload paspor anda',
  onIncrement,
  onDecrement,
  value,
  ...props
}: InputProps) {
  // Date variant
  if (variant === 'date') {
    const inputDateRef = useRef<HTMLInputElement>(null);
    return (
      <label className="flex flex-col gap-1.5">
        {label && <span className="text-sm">{label}</span>}
        <div className="relative">
          <input
            ref={inputDateRef}
            type="date"
            className="w-full rounded-[10px] border border-[#ffc9d6] py-3 pr-3 pl-4 text-sm outline-none bg-white box-border focus:border-[#ff8fb1] focus:shadow-[0_0_0_1px_rgba(255,143,177,0.3)] transition-all custom-date-input"
            style={{ colorScheme: 'light' }}
            value={value as string}
            {...props}
          />
        </div>
        {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
      </label>
    );
  }

  // Upload variant
  if (variant === 'upload') {
    return (
      <label className="flex flex-col gap-1.5">
        {label && <span className="text-sm">{label}</span>}
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-[10px] border border-[#ffc9d6] py-3.5 pr-11 pl-4 text-sm outline-none bg-white box-border focus:border-[#ff8fb1] focus:shadow-[0_0_0_1px_rgba(255,143,177,0.3)] transition-all"
            placeholder={uploadText}
            value={value as string}
            readOnly
            {...props}
          />
          <button
            type="button"
            onClick={onUploadClick}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <Upload className="w-[18px] h-[18px]" />
          </button>
        </div>
        {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
      </label>
    );
  }

  // Number control variant
  if (variant === 'number-control') {
    return (
      <label className="flex flex-col gap-1.5">
        {label && <span className="text-sm">{label}</span>}
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-[10px] border border-[#ffc9d6] py-3.5 pr-24 pl-4 text-sm outline-none bg-white box-border focus:border-[#ff8fb1] focus:shadow-[0_0_0_1px_rgba(255,143,177,0.3)] transition-all"
            value={value}
            readOnly
            {...props}
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={onDecrement}
              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-3 h-3 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={onIncrement}
              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        </div>
        {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
      </label>
    );
  }

  // Default variant
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm">{label}</span>}
      <div className="relative">
        <input
          type={
            showPasswordToggle && type === 'password'
              ? isPasswordVisible
                ? 'text'
                : 'password'
              : type
          }
          className="w-full rounded-[10px] border border-[#ffc9d6] py-3.5 pr-11 pl-4 text-sm outline-none bg-white box-border focus:border-[#ff8fb1] focus:shadow-[0_0_0_1px_rgba(255,143,177,0.3)] transition-all"
          value={value as string}
          {...props}
        />
        {icon && (
          <img
            src={icon}
            alt=""
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] opacity-70"
          />
        )}
        {showPasswordToggle && onPasswordToggle && (
          <img
            src={isPasswordVisible ? HiddenPwIcon : SeePwIcon}
            alt={isPasswordVisible ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] opacity-60 cursor-pointer transition-opacity duration-200 hover:opacity-100"
            onClick={onPasswordToggle}
          />
        )}
      </div>
      {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
    </label>
  );
}

// Demo Component
export function InputDemo() {
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [emailError, setEmailError] = React.useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !value.includes('@')) {
      setEmailError('Email harus mengandung karakter @');
    } else {
      setEmailError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 text-center">
          Input Component
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Tailwind-based input fields with various configurations
        </p>

        {/* Basic Inputs */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Basic Text Inputs
          </h2>
          <div className="space-y-4">
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={handleEmailChange}
              error={emailError}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+62 812 3456 7890"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Password Input
          </h2>
          <div className="space-y-4">
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPasswordToggle
              isPasswordVisible={showPassword}
              onPasswordToggle={() => setShowPassword(!showPassword)}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              showPasswordToggle
              isPasswordVisible={showPassword}
              onPasswordToggle={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        {/* Input with Icons */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Input with Custom Icons
          </h2>
          <div className="space-y-4">
            <Input
              label="Search"
              type="text"
              placeholder="Search something..."
              icon="https://api.iconify.design/lucide/search.svg"
            />
            <Input
              label="Location"
              type="text"
              placeholder="Enter location"
              icon="https://api.iconify.design/lucide/map-pin.svg"
            />
          </div>
        </div>

        {/* Error States */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Error States
          </h2>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="invalid-email"
              error="Please enter a valid email address"
            />
            <Input
              label="Password"
              type="password"
              placeholder="123"
              error="Password must be at least 8 characters"
              showPasswordToggle
            />
          </div>
        </div>

        {/* Different Sizes & States */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Different States
          </h2>
          <div className="space-y-4">
            <Input
              label="Disabled Input"
              type="text"
              placeholder="This is disabled"
              disabled
            />
            <Input
              label="Readonly Input"
              type="text"
              value="This is readonly"
              readOnly
            />
            <Input
              label="Required Input"
              type="text"
              placeholder="This is required"
              required
            />
          </div>
        </div>

        {/* Form Example */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Complete Form Example
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Form submitted!');
            }}
            className="space-y-4"
          >
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              required
              showPasswordToggle
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              required
              showPasswordToggle
            />
            <button
              type="submit"
              className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Submit Form
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
