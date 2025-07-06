import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStar,
  faSignOutAlt,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(storedUser);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  return (
    <header className="fixed top-4 mt-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sreen-xl w-[95%] rounded-4xl bg-white/15 backdrop-blur-md px-7 py-6 shadow-2xl border border-white/20 flex justify-between items-center">
      <div className="flex items-center gap-4 md:gap-20">
        <a href="/home" className="hover:scale-110 transition-transform">
          <img src="/logo.png" alt="Logo" className="hidden md:block w-28" />
          <img
            src="/logo2.png"
            alt="Logo"
            className="block md:hidden w-6 h-6"
          />
        </a>

        <nav className="flex gap-3 md:gap-10">
          <a
            href="#"
            className="text-xs md:text-lg text-white hover:text-blue-400 transition-colors"
          >
            Series
          </a>
          <a
            href="#"
            className="text-xs md:text-lg text-white hover:text-blue-400 transition-colors"
          >
            Film
          </a>
          <a
            href="#"
            className="text-xs md:text-lg text-white hover:text-blue-400 transition-colors"
          >
            Daftar Saya
          </a>
          {user?.role === "admin" && (
            <a
              href="/admin"
              className="text-xs md:text-lg font-bold text-fuchsia-900 hover:text-blue-400 transition-colors"
            >
              Dashboard
            </a>
          )}
        </nav>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <img
            src="/avatar.png"
            alt="Profile"
            className="w-10 h-10 mx-1 rounded-full border border-white/30"
          />
          <span className="text-m text-white hidden md:block">{user?.username}</span>
          <FontAwesomeIcon
            icon={faCaretDown}
            className={`transition-transform duration-300 text-white transform origin-center ${
              isDropdownOpen ? "rotate-right" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-50">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-white hover:text-blue-400"
            >
              <FontAwesomeIcon icon={faUser} /> Profile Saya
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-white hover:text-blue-400"
            >
              <FontAwesomeIcon icon={faStar} /> Ubah ke Premium
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-white hover:text-red-400 w-full text-left"
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
