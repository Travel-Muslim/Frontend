import React, { useEffect, useMemo, useState } from 'react';
import type { CommunityPost } from '../../api/community';
import { fetchCommunityPosts } from '../../api/community';
import AdminLayout from '../../components/admin/AdminLayout';

function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="m8 10 4 4 4-4"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M14 5h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 5v14"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 12h9"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m13 9-3 3 3 3"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle
        cx="12"
        cy="9"
        r="4"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
      />
      <path
        d="M6 20c0-3.5 3-6 6-6s6 2.5 6 6"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="m12 4 2.2 4.4 4.8.7-3.5 3.4.8 4.8L12 14.8 7.7 17.3l.8-4.8L5 9.1l4.8-.7Z"
        fill="#f4b400"
        stroke="#e3a200"
      />
    </svg>
  );
}

export default function AdminCommunity() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthOpen, setMonthOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCommunityPosts()
      .then((list) => {
        if (active) setPosts(list);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const sortedPosts = useMemo(() => posts, [posts]);

  return (
    <AdminLayout title="Manajemen Komunitas">
      <section className="bg-white rounded-2xl p-[18px] border border-[#f0e8ff] shadow-[0_18px_38px_rgba(15,23,42,0.12)] m-6">
        <div className="flex justify-between items-center gap-3">
          <h2 className="m-0 text-[22px] text-[#1d1d1f] font-bold">
            Forum Diskusi
          </h2>
          <button
            className="border border-[#e4d5ff] bg-[#f7f2ff] text-[#6b53b8] rounded-xl px-3 py-[10px] inline-flex items-center gap-[10px] cursor-pointer font-extrabold hover:bg-[#efe6ff] transition-colors duration-150"
            type="button"
            onClick={() => setMonthOpen((v) => !v)}
            aria-expanded={monthOpen}
          >
            November
            <span
              className={`w-[18px] h-[18px] inline-flex items-center justify-center transition-transform duration-200 ${monthOpen ? 'rotate-180' : ''}`}
            >
              <IconChevron />
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-[14px] mt-3">
          {loading ? (
            <div className="border border-[#f0d7e1] rounded-xl p-[14px] bg-[#fffdfd] shadow-[0_10px_18px_rgba(15,23,42,0.08)] text-[#6b6b6b]">
              Memuat data...
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="border border-[#f0d7e1] rounded-xl p-[14px] bg-[#fffdfd] shadow-[0_10px_18px_rgba(15,23,42,0.08)] text-[#6b6b6b]">
              Belum ada diskusi.
            </div>
          ) : (
            sortedPosts.map((post) => (
              <article
                className="border border-[#f0d7e1] rounded-xl p-[14px] bg-[#fffdfd] shadow-[0_10px_18px_rgba(15,23,42,0.08)]"
                key={post.id}
              >
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-[10px]">
                  <h3 className="m-0 mb-2 sm:mb-0 text-[#2d2d2d] text-[17px] font-bold">
                    "{post.title}"
                  </h3>
                  <div className="flex items-start sm:items-center gap-[10px]">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-[38px] h-[38px] rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <div className="font-extrabold text-[#1f1f1f]">
                        {post.author}
                      </div>
                      <div className="flex items-center gap-2 text-[#6b6b6b] font-bold text-sm">
                        <span className="w-4 h-4 flex-shrink-0">
                          <StarIcon />
                        </span>
                        <span>{post.rating?.toFixed?.(1) ?? post.rating}</span>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </header>
                <p className="m-0 mt-[10px] leading-[1.6] text-[#2f2f2f]">
                  {post.body}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </AdminLayout>
  );
}
