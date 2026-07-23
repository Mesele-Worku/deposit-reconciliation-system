// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'

// import App from './App.jsx'
// import './index.css'
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from 'react';

import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './context/authContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);
