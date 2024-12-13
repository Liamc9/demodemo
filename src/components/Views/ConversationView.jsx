// src/components/conversationView.jsx

import React from 'react';
import styled from 'styled-components';
import Chat from '../Chat';
import ChatListingCard from '../ChatListingCard';

// Styled Components
const ConversationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align to flex-start to accommodate the fixed card */
  height: 100vh;
  padding-top: 160px; /* Space for the fixed ChatListingCard */
  box-sizing: border-box;
  background-color: #f9fafb; /* Light background for better contrast */
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 1.2em;
`;

const LoadingMessage = styled.div`
  font-size: 1.2em;
  color: #555;
`;

// Display Component
const conversationView = ({
  conversation,
  listing,
  loadingConversation,
  loadingListing,
  errorConversation,
  errorListing,
    handleSendMessage,
    newMessage,
    setNewMessage,
    messagesEndRef
}) => {
  return (
    <>
      {/* Display ChatListingCard only if listing data is available and not loading */}
      {!loadingListing && listing && <ChatListingCard data={listing} />}

      <ConversationContainer>
        {/* Loading or Error States for Conversation */}
        {loadingConversation ? (
          <LoadingMessage>Loading conversation...</LoadingMessage>
        ) : errorConversation ? (
          <ErrorMessage>Error loading conversation: {errorConversation.message}</ErrorMessage>
        ) : (
          <>
            {/* Loading or Error States for Listing */}
            {loadingListing ? (
              <LoadingMessage>Loading listing details...</LoadingMessage>
            ) : errorListing ? (
              <ErrorMessage>Error loading listing: {errorListing.message}</ErrorMessage>
            ) : (
              <Chat conversation={conversation} handleSendMessage={handleSendMessage}
              newMessage={newMessage} setNewMessage={setNewMessage} messagesEndRef={messagesEndRef}/>
            )}
          </>
        )}
      </ConversationContainer>
    </>
  );
};

export default conversationView;
