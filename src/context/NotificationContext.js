// src/context/NotificationContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../firebase-config'; // Ensure you have Firebase initialized
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

// Hook to use the context
export const useNotifications = () => useContext(NotificationContext);

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({
    explore: false,
    listing: false,
    account: false,
    messages: false, // Added messages notification
  });

  const { currentUser } = useAuth(); // Get the current user from AuthContext

  // Fetch notifications from Firestore when the user logs in
  useEffect(() => {
    if (currentUser) {
      const fetchNotifications = async () => {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setNotifications(userData.notifications || {
              explore: false,
              listing: false,
              account: false,
              messages: false,
            });
          } else {
            // If no notifications field exists, initialize it
            await setDoc(
              docRef,
              { notifications: notifications },
              { merge: true }
            );
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
    } else {
      // User is logged out, reset notifications
      setNotifications({
        explore: false,
        listing: false,
        account: false,
        messages: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]); // Ensure 'notifications' is not a dependency to prevent infinite loop

  // Helper function to save notifications to Firestore
  const saveNotificationsToFirestore = async (updatedNotifications) => {
    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        await setDoc(
          docRef,
          { notifications: updatedNotifications },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving notifications:', error);
      }
    }
  };

  // Add a notification
  const addNotification = useCallback((key) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = { ...prevNotifications, [key]: true };
      saveNotificationsToFirestore(updatedNotifications);
      return updatedNotifications;
    });
  }, [currentUser]);

  // Clear a notification
  const clearNotification = useCallback((key) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = { ...prevNotifications, [key]: false };
      saveNotificationsToFirestore(updatedNotifications);
      return updatedNotifications;
    });
  }, [currentUser]);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, clearNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
