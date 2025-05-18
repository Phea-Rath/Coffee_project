// AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  
  
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("AccountRouter"))); // e.g. { username: 'acc1', role: 'home' }
  // Fake login function (replace with real auth if needed)
  const login = (accountId) => {
    if (accountId == 1) {
      setUser({ accountId, role: 'Admin' });
      sessionStorage.setItem("AccountRouter", JSON.stringify({ accountId, role: 'Admin' }));
    } else if (accountId == 2) {
      setUser({ accountId, role: 'Staff' });
      sessionStorage.setItem("AccountRouter", JSON.stringify({ accountId, role: 'Staff' }));
    } else {
      setUser({ accountId, role: '/' });
      sessionStorage.setItem("AccountRouter", JSON.stringify({ accountId, role: '/' }));
    }
  };

  // Logout clears the user
  const logout = () => {
    setUser({ accountId:0, role: '/' });
    
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the context
export const useAuth = () => useContext(AuthContext);
