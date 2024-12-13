// src/pages/Messages.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase-config';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import MessagesView from '../components/Views/MessagesView';

export default function Messages() {
  const { currentUser, userData } = useAuth();
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
      : null // If no conversation IDs, don't run the query
  );

  // Update conversations state when snapshot changes
  useEffect(() => {
    if (conversationsSnapshot) {
      setConversations(
        conversationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    }
  }, [conversationsSnapshot]);

  // Handle loading and error states
  useEffect(() => {
    if (conversationsError) {
      setError("Failed to load conversations.");
    }
  }, [conversationsError]);

  console.log(conversations);

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
