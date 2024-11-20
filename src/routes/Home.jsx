import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";

export default function Home() {
  const { notifications, addNotification, clearNotification } = useNotifications();

  useEffect(() => {
    console.log("Current notifications:", notifications);
  }, [notifications]);

  return (
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

      <Outlet />
    </div>
  );
}

