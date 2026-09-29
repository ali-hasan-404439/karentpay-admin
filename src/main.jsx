import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, RouterProvider } from 'react-router-dom';
import ThemeProvider from './utils/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from './Router/router';
import ContextProvider from './pages/ContextProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <ContextProvider>
      <RouterProvider router={router} />
      <ToastContainer autoClose={1500} />
    </ContextProvider>
  </ThemeProvider>
);
