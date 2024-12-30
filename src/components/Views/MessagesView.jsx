// src/pages/MessagesView.js
import React from 'react';
import MessagesPrompt from '../cards/MessagesPrompt';
import ConversationList from '../molecules/stackedlist/ConversationList';
import styled from 'styled-components';
const FixedHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px; /* Adjust height as needed */
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 40; /* Ensure it stays above other elements */
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  color: #333333;
  margin: 0;
  font-weight: bold;
`;
// Adjust BodyContainer to account for the fixed header
const BodyContainer = styled.div`
  position: relative;
  padding-top: 80px; /* Added padding-top to prevent overlap with the fixed header */
  max-width: 1200px;
  margin: 0 auto;
`;

export default function MessagesView({ currentUser, conversations, loading, error }) {
  return (
    <div>
      <FixedHeader>
        <HeaderTitle>My Messages</HeaderTitle>
        
      </FixedHeader>
      <BodyContainer>
      {!currentUser ? (
        <MessagesPrompt currentUser/>
      ) : (
        <div>
          {loading ? (
            <p>Loading conversations...</p>
          ) : error ? (
            <p>{error}</p>
          ) : conversations.length === 0 ? (
            <p>No conversations found.</p>
          ) : (
            <ConversationList conversations={conversations} currentUser={currentUser}/>
          )}
        </div>
      )}
      </BodyContainer>
    </div>
  );
}
