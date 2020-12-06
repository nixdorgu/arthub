export const getToken = () => {
  return localStorage.getItem("arthub_token") || null;
};

export const removeToken = () => {
  localStorage.removeItem("arthub_token");
  localStorage.removeItem("user");
};

export const setToken = (token) => {
  localStorage.setItem("arthub_token", token);
};

export const logout = (setAuthenticated, setUser) => {
  setAuthenticated(false);
  setUser({});
  removeToken();
}