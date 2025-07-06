// Register.jsx (Sudah Diperbaiki dengan Firebase)

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// LANGKAH 1: Impor semua yang kita butuhkan dari Firebase
import { auth, db } from "../firebaseConfig"; // Pastikan path ini benar
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

const Register = () => {
  // Tambahkan email ke state form
  const [formData, setFormData] = useState({
    username: "",
    email: "", // WAJIB ADA
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Tambahkan state untuk error dan loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fungsi ini sudah benar
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // LANGKAH 2: Ganti total fungsi handleSubmit dengan logika Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi awal
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama!");
      setLoading(false);
      return;
    }

    const username = formData.username.toLowerCase().trim();
    const email = formData.email.trim();

    try {
      // 1. Cek apakah username sudah ada di database
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error(
          "Username sudah digunakan. Silakan pilih username lain."
        );
      }

      // 2. Jika username tersedia, buat akun di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        formData.password
      );
      const user = userCredential.user;

      // 3. Buat dokumen profil untuk pengguna ini di Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        role: "user", // Default role untuk semua pendaftar baru
        createdAt: serverTimestamp(),
      });

      // Jika berhasil, arahkan ke halaman utama
      navigate("/home");
    } catch (err) {
      // Menangani berbagai jenis error dari Firebase
      if (err.code === "auth/email-already-in-use") {
        setError("Email ini sudah terdaftar.");
      } else if (err.code === "auth/weak-password") {
        setError("Password terlalu lemah. Minimal 6 karakter.");
      } else {
        setError(err.message);
      }
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  // LANGKAH 3: Buat fungsi untuk handle Daftar dengan Google
  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          username: user.email.split("@")[0] + Math.floor(Math.random() * 1000), // Buat username unik
          email: user.email,
          role: "user",
          createdAt: serverTimestamp(),
          photoURL: user.photoURL,
        });
      }
      navigate("/home");
    } catch (err) {
      setError("Gagal mendaftar dengan Google. Silakan coba lagi.");
      console.error("Google signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... UI Anda ...
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center"
      style={{ backgroundImage: "url('/bgregister.jpg')" }}
    >
      <div className="bg-gray-900/85 p-10 rounded-2xl h-auto w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="logo" className="h-11 mb-5" />
          <h1 className="text-white text-3xl font-bold">Daftar</h1>
          <h2 className="text-white text-base font-normal mb-5">
            Selamat datang!
          </h2>

          {error && (
            <p className="text-red-500 bg-red-100/10 w-full text-center p-2 rounded-lg mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block text-white text-lg font-medium mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Masukkan username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-900/85 border border-gray-600 rounded-3xl px-3 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* PENAMBAHAN WAJIB: Input untuk Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-white text-lg font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-900/85 border border-gray-600 rounded-3xl px-3 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-white text-lg font-medium mb-1"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Masukkan kata sandi"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-900/85 border border-gray-600 rounded-3xl px-3 py-3 text-white focus:outline-none focus:border-blue-500 pr-12"
                />
                <span
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 pr-1 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="text-gray-400 text-xl"
                  />
                </span>
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="confirmPassword"
                className="block text-white text-lg font-medium mb-1"
              >
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Masukkan kata sandi"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-900/85 border border-gray-600 rounded-3xl px-3 py-3 text-white focus:outline-none focus:border-blue-500 pr-12"
                />
                <span
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="absolute right-3 pr-1 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                    className="text-gray-400 text-xl"
                  />
                </span>
              </div>
            </div>

            <div className="flex justify-center mb-5">
              <Link to="/login" className="text-gray-300 hover:text-white">
                Sudah punya akun? <b>Masuk</b>
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-3xl transition-colors mb-3 disabled:opacity-50"
            >
              {loading ? "Mendaftarkan..." : "Daftar"}
            </button>
            <p className="text-center text-gray-400 mb-3">Atau</p>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full bg-transparent border border-gray-600 hover:border-gray-500 text-white font-medium py-3 px-4 rounded-3xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <img src="googleicon.png" alt="Google Logo" className="w-5 h-5" />
              {loading ? "Memproses..." : "Daftar dengan Google"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
