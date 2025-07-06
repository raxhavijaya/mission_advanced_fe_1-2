export const getMovies = () => {
  const localMovies = localStorage.getItem("movies");
  return localMovies ? JSON.parse(localMovies) : [];
};

export const saveMovies = (movies) => {
  localStorage.setItem("movies", JSON.stringify(movies));
};
