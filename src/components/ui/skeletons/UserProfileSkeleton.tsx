import React from 'react';

export const UserProfileSkeleton = () => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
    <div className="flex flex-col gap-1">
      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
    </div>
  </div>
);

export const UserDropdownSkeleton = () => (
  <div className="px-3 py-2 border-b border-gray-100 mb-2">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
      <div className="flex flex-col gap-1">
        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
        <div className="h-2 bg-gray-200 rounded w-20 animate-pulse" />
      </div>
    </div>
  </div>
);

export default UserProfileSkeleton;