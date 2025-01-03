// src/components/MessagesPrompt.js
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { LettzIcon } from '../icons/Icons'; // Adjust the path as necessary

// Styled Components

// Enhanced Card styling
const Card = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center content vertically within the card */
  width: 100%;
  max-width: 500px; /* Increased max-width for better layout */
  min-height: 400px; /* Set a minimum height to make the card taller */
  padding: 40px 30px; /* Increased padding for more spacious content */
  border: 1px solid #ddd;
  border-radius: 12px; /* Slightly larger border radius for a smoother look */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); /* Enhanced shadow for depth */
  background-color: #fff;
  box-sizing: border-box;
  margin-top: 10vh; /* Adjusted margin for better centering */

  /* Responsive adjustments */
  @media (max-width: 600px) {
    min-height: 350px;
    padding: 30px 20px;
  }
`;

// Header for LettzIcon and "Lettz" text
const Header = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
`;

// Styled component for the Lettz text
const LogoText = styled.span`
  font-size: 30px;
  font-weight: bold;
  margin-left: 8px;
`;

// Styled component for LettzIcon
const StyledLettzIcon = styled(LettzIcon)`
  width: 32px;
  height: 32px;
color: #A855F7;
  `;

// Enhanced IconWrapper
const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top left, #6a11cb, #A855F7);
  border-radius: 50%;
  margin: 24px 0;

  span {
    font-size: 40px;
    color: #fff;
  }
`;

// Enhanced Text
const Text = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  text-align: center;
  flex-grow: 1; /* Allow text to take up available space */
`;

// Enhanced Button
const Button = styled.button`
  width: 100%;
  padding: 14px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  background-color: #A855F7;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #9333EA;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #7E22CE;
    transform: translateY(0);
  }
`;

const MessagesPrompt = () => {
  const navigate = useNavigate(); // Initialize navigation

  const handleLoginClick = () => {
      navigate('/login', { state: { from: '/messages' } });
  };

  return (
    <Card>
      <Header>
        <StyledLettzIcon /> {/* Styled icon */}
        <LogoText>Lettz</LogoText>
      </Header>
      <IconWrapper>
        {/* Replace with your desired icon */}
        <span role="img" aria-label="messages">💬</span>
      </IconWrapper>
      <Text>Please log in to see your messages.</Text>
      <Button onClick={handleLoginClick}>Login</Button>
    </Card>
  );
};

export default MessagesPrompt;
