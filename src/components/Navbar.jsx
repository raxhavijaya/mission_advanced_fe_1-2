// src/components/Navbar.jsx (Final dengan Redux & Link Dashboard)

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStar,
  faSignOutAlt,
  faCaretDown,
  faTachometerAlt, // Ikon untuk Dashboard
} from "@fortawesome/free-solid-svg-icons";

// LANGKAH 1: Impor hooks dan actions dari Redux & Firebase
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { clearAuth } from "../store/redux/authSlice";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // LANGKAH 2: Ambil data user langsung dari Redux store
  const user = useSelector((state) => state.auth.user);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // LANGKAH 3: Perbaiki fungsi logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Logout dari Firebase
      dispatch(clearAuth()); // Bersihkan state di Redux
      navigate("/login"); // Arahkan ke halaman login
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <header className="fixed top-4 mt-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sreen-xl w-[95%] rounded-4xl bg-white/15 backdrop-blur-md px-7 py-6 shadow-2xl border border-white/20 flex justify-between items-center">
      <div className="flex items-center gap-4 md:gap-20">
        {/* Menggunakan <Link> untuk navigasi SPA yang lebih baik */}
        <Link to="/home" className="hover:scale-110 transition-transform">
          <img src="/logo.png" alt="Logo" className="hidden md:block w-28" />
          <img
            src="/logo2.png"
            alt="Logo"
            className="block md:hidden w-6 h-6"
          />
        </Link>

        <nav className="flex gap-3 md:gap-10">
          <Link
            to="/series"
            className="text-xs md:text-lg text-white hover:text-blue-400 transition-colors"
          >
            Series
          </Link>
          <Link
            to="/film"
            className="text-xs md:text-lg text-white hover:text-blue-400 transition-colors"
          >
            Film
          </Link>
          <Link
            to="/mylist"
            className="text-xs md:text-lg text-white hover:text-blue-400 transition-colors"
          >
            Daftar Saya
          </Link>
          {/* Link Dashboard di navigasi utama ini bisa tetap ada atau dihapus sesuai selera */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-xs md:text-lg font-bold text-amber-400 hover:text-blue-400 transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>
      </div>

      {/* Tampilkan profil hanya jika user sudah login */}
      {user && (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <img
              src={user.photoURL || "/avatar.png"}
              alt="Profile"
              className="w-10 h-10 mx-1 rounded-full border border-white/30 object-cover"
            />
            <span className="text-m text-white hidden md:block">
              {user.username}
            </span>
            <FontAwesomeIcon
              icon={faCaretDown}
              className={`transition-transform duration-300 text-white transform origin-center ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-gray-800/90 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-50">
              {/* LANGKAH 4: Tambahkan link Dashboard di dropdown (hanya untuk admin) */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10"
                >
                  <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10"
              >
                <FontAwesomeIcon icon={faUser} /> Profile Saya
              </Link>
              <Link
                to="/premium"
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10"
              >
                <FontAwesomeIcon icon={faStar} /> Ubah ke Premium
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-red-500/50 w-full text-left rounded-b-xl"
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Keluar
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
