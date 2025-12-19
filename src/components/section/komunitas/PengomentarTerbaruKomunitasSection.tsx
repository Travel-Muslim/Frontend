import CardKomentar from '../../ui/card-komentar/CardKomentar';

interface Commenter {
  name: string;
  rating: number;
  avatar: string;
}

interface PengomentarTerbaruKomunitasSectionProps {
  commenters: Commenter[];
  variant?: 'standalone' | 'sidebar';
}

export default function PengomentarTerbaruKomunitasSection({
  commenters,
  variant = 'standalone',
}: PengomentarTerbaruKomunitasSectionProps) {
  // Sidebar variant - compact layout for sidebar
  if (variant === 'sidebar') {
    return (
      <div className="bg-white rounded-[10px] shadow-lg overflow-hidden max-w-2xl mx-auto">
        {/* Title with purple background */}
        <div className="bg-[#B49DE4] px-6 py-3">
          <h3 className="text-lg font-bold text-white">Pengomentar Terbaru</h3>
        </div>
        {/* Commenters List */}
        <div className="bg-gray-50">
          {commenters.length > 0 ? (
            commenters.map((commenter, index) => (
              <CardKomentar
                key={`${commenter.name}-${index}`}
                variant="compact"
                avatar={commenter.avatar}
                name={commenter.name}
                rating={commenter.rating}
              />
            ))
          ) : (
            <div className="text-center py-8 px-6">
              <p className="text-gray-500 text-sm">Belum ada pengomentar</p>
            </div>
          )}
        </div>
      </div>
    );
  }
  // Standalone variant - full section layout
  return (
    <section className="w-full py-12 md:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Title with purple background */}
          <div className="bg-[#B49DE4] px-6 py-6">
            <h2 className="text-2xl font-bold text-white">
              Pengomentar Terbaru
            </h2>
          </div>
          {/* Commenters List */}
          <div className="bg-gray-50">
            {commenters.length > 0 ? (
              commenters.map((commenter, index) => (
                <CardKomentar
                  key={`${commenter.name}-${index}`}
                  variant="compact"
                  avatar={commenter.avatar}
                  name={commenter.name}
                  rating={commenter.rating}
                />
              ))
            ) : (
              <div className="text-center py-8 px-6">
                <p className="text-gray-500">Belum ada pengomentar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
