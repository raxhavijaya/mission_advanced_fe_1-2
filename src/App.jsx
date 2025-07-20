// src/App.jsx (Lengkap dengan penanganan error state)

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectRoute";

import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth"; // Impor signOut
import { collection, query, onSnapshot, doc, getDoc } from "firebase/firestore";
import { setMovies } from "./store/redux/moviesSlice";
import { setUser, setFavorites, clearAuth } from "./store/redux/authSlice";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Listener untuk data film (tidak berubah)
    const moviesQuery = query(collection(db, "movies"));
    const unsubscribeMovies = onSnapshot(
      moviesQuery,
      (querySnapshot) => {
        const moviesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setMovies(moviesData));
      },
      (error) => {
        console.error("Error fetching movies collection:", error);
      }
    );

    // Listener untuk status login dengan logika yang lebih baik
    let unsubscribeFavorites = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDocRef = doc(db, "users", authUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // --- KASUS 1: PENGGUNA VALID (Ada di Auth & Firestore) ---
          const fullUserData = { uid: authUser.uid, ...userDocSnap.data() };
          dispatch(setUser(fullUserData)); // loading akan menjadi false

          const favDocRef = doc(db, "userFavorites", authUser.uid);
          unsubscribeFavorites = onSnapshot(favDocRef, (docSnap) => {
            if (docSnap.exists()) {
              dispatch(setFavorites(docSnap.data().movieIds || []));
            } else {
              dispatch(setFavorites([])); // Pastikan favorit direset jika dokumen tidak ada
            }
          });
        } else {
          // --- KASUS 2: PENGGUNA "HANTU" (Ada di Auth, TAPI TIDAK di Firestore) ---
          console.warn(
            "Pengguna ada di Auth, tapi tidak di Firestore. Sesi logout paksa."
          );
          await signOut(auth); // Logout paksa dari Firebase
          dispatch(clearAuth()); // Bersihkan state Redux, loading akan menjadi false
        }
      } else {
        // --- KASUS 3: TIDAK ADA PENGGUNA LOGIN ---
        dispatch(clearAuth()); // Bersihkan state Redux, loading akan menjadi false
      }
    });

    return () => {
      unsubscribeMovies();
      unsubscribeAuth();
      unsubscribeFavorites();
    };
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
