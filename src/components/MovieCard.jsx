// src/components/MovieCard.jsx

import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";

// Komponen ini menerima semua data yang diperlukan sebagai props
const MovieCard = ({ movie, user, isFavorited, onToggleFavorite }) => {
  const navigate = useNavigate();

  // Fungsi untuk mencegah klik pada tombol hati menyebar ke kartu
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Hentikan event agar tidak menjalankan navigasi
    onToggleFavorite(movie.id, isFavorited);
  };

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black cursor-pointer"
    >
      <img
        src={
          movie.poster ||
          "https://via.placeholder.com/400x225.png?text=Image+Not+Found"
        }
        alt={movie.title}
        className="w-full h-[350px] object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-50"
      />

      {/* Tombol Suka/Favorit */}
      {/* Hanya tampilkan jika user sudah login */}
      {user && (
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 left-2 z-20 p-2 bg-black/50 rounded-full transition-transform hover:scale-110"
        >
          <FontAwesomeIcon
            icon={faHeart}
            className={isFavorited ? "text-red-500" : "text-white/70"}
          />
        </button>
      )}

      {/* Badge (opsional) - bisa ditambahkan jika perlu */}
      {/* <span className="absolute top-2 right-2 z-10 ...">BADGE</span> */}

      {/* Konten Teks yang muncul dari bawah saat hover */}
      <div
        className="absolute inset-0 p-4 flex flex-col justify-end
                      transform transition-all duration-500 ease-in-out
                      opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
      >
        <h3 className="text-white text-lg font-bold line-clamp-1">
          {movie.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-300 my-1 flex-wrap">
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
            {movie.rating}
          </span>
          <span className="truncate">
            {Array.isArray(movie.genre) ? movie.genre.join(" • ") : movie.genre}
          </span>
        </div>
        <p className="text-xs text-gray-400 line-clamp-2 mb-3">
          {movie.description}
        </p>
        <div className="text-center w-full bg-white/20 text-white text-sm font-bold py-2 rounded-lg backdrop-blur-sm">
          Lihat Detail
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
