import { createSlice } from "@reduxjs/toolkit";

// State awal untuk slice film
const initialState = {
  data: [], // Array untuk menampung semua data film dari API
  status: "idle", // Status untuk melacak proses fetching: 'idle' | 'loading' | 'succeeded' | 'failed'
};

export const moviesSlice = createSlice({
  name: "movies",
  initialState,
  // Reducers adalah fungsi yang mendefinisikan bagaimana state bisa diubah
  reducers: {
    // Action 'setMovies' akan menerima data film dan menyimpannya ke state
    setMovies: (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
    },
    // Action 'setLoading' untuk mengubah status menjadi loading
    setLoading: (state) => {
      state.status = "loading";
    },
  },
});

// Ekspor actions agar bisa dipanggil dari komponen lain (misal: dispatch(setMovies(...)))
export const { setMovies, setLoading } = moviesSlice.actions;

// Ekspor reducer agar bisa didaftarkan di store utama
export default moviesSlice.reducer;
