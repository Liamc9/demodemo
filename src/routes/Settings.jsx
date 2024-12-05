// IMPORTS
import React from 'react';
import { Settings, UsersIcon, NotificationsIcon } from 'liamc9npm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// CREATE FUNCTION
function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // HTML
  return (
    <div>
      <Settings
        settings={[
          {
            category: 'Account',
            icon: UsersIcon,
            text: 'Manage Account',
            link: '/manageaccount',
          },
          {
            category: 'Account',
            icon: NotificationsIcon,
            text: 'Manage Billing',
            link: '/managebilling',
          },
          {
            category: 'Notifications',
            icon: NotificationsIcon,
            text: 'Email Notifications',
            link: '/email-notifications',
          },
        ]}
        onLogout={handleLogout} // Pass the handleLogout function
      />
    </div>
  );
}

export default SettingsPage;