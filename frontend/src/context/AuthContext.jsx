import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthCtx = createContext(null);
export default AuthCtx;

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(
    () => !!localStorage.getItem("isLogin")
  );

  const login = (user, pass) => {
    const u = import.meta.env.VITE_ADMIN_USER;
    const p = import.meta.env.VITE_ADMIN_PASS;
    if (user === u && pass === p) {
      localStorage.setItem("adm", "1");
      localStorage.setItem("isLogin", true);
      setIsAdmin(true);
      return { ok: true };
    }
    return { ok: false, error: "Invalid credentials" };
  };
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("adm");
    localStorage.removeItem("isLogin");
    navigate("/");
    setIsAdmin(false);
  };

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
// useAuth hook moved to a separate file: useAuth.js
export function useAuth() {
  return useContext(AuthCtx);
}
