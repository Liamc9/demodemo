// src/pages/Messages.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase-config';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import MessagesView from '../components/Views/MessagesView';
import { useNotifications } from '../context/NotificationContext'; // Import the notification hook

export default function Messages() {
  const { currentUser, userData } = useAuth();
  const { addNotification, clearNotification } = useNotifications(); // Access notification functions
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);

  const conversationIds = userData?.conversationIDs || [];

  // Firestore query using useCollection
  const [conversationsSnapshot, conversationsLoading, conversationsError] = useCollection(
    conversationIds.length > 0
      ? query(
          collection(db, "conversations"),
          where("__name__", "in", conversationIds)
        )
      : null
  );

  // Update conversations state and manage notifications when snapshot changes
  useEffect(() => {
    if (conversationsSnapshot) {
      let hasAnyNewMessages = false;
      const updatedConversations = conversationsSnapshot.docs.map((doc) => {
        const data = doc.data();
        const lastRead = data.lastRead ? data.lastRead[currentUser.uid]?.toDate() : null;
        const lastMessageTimestamp = data.lastMessage?.timestamp?.toDate();
        const hasNewMessage = lastRead ? lastMessageTimestamp > lastRead : true;

        if (hasNewMessage) {
          hasAnyNewMessages = true;
        }

        return {
          id: doc.id,
          ...data,
          hasNewMessage,
        };
      });

      setConversations(updatedConversations);

      // Update global messages notification based on unread messages
      if (hasAnyNewMessages) {
        addNotification('messages');
      } else {
        clearNotification('messages');
      }
    }
  }, [conversationsSnapshot, currentUser.uid, addNotification, clearNotification]);

  // Handle loading and error states
  useEffect(() => {
    if (conversationsError) {
      setError("Failed to load conversations.");
    }
  }, [conversationsError]);


  // Pass data to the display component
  return (
    <MessagesView
      currentUser={currentUser}
      conversations={conversations}
      loading={conversationsLoading}
      error={error}
    />
  );
}
