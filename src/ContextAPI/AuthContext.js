import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

const isSessionExpired = () => {
  const expiryTime = sessionStorage.getItem('expiry');
  if (!expiryTime) return true;
  return new Date().getTime() > new Date(expiryTime).getTime();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser && !isSessionExpired() ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('token') && !isSessionExpired() ? sessionStorage.getItem('token') : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isSessionExpired()) {
      setUser(null);
      setToken(null);
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('expiry');
    }
  }, []);

  const login = async (credentials, navigate) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://api.chesadentalcare.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      if (data.user !== 'Admin') {
        toast.error("Only Admin can login");
        return;
      }

      // console.log('Before state updates:', user, token);
      setUser(data.user);
      setToken(data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('token', data.token);
      const expiryTime = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour from now
      sessionStorage.setItem('expiry', expiryTime.toISOString());

      // console.log('After state updates:', data.user, data.token);
      // Navigate after state has been updated
      // setTimeout(() => { window.location.href = '/all_orders'; }, 1000);
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            { window.location.href = '/all_orders'; };
            resolve();
          }, 1100);
        }),
        {
          loading: 'Logging in...',
          success: 'Login successful!',
          error: 'Something went wrong!',
        }
      );
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expiry');
    toast.remove('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
