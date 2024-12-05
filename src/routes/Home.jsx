// Home.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from "../context/NotificationContext";

export default function Home() {
  const { currentUser, userData, updateUserData, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(userData?.username || '');
  const [age, setAge] = useState(userData?.age || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { notifications, addNotification, clearNotification } = useNotifications();

    useEffect(() => {
    console.log("Current notifications:", notifications);
  }, [notifications]);

  // Update local state when userData changes
  useEffect(() => {
    setUsername(userData?.username || '');
    setAge(userData?.age || '');
    setEmail(currentUser?.email || '');
  }, [userData, currentUser]);

  // Handle updating user data
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateUserData({ username, age });
      setSuccess('User data updated successfully!');
    } catch (error) {
      setError('Failed to update user data.');
      console.error('Error updating user data:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      setError('Failed to logout.');
      console.error('Logout failed:', error);
    }
  };

  if (!currentUser) {
    // If not authenticated, redirect to login
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen overflow-y-auto overflow-x-hidden bg-white p-4">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <p className="mb-4">This page demonstrates the usage of the AuthContext.</p>

      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Username:</strong> {userData?.username || 'Not set'}
        </p>
        <p>
          <strong>Age:</strong> {userData?.age || 'Not set'}
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Update Username:</label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter new username"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Update Age:</label>
          <input
            type="number"
            className="border border-gray-300 p-2 rounded w-full"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update User Data
        </button>
      </form>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mt-6"
      >
        Logout
      </button>
      <div className="min-h-screen overflow-y-auto overflow-x-hidden bg-white p-4">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <p className="mb-4">Practice using the Notification Context by interacting with the buttons below.</p>

      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Manage Notifications for Home:</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => addNotification("home")}
          >
            Add Notification to Home
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => clearNotification("home")}
          >
            Clear Notification from Home
          </button>
        </div>

        <div>
          <h2 className="font-semibold">Manage Notifications for Search:</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => addNotification("search")}
          >
            Add Notification to Search
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => clearNotification("search")}
          >
            Clear Notification from Search
          </button>
        </div>

        <div>
          <h2 className="font-semibold">Manage Notifications for Profile:</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => addNotification("profile")}
          >
            Add Notification to Profile
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => clearNotification("profile")}
          >
            Clear Notification from Profile
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}