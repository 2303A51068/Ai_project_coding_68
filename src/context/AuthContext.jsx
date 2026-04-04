import { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback((email, password) => {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        setUser({
          id: Math.random(),
          email,
          name: email.split('@')[0],
          createdAt: new Date(),
        });
        setIsAuthModalOpen(false);
      } else {
        setError('Please enter valid credentials');
      }
      setLoading(false);
    }, 500);
  }, []);

  const register = useCallback((email, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        setUser({
          id: Math.random(),
          email,
          name: email.split('@')[0],
          createdAt: new Date(),
        });
        setIsAuthModalOpen(false);
        setAuthMode('login');
      } else {
        setError('Please fill all fields');
      }
      setLoading(false);
    }, 500);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    setAuthMode('login');
  }, []);

  const value = {
    user,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    register,
    logout,
    loading,
    error,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
