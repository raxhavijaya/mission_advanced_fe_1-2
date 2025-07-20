import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
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
    // Listener untuk DATA FILM
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

    // Listener untuk STATUS LOGIN PENGGUNA
    let unsubscribeFavorites = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDocRef = doc(db, "users", authUser.uid);
        const favDocRef = doc(db, "userFavorites", authUser.uid);

        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const fullUserData = { uid: authUser.uid, ...userDocSnap.data() };
          dispatch(setUser(fullUserData));
        }

        unsubscribeFavorites = onSnapshot(
          favDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              dispatch(setFavorites(docSnap.data().movieIds || []));
            }
          },
          (error) => {
            console.error("Error fetching user favorites:", error);
          }
        );
      } else {
        dispatch(clearAuth());
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
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Dashboard />} />
        {/* <Route path="/movie/:id" element={<MovieDetail />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
