import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

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
  const [formMode, setFormMode] = useState("hidden"); // 'hidden', 'create', 'edit'

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().role === "admin") {
          setUser({ uid: user.uid, ...userDocSnap.data() });
        } else {
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    });

    const q = query(collection(db, "movies"));
    const unsubscribeMovies = onSnapshot(q, (querySnapshot) => {
      setMovies(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
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
    setFormMode("hidden");
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
      if (formMode === "edit") {
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
    setFormMode("edit");
  };

  const handleShowCreateForm = () => {
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
    setFormMode("create");
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

        <div className="mb-8">
          {formMode === "hidden" && (
            <button
              onClick={handleShowCreateForm}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              Tambah Film Baru
            </button>
          )}

          {formMode !== "hidden" && (
            <div className="p-6 bg-white/5 rounded-xl border border-white/20">
              <h2 className="text-2xl font-bold mb-4 text-center">
                {formMode === "create"
                  ? "Tambah Film Baru"
                  : `Edit Film: ${form.title}`}
              </h2>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
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
                    type={
                      field === "year" || field === "rating" ? "number" : "text"
                    }
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
                <div className="col-span-full flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="flex-grow bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition"
                  >
                    {formMode === "create" ? "Simpan Film" : "Simpan Perubahan"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-grow bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-xl transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

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
