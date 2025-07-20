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
import MovieCard from "./MovieCard"; // Pastikan path ini benar

// Menerima onToggleFavorite sebagai props
const TopRatedMovies = ({ movies, user, favoriteIds, onToggleFavorite }) => {
  const topRatedMovies = useMemo(() => {
    if (!movies || movies.length === 0) return [];
    return [...movies]
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 10);
  }, [movies]);

  if (topRatedMovies.length === 0) {
    return null;
  }

  return (
    <section className="px-4 md:px-10 mt-2 mb-10 relative">
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".top-rated-prev",
            nextEl: ".top-rated-next",
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
          {topRatedMovies.map((movie) => (
            <SwiperSlide key={movie.id}>
              {/* Mengoper semua props yang dibutuhkan ke MovieCard */}
              <MovieCard
                movie={movie}
                user={user}
                isFavorited={favoriteIds.has(movie.id)}
                onToggleFavorite={onToggleFavorite}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="top-rated-prev absolute top-1/2 -translate-y-1/2 -left-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/30 text-white rounded-full hover:bg-white/20 transition disabled:opacity-0 disabled:cursor-not-allowed">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button className="top-rated-next absolute top-1/2 -translate-y-1/2 -right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/30 text-white rounded-full hover:bg-white/20 transition disabled:opacity-0 disabled:cursor-not-allowed">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </section>
  );
};

export default TopRatedMovies;
