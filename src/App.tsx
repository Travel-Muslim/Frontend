import React, { Suspense, lazy } from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import Header from './components/section/header/Header';
import Footer from './components/section/footer/Footer';
import { AuthProvider } from './contexts/AuthContext';

const Home = lazy(() => import('./pages/Home'));
const Wishlist = lazy(() => import('./pages/destinasi/WishlistDestinasi'));
const Riwayat = lazy(() => import('./pages/pesanan/RiwayatPesanan'));
const Artikel = lazy(() => import('./pages/artikel/Artikel'));
const ArtikelDetail = lazy(() => import('./pages/artikel/DetailArtikel'));
const Komunitas = lazy(() => import('./pages/komunitas/Komunitas'));
const DetailDestinasi = lazy(() => import('./pages/destinasi/DetailDestinasi'));
const Login = lazy(() => import('./pages/auth/Login'));
const SignUp = lazy(() => import('./pages/auth/Register'));
const ReviewDestinasi = lazy(() => import('./pages/destinasi/ReviewDestinasi'));
const TicketPage = lazy(() => import('./pages/pesanan/DetailTiket'));
const CariDestinasi = lazy(() => import('./pages/destinasi/CariDestinasi'));
const RekomendasiPaket = lazy(
  () => import('./pages/destinasi/RekomendasiDestinasi')
);
const ForgotPassword = lazy(() => import('./pages/auth/LupaPassword'));
const PembayaranPesanan = lazy(
  () => import('./pages/pesanan/PembayaranPesanan')
);
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminUserCreate = lazy(() => import('./pages/admin/AdminUserCreate'));
const AdminUserView = lazy(() => import('./pages/admin/AdminUserView'));
const AdminUserEdit = lazy(() => import('./pages/admin/AdminUserEdit'));
const AdminPackages = lazy(() => import('./pages/admin/AdminPackages'));
const AdminPackageCreate = lazy(
  () => import('./pages/admin/AdminPackageCreate')
);
const AdminPackageEdit = lazy(
  () => import('./pages/admin/AdminPackageEdit')
);
const AdminPackageDetail = lazy(
  () => import('./pages/admin/AdminPackageDetail')
);
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles'));
const AdminArticleCreate = lazy(() => import('./pages/admin/AdminArticleCreate'));
const AdminArticleEdit = lazy(() => import('./pages/admin/AdminArticleEdit'));
const AdminArticleView = lazy(() => import('./pages/admin/AdminArticleView'));
const AdminArticleForm = lazy(() => import('./pages/admin/AdminArticleForm'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminOrderView = lazy(() => import('./pages/admin/AdminOrderView'));
const AdminOrderEdit = lazy(() => import('./pages/admin/AdminOrderEdit'));
const AdminCommunity = lazy(() => import('./pages/admin/AdminCommunity'));
const Profile = lazy(() => import('./pages/profile/Profile'));

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppWrapper() {
  const location = useLocation();

  const hideHeaderPaths = [
    '/login',
    '/signup',
    '/forgot-password',
    '/admin',
    '/profile',
  ];
  const hideFooterPaths = [
    '/login',
    '/signup',
    '/forgot-password',
    '/admin',
    '/profile',
  ];
  const hideProfileHeader = location.pathname === '/profile';
  const hideHeader = hideHeaderPaths.some((p) =>
    location.pathname.startsWith(p)
  );
  const hideFooter = hideFooterPaths.some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <>
      <ScrollToTop />
      {!hideHeader && !hideProfileHeader && <Header />}

      <Suspense fallback={<div style={{ minHeight: '60vh' }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/home" element={<Home />} />
          <Route path="/cari-destinasi" element={<CariDestinasi />} />
          <Route path="/rekomendasi-destinasi" element={<RekomendasiPaket />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/riwayat" element={<Riwayat />} />
          <Route path="/artikel" element={<Artikel />} />
          <Route path="/artikel/:id" element={<ArtikelDetail />} />
          <Route path="/komunitas" element={<Komunitas />} />
          <Route path="/destinasi/:id" element={<DetailDestinasi />} />
          <Route
            path="/pembayaran-pesanan/:id"
            element={<PembayaranPesanan />}
          />
          <Route path="/review" element={<ReviewDestinasi />} />
          <Route path="/tiket/:id" element={<TicketPage />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/create" element={<AdminUserCreate />} />
          <Route path="/admin/users/:id" element={<AdminUserView />} />
          <Route path="/admin/users/:id/edit" element={<AdminUserEdit />} />
          <Route path="/admin/packages" element={<AdminPackages />} />
          <Route path="/admin/packages/create" element={<AdminPackageCreate />} />
          <Route path="/admin/packages/edit/:id" element={<AdminPackageEdit />} />
          <Route path="/admin/packages/:id" element={<AdminPackageDetail />} />
          <Route path="/admin/articles" element={<AdminArticles />} />
          <Route path="/admin/articles/create" element={<AdminArticleCreate />} />
          <Route path="/admin/articles/edit/:id" element={<AdminArticleEdit />} />
          <Route path="/admin/articles/:id" element={<AdminArticleView />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/view/:id" element={<AdminOrderView />} />
          <Route path="/admin/orders/edit/:id" element={<AdminOrderEdit />} />
          <Route path="/admin/community" element={<AdminCommunity />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </BrowserRouter>
  );
}
