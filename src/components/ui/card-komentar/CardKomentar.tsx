import React from 'react';
import { Star } from 'lucide-react';

interface CardKomentarProps {
  variant: 'full' | 'compact';
  avatar: string;
  name: string;
  rating: number;
  date?: string;
  title?: string;
  comment?: string;
  className?: string;
}

export default function CardKomentar({
  variant,
  avatar,
  name,
  rating,
  date,
  title,
  comment,
  className = '',
}: CardKomentarProps) {
  // Format date to remove T and Z
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return dateString.replace('T', ' ').replace('Z', '').split('.')[0];
  };

  // Full variant - with title, comment, and right-aligned profile
  if (variant === 'full') {
    return (
      <div
        className={`bg-white w-full rounded-[20px] border-2 border-[#FFC9D6] p-3 sm:p-4 ${className}`}
      >
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left side - Comment content */}
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
            )}
            {comment && (
              <p className="text-sm text-gray-700 leading-relaxed">{comment}</p>
            )}
          </div>

          {/* Right side - User info (horizontal layout) */}
          <div className="flex items-center gap-3 lg:min-w-[280px]">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name, Rating, and Date in horizontal layout */}
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-gray-800">{name}</h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-700">
                    {rating}
                  </span>
                </div>
                {date && (
                  <span className="text-xs text-gray-400">
                    {formatDate(date)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant - horizontal layout with left-aligned profile
  return (
    <div
      className={`bg-white h-20 rounded-[15px] border border-gray-200 p-4 ${className}`}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* Name and Rating */}
        <div className="flex-1">
          <h4 className="text-medium font-bold text-gray-800 mb-1">{name}</h4>
          <div className="flex items-center gap-2">
            <Star className="w-2 h-2 fill-yellow-400 text-yellow-400" />
            <span className="text-medium font-semibold text-gray-700">
              {rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo Component
export function CardKomentarDemo() {
  const sampleAvatar =
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sonya&backgroundColor=4a5568';

  const fullComments = [
    {
      id: '1',
      avatar: sampleAvatar,
      name: 'Lorem Ipsum',
      rating: 4.8,
      date: '00 MTH YEAR',
      title: 'Lorem Ipsum',
      comment:
        'Lorem ipsum dolor sit amet consectetur. Mi in nulla nisl sed aliquam leo in. Et ornare hendrerit fringilla consequat urna massa nunc habitant. Diam vitae pretium amet euismod.',
    },
    {
      id: '2',
      avatar: sampleAvatar,
      name: 'Sonya Nur Fadillah',
      rating: 4.8,
      date: '2 MTH AGO',
      title: 'Amazing Experience',
      comment:
        'The tour was absolutely fantastic! Everything was well-organized and the guide was very knowledgeable. The halal food options were excellent and the accommodations were comfortable. Highly recommended for Muslim travelers!',
    },
    {
      id: '3',
      avatar: sampleAvatar,
      name: 'Ahmad Rahman',
      rating: 5.0,
      date: '1 MTH AGO',
      title: 'Best Tour Ever',
      comment:
        'This was the best tour experience I have ever had. The itinerary was perfect, the prayer facilities were always available, and the team was very professional. Will definitely book again!',
    },
  ];

  const compactComments = [
    {
      id: '1',
      avatar: sampleAvatar,
      name: 'Sonya Nur Fadillah',
      rating: 4.8,
    },
    {
      id: '2',
      avatar: sampleAvatar,
      name: 'Ahmad Rahman',
      rating: 5.0,
    },
    {
      id: '3',
      avatar: sampleAvatar,
      name: 'Fatimah Zahra',
      rating: 4.5,
    },
    {
      id: '4',
      avatar: sampleAvatar,
      name: 'Muhammad Ali',
      rating: 4.9,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Card Komentar Component
          </h1>
          <p className="text-gray-600">
            Two variants: Full comment card and compact profile card
          </p>
        </div>

        {/* Full Variant Examples */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Full Variant - Complete Comments
          </h2>
          <div className="space-y-6">
            {fullComments.map((comment) => (
              <CardKomentar
                key={comment.id}
                variant="full"
                avatar={comment.avatar}
                name={comment.name}
                rating={comment.rating}
                date={comment.date}
                title={comment.title}
                comment={comment.comment}
              />
            ))}
          </div>
        </div>

        {/* Compact Variant Examples */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Compact Variant - Profile with Rating
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {compactComments.map((comment) => (
              <CardKomentar
                key={comment.id}
                variant="compact"
                avatar={comment.avatar}
                name={comment.name}
                rating={comment.rating}
              />
            ))}
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Usage Examples
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Full Variant
              </h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {`<CardKomentar
  variant="full"
  avatar="https://example.com/avatar.jpg"
  name="Sonya Nur Fadillah"
  rating={4.8}
  date="2 MTH AGO"
  title="Amazing Experience"
  comment="The tour was absolutely fantastic! Everything was well-organized..."
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Compact Variant
              </h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {`<CardKomentar
  variant="compact"
  avatar="https://example.com/avatar.jpg"
  name="Sonya Nur Fadillah"
  rating={4.8}
/>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Full Variant
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">✓</span>
                  <span>Pink border (#FFC9D6)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">✓</span>
                  <span>Title and full comment text</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">✓</span>
                  <span>Right-aligned user profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">✓</span>
                  <span>Rating with star icon and date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">✓</span>
                  <span>Responsive layout (column on mobile)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Compact Variant
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">✓</span>
                  <span>Minimal gray border</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">✓</span>
                  <span>Horizontal layout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">✓</span>
                  <span>Left-aligned avatar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">✓</span>
                  <span>Name and rating only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">✓</span>
                  <span>Perfect for user lists</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
