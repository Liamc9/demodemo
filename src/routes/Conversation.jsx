// src/components/Conversation.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../context/AuthContext';
import { useDocument } from 'react-firebase-hooks/firestore';
import ConversationView from '../components/Views/ConversationView';
import { useNotifications } from '../context/NotificationContext'; // Import the notification hook

const Conversation = () => {
  const { conversationId } = useParams();
  const { currentUser } = useAuth();
  const { clearNotification } = useNotifications(); // Access clearNotification
  const navigate = useNavigate();
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
        id: conversationSnapshot.id,
        ...data,
      });

      // Update lastRead for currentUser
      const userLastRead = data.lastRead || {};
      const lastMessageTimestamp = data.lastMessage?.timestamp?.toDate();

      if (!userLastRead[currentUser.uid] || (lastMessageTimestamp && lastMessageTimestamp > userLastRead[currentUser.uid].toDate())) {
        const conversationRef = doc(db, 'conversations', conversationSnapshot.id);
        updateDoc(conversationRef, {
          [`lastRead.${currentUser.uid}`]: Timestamp.now(),
        }).catch(error => {
          console.error("Error updating lastRead:", error);
        });

        // Optionally clear global messages notification if this is the active conversation
        clearNotification('messages');
      }
    }
  }, [conversationSnapshot, currentUser.uid, clearNotification]);

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

    if (!conversation.id) {
      console.error('Conversation ID is undefined.');
      return;
    }

    const message = {
      localTimestamp: Date.now(),
      sender: currentUser.uid,
      text: newMessage.trim(),
      timestamp: Timestamp.now(),
    };

    try {
      const conversationRef = doc(db, 'conversations', conversation.id);

      await updateDoc(conversationRef, {
        messages: arrayUnion(message),
        lastMessage: {
          text: message.text,
          timestamp: message.timestamp,
        },
      });

      setNewMessage('');
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (conversationError) {
    return <p>Error loading conversation: {conversationError.message}</p>;
  }

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
