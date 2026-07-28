import { createContext, useState, useEffect, useContext } from 'react';
// 1. Create the Context
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedUserString = localStorage.getItem('user');
    
    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString);
        setUser(storedUser);
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log("Saving User to Context:", userData); 
    
    setUser(userData);
    
    localStorage.setItem('user', JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  const updateUserName = (updatedData) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserName, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};