import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState({
    canUpload: false,
    canViewDashboard: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          setRole(data.role || "employee");
          setPermissions({
            canUpload: data.canUpload || false,
            canViewDashboard: data.canViewDashboard || false,
          });
        } else {
          const defaultUser = {
            name: user.displayName || "Unnamed",
            email: user.email,
            role: "employee",
            canUpload: false,
            canViewDashboard: false,
          };
          await setDoc(userRef, defaultUser);
          setRole("employee");
          setPermissions({
            canUpload: false,
            canViewDashboard: false,
          });
        }
      } else {
        setRole(null);
        setPermissions({
          canUpload: false,
          canViewDashboard: false,
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, permissions, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
