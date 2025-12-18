import StatCard from '../../ui/star-card/StatCard';

interface SocialApproveKomunitasSectionProps {
  activeMembers?: string;
  topicCount?: string;
  averageRating?: string;
  responseRate?: string;
  className?: string;
}

export default function SocialApproveKomunitasSection({
  activeMembers = '50K+',
  topicCount = '100+',
  averageRating = '4.9',
  responseRate = '95%',
  className = '',
}: SocialApproveKomunitasSectionProps) {
  return (
    <section
      className={`relative w-full -mt-30 md:-mt-24 lg:-mt-28 pb-8 md:pb-12 z-20 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          <StatCard
            value={activeMembers}
            label="Anggota Komunitas Aktif"
            className="w-full h-35 sm:h-30"
          />
          <StatCard
            value={topicCount}
            label="Topik Diskusi"
            className="w-full h-35 sm:h-30"
          />
          <StatCard
            value={averageRating}
            label="Rata-Rata Rating"
            className="w-full h-35 sm:h-30"
          />
          <StatCard
            value={responseRate}
            label="Tingkat Respons Diskusi"
            className="w-full h-35 sm:h-30"
          />
        </div>
      </div>
    </section>
  );
}
