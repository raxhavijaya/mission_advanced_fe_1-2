import usersJson from "../data/users.json";

// Ambil dari localStorage kalau sudah register baru
const getUsers = () => {
  const local = localStorage.getItem("users");
  return local ? JSON.parse(local) : [...usersJson];
};

export const loginUser = ({ username, password }) => {
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    return { success: true, role: user.role };
  }
  return { success: false, message: "Username atau password salah!" };
};

export const registerNewUser = ({ username, password }) => {
  const users = getUsers();
  const exists = users.find((u) => u.username === username);
  if (exists) return { success: false, message: "Username sudah terdaftar!" };

  const newUser = { username, password, role: "user" };
  const updatedUsers = [...users, newUser];
  localStorage.setItem("users", JSON.stringify(updatedUsers));
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  return { success: true };
};

export const logoutUser = () => {
  localStorage.removeItem("currentUser");
};
