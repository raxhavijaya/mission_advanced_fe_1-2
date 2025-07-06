import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import moviesData from "../data/movies.json";

const RilisBaru = () => {
  const topRatedMovies = [...moviesData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  return (
    <section className="px-4 md:px-10 mt-2 mb-10 relative">
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".swiper-top-prev",
            prevEl: ".swiper-top-next",
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
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-white/5 backdrop-blur-md">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-100 object-cover"
                />

                {/* Label hanya jika rating >= 8.0 */}
                {movie.rating >= 8.0 && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                    TOP 10
                  </span>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Tombol kiri */}
        <button className="swiper-top-next absolute top-1/2 -translate-y-1/2 -left-4 z-10 p-2 bg-white/10 border border-white/30 text-white rounded-full hover:bg-white/20 transition">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        {/* Tombol kanan */}
        <button className="swiper-top-prev absolute top-1/2 -translate-y-1/2 -right-4 z-10 p-2 bg-white/10 border border-white/30 text-white rounded-full hover:bg-white/20 transition">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </section>
  );
};

export default RilisBaru;
