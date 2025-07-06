// Dashboard.jsx (Super Lengkap & Final)

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

const Dashboard = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    year: "",
    genre: "",
    duration: "",
    rating: "",
    agerating: "",
    poster: "",
    banner: "",
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().role === "admin") {
          const fullUserData = { uid: user.uid, ...userDocSnap.data() };
          setUser(fullUserData);
        } else {
          navigate("/login");
        }
      } else {
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
    };
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      description: "",
      year: "",
      genre: "",
      duration: "",
      rating: "",
      agerating: "",
      poster: "",
      banner: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.genre) {
      alert("Judul dan Genre wajib diisi.");
      return;
    }

    const dataToSubmit = { ...form };

    if (dataToSubmit.genre && typeof dataToSubmit.genre === "string") {
      dataToSubmit.genre = dataToSubmit.genre
        .split(",")
        .map((g) => g.trim())
        .filter((g) => g);
    }

    delete dataToSubmit.id;

    try {
      if (form.id) {
        await updateDoc(doc(db, "movies", form.id), dataToSubmit);
      } else {
        await addDoc(collection(db, "movies"), {
          ...dataToSubmit,
          createdAt: serverTimestamp(),
          favoritesCount: 0,
        });
      }
      resetForm();
    } catch (err) {
      console.error("Error submitting movie:", err);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  const handleEdit = (movie) => {
    const movieToEdit = { ...movie };
    if (Array.isArray(movieToEdit.genre)) {
      movieToEdit.genre = movieToEdit.genre.join(", ");
    }
    setForm(movieToEdit);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus film ini?")) {
      try {
        await deleteDoc(doc(db, "movies", id));
      } catch (err) {
        console.error("Error deleting movie:", err);
        alert("Gagal menghapus film.");
      }
    }
  };

  const handleDeleteAll = async () => {
    if (
      window.confirm(
        "PERINGATAN: Anda akan menghapus SEMUA data film. Aksi ini tidak bisa dibatalkan. Lanjutkan?"
      )
    ) {
      try {
        const moviesQuery = query(collection(db, "movies"));
        const querySnapshot = await getDocs(moviesQuery);
        querySnapshot.forEach(async (document) => {
          await deleteDoc(doc(db, "movies", document.id));
        });
      } catch (err) {
        console.error("Error deleting all movies:", err);
        alert("Gagal menghapus semua film.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 to-black text-white">
      <div className="max-w-6xl mx-auto backdrop-blur-md bg-white/10 rounded-3xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <img src="/logo.png" alt="logo" className="h-11" />
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <div className="flex gap-4 items-center">
            {user && (
              <span className="text-gray-300 text-sm">
                Welcome, {user.username}
              </span>
            )}
            <button
              onClick={() => navigate("/home")}
              className="bg-white/10 border border-gray-400 px-4 py-2 rounded-xl hover:bg-white/20"
            >
              Home
            </button>
            <button
              onClick={handleLogout}
              className="bg-white/10 border border-gray-400 px-4 py-2 rounded-xl hover:bg-white/20"
            >
              Logout
            </button>
            <button
              onClick={handleDeleteAll}
              className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-400"
            >
              Hapus Semua
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            "title",
            "year",
            "description",
            "genre",
            "duration",
            "rating",
            "agerating",
            "poster",
            "banner",
          ].map((field) => (
            <input
              key={field}
              name={field}
              type={field === "year" || field === "rating" ? "number" : "text"}
              value={form[field] || ""}
              onChange={handleChange}
              placeholder={
                field === "genre"
                  ? "Genre (pisahkan dengan koma)"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              className="bg-white/10 border border-gray-400 text-white placeholder-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={field === "title" || field === "genre"}
            />
          ))}
          <button
            type="submit"
            className="col-span-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition"
          >
            {form.id ? "Simpan Perubahan" : "Tambah Film"}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl shadow-md"
            >
              <img
                src={
                  movie.poster ||
                  "https://via.placeholder.com/300x150.png?text=No+Image"
                }
                alt={movie.title}
                className="w-full h-52 object-cover rounded-xl mb-3"
              />
              <h2 className="text-xl font-bold mb-1 truncate">
                {movie.title} ({movie.year})
              </h2>
              <div className="flex items-center gap-2 text-sm mb-1">
                <span className="bg-gray-200 text-black px-2 py-0.5 rounded">
                  {movie.agerating}
                </span>
                <span className="text-gray-300">{movie.duration}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-300 flex items-center gap-1">
                  {movie.rating}{" "}
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-2 truncate">
                {Array.isArray(movie.genre)
                  ? movie.genre.join(", ")
                  : movie.genre}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(movie)}
                  className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(movie.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400 text-sm font-semibold"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
