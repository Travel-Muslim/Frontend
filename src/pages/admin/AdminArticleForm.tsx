import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
    <div className="flex min-h-screen bg-[#faf5f0] font-sans">
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${navOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setNavOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 h-screen w-[260px] bg-white shadow-[4px_0_18px_rgba(15,23,42,0.08)] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-3 p-6 border-b border-[#e8dfd6]">
          <div className="w-[46px] h-[46px] rounded-xl bg-gradient-to-br from-[#8b6bd6] to-[#6a4cb8] grid place-items-center shadow-[0_8px_20px_rgba(123,90,211,0.25)]">
            <img src="/logo.svg" alt="Saleema" className="w-[30px] h-[30px]" />
          </div>
          <div className="flex flex-col leading-tight">
            <strong className="text-[17px] text-[#2a2a2a] font-extrabold">
              Saleema
            </strong>
            <span className="text-[13px] text-[#8b6bd6] font-bold">Tour</span>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-[6px] p-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`flex items-center gap-3 px-4 py-[13px] rounded-[12px] text-[15px] font-bold transition-all duration-150 ${isActive(location.pathname, item.path) ? 'bg-gradient-to-r from-[#8b6bd6] to-[#7557c9] text-white shadow-[0_8px_20px_rgba(123,90,211,0.28)]' : 'text-[#6a6a6a] hover:bg-[#f7f4ff]'}`}
              type="button"
              onClick={() => {
                setNavOpen(false);
                navigate(item.path);
              }}
            >
              <span className="w-[22px] h-[22px] flex-shrink-0">
                <NavIcon name={item.key as NavItem['key']} />
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col lg:ml-[260px]">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-white px-6 py-4 shadow-[0_2px_12px_rgba(15,23,42,0.08)] min-h-[74px]">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden flex flex-col gap-[5px] w-[28px] h-[28px] justify-center cursor-pointer"
              type="button"
              aria-label="Buka navigasi"
              onClick={() => setNavOpen(true)}
            >
              <span className="block w-full h-[3px] bg-[#7b5ad3] rounded-full" />
              <span className="block w-full h-[3px] bg-[#7b5ad3] rounded-full" />
              <span className="block w-full h-[3px] bg-[#7b5ad3] rounded-full" />
            </button>
            <button
              className="hidden sm:flex items-center gap-2 px-4 py-[10px] bg-white border border-[#e8dfd6] rounded-[10px] text-[#7b5ad3] font-bold cursor-pointer transition-all duration-150 hover:bg-[#f7f4ff]"
              type="button"
              onClick={() => navigate('/admin/articles')}
              aria-label="Kembali"
            >
              <span className="w-[18px] h-[18px]">
                <IconArrowLeft />
              </span>
              <span>Kembali</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2a2a2a] m-0">
              {isEditMode && hasArticle ? 'Edit Artikel' : 'Tambahkan Artikel'}
            </h1>
          </div>
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center gap-3 cursor-pointer bg-transparent border-none"
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <img
                src="/avatar.jpg"
                alt="Admin"
                className="w-[44px] h-[44px] rounded-full object-cover border-2 border-[#e8dfd6]"
              />
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <div className="text-[15px] font-bold text-[#2a2a2a]">
                  Sofia Nugraheni
                </div>
                <div className="text-[13px] text-[#8a8a8a]">Admin</div>
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-[14px] shadow-[0_10px_32px_rgba(15,23,42,0.12)] min-w-[180px] py-2 z-50">
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-[10px] text-[15px] font-bold text-[#4a4a4a] bg-transparent border-none cursor-pointer hover:bg-[#f7f4ff] transition-colors duration-150"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/');
                  }}
                >
                  <span className="w-[20px] h-[20px] flex-shrink-0">
                    <IconLogout />
                  </span>
                  <span>Sign Out</span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-[10px] text-[15px] font-bold text-[#4a4a4a] bg-transparent border-none cursor-pointer hover:bg-[#f7f4ff] transition-colors duration-150"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/admin/profile');
                  }}
                >
                  <span className="w-[20px] h-[20px] flex-shrink-0">
                    <IconProfile />
                  </span>
                  <span>Edit Profil</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="m-6 bg-[#fffdfd] border border-[#f4d6dc] rounded-[20px] p-6 shadow-[0_8px_18px_rgba(0,0,0,0.08)] mb-4">
          <div className="mb-6">
            <h2 className="m-0 text-[22px] text-[#1d1d1f] font-bold">
              Tambah Artikel
            </h2>
            <p className="mt-[6px] mb-0 text-sm text-[#8a8a8a]">
              Isi kolom di bawah ini secara lengkap untuk{' '}
              {isEditMode && hasArticle ? 'memperbarui' : 'membuat'} draft
              artikel.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
            <label className="flex flex-col gap-2 font-bold text-[#4a4a4a]">
              <span>Judul Artikel*</span>
              <input
                type="text"
                required
                placeholder="Bukan Seoul Aja! Hidden Gems Korea dalam Paket Wisata Muslimah"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-[#f5b5be] rounded-[10px] py-3 px-[14px] text-[15px] bg-[#fffdfd] outline-none focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.18)] placeholder:text-[#b3b3b3]"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold text-[#4a4a4a]">
              <span>Tanggal*</span>
              <div className="flex items-center border border-[#f5b5be] rounded-[10px] bg-[#fffdfd] px-[10px] focus-within:border-[#f28b95] focus-within:shadow-[0_0_0_2px_rgba(242,139,149,0.18)]">
                <input
                  type="date"
                  required
                  placeholder="30/11/2025"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-none outline-none py-3 px-1 w-full bg-transparent text-[15px]"
                />
                <span className="w-[20px] h-[20px] flex-shrink-0 text-[#f28b95]">
                  <IconCalendar />
                </span>
              </div>
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="rounded-[16px] font-extrabold bg-[#22c6b6] border border-[#16b3a6] text-white shadow-[0_10px_22px_rgba(34,198,182,0.2)] px-6 py-[14px] cursor-pointer hover:bg-[#1eab9d] hover:shadow-[0_14px_28px_rgba(34,198,182,0.3)] transition-all duration-150"
              onClick={handleSave}
            >
              Simpan Perubahan
            </button>
          </div>
        </section>

        <section className="m-6 bg-white border border-[#f5d4de] rounded-[20px] p-6 shadow-[0_8px_18px_rgba(0,0,0,0.08)] mb-4">
          <div className="mb-6">
            <h2 className="m-0 text-[22px] text-[#1d1d1f] font-bold">
              Isi Artikel
            </h2>
            <p className="mt-[6px] mb-0 text-sm text-[#8a8a8a]">
              Tulis konten artikel Anda di sini. Pastikan narasi mengalir dengan
              baik, informatif, dan relevan dengan kategori yang dipilih.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap my-[10px] mb-3">
            <div className="flex items-center border border-[#f0c7cb] rounded-[10px] px-[10px] bg-white">
              <span className="text-[#f28b95] font-extrabold mr-1">T</span>
              <select
                value={fontWeight}
                onChange={(e) => setFontWeight(e.target.value as TextWeight)}
                className="border-none bg-transparent text-[#2f2f2f] font-bold py-2 cursor-pointer outline-none"
              >
                <option value="Semi-Bold">Semi-Bold</option>
                <option value="Bold">Bold</option>
                <option value="Regular">Regular</option>
              </select>
            </div>
            <div>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="border border-[#f0c7cb] rounded-[10px] px-[10px] py-2 bg-white text-[#2f2f2f] font-bold min-w-[86px] cursor-pointer outline-none"
              >
                <option value="20px">20px</option>
                <option value="18px">18px</option>
                <option value="16px">16px</option>
              </select>
            </div>
            <button
              type="button"
              aria-label="Bold"
              className={`border rounded-lg p-2 cursor-pointer inline-flex items-center justify-center transition-all duration-150 ${bold ? 'border-[#22c6b6] bg-[#e1faf6] text-[#158f83] shadow-[0_8px_16px_rgba(34,198,182,0.2)]' : 'border-[#e4d5ff] bg-white text-[#b08cf2]'}`}
              onClick={() => {
                applyCommand('bold');
                setBold((v) => !v);
              }}
            >
              <span className="w-4 h-4">
                <IconBold />
              </span>
            </button>
            <button
              type="button"
              aria-label="Italic"
              className={`border rounded-lg p-2 cursor-pointer inline-flex items-center justify-center transition-all duration-150 ${italic ? 'border-[#22c6b6] bg-[#e1faf6] text-[#158f83] shadow-[0_8px_16px_rgba(34,198,182,0.2)]' : 'border-[#e4d5ff] bg-white text-[#b08cf2]'}`}
              onClick={() => {
                applyCommand('italic');
                setItalic((v) => !v);
              }}
            >
              <span className="w-4 h-4">
                <IconItalic />
              </span>
            </button>
            <button
              type="button"
              aria-label="Underline"
              className={`border rounded-lg p-2 cursor-pointer inline-flex items-center justify-center transition-all duration-150 ${underline ? 'border-[#22c6b6] bg-[#e1faf6] text-[#158f83] shadow-[0_8px_16px_rgba(34,198,182,0.2)]' : 'border-[#e4d5ff] bg-white text-[#b08cf2]'}`}
              onClick={() => {
                applyCommand('underline');
                setUnderline((v) => !v);
              }}
            >
              <span className="underline font-extrabold text-[#b08cf2]">U</span>
            </button>
            <button
              type="button"
              aria-label="Rata kiri"
              className={`border rounded-lg p-2 cursor-pointer inline-flex items-center justify-center transition-all duration-150 ${align === 'left' ? 'border-[#22c6b6] bg-[#e1faf6] text-[#158f83] shadow-[0_8px_16px_rgba(34,198,182,0.2)]' : 'border-[#e4d5ff] bg-white text-[#b08cf2]'}`}
              onClick={() => {
                setAlign('left');
                applyCommand('justifyLeft');
              }}
            >
              <span className="w-4 h-4">
                <IconAlignLeft />
              </span>
            </button>
            <button
              type="button"
              aria-label="Rata tengah"
              className={`border rounded-lg p-2 cursor-pointer inline-flex items-center justify-center transition-all duration-150 ${align === 'center' ? 'border-[#22c6b6] bg-[#e1faf6] text-[#158f83] shadow-[0_8px_16px_rgba(34,198,182,0.2)]' : 'border-[#e4d5ff] bg-white text-[#b08cf2]'}`}
              onClick={() => {
                setAlign('center');
                applyCommand('justifyCenter');
              }}
            >
              <span className="w-4 h-4">
                <IconAlignCenter />
              </span>
            </button>
            <button
              type="button"
              aria-label="Rata kanan"
              className={`border rounded-lg p-2 cursor-pointer inline-flex items-center justify-center transition-all duration-150 ${align === 'justify' ? 'border-[#22c6b6] bg-[#e1faf6] text-[#158f83] shadow-[0_8px_16px_rgba(34,198,182,0.2)]' : 'border-[#e4d5ff] bg-white text-[#b08cf2]'}`}
              onClick={() => {
                setAlign('justify');
                applyCommand('justifyFull');
              }}
            >
              <span className="w-4 h-4">
                <IconAlignJustify />
              </span>
            </button>
            <button
              type="button"
              aria-label="Bullet list"
              className={`border rounded-lg p-2 cursor-pointer inline-flex items-center justify-center transition-all duration-150 ${listMode === 'bullet' ? 'border-[#22c6b6] bg-[#e1faf6] text-[#158f83] shadow-[0_8px_16px_rgba(34,198,182,0.2)]' : 'border-[#e4d5ff] bg-white text-[#b08cf2]'}`}
              onClick={() => {
                const next = listMode === 'bullet' ? 'none' : 'bullet';
                setListMode(next);
                applyCommand('insertUnorderedList');
              }}
            >
              <span className="w-4 h-4">
                <IconList />
              </span>
            </button>
            <button
              type="button"
              aria-label="Tambahkan link"
              className="border border-[#e4d5ff] bg-white rounded-lg p-2 cursor-pointer inline-flex items-center justify-center text-[#b08cf2] transition-all duration-150 hover:bg-[#f7f4ff]"
              onClick={() => {
                const url = window.prompt('Masukkan URL');
                if (url) applyCommand('createLink', url);
              }}
            >
              <span className="w-4 h-4">
                <IconLinkInline />
              </span>
            </button>
            <button
              type="button"
              aria-label="Tambahkan gambar"
              className="border border-[#e4d5ff] bg-white rounded-lg p-2 cursor-pointer inline-flex items-center justify-center text-[#b08cf2] transition-all duration-150 hover:bg-[#f7f4ff]"
              onClick={() => contentImageInputRef.current?.click()}
            >
              <span className="w-4 h-4">
                <IconImage />
              </span>
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
            className="w-full border border-[#f5b5be] rounded-[12px] p-[14px] text-[15px] bg-[#fffdfd] outline-none min-h-[320px] box-border leading-[1.6] [direction:ltr] text-left [unicode-bidi:normal] [writing-mode:horizontal-tb] focus:border-[#f28b95] focus:shadow-[0_0_0_2px_rgba(242,139,149,0.18)] empty:before:content-[attr(data-placeholder)] empty:before:text-[#b3b3b3]"
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

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              className="border border-[#16b3a6] bg-[#22c6b6] text-white px-5 py-3 rounded-[10px] font-bold cursor-pointer shadow-[0_10px_22px_rgba(34,198,182,0.2)] transition-transform duration-150 hover:scale-105"
              onClick={handleSave}
            >
              Simpan Perubahan
            </button>
          </div>
        </section>

        <div className="bg-white rounded-[20px] border border-[#f0e0ef] p-5 shadow-[0_18px_35px_rgba(0,0,0,0.08)] mt-3 mx-6 mb-6 flex flex-col gap-[14px]">
          <button
            type="button"
            className="w-full rounded-[18px] font-extrabold bg-[#22c6b6] text-white shadow-[0_12px_24px_rgba(34,198,182,0.3)] px-5 py-[14px] cursor-pointer hover:bg-[#1eab9d] hover:shadow-[0_16px_32px_rgba(34,198,182,0.4)] transition-all duration-150"
            onClick={() => setPreviewOpen(true)}
          >
            Tampilkan Detail Preview
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
            <button
              type="button"
              className="rounded-[16px] font-extrabold bg-[#f87171] border border-[#f87171] text-white shadow-[0_10px_22px_rgba(248,113,113,0.2)] px-5 py-[14px] cursor-pointer hover:bg-[#ef4444] hover:shadow-[0_14px_28px_rgba(248,113,113,0.3)] transition-all duration-150"
              onClick={() => navigate('/admin/articles')}
            >
              Batalkan Artikel
            </button>
            <button
              type="button"
              className="rounded-[16px] font-extrabold bg-[#22c6b6] border border-[#16b3a6] text-white shadow-[0_10px_22px_rgba(34,198,182,0.2)] px-5 py-[14px] cursor-pointer hover:bg-[#1eab9d] hover:shadow-[0_14px_28px_rgba(34,198,182,0.3)] transition-all duration-150"
              onClick={handleSave}
            >
              {isEditMode && hasArticle
                ? 'Simpan Artikel'
                : 'Tambahkan Artikel'}
            </button>
          </div>
        </div>

        {successModal && (
          <div className="fixed inset-0 bg-black/40 grid place-items-center z-[9999] p-4">
            <div className="bg-white rounded-[18px] p-8 text-center shadow-[0_10px_32px_rgba(0,0,0,0.15)] max-w-[380px] w-full">
              <div className="w-[92px] h-[92px] rounded-full bg-[#22c6b6] grid place-items-center mx-auto mb-[18px] shadow-[0_10px_26px_rgba(34,198,182,0.28)]">
                <span className="w-[48px] h-[48px]">
                  <IconCheck />
                </span>
              </div>
              <h3 className="m-0 mb-2 text-xl text-[#2a2a2a] font-bold">
                Artikel {isEditMode && hasArticle ? 'Diperbarui' : 'Tersimpan'}
              </h3>
              <p className="text-[#757575] mb-6 text-[15px]">
                Artikel berhasil{' '}
                {isEditMode && hasArticle ? 'diperbarui' : 'disimpan'}.
              </p>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="w-full border border-[#16b3a6] bg-[#22c6b6] text-white px-5 py-[14px] rounded-[10px] font-bold cursor-pointer shadow-[0_10px_22px_rgba(34,198,182,0.2)] transition-transform duration-150 hover:scale-105"
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
          <div className="fixed inset-0 bg-black/50 grid place-items-center z-[9999] p-4">
            <div className="bg-white rounded-[18px] p-6 max-w-[920px] w-full max-h-[85vh] overflow-y-auto relative shadow-[0_10px_32px_rgba(0,0,0,0.15)]">
              <button
                className="absolute top-4 right-4 w-[38px] h-[38px] rounded-full bg-[#f3f3f3] grid place-items-center cursor-pointer text-[#8a8a8a] transition-all duration-150 hover:bg-[#e4e4e4]"
                type="button"
                onClick={() => setPreviewOpen(false)}
              >
                <IconClose />
              </button>
              <h3 className="m-0 mb-5 text-xl font-bold text-[#2a2a2a]">
                Detail Preview
              </h3>
              <div className="grid gap-2">
                <div className="flex flex-col gap-1">
                  <strong className="text-lg text-[#2b2b2b]">
                    {previewTitle}
                  </strong>
                  <span className="text-[#d56780] font-extrabold">
                    {previewDate}
                  </span>
                  {previewLink && (
                    <a
                      className="text-[#1aa7b6] break-all font-bold"
                      href={previewLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {previewLink}
                    </a>
                  )}
                </div>
                {imageSrc && (
                  <div>
                    <img
                      src={imageSrc}
                      alt={previewTitle}
                      className="w-full max-h-[320px] object-cover rounded-[12px] mb-[10px]"
                    />
                  </div>
                )}
                <div
                  className="m-0 leading-[1.6] text-[#383838] [direction:ltr] text-left [unicode-bidi:isolate] [writing-mode:horizontal-tb]"
                  dangerouslySetInnerHTML={{ __html: previewContent }}
                />
                {previewGallery.length > 0 && (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 mt-3">
                    {previewGallery.map((src, idx) => (
                      <img
                        key={`${src}-${idx}`}
                        src={src}
                        alt={`${previewTitle} ${idx + 1}`}
                        className="w-full h-[180px] object-cover rounded-[10px]"
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
