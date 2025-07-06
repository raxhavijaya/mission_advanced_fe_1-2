// Langkah A: Impor fungsi-fungsi yang diperlukan dari SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Langkah B: Tempel (PASTE) kunci konfigurasi yang Anda salin dari website Firebase
// Ganti blok di bawah ini dengan milik Anda!
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Langkah C: Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Langkah D: Ekspor layanan yang akan digunakan di seluruh aplikasi Anda
export const auth = getAuth(app);
export const db = getFirestore(app);
