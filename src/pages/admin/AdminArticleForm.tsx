import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './AdminDashboard.css';
import './AdminPackageDetail.css';
import './AdminArticleForm.css';
import type { Article, ArticleBlock } from '../../api/articles';
import { loadArticles, upsertArticle } from '../../utils/articleStorage';

interface NavItem {
  key: string;
  label: string;
  path: string;
}

type TextWeight = 'Regular' | 'Semi-Bold' | 'Bold';
type TextAlign = 'left' | 'center' | 'justify';

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', path: '/admin' },
  { key: 'users', label: 'Manajemen User', path: '/admin/users' },
  { key: 'packages', label: 'Manajemen Paket', path: '/admin/packages' },
  { key: 'articles', label: 'Manajemen Artikel', path: '/admin/articles' },
  { key: 'community', label: 'Manajemen Komunitas', path: '/admin/community' },
  { key: 'orders', label: 'Manajemen Order', path: '/admin/orders' },
];

const ARTICLE_TEMPLATE: Required<
  Pick<
    Article,
    | 'title'
    | 'date'
    | 'displayDate'
    | 'content'
    | 'image'
    | 'gallery'
    | 'blocks'
  >
> = {
  title: '',
  date: '',
  displayDate: '',
  content: '',
  image: '',
  gallery: [],
  blocks: [],
};
const ARTICLE_LINK = '';
const STRIP_BIDI_REGEX = /[\u202A-\u202E\u2066-\u2069\u200E\u200F]/g;

const forceLtr = (el: HTMLElement | null) => {
  if (!el) return;
  el.dir = 'ltr';
  el.style.direction = 'ltr';
  el.style.textAlign = 'left';
  (el.style as any).unicodeBidi = 'normal';
  (el.style as any).writingMode = 'horizontal-tb';
  el.childNodes.forEach((node) => {
    if (node instanceof HTMLElement) {
      node.dir = 'ltr';
      node.style.direction = 'ltr';
      node.style.textAlign = 'left';
      (node.style as any).unicodeBidi = 'normal';
      (node.style as any).writingMode = 'horizontal-tb';
    }
  });
};

const stripBidi = (value: string) => value.replace(STRIP_BIDI_REGEX, '');

const placeCaretAtEnd = (el: HTMLElement) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
};

function NavIcon({ name }: { name: NavItem['key'] }) {
  const stroke = '#8b6bd6';
  switch (name) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3"
            y="3"
            width="8"
            height="8"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="13"
            y="3"
            width="8"
            height="5"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="3"
            y="13"
            width="5"
            height="8"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="10"
            y="13"
            width="11"
            height="8"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="9"
            cy="8"
            r="4"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M3 20c0-3.5 3-6 6-6"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="18"
            cy="9"
            r="3"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M15.5 15.5c1.5 0 5.5 1 5.5 4.5"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'packages':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 7.5 12 3l8 4.5-8 4.5L4 7.5Z"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M4 7.5v9l8 4.5 8-4.5v-9"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path d="M12 12v9" stroke={stroke} strokeWidth="2" fill="none" />
        </svg>
      );
    case 'articles':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="5"
            y="4"
            width="14"
            height="16"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M8 8h8M8 12h8M8 16h5"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'community':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="7"
            cy="9"
            r="3"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="17"
            cy="9"
            r="3"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M3 18c0-3 3-5 7-5"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M21 18c0-3-3-5-7-5"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'orders':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M7 9h10M7 13h7"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

function IconArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M14.5 6.5 8 12l6.5 5.5"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M8.5 12H19"
        fill="none"
        stroke="#7b5ad3"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect
        x="4"
        y="6"
        width="16"
        height="14"
        rx="3"
        fill="none"
        stroke="#f28b95"
        strokeWidth="2"
      />
      <path
        d="M8 4v4M16 4v4M4 10h16"
        fill="none"
        stroke="#f28b95"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBold() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7 5h6a3 3 0 0 1 0 6H7zm0 6h7a3 3 0 0 1 0 6H7z"
        fill="none"
        stroke="#b08cf2"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconItalic() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M10 5h6M8 19h6m1-14-5 14"
        fill="none"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M5 12.5 10 17.5 19 7"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="m7 7 10 10M17 7 7 17"
        fill="none"
        stroke="#4a4a4a"
        strokeWidth="2.2"
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

function IconAlignLeft() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M5 7.5h14"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 12h10"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 16.5h14"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconAlignCenter() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M6 7.5h12"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 12h8"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 16.5h12"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconAlignJustify() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M5 7.5h14"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 12h14"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 16.5h14"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconList() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="6.5" cy="8" r="1.4" fill="#b08cf2" />
      <circle cx="6.5" cy="12" r="1.4" fill="#b08cf2" />
      <circle cx="6.5" cy="16" r="1.4" fill="#b08cf2" />
      <path
        d="M10 8h8M10 12h8M10 16h8"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconImage() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect
        x="4"
        y="6"
        width="16"
        height="12"
        rx="2.2"
        stroke="#b08cf2"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M8 13.5 11 10l3 4 2-1.8L18 14"
        fill="none"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="10" r="1.4" fill="#b08cf2" />
    </svg>
  );
}

function IconLinkInline() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M9.5 14.5 8 16a3.5 3.5 0 1 1-5-5l3-3a3.5 3.5 0 0 1 5 0l.8.8M14.5 9.5 16 8a3.5 3.5 0 1 1 5 5l-3 3a3.5 3.5 0 0 1-5 0l-.8-.8"
        fill="none"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 14 14 10"
        stroke="#b08cf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const formatDisplayDate = (value: string) => {
  if (!value) return '';
  const parts = value.split(/[-/]/);
  if (parts.length === 3) {
    const [p1, p2, p3] = parts;
    let day = p1;
    let month = p2;
    const year = p1.length === 4 ? p1 : p3;
    if (Number(p1) > 12 && Number(p2) <= 12) {
      day = p1;
      month = p2;
    } else if (Number(p2) > 12 && Number(p1) <= 12) {
      day = p2;
      month = p1;
    } else if (p1.length === 4) {
      day = p3;
      month = p2;
    }
    const iso = `${year}-${month}-${day}`;
    const date = new Date(iso);
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    }
  }
  return value;
};

export default function AdminArticleForm() {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [title, setTitle] = useState(ARTICLE_TEMPLATE.title);
  const [date, setDate] = useState(ARTICLE_TEMPLATE.date);
  const toHtml = (val: string) =>
    val && val.includes('<') ? val : val ? `<p>${val}</p>` : '';
  const [contentHtml, setContentHtml] = useState<string>(
    toHtml(ARTICLE_TEMPLATE.content)
  );
  const [imageSrc, setImageSrc] = useState(ARTICLE_TEMPLATE.image);
  const [gallery, setGallery] = useState<string[]>(
    ARTICLE_TEMPLATE.gallery || []
  );
  const [link, setLink] = useState('');
  const [fontWeight, setFontWeight] = useState<TextWeight>('Semi-Bold');
  const [fontSize, setFontSize] = useState('20px');
  const [align, setAlign] = useState<TextAlign>('left');
  const [listMode, setListMode] = useState<'none' | 'bullet'>('none');
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const contentImageInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [successModal, setSuccessModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const isActive = (current: string, target: string) =>
    target === '/admin'
      ? current === target
      : current === target || current.startsWith(`${target}/`);
  const articleKey = params.id ?? '';
  const isEditMode = Boolean(articleKey);
  const article = useMemo(
    () =>
      isEditMode
        ? articles.find((a) => String(a.id) === String(articleKey))
        : undefined,
    [articleKey, articles, isEditMode]
  );
  const hasArticle = !!article;

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadArticles()
      .then((data) => {
        if (active) setArticles(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setDate(article.date || '');
      setContentHtml(toHtml(article.content || ''));
      setImageSrc(article.image || '');
      setGallery(article.gallery || []);
      setLink(article.link || '');
    } else if (!isEditMode) {
      setTitle(ARTICLE_TEMPLATE.title);
      setDate(ARTICLE_TEMPLATE.date);
      setContentHtml(toHtml(ARTICLE_TEMPLATE.content));
      setImageSrc(ARTICLE_TEMPLATE.image);
      setGallery(ARTICLE_TEMPLATE.gallery || []);
      setLink('');
      setFontWeight('Semi-Bold');
      setFontSize('20px');
      setAlign('left');
      setListMode('none');
      setBold(false);
      setItalic(false);
      setUnderline(false);
    } else if (isEditMode && !loading) {
      setTitle(ARTICLE_TEMPLATE.title);
      setDate(ARTICLE_TEMPLATE.date);
      setContentHtml(toHtml(ARTICLE_TEMPLATE.content));
      setImageSrc(ARTICLE_TEMPLATE.image);
      setGallery([]);
      setLink('');
    }
  }, [article, isEditMode, loading]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('click', close);
    }
    return () => document.removeEventListener('click', close);
  }, [profileOpen]);

  const previewTitle = title || (article?.title ?? ARTICLE_TEMPLATE.title);
  const previewDate = date || (article?.date ?? ARTICLE_TEMPLATE.date);
  const previewContent = useMemo(
    () =>
      contentHtml ||
      article?.content ||
      ARTICLE_TEMPLATE.content ||
      'Isi artikel akan tampil di sini.',
    [article?.content, contentHtml]
  );
  const previewLink = '';
  const previewGallery =
    (gallery && gallery.length > 0 ? gallery : article?.gallery) ||
    ARTICLE_TEMPLATE.gallery ||
    [];
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  const textareaStyle: React.CSSProperties = {
    fontWeight: bold
      ? 800
      : fontWeight === 'Bold'
        ? 800
        : fontWeight === 'Semi-Bold'
          ? 700
          : 400,
    fontSize,
    fontStyle: italic ? 'italic' : 'normal',
    textDecoration: underline ? 'underline' : 'none',
    paddingLeft: listMode === 'bullet' ? 24 : 14,
    textAlign: align,
    lineHeight: 1.6,
  };

  const handleSave = async () => {
    const payload: Article = {
      id: isEditMode && article ? article.id : '',
      title: title || article?.title || ARTICLE_TEMPLATE.title,
      date: date || article?.date || ARTICLE_TEMPLATE.date,
      displayDate: formatDisplayDate(
        String(
          date ||
            article?.displayDate ||
            ARTICLE_TEMPLATE.displayDate ||
            ARTICLE_TEMPLATE.date
        )
      ),
      time: article?.time || '07.00',
      status: article?.status || 'Selesai',
      content: contentHtml || article?.content || ARTICLE_TEMPLATE.content,
      image: imageSrc || article?.image || ARTICLE_TEMPLATE.image,
      gallery: gallery.length
        ? gallery
        : article?.gallery || ARTICLE_TEMPLATE.gallery || [],
      link: link || article?.link || ARTICLE_LINK,
      blocks: (article?.blocks as ArticleBlock[] | undefined) || [],
    };
    const next = await upsertArticle(payload);
    setArticles(next);
    setSuccessModal(true);
  };

  useEffect(() => {
    if (editorRef.current) {
      forceLtr(editorRef.current);
      const cleaned = stripBidi(editorRef.current.innerHTML);
      if (cleaned !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = cleaned;
        placeCaretAtEnd(editorRef.current);
      }
    }
  }, [editorRef]);

  const applyCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      const html = editorRef.current.innerHTML;
      setContentHtml(html);
    }
  };

  return (
    <div className={`ad-root ${navOpen ? 'nav-open' : ''}`}>
      <div
        className={`ad-nav-backdrop ${navOpen ? 'show' : ''}`}
        onClick={() => setNavOpen(false)}
      />

      <aside className={`ad-sidebar ${navOpen ? 'is-open' : ''}`}>
        <div className="ad-logo">
          <div className="ad-logo-badge">
            <img src="/logo.svg" alt="Saleema" />
          </div>
          <div className="ad-logo-text">
            <strong>Saleema</strong>
            <span>Tour</span>
          </div>
        </div>
        <nav className="ad-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`ad-nav-item ${isActive(location.pathname, item.path) ? 'active' : ''}`}
              type="button"
              onClick={() => {
                setNavOpen(false);
                navigate(item.path);
              }}
            >
              <span className="ad-nav-icon">
                <NavIcon name={item.key as NavItem['key']} />
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="ad-main">
        <header className="ad-topbar">
          <div className="ad-topbar-left">
            <button
              className="ad-menu-toggle"
              type="button"
              aria-label="Buka navigasi"
              onClick={() => setNavOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
            <button
              className="ap-back-btn"
              type="button"
              onClick={() => navigate('/admin/articles')}
              aria-label="Kembali"
            >
              <IconArrowLeft />
              <span>Kembali</span>
            </button>
            <h1>
              {isEditMode && hasArticle ? 'Edit Artikel' : 'Tambahkan Artikel'}
            </h1>
          </div>
          <div className="ad-user-wrapper" ref={userMenuRef}>
            <button
              className="ad-user"
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <img src="/avatar.jpg" alt="Admin" />
              <div>
                <div className="ad-user-name">Sofia Nugraheni</div>
                <div className="ad-user-role">Admin</div>
              </div>
            </button>
            {profileOpen && (
              <div className="ad-user-menu">
                <button
                  type="button"
                  className="ad-user-menu-item"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/');
                  }}
                >
                  <span className="ad-user-menu-icon">
                    <IconLogout />
                  </span>
                  <span>Sign Out</span>
                </button>
                <button
                  type="button"
                  className="ad-user-menu-item"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/admin/profile');
                  }}
                >
                  <span className="ad-user-menu-icon">
                    <IconProfile />
                  </span>
                  <span>Edit Profil</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="aaf-card aaf-meta-card">
          <div className="aaf-card-head">
            <h2>Tambah Artikel</h2>
            <p className="apd-sub">
              Isi kolom di bawah ini secara lengkap untuk{' '}
              {isEditMode && hasArticle ? 'memperbarui' : 'membuat'} draft
              artikel.
            </p>
          </div>
          <div className="aaf-grid">
            <label className="apd-field">
              <span>Judul Artikel*</span>
              <input
                type="text"
                required
                placeholder="Bukan Seoul Aja! Hidden Gems Korea dalam Paket Wisata Muslimah"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="apd-field">
              <span>Tanggal*</span>
              <div className="aaf-date-field">
                <input
                  type="date"
                  required
                  placeholder="30/11/2025"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <span className="aaf-date-icon">
                  <IconCalendar />
                </span>
              </div>
            </label>
          </div>
          <div className="aaf-card-actions">
            <button
              type="button"
              className="apd-btn apd-btn-save"
              onClick={handleSave}
            >
              Simpan Perubahan
            </button>
          </div>
        </section>

        <section className="aaf-card aaf-content-card">
          <div className="aaf-card-head">
            <h2>Isi Artikel</h2>
            <p className="apd-sub">
              Tulis konten artikel Anda di sini. Pastikan narasi mengalir dengan
              baik, informatif, dan relevan dengan kategori yang dipilih.
            </p>
          </div>

          <div className="aaf-toolbar">
            <div className="aaf-select">
              <span className="aaf-select-prefix">T</span>
              <select
                value={fontWeight}
                onChange={(e) => setFontWeight(e.target.value as TextWeight)}
              >
                <option value="Semi-Bold">Semi-Bold</option>
                <option value="Bold">Bold</option>
                <option value="Regular">Regular</option>
              </select>
            </div>
            <div className="aaf-select">
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
              >
                <option value="20px">20px</option>
                <option value="18px">18px</option>
                <option value="16px">16px</option>
              </select>
            </div>
            <button
              type="button"
              aria-label="Bold"
              className={bold ? 'aaf-btn-active' : ''}
              onClick={() => {
                applyCommand('bold');
                setBold((v) => !v);
              }}
            >
              <IconBold />
            </button>
            <button
              type="button"
              aria-label="Italic"
              className={italic ? 'aaf-btn-active' : ''}
              onClick={() => {
                applyCommand('italic');
                setItalic((v) => !v);
              }}
            >
              <IconItalic />
            </button>
            <button
              type="button"
              aria-label="Underline"
              className={underline ? 'aaf-btn-active' : ''}
              onClick={() => {
                applyCommand('underline');
                setUnderline((v) => !v);
              }}
            >
              <span className="aaf-underline">U</span>
            </button>
            <button
              type="button"
              aria-label="Rata kiri"
              className={align === 'left' ? 'aaf-btn-active' : ''}
              onClick={() => {
                setAlign('left');
                applyCommand('justifyLeft');
              }}
            >
              <IconAlignLeft />
            </button>
            <button
              type="button"
              aria-label="Rata tengah"
              className={align === 'center' ? 'aaf-btn-active' : ''}
              onClick={() => {
                setAlign('center');
                applyCommand('justifyCenter');
              }}
            >
              <IconAlignCenter />
            </button>
            <button
              type="button"
              aria-label="Rata kanan"
              className={align === 'justify' ? 'aaf-btn-active' : ''}
              onClick={() => {
                setAlign('justify');
                applyCommand('justifyFull');
              }}
            >
              <IconAlignJustify />
            </button>
            <button
              type="button"
              aria-label="Bullet list"
              className={listMode === 'bullet' ? 'aaf-btn-active' : ''}
              onClick={() => {
                const next = listMode === 'bullet' ? 'none' : 'bullet';
                setListMode(next);
                applyCommand('insertUnorderedList');
              }}
            >
              <IconList />
            </button>
            <button
              type="button"
              aria-label="Tambahkan link"
              onClick={() => {
                const url = window.prompt('Masukkan URL');
                if (url) applyCommand('createLink', url);
              }}
            >
              <IconLinkInline />
            </button>
            <button
              type="button"
              aria-label="Tambahkan gambar"
              onClick={() => contentImageInputRef.current?.click()}
            >
              <IconImage />
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={contentImageInputRef}
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                applyCommand('insertImage', url);
              }
              e.target.value = '';
            }}
          />
          <input
            type="file"
            multiple
            accept="image/*"
            ref={galleryInputRef}
            style={{ display: 'none' }}
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (!files.length) return;
              const urls = files.map((file) => URL.createObjectURL(file));
              setGallery((prev) => [...prev, ...urls]);
              e.target.value = '';
            }}
          />

          <div
            ref={editorRef}
            className="aaf-editor"
            contentEditable
            dir="ltr"
            suppressContentEditableWarning
            onInput={(e) => {
              const el = e.target as HTMLDivElement;
              forceLtr(el);
              const cleaned = stripBidi(el.innerHTML);
              if (cleaned !== el.innerHTML) {
                el.innerHTML = cleaned;
                placeCaretAtEnd(el);
              }
              setContentHtml(cleaned);
            }}
            style={{
              ...textareaStyle,
              direction: 'ltr',
              unicodeBidi: 'normal' as React.CSSProperties['unicodeBidi'],
            }}
            data-placeholder="Masukkan isi artikel dan sisipkan gambar/link di sini"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <div className="aaf-card-actions">
            <button
              type="button"
              className="apd-btn apd-btn-save"
              onClick={handleSave}
            >
              Simpan Perubahan
            </button>
          </div>
        </section>

        <div className="aaf-preview-actions">
          <button
            type="button"
            className="apd-btn-secondary aaf-preview-btn"
            onClick={() => setPreviewOpen(true)}
          >
            Tampilkan Detail Preview
          </button>
          <div className="aaf-footer-row">
            <button
              type="button"
              className="apd-btn apd-btn-cancel"
              onClick={() => navigate('/admin/articles')}
            >
              Batalkan Artikel
            </button>
            <button
              type="button"
              className="apd-btn apd-btn-save"
              onClick={handleSave}
            >
              {isEditMode && hasArticle
                ? 'Simpan Artikel'
                : 'Tambahkan Artikel'}
            </button>
          </div>
        </div>

        {successModal && (
          <div className="ap-modal">
            <div className="ap-modal-card">
              <div className="ap-modal-icon ap-modal-icon-success">
                <IconCheck />
              </div>
              <h3>
                Artikel {isEditMode && hasArticle ? 'Diperbarui' : 'Tersimpan'}
              </h3>
              <p>
                Artikel berhasil{' '}
                {isEditMode && hasArticle ? 'diperbarui' : 'disimpan'}.
              </p>
              <div className="ap-modal-actions">
                <button
                  type="button"
                  className="ap-modal-btn confirm"
                  onClick={() => {
                    setSuccessModal(false);
                    navigate('/admin/articles');
                  }}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}

        {previewOpen && (
          <div className="ap-preview-modal">
            <div className="ap-preview-card">
              <button
                className="ap-preview-close"
                type="button"
                onClick={() => setPreviewOpen(false)}
              >
                <IconClose />
              </button>
              <h3>Detail Preview</h3>
              <div className="aaf-preview">
                <div className="aaf-preview-meta">
                  <strong>{previewTitle}</strong>
                  <span>{previewDate}</span>
                  {previewLink && (
                    <a
                      className="aaf-preview-link"
                      href={previewLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {previewLink}
                    </a>
                  )}
                </div>
                {imageSrc && (
                  <div className="aaf-preview-image">
                    <img src={imageSrc} alt={previewTitle} />
                  </div>
                )}
                <div
                  className="aaf-preview-body"
                  dangerouslySetInnerHTML={{ __html: previewContent }}
                />
                {previewGallery.length > 0 && (
                  <div className="aaf-preview-gallery">
                    {previewGallery.map((src, idx) => (
                      <img
                        key={`${src}-${idx}`}
                        src={src}
                        alt={`${previewTitle} ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
