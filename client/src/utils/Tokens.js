export const getToken = () => {
  return localStorage.getItem("token") || null;
};

export const removeUserSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const setUserSession = (token) => {
  localStorage.setItem("token", token);
};
