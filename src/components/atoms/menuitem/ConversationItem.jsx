// src/components/ConversationItem.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Styled Components
const ItemWrapper = styled(Link)`
  display: flex;
  align-items: center;
  height: 100px;
  padding: 1rem;
  text-decoration: none;
  border-bottom: 1px solid #e0e0e0;
  color: inherit;
  position: relative;
  &:hover {
    background-color: #f9fafb;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 9999px;
  margin-right: 1rem;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.span`
  font-size: 1.3rem;
  color: #333333;
  margin: 0;
  font-weight: ${(props) => (props.hasNewMessage ? '700' : '600')};
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const LastMessage = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80%;
  font-weight: ${(props) => (props.hasNewMessage ? '700' : '400')};
`;

const NewIndicator = styled.div`
  width: 12px;
  height: 12px;
  background-color: #ef4444; /* Red color */
  border-radius: 50%;
  position: absolute;
  top: 20px;
  right: 20px;
`;

// Helper Function to Format Timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';

  const messageDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();

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
  const otherParticipant = conversation.participants.find(p => p.uid !== currentUser.uid);
  if (!otherParticipant) {
    return null;
  }

  const formattedTimestamp = conversation.lastMessage?.timestamp
    ? formatTimestamp(conversation.lastMessage.timestamp)
    : '';

  return (
    <ItemWrapper to={`/conversation/${conversation.id}`}>
      <Avatar src={otherParticipant.avatarUrl} alt={`${otherParticipant.name}'s avatar`} />
      <Details>
        <Header>
          <Name hasNewMessage={conversation.hasNewMessage}>{otherParticipant.name}</Name>
          <Timestamp>{formattedTimestamp}</Timestamp>
        </Header>
        <LastMessage hasNewMessage={conversation.hasNewMessage}>
          {conversation.lastMessage.text}
        </LastMessage>
      </Details>
      {conversation.hasNewMessage && <NewIndicator />}
    </ItemWrapper>
  );
};

export default ConversationItem;
