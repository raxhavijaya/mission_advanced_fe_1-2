import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// Komponen ini akan membungkus halaman yang butuh login
// adminOnly adalah prop opsional jika rute hanya untuk admin
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. Jika status auth masih loading, tampilkan layar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center text-white text-xl">
        Authenticating...
      </div>
    );
  }

  // 2. Jika sudah tidak loading dan TIDAK ada user, redirect ke login
  if (!user) {
    // Simpan lokasi saat ini agar setelah login bisa kembali ke sini
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Jika rute ini hanya untuk admin, tapi role user bukan admin, tendang ke home
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  // 4. Jika semua pengecekan lolos, tampilkan halaman yang diminta
  return children;
};

export default ProtectedRoute;
