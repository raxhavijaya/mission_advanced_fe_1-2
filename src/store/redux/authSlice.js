import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Menyimpan data user (uid, email, username, role)
  favoriteIds: [], // Menyimpan array ID film favorit
  loading: true, // Status loading untuk pengecekan auth awal
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Aksi untuk menyimpan data user yang sudah digabung
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    // Aksi untuk menyimpan daftar favorit
    setFavorites: (state, action) => {
      state.favoriteIds = action.payload;
    },
    // Aksi untuk membersihkan semua saat logout
    clearAuth: (state) => {
      state.user = null;
      state.favoriteIds = [];
      state.loading = false;
    },
  },
});

export const { setUser, setFavorites, clearAuth } = authSlice.actions;

export default authSlice.reducer;
