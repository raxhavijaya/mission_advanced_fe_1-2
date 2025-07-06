import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { auth, db } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let userEmail;
      const identifier = formData.username.toLowerCase().trim();

      // Cek apakah pengguna memasukkan email atau username
      if (identifier.includes("@")) {
        // Jika input adalah email, langsung gunakan
        userEmail = identifier;
      } else {
        // Jika bukan email, cari username ini di Firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", identifier));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("Username atau password salah.");
        }
        // Ambil email dari dokumen yang ditemukan
        userEmail = querySnapshot.docs[0].data().email;
      }

      // Lakukan login dengan email yang sudah didapatkan
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        formData.password
      );
      const user = userCredential.user;

      // Setelah login berhasil, ambil data role dari Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        // Arahkan pengguna berdasarkan rolenya
        navigate(userData.role === "admin" ? "/admin" : "/home");
      } else {
        // Fallback jika profil tidak ditemukan, arahkan ke home
        navigate("/home");
      }
    } catch (err) {
      // Tangani semua jenis error (username tidak ada, password salah, dll)
      setError("Username atau password salah. Silakan coba lagi.");
      console.error("Login error:", err);
    } finally {
      // Hentikan loading setelah semua proses selesai
      setLoading(false);
    }
  };

  
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Cek apakah pengguna ini sudah ada di database 'users' kita
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // Jika tidak ada (ini adalah login pertama kali dengan Google)
      if (!userDocSnap.exists()) {
        // Buatkan profil untuknya di Firestore
        await setDoc(userDocRef, {
          username: user.email.split("@")[0], // Buat username default dari email
          email: user.email,
          role: "user",
          createdAt: serverTimestamp(),
          photoURL: user.photoURL,
        });
      }
      // Arahkan ke halaman utama setelah login
      navigate("/home");
    } catch (err) {
      setError("Gagal login dengan Google. Silakan coba lagi.");
      console.error("Google login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center"
      style={{ backgroundImage: "url('/bglogin.jpg')" }}
    >
      <div className="bg-gray-900/85 p-10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="logo" className="h-11 mb-5" />
          <h1 className="text-white text-3xl font-bold mb-2">Masuk</h1>
          <h2 className="text-white text-base font-normal mb-5">
            Selamat datang kembali!
          </h2>
          
          {error && (
            <p className="text-red-500 bg-red-100/10 w-full text-center p-2 rounded-lg mb-4">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="w-full">
          
            <div className="mb-5">
              <label className="block text-white text-lg font-medium mb-1">
                Username atau Email
              </label>
              <input
                type="text"
                name="username"
                placeholder="Masukkan username atau email"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-900/85 border border-gray-600 rounded-3xl px-3 py-3 text-white"
              />
            </div>
            <div className="mb-5">
              <label className="block text-white text-lg font-medium mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Masukkan kata sandi"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-900/85 border border-gray-600 rounded-3xl px-3 py-3 text-white pr-12"
                />
                <span
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="text-gray-400 text-xl"
                  />
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-5 text-white">
              <Link to="/register" className="text-gray-300 hover:text-white">
                Belum punya akun? <b>Daftar</b>
              </Link>
              <p className="text-gray-300 hover:text-white">Lupa kata sandi?</p>
            </div>
            <button
              type="submit"
              disabled={loading} // Tombol disable saat loading
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-3xl mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
            <p className="text-center text-gray-400 mb-3">Atau</p>
            <button
              type="button"
              onClick={handleGoogleLogin} // Hubungkan ke fungsi Google Login
              disabled={loading} // Tombol disable saat loading
              className="w-full bg-transparent border border-gray-600 hover:border-gray-500 text-white font-medium py-3 px-4 rounded-3xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                src="/googleicon.png"
                alt="Google Logo"
                className="w-5 h-5"
              />
              {loading ? "Memproses..." : "Masuk dengan Google"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
