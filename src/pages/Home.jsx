import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import MelanjutkanFilm from "../components/MelanjutkanFilm";
import TopRatingToday from "../components/TopRating";
import FilmTrending from "../components/FilmTrending";
import RilisBaru from "../components/RilisBaru";
import Footer from "../components/Footer";

// Impor fungsi untuk interaksi (ini tidak masuk ke Redux)
import { db } from "../firebaseConfig";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  setDoc,
} from "firebase/firestore";

const Home = () => {
  // --- BACA DATA LANGSUNG DARI REDUX STORE ---
  const { data: movies, status } = useSelector((state) => state.movies);
  const { user, favoriteIds: favIds } = useSelector((state) => state.auth);

  // Buat Set dari array favorit untuk pencarian cepat
  const favoriteIds = new Set(favIds);

  
  const toggleFavorite = async (movieId) => {
    if (!user) return;
    const isFavorited = favoriteIds.has(movieId);
    const favDocRef = doc(db, "userFavorites", user.uid);
    const movieDocRef = doc(db, "movies", movieId);
    try {
      if (isFavorited) {
        await updateDoc(favDocRef, { movieIds: arrayRemove(movieId) });
        await updateDoc(movieDocRef, { favoritesCount: increment(-1) });
      } else {
        await updateDoc(favDocRef, { movieIds: arrayUnion(movieId) });
        await updateDoc(movieDocRef, { favoritesCount: increment(1) });
      }
    } catch (err) {
      if (err.code === "not-found" && !isFavorited) {
        await setDoc(favDocRef, { movieIds: [movieId] });
        await updateDoc(movieDocRef, { favoritesCount: increment(1) });
      }
    }
  };

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center text-white text-xl">
        Loading Movies...
      </div>
    );
  }

  return (
    <div>
      <Navbar /> {/* Navbar akan mengambil data user dari Redux juga */}
      <HeroSection
        movies={movies}
        user={user}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
      />
      <div className="mt-8 w-[94.5%] mx-auto rounded-4xl bg-white/15 backdrop-blur-md py-4 shadow-2xl border border-white/20">
        <h2 className="pl-10 text-white text-2xl md:text-3xl font-bold mb-5">
          Film Pilihan
        </h2>
        <MelanjutkanFilm
          movies={movies}
          user={user}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
        <h2 className="pl-10 text-white text-2xl md:text-3xl font-bold mb-5">
          Top Rating
        </h2>
        <TopRatingToday
          movies={movies}
          user={user}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
        <h2 className="pl-10 text-white text-2xl md:text-3xl font-bold mb-5">
          Film Trending
        </h2>
        <FilmTrending
          movies={movies}
          user={user}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
        <h2 className="pl-10 text-white text-2xl md:text-3xl font-bold mb-5">
          Rilis Baru
        </h2>
        <RilisBaru
          movies={movies}
          user={user}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
