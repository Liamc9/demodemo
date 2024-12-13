// src/components/ConversationList.js
import React from 'react';
import styled from 'styled-components';
import ConversationItem from '../../atoms/menuitem/ConversationItem';

// Styled Components
const ListWrapper = styled.div`
`;


const ConversationList = ({ conversations, currentUser }) => {
  return (
    <ListWrapper>
      {conversations.map((conversation) => (
        <ConversationItem key={conversation.id} conversation={conversation} currentUser={currentUser}/>
      ))}
    </ListWrapper>
  );
};

export default ConversationList;
