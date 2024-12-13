// ProgressBar.js
import React from "react";
import styled from "styled-components";

const ProgressBar = ({ currentPage, totalPages }) => {
  const progress = (currentPage / totalPages) * 100;
  return (
    <ProgressBarContainer>
      <ProgressIndicator style={{ width: `${progress}%` }} />
    </ProgressBarContainer>
  );
};

export default ProgressBar;

const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: #e0e0e0;
  height: 8px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const ProgressIndicator = styled.div`
  height: 100%;
  background-color: #b08b5b;
  border-radius: 5px;
  transition: width 0.3s;
`;
