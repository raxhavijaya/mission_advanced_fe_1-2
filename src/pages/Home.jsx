// src/pages/Home.jsx (Lengkap & Final)

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import MelanjutkanFilm from "../components/MelanjutkanFilm";
import TopRatingToday from "../components/TopRating";
import FilmTrending from "../components/FilmTrending";
import RilisBaru from "../components/RilisBaru";
import Footer from "../components/Footer";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  setDoc,
} from "firebase/firestore";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // FUNGSI UNTUK MENGURUS FAVORIT SEKARANG TINGGAL DI SINI (SATU TEMPAT)
  const toggleFavorite = async (movieId) => {
    if (!user) {
      alert("Anda harus login untuk menyukai film!");
      return;
    }

    const isFavorited = favoriteIds.has(movieId);
    const favDocRef = doc(db, "userFavorites", user.uid);
    const movieDocRef = doc(db, "movies", movieId);

    try {
      if (isFavorited) {
        // Hapus dari favorit
        await updateDoc(favDocRef, { movieIds: arrayRemove(movieId) });
        await updateDoc(movieDocRef, { favoritesCount: increment(-1) });
      } else {
        // Tambah ke favorit
        await updateDoc(favDocRef, { movieIds: arrayUnion(movieId) });
        await updateDoc(movieDocRef, { favoritesCount: increment(1) });
      }
    } catch (err) {
      if (err.code === "not-found" && !isFavorited) {
        try {
          await setDoc(favDocRef, { movieIds: [movieId] });
          await updateDoc(movieDocRef, { favoritesCount: increment(1) });
        } catch (error) {
          console.error("Gagal membuat dokumen favorit:", error);
        }
      } else {
        console.error("Gagal memperbarui favorit:", err);
      }
    }
  };

  useEffect(() => {
    let unsubscribeFavorites = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDocRef = doc(db, "users", authUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const fullUserData = { uid: authUser.uid, ...userDocSnap.data() };
          setUser(fullUserData);

          const favDocRef = doc(db, "userFavorites", authUser.uid);
          unsubscribeFavorites = onSnapshot(favDocRef, (docSnap) => {
            if (docSnap.exists()) {
              setFavoriteIds(new Set(docSnap.data().movieIds));
            } else {
              setFavoriteIds(new Set());
            }
          });
        } else {
          navigate("/login");
        }
      } else {
        setUser(null);
        setFavoriteIds(new Set());
        navigate("/login");
      }
    });

    const q = query(collection(db, "movies"));
    const unsubscribeMovies = onSnapshot(q, (querySnapshot) => {
      const moviesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovies(moviesData);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMovies();
      unsubscribeFavorites();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center text-white text-xl">
        Loading Your Experience...
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} />
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
          Top Rating Film dan Series Hari Ini
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
