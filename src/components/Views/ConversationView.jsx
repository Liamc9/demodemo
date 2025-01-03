// src/components/conversationView.jsx
import React from 'react';
import styled from 'styled-components';
import Chat from '../Chat';
import ChatListingCard from '../ChatListingCard';
import { ChevronLeftIcon } from '../icons/Icons'; // Import the ChevronLeftIcon

// Styled Components
const ConversationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align to flex-start to accommodate the fixed card */
  /* Instead of forcing a 100vh height, use min-height and allow scrolling */
  min-height: 100vh;
  /* Provide enough top padding so chat isn't behind the fixed card */
  padding-top: 160px; /* Adjust based on the height of ChatListingCard */
  box-sizing: border-box;
  background-color: #f9fafb; /* Light background for better contrast */
  position: relative; /* Make it a positioned parent for the absolute BackButton */

  /* This allows the entire container to scroll if content exceeds the window */
  overflow-y: auto;
`;

const BackButton = styled.button`
  position: fixed;
  top: 20px; /* Adjust as needed */
  left: 20px; /* Adjust as needed */
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  padding: 5px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 50; /* Ensure it's above the conversation content */

  svg {
    width: 24px;
    height: 24px;
  }
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
const ConversationView = ({
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
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <>
      {/* Display ChatListingCard only if listing data is available and not loading */}
      {!loadingListing && listing && <ChatListingCard data={listing} />}

      <ConversationContainer>
        {/* Back Button */}
        <BackButton onClick={handleBackClick} aria-label="Go Back">
          <ChevronLeftIcon />
        </BackButton>

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
              <Chat
                conversation={conversation}
                handleSendMessage={handleSendMessage}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                messagesEndRef={messagesEndRef}
              />
            )}
          </>
        )}
      </ConversationContainer>
    </>
  );
};

export default ConversationView;