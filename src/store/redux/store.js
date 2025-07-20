import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import moviesReducer from "./moviesSlice";

// Konfigurasi dan ekspor store
export const store = configureStore({
  
  reducer: {
    // Setiap key di sini akan menjadi nama state di dalam Redux store
    auth: authReducer,
    movies: moviesReducer,
  },
});
