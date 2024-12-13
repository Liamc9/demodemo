// src/components/Conversation.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../context/AuthContext';
import { useDocument } from 'react-firebase-hooks/firestore';
import ConversationView from '../components/Views/ConversationView'; // Import the display component

const Conversation = () => {
  const { conversationId } = useParams();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  const [conversation, setConversation] = useState(null);
  const [listing, setListing] = useState(null);
  const [newMessage, setNewMessage] = useState('');


  // Fetch conversation data
  const [conversationSnapshot, conversationLoading, conversationError] = useDocument(
    conversationId ? doc(db, "conversations", conversationId) : null
  );

  useEffect(() => {
    if (conversationSnapshot) {
      const data = conversationSnapshot.data();
      console.log("Fetched Conversation:", data);
      setConversation({
        id: conversationSnapshot.id, // Add the ID here
        ...data, // Spread the conversation data
      });
    }
  }, [conversationSnapshot]);

  // Fetch listing data only if listingId is available
  const listingId = conversation?.listingId;

  const [listingSnapshot, listingLoading, listingError] = useDocument(
    listingId ? doc(db, "listings", listingId) : null
  );

  useEffect(() => {
    if (listingSnapshot) {
      const data = listingSnapshot.data();
      console.log("Fetched Listing:", data);
      setListing(data);
    }
  }, [listingSnapshot]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !currentUser) return;

    // Ensure conversation.id exists
    if (!conversation.id) {
      console.error('Conversation ID is undefined.');
      return;
    }

    const message = {
      localTimestamp: Date.now(),
      sender: currentUser.uid,
      text: newMessage.trim(),
    };

    try {
      const conversationRef = doc(db, 'conversations', conversation.id);

      await updateDoc(conversationRef, {
        messages: arrayUnion(message),
        lastMessage: {
          text: message.text,
          timestamp: Timestamp.now(),
        },
      });

      setNewMessage('');
      // Scroll to bottom after sending
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <ConversationView
      conversation={conversation}
      listing={listing}
      loadingConversation={conversationLoading}
      loadingListing={listingLoading}
      errorConversation={conversationError}
      errorListing={listingError}
      handleSendMessage={handleSendMessage}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      messagesEndRef={messagesEndRef}
    />
  );
};

export default Conversation;
