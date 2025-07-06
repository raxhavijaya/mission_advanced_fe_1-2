// MelanjutkanFilm.jsx (Final dengan Tombol Detail pada Hover)

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const MelanjutkanFilm = ({ movies }) => {
  const navigate = useNavigate();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);

  useEffect(() => {
    setSwiperReady(true);
  }, []);

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="px-4 md:px-10 mt-2 mb-10 relative">
      <div className="relative">
        {swiperReady && (
          <>
            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
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
              {movies.map((movie) => (
                <SwiperSlide key={movie.id} className="cursor-pointer">
                  <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src={
                        movie.banner ||
                        "https://via.placeholder.com/400x225.png?text=Image+Not+Found"
                      }
                      alt={movie.title}
                      className="w-full h-[180px] object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-50"
                    />
                    <div
                      className="absolute inset-0 p-4 flex flex-col justify-end
                                  transform transition-all duration-500 ease-in-out
                                  opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
                    >
                      <h3 className="text-white text-lg font-bold line-clamp-1">
                        {movie.title}
                      </h3>
                      
                      <div className="flex items-center gap-x-3 gap-y-1 text-xs text-gray-300 my-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon
                            icon={faStar}
                            className="text-yellow-400"
                          />
                          {movie.rating}
                        </span>

                        {/* Hapus 'truncate', biarkan browser menanganinya secara alami */}
                        <span>
                          {Array.isArray(movie.genre)
                            ? movie.genre.join(" • ")
                            : movie.genre}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                        {movie.description}
                      </p>
                      {/* --- TOMBOL DITAMBAHKAN KEMBALI DI SINI --- */}
                      <button
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="w-full bg-red-600 text-white text-sm font-bold py-2 rounded-lg hover:bg-red-700 transition mt-auto"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              ref={prevRef}
              className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 p-2 w-10 h-10 bg-white/10 border border-white/30 text-white rounded-full hover:bg-white/20 transition disabled:opacity-0"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              ref={nextRef}
              className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 p-2 w-10 h-10 bg-white/10 border border-white/30 text-white rounded-full hover:bg-white/20 transition disabled:opacity-0"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default MelanjutkanFilm;
