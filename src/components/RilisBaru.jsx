import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

// Impor komponen MovieCard yang bisa dipakai ulang
import MovieCard from "./MovieCard";

const RilisBaru = ({ movies, user, favoriteIds, onToggleFavorite }) => {
  
  const newReleaseMovies = useMemo(() => {
    if (!movies || movies.length === 0) return [];

    // Urutkan berdasarkan field 'createdAt' dari yang terbaru ke terlama
    return (
      [...movies]
        // Pastikan hanya film yang punya data 'createdAt' yang diproses
        .filter((movie) => movie.createdAt && movie.createdAt.seconds)
        // Urutkan berdasarkan detik timestamp, dari yang terbesar (terbaru)
        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
        .slice(0, 10)
    ); // Ambil 10 film terbaru
  }, [movies]);

  if (newReleaseMovies.length === 0) {
    return null;
  }

  return (
    <section className="px-4 md:px-10 mt-2 mb-10 relative">
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          // Gunakan nama kelas yang unik untuk navigasi
          navigation={{
            prevEl: ".rilis-baru-prev",
            nextEl: ".rilis-baru-next",
          }}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          className="w-full"
        >
          {newReleaseMovies.map((movie) => (
            <SwiperSlide key={movie.id}>
              {/* Gunakan komponen MovieCard yang sudah ada */}
              <MovieCard
                movie={movie}
                user={user}
                isFavorited={favoriteIds.has(movie.id)}
                onToggleFavorite={onToggleFavorite}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="rilis-baru-prev absolute top-1/2 -translate-y-1/2 -left-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/30 text-white rounded-full hover:bg-white/20 transition disabled:opacity-0 disabled:cursor-not-allowed">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button className="rilis-baru-next absolute top-1/2 -translate-y-1/2 -right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/30 text-white rounded-full hover:bg-white/20 transition disabled:opacity-0 disabled:cursor-not-allowed">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </section>
  );
};

export default RilisBaru;
