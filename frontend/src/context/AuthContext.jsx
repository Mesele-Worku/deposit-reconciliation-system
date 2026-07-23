import { createContext, useContext, useState } from 'react';

import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const login = async (username, password) => {
    const response = await api.post('/auth/login', {
      username,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('token', token);

    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');

    localStorage.removeItem('user');

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
