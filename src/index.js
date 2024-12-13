import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
import Root from './routes/Root';
import Login from './routes/Login';
import SettingsPage from './routes/Settings';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import useAuth
import Listing from './routes/Listing';
import Explore from './routes/Explore';
import Messages from './routes/Messages';
import ManageAccount from './routes/ManageAccount';
import Rooms from './routes/Rooms';
import Profile from './routes/Profile';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Conversation from './routes/Conversation';

// Helper component for route protection
const RequireAuth = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Define your routes with authentication checks
const router = createBrowserRouter([
  {
    path: '',
    element: <Root />,
    children: [
      {
        index: true, // Default route
        element: <Navigate to="/explore" replace />, // Redirect to /home
      },
      { path: 'login', element: <Login /> }, // Public route
      { path: 'settings/:userId', element: <RequireAuth><SettingsPage /></RequireAuth> }, // Protected route
      { path: 'listing', element: <Listing /> }, // Protected route
      { path: 'explore', element: <Explore /> }, // Protected route
      { path: 'messages', element: <Messages /> }, // Protected route
      { path: 'settings/manageaccount', element: <RequireAuth><ManageAccount /></RequireAuth> }, // Protected route
      { path: 'rooms/:id', element: <Rooms />}, // Protected route
      { path: 'profile/:id', element: <Profile />}, // Protected route
      { path: 'conversation/:conversationId', element: <RequireAuth><Conversation/></RequireAuth>}
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer />
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
    <ToastContainer />
  </React.StrictMode>
);
