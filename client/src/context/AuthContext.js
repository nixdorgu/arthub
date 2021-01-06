import { createContext, useState, useEffect, useContext } from "react";
import { fetch } from "../utils/fetch";
import { getToken, removeToken } from "../utils/Tokens";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = getToken();

    if (token) {
      fetch("/api/verify", {
        method: "POST",
        data: { token },
        success: (response) => {
          setAuthenticated(true);
          // add check for response token -> if response.refreshToken != undefined then setToken to refresh token else proceed
          let user = response.user;
          user = {
            id: user["user_id"],
            first_name: user["first_name"],
            last_name: user["last_name"],
            email: user["email"],
            user_classification: user["user_classification"],
            member_since: user["member_since"],
          };

          setUser(user);
        },
        error: (error) => {
          setAuthenticated(false);
          removeToken();
        }
      });
    } else {
      setAuthenticated(false);
      setUser({});
    }
  }, [authenticated]);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
