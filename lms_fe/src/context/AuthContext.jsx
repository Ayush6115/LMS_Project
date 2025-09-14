// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useRef, useContext } from "react";
import {jwtDecode} from "jwt-decode";

// Create Context
export const AuthContext = createContext();

// Provider Component
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const logoutTimerRef = useRef(null);

  // Decode JWT safely
  const decode = (tkn) => {
    try {
      return jwtDecode(tkn);
    } catch {
      return null;
    }
  };

  // Extract role from decoded JWT
  const extractRole = (decoded) => {
    if (!decoded) return null;
    return decoded.role || decoded.Role || decoded.roles || (decoded.user && decoded.user.role) || null;
  };

  // Schedule auto logout based on token expiration
  const scheduleAutoLogout = (decoded) => {
    if (!decoded || !decoded.exp) return;
    const now = Date.now() / 1000;
    const ttl = decoded.exp - now;
    if (ttl <= 0) {
      logout();
      return;
    }
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, Math.floor(ttl * 1000));
  };

  // Initialize from localStorage
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return;
    const decoded = decode(t);
    if (!decoded) {
      localStorage.removeItem("token");
      return;
    }
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("token");
      return;
    }
    setToken(t);
    setUserRole(extractRole(decoded));
    scheduleAutoLogout(decoded);

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  // Listen for token changes across tabs or manual dispatch
  useEffect(() => {
    const handler = () => {
      const t = localStorage.getItem("token");
      if (!t) {
        setToken(null);
        setUserRole(null);
        if (logoutTimerRef.current) {
          clearTimeout(logoutTimerRef.current);
          logoutTimerRef.current = null;
        }
        return;
      }
      const decoded = decode(t);
      if (!decoded) {
        setToken(null);
        setUserRole(null);
        return;
      }
      setToken(t);
      setUserRole(extractRole(decoded));
      scheduleAutoLogout(decoded);
    };

    window.addEventListener("tokenChanged", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("tokenChanged", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  // Login function
  const login = (tkn) => {
    const decoded = decode(tkn);
    if (!decoded) throw new Error("Invalid token");
    localStorage.setItem("token", tkn);
    setToken(tkn);
    setUserRole(extractRole(decoded));
    scheduleAutoLogout(decoded);
    window.dispatchEvent(new Event("tokenChanged"));
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserRole(null);
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    window.dispatchEvent(new Event("tokenChanged"));
  };

  return (
    <AuthContext.Provider value={{ token, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
