// src/components/Drawers/BottomDrawer.jsx

import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styled, { css } from "styled-components";

const DrawerContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  transition: opacity ${({ transitionDuration }) => transitionDuration}ms ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
`;

const BackgroundOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity ${({ transitionDuration }) => transitionDuration}ms ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
`;

const Drawer = styled.div`
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth};
  height: ${({ autoHeight, height }) => (autoHeight ? "auto" : height)};
  background-color: white;
  ${({ noRoundedCorners }) =>
    noRoundedCorners
      ? css`
          border-radius: 0;
        `
      : css`
          border-radius: 16px 16px 0 0;
        `}
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transform: ${({ isOpen }) => (isOpen ? "translateY(0)" : "translateY(100%)")};
  transition: transform ${({ transitionDuration }) => transitionDuration}ms ease-in-out,
    opacity ${({ transitionDuration }) => transitionDuration}ms ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  display: flex;
  flex-direction: column;
`;

const Handle = styled.div`
  width: 48px;
  height: 4px;
  background-color: #d1d5db;
  border-radius: 9999px;
  margin: 8px auto;
  display: ${({ hideHandle }) => (hideHandle ? "none" : "block")};
`;

const DrawerContent = styled.div`
  flex: 1;
  overflow-y: ${({ autoHeight }) => (autoHeight ? "visible" : "auto")};
`;

export default function BottomDrawer({
  isOpen,
  onClose,
  children,
  transitionDuration = 300,
  height = "80vh",
  autoHeight = false,
  maxWidth = "600px",
  hideHandle = false, // New prop to hide handle
  noRoundedCorners = false, // New prop to remove rounded corners
}) {
  const drawerRef = useRef();

  // Close the drawer when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  return createPortal(
    <DrawerContainer isOpen={isOpen} transitionDuration={transitionDuration}>
      {/* Background overlay */}
      <BackgroundOverlay isOpen={isOpen} onClick={onClose} transitionDuration={transitionDuration} />

      {/* Drawer content */}
      <Drawer
        ref={drawerRef}
        isOpen={isOpen}
        transitionDuration={transitionDuration}
        height={height}
        autoHeight={autoHeight}
        maxWidth={maxWidth}
        noRoundedCorners={noRoundedCorners} // Pass the new prop
      >
        {/* Drawer handle */}
        <Handle hideHandle={hideHandle} /> {/* Pass the new prop */}
        {/* Scrollable or auto-adjusted content area */}
        <DrawerContent autoHeight={autoHeight}>{children}</DrawerContent>
      </Drawer>
    </DrawerContainer>,
    document.body
  );
}
