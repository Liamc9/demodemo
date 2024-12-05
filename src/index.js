import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Root from './routes/Root';
import Login from './routes/Login';
import Home from './routes/Home';
import SettingsPage from './routes/Settings';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';

const router = createBrowserRouter([
  { path: '', element: <Root />,
    children: [
      {
        index: true, // This makes it the default route for the parent path
        element: <Navigate to="/home" replace />, // Redirect to /home
      },
      { path: 'login', element: <Login />, },
      { path: 'home', element: <Home />, },
      { path: 'settings', element: <SettingsPage />, },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <AuthProvider>
    <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  </AuthProvider>
  </React.StrictMode>
);