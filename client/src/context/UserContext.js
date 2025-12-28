import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  /* =========================================
     🔄 Load user from localStorage (ONCE)
  ========================================= */
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        const parsed = JSON.parse(savedUser);

        // 🔐 Normalize user (guarantee display name)
        const normalizedUser = {
          ...parsed,
          username: parsed.username || parsed.email || "Account",
        };

        setUser(normalizedUser);
      }
    } catch (err) {
      console.error("❌ Failed to load user from storage:", err);
      localStorage.removeItem("user");
    } finally {
      setReady(true);
    }
  }, []);

  /* =========================================
     ✅ Login
  ========================================= */
  const loginUser = (userData) => {
    if (!userData) return;

    const normalizedUser = {
      ...userData,
      username: userData.username || userData.email || "Account",
    };

    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  /* =========================================
     ✏️ Update user (Profile save)
     🔥 THIS FIXES YOUR BUG
  ========================================= */
  const updateUser = (updatedUser) => {
    if (!updatedUser) return;

    const normalizedUser = {
      ...updatedUser,
      username:
        updatedUser.username ||
        updatedUser.email ||
        user?.username ||
        "Account",
    };

    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  /* =========================================
     🚪 Logout
  ========================================= */
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  /* =========================================
     🛑 Prevent half-render
  ========================================= */
  if (!ready) return null;

  console.log("🟢 UserContext user =", user);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loginUser,
        updateUser, // ✅ IMPORTANT
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
