import React, { useState, useRef, useEffect } from 'react';
import { LogOut, UserPen, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../api/auth';
import { useAuth } from '../../../contexts/AuthContext';

export interface ProfileMenuItem {
  id: string;
  label: string;
  icon?: 'logout' | 'edit' | 'dashboard' | React.ReactNode;
  onClick?: () => void;
  action?: 'edit-profile' | 'logout' | 'admin-dashboard' | 'custom';
}

interface DropdownProfileProps {
  userName: string;
  userAvatar?: string;
  menuItems?: ProfileMenuItem[];
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  onLogoutSuccess?: () => void;
  showAdminDashboard?: boolean; // Control visibility of admin dashboard option
}

export default function DropdownProfile({
  userName,
  userAvatar,
  menuItems,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  onLogoutSuccess,
  showAdminDashboard = false,
}: DropdownProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Default menu items if none provided
  const defaultMenuItems: ProfileMenuItem[] = [
    {
      id: 'edit',
      label: 'Edit Profil',
      icon: 'edit',
      action: 'edit-profile',
    },
    ...(showAdminDashboard
      ? [
          {
            id: 'admin',
            label: 'Dashboard Admin',
            icon: 'dashboard' as const,
            action: 'admin-dashboard' as const,
          },
        ]
      : []),
    {
      id: 'signout',
      label: 'Sign Out',
      icon: 'logout',
      action: 'logout',
    },
  ];

  const items = menuItems || defaultMenuItems;

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const success = await logout();
      if (success) {
        // Update auth context
        setUser(null);
        if (onLogoutSuccess) {
          onLogoutSuccess();
        } else {
          // Default behavior: navigate to home
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, clear local data
      setUser(null);
      if (onLogoutSuccess) {
        onLogoutSuccess();
      } else {
        navigate('/');
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };
  const handleAdminDashboard = () => {
    // Token sudah tersimpan di localStorage saat login
    // Akan otomatis diambil oleh axios interceptor untuk API calls
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin');
    } else {
      console.error('No authentication token found');
      // Redirect to login if no token
      navigate('/login');
    }
  };
  const handleMenuItemClick = async (item: ProfileMenuItem) => {
    setIsOpen(false);

    // Handle built-in actions
    if (item.action === 'logout') {
      await handleLogout();
      return;
    }

    if (item.action === 'edit-profile') {
      handleEditProfile();
      return;
    }
    if (item.action === 'admin-dashboard') {
      handleAdminDashboard();
      return;
    }
    // Handle custom onClick
    if (item.onClick) {
      item.onClick();
    }
  };

  const getIcon = (icon: ProfileMenuItem['icon']) => {
    if (icon === 'logout') {
      return <LogOut className="w-5 h-5" />;
    }
    if (icon === 'edit') {
      return <UserPen className="w-5 h-5" />;
    }
    if (icon === 'dashboard') {
      return <LayoutDashboard className="w-5 h-5" />;
    }
    return icon;
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Profile Button */}
      <button
        onClick={handleToggle}
        className={`
          flex items-center gap-3
          transition-colors
          ${buttonClassName || 'bg-linear-30 border-none border-gray-200 rounded-[15px] px-3 py-2 sm:px-0 sm:py-0 hover:border-gray-300'}
        `}
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden bg-linear-30 flex-shrink-0">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-purple-200 text-purple-700 font-semibold text-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name */}
        <span className="text-base font-semibold hidden sm:block">
          {userName}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={`w-5 h-5 font-semibold transition-transform duration-200 hidden sm:block ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute top-full right-0 mt-2
            bg-white border border-gray-200 rounded-[15px]
            shadow-lg
            overflow-hidden
            z-1200
            min-w-[220px]
            ${menuClassName}
          `}
        >
          {/* User Info Header */}
          <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-200 text-purple-700 font-semibold text-xl">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-base font-semibold text-gray-800">
                {userName}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item)}
                disabled={isLoggingOut && item.action === 'logout'}
                className="
                  w-full flex items-center gap-3
                  px-4 py-3
                  text-base text-gray-700
                  hover:bg-[#F9F5FF]
                  transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {item.icon && (
                  <span className="text-gray-600">{getIcon(item.icon)}</span>
                )}
                <span>
                  {isLoggingOut && item.action === 'logout'
                    ? 'Logging out...'
                    : item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Demo Component
export function DropdownProfileDemo() {
  const navigate = useNavigate();
  const sampleAvatar =
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sonya&backgroundColor=c0aede';

  // Example with default behavior (uses built-in actions)
  const defaultBehaviorItems: ProfileMenuItem[] = [
    {
      id: 'edit',
      label: 'Edit Profil',
      icon: 'edit',
      action: 'edit-profile', // Will navigate to /profile
    },
    {
      id: 'admin',
      label: 'Dashboard Admin',
      icon: 'dashboard',
      action: 'admin-dashboard', // Will navigate to /admin with token check
    },
    {
      id: 'signout',
      label: 'Sign Out',
      icon: 'logout',
      action: 'logout', // Will call logout API and navigate to /
    },
  ];

  // Example with custom behavior
  const customMenuItems: ProfileMenuItem[] = [
    {
      id: 'edit',
      label: 'Edit Profil',
      icon: 'edit',
      action: 'edit-profile',
    },
    {
      id: 'admin',
      label: 'Dashboard Admin',
      icon: 'dashboard',
      action: 'admin-dashboard',
    },
    {
      id: 'settings',
      label: 'Settings',
      action: 'custom',
      onClick: () => {
        console.log('Settings clicked');
        alert('Opening settings...');
      },
    },
    {
      id: 'signout',
      label: 'Sign Out',
      icon: 'logout',
      action: 'logout',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Dropdown Profile Component
          </h1>
          <p className="text-gray-600">
            Profile dropdown with avatar, name, and dynamic menu items
          </p>
        </div>

        {/* Example 1: Basic Profile Dropdown with Default Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Example 1: Default Behavior (Auto-navigate to /profile and logout)
          </h2>
          <div className="flex justify-end">
            <DropdownProfile userName="Sonya Nur" userAvatar={sampleAvatar} />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Uses default menu items with built-in navigation and logout
          </p>
        </div>

        {/* Example 1b: With Admin Dashboard */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Example 1b: With Admin Dashboard Option
          </h2>
          <div className="flex justify-end">
            <DropdownProfile
              userName="Admin User"
              userAvatar={sampleAvatar}
              showAdminDashboard={true}
            />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Shows admin dashboard option for authorized users
          </p>
        </div>

        {/* Example 2: With Custom Menu Items */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Example 2: Custom Menu Items
          </h2>
          <div className="flex justify-end">
            <DropdownProfile
              userName="Ahmad Rahman"
              menuItems={customMenuItems}
            />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Custom menu with additional settings option
          </p>
        </div>

        {/* Example 3: With Custom Logout Handler */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Example 3: Custom Logout Success Handler
          </h2>
          <div className="flex justify-end">
            <DropdownProfile
              userName="Fatimah Zahra"
              userAvatar={sampleAvatar}
              onLogoutSuccess={() => {
                console.log('Custom logout handler');
                alert('Logout successful! Redirecting...');
                navigate('/login');
              }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Uses custom callback after successful logout
          </p>
        </div>

        {/* Example 4: Without Avatar Image */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Example 4: Without Avatar (Shows Initial)
          </h2>
          <div className="flex justify-end">
            <DropdownProfile userName="User Name" />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Displays user initial when no avatar provided
          </p>
        </div>

        {/* Usage Example */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Usage Example
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {`// Simple usage with default behavior
<DropdownProfile
  userName="Sonya Nur"
  userAvatar="https://example.com/avatar.jpg"
/>

// With admin dashboard option
<DropdownProfile
  userName="Admin User"
  userAvatar="https://example.com/avatar.jpg"
  showAdminDashboard={true}
/>

// With custom menu items
const menuItems = [
  {
    id: 'edit',
    label: 'Edit Profil',
    icon: 'edit',
    action: 'edit-profile', // Auto-navigate to /profile
  },
  {
    id: 'admin',
    label: 'Dashboard Admin',
    icon: 'dashboard',
    action: 'admin-dashboard', // Auto-navigate to /admin with token
  },
  {
    id: 'settings',
    label: 'Settings',
    action: 'custom',
    onClick: () => {
      // Custom handler
      navigate('/settings');
    },
  },
  {
    id: 'signout',
    label: 'Sign Out',
    icon: 'logout',
    action: 'logout', // Auto-logout and redirect
  },
];

<DropdownProfile
  userName="Sonya Nur"
  userAvatar="https://example.com/avatar.jpg"
  menuItems={menuItems}
  onLogoutSuccess={() => {
    // Optional: Custom logout handler
    navigate('/login');
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
              <span>Built-in navigation to /profile on edit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>
                Built-in navigation to /admin dashboard with token check
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Integrated logout API call</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Auto-clear localStorage on logout</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Token validation before accessing admin dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Default menu items if none provided</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Custom onClick handlers per item</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Avatar support (with fallback to initial letter)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Loading state during logout</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Click outside to close</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Responsive (hides name/chevron on mobile)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">✓</span>
              <span>Smooth animations and transitions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
