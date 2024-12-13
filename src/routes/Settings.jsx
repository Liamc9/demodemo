// SettingsPage.js
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Settings from "../components/pages/Settings";
import styled from "styled-components";
import { UsersIcon, NotificationsIcon } from "../components/icons/Icons"; // Ensure Icons are imported

// Styled Components
const LoadingMessage = styled.div`
  padding: 16px;
  font-size: 1.25rem; /* Increased font size */
  color: #666;
  text-align: center;
`;

// CREATE FUNCTION
function SettingsPage() {
  const { logout, userData, currentUser } = useAuth(); // Access userData and currentUser from context
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle loading and authentication state
  if (currentUser === null) {
    // User is not authenticated
    navigate("/login");
    return null;
  }

  if (!userData) {
    return <LoadingMessage>Loading user data...</LoadingMessage>;
  }

  // HTML
  return (
    <div>
      {/* Settings Component with userData prop */}
      <Settings
        userData={userData} // Pass userData to Settings
        settings={[
          {
            category: "Account",
            icon: UsersIcon,
            text: "Manage Account",
            link: "./manageaccount",
          },
          {
            category: "Communication",
            icon: NotificationsIcon,
            text: "Email Notifications",
            link: "/email-notifications",
          },
        ]}
        onLogout={handleLogout} // Pass the handleLogout function
      />
    </div>
  );
}

export default SettingsPage;
