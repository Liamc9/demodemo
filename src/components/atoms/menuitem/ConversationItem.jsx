// src/components/ConversationItem.jsx

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Styled Components
const ItemWrapper = styled(Link)`
  display: flex;
  align-items: center;
  height: 100px; /* Equivalent to h-20 */
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  position: relative; /* To position the timestamp */
  &:hover {
    background-color: #f9fafb;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 9999px; /* Equivalent to rounded-full */
  margin-right: 1rem;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative; /* To position the timestamp */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.span`
  font-size: 1.3rem; /* Equivalent to text-base */
  font-weight: 600; /* Equivalent to font-semibold */
`;

const Timestamp = styled.span`
  font-size: 0.75rem; /* Smaller font size */
  color: #9ca3af; /* Equivalent to text-gray-400 */
`;

const LastMessage = styled.span`
  font-size: 0.875rem; /* Equivalent to text-sm */
  color: #6b7280; /* Equivalent to text-gray-500 */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80%;
`;

// Helper Function to Format Timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';

  // Convert Firestore Timestamp to Date
  const messageDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();

  // Calculate difference in days
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMessageDay = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate()
  );

  const diffTime = startOfToday - startOfMessageDay;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else {
    return `${diffDays} days ago`;
  }
};

// Component
const ConversationItem = ({ conversation, currentUser }) => {

  // Find the other participant
  const otherParticipant = conversation.participants.find(p => p.uid !== currentUser.uid);
  if (!otherParticipant) {
    return null;
  }

  // Format the timestamp
  const formattedTimestamp = conversation.lastMessage?.timestamp
    ? formatTimestamp(conversation.lastMessage.timestamp)
    : '';

  return (
    <ItemWrapper to={`/conversation/${conversation.id}`}>
      <Avatar src={otherParticipant.avatarUrl} alt={`${otherParticipant.name}'s avatar`} />
      <Details>
        <Header>
          <Name>{otherParticipant.name}</Name>
          <Timestamp>{formattedTimestamp}</Timestamp>
        </Header>
        <LastMessage>{conversation.lastMessage.text}</LastMessage>
      </Details>
    </ItemWrapper>
  );
};

export default ConversationItem;
