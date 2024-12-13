// Loader.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

// Define the keyframes for the bounce animation
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

// Styled component for the loader wrapper to center it in the viewport
const LoaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it stays on top of other elements */
`;

// Styled component for each bouncing dot
const Dot = styled.div`
  width: 16px; /* Equivalent to Tailwind's w-4 */
  height: 16px; /* Equivalent to Tailwind's h-4 */
  margin: 0 4px; /* Equivalent to Tailwind's gap-2 */
  background-color: #1d4ed8; /* Equivalent to Tailwind's bg-blue-700 */
  border-radius: 50%;
  display: inline-block;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  animation-delay: ${(props) => props.delay};
`;

// Loader Component
const Loader = () => {
  return (
    <LoaderWrapper>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Dot delay="0s" />
        <Dot delay="0.2s" />
        <Dot delay="0.4s" />
      </div>
    </LoaderWrapper>
  );
};

export default Loader;
