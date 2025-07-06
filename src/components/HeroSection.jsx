// HeroSection.jsx (Sudah Diperbaiki dengan data dari props)

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // LANGKAH 1: Impor useNavigate
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade, Autoplay } from "swiper/modules"; // Tambahkan Autoplay
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// LANGKAH 2: Terima 'movies' sebagai props
const HeroSection = ({ movies }) => {
  const [topMovies, setTopMovies] = useState([]);
  const navigate = useNavigate(); // Inisialisasi navigate

  // LANGKAH 3: Gunakan props 'movies' sebagai sumber data
  useEffect(() => {
    // Pastikan movies tidak kosong sebelum diolah
    if (movies && movies.length > 0) {
      // Logika sorting Anda sudah benar, kita pakai lagi
      const sorted = [...movies].sort(
        (a, b) => parseFloat(b.rating) - parseFloat(a.rating)
      );
      setTopMovies(sorted.slice(0, 5)); // Ambil 5 film dengan rating tertinggi
    }
  }, [movies]); // Jalankan effect ini setiap kali props 'movies' berubah

  // Fungsi untuk navigasi ke halaman detail
  const handleDetailsClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  // Logika ini sudah benar, jika tidak ada film, jangan tampilkan apa-apa
  if (topMovies.length === 0) {
    return null; 
  }

  // UI Anda tidak diubah, hanya datanya yang sekarang dinamis
  return (
    <section className="relative w-full mt-[150px] px-4 md:px-10 ">
      <Swiper
        modules={[Pagination, EffectFade, Autoplay]} // Tambahkan Autoplay
        effect="fade"
        loop={true}
        autoplay={{ // Konfigurasi Autoplay
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="w-full h-[70vh] md:h-[85vh] rounded-4xl"
      >
        {topMovies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="relative w-full h-full rounded-4xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-md shadow-xl">
              <img
                src={movie.banner}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
              <div className="relative z-20 h-full flex flex-col justify-end px-6 md:px-10 pb-10 text-white">
                <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
                  {movie.title}
                </h1>
                <p className="max-w-xl text-sm md:text-base text-gray-200 mb-4 line-clamp-3">
                  {movie.description}
                </p>
                <div className="flex flex-wrap gap-3 text-sm md:text-base items-center">
                  <button className="bg-white text-black font-semibold px-5 py-2 rounded-xl hover:bg-gray-200 transition">
                    ▶ Tonton Sekarang
                  </button>
                  {/* LANGKAH 4: Buat tombol ini fungsional */}
                  <button 
                    onClick={() => handleDetailsClick(movie.id)}
                    className="bg-white/10 border border-white/30 text-white px-5 py-2 rounded-xl hover:bg-white/20 backdrop-blur-md transition flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faCircleInfo} />
                    Selengkapnya
                  </button>
                  <span className="inline-flex items-center justify-center bg-white/15 px-3 py-1 rounded-lg border border-white/20 backdrop-blur-sm">
                    {movie.agerating}
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;