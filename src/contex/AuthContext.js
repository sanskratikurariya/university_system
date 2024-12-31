"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../lib/firebase"; // Ensure this path is correct
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(auth); // Ensure auth is initialized correctly

    if (!auth) {
      console.log("Firebase auth is not initialized correctly.");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();  // Cleanup function when component is unmounted
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
