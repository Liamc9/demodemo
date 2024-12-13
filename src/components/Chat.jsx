// src/components/Chat.js
import React, {  useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useAuth } from '../context/AuthContext';

// Styled Components

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 800px; /* Increased width for better readability */
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.2rem;
  color: #555;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 15px;
  ${(props) =>
    props.sent
      ? css`
          justify-content: flex-end;
        `
      : css`
          justify-content: flex-start;
        `}
`;

const MessageAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  ${(props) =>
    props.sent
      ? css`
          margin-left: 10px;
        `
      : css`
          margin-right: 10px;
        `}
  object-fit: cover;
`;

const MessageBubble = styled.div`
  background-color: ${(props) => (props.sent ? '#A855F7' : '#ffffff')};
  color: ${(props) => (props.sent ? '#ffffff' : '#000000')};
  padding: 12px 18px;
  max-width: 70%;
  border-radius: 20px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: ${(props) => (props.sent ? 'auto' : '0')};
  margin-right: ${(props) => (props.sent ? '0' : 'auto')};
  text-align: ${(props) => (props.sent ? 'right' : 'left')};
`;


const MessageText = styled.span`
  font-size: 1em;
  word-wrap: break-word;
`;

const MessageTimestamp = styled.span`
  font-size: 0.7em;
  color: #757575;
  margin-top: 5px;
  display: block;
  text-align: ${(props) => (props.sent ? 'right' : 'left')};
`;

const ChatInputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid #e0e0e0;
  background-color: #ffffff;
  display: flex;
  align-items: center;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 18px;
  border: 1px solid #e0e0e0;
  border-radius: 30px;
  outline: none;
  font-size: 1em;
  transition: border-color 0.3s;

  &:focus {
    border-color: #000;
  }
`;

const SendButton = styled.button`
  margin-left: 15px;
  padding: 10px 20px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;

  &:hover {
    background-color: #333;
  }

  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

// Chat Component

const Chat = ({ conversation, handleSendMessage, newMessage, setNewMessage, messagesEndRef }) => {
  const { currentUser } = useAuth();

  // Memoize participant map to avoid unnecessary recalculations
  const participantMap = useMemo(() => {
    if (!conversation) return {};
    return conversation.participants.reduce((acc, participant) => {
      acc[participant.uid] = participant;
      return acc;
    }, {});
  }, [conversation]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (conversation && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, conversation?.messages]);


  // If conversation is not yet loaded, show loading message
  if (!conversation) {
    return <LoadingMessage>Loading conversation...</LoadingMessage>;
  }

  // Destructure with default values to prevent undefined errors
  const { participants = [], messages = [], lastMessage = {} } = conversation;

  return (
    <ChatContainer>
      {/* Messages */}
      <ChatMessages>
        {messages.map((message) => {
          const isSentByCurrentUser = message.sender === currentUser?.uid;
          const sender = participantMap[message.sender];
          return (
            <MessageContainer key={message.id || message.localTimestamp} sent={isSentByCurrentUser}>
              {!isSentByCurrentUser && sender?.avatarUrl && (
                <MessageAvatar src={sender.avatarUrl} alt={sender.name} />
              )}
              <div>
                <MessageBubble sent={isSentByCurrentUser}>
                  <MessageText>{message.text}</MessageText>
                </MessageBubble>
                <MessageTimestamp sent={isSentByCurrentUser}>
                  {new Date(message.localTimestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </MessageTimestamp>
              </div>
              {isSentByCurrentUser && currentUser?.photoURL && (
                <MessageAvatar src={currentUser.photoURL} alt="You" sent />
              )}
            </MessageContainer>
          );
        })}
        <div ref={messagesEndRef} />
      </ChatMessages>

      {/* Message Input */}
      <ChatInputContainer>
        <ChatInput
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <SendButton onClick={handleSendMessage} disabled={!newMessage.trim()}>
          Send
        </SendButton>
      </ChatInputContainer>
    </ChatContainer>
  );
};


export default Chat;
