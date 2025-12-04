import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";

import Home from "./pages/Home";
import Wishlist from "./pages/Wishlist";
import Riwayat from "./pages/Riwayat";
import Artikel from "./pages/Artikel";
import Komunitas from "./pages/Komunitas";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function AppWrapper() {
  const location = useLocation();

  const hideHeader = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/komunitas" element={<Komunitas />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
