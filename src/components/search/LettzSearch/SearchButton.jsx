import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// Styled container for the search button
const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 50px; /* Ensure sufficient height */
  background-color: #ffffff; /* White background */
  border: 1px solid #dcdcdc;
  border-radius: 10px; /* Reduced border radius */
  font-size: 16px;
  color: #333;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle outer shadow */

  &:hover {
    background-color: #f9f9f9;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* Slightly deeper shadow on hover */
  }

  &:focus {
    outline: none;
  }
`;

// Container for the left and right content
const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

// Styled for individual sections
const SectionLeft = styled.div`
  flex: 1;
  text-align: left; /* Left-aligned text */
  color: #000;
  font-weight: 600;
  font-size: 1.3rem;
  padding: 0 16px; /* Increased padding for spacing */
`;

const SectionRight = styled.div`
  flex: 1;
  text-align: left; /* Left-aligned text */
  color: #666;
  font-weight: 500;
    font-size: 1.3rem;
  padding: 0 16px; /* Increased padding for spacing */
`;

// Styled vertical divider
const Divider = styled.div`
  width: 2px; /* Thin vertical divider */
  height: 30px; /* Height relative to the button */
  background-color: #888; /* Visible color */
  display: block; /* Ensures it is rendered as a visible block */
`;

const SearchButton = ({
  onClick,
  place = "Anywhere",
  startDate = "Anytime",
  endDate = "",
}) => (
  <StyledButton onClick={onClick}>
    <ContentContainer>
      <SectionLeft>{place}</SectionLeft>
      <Divider> </Divider> {/* Visible even without content */}
      <SectionRight>
        {startDate}
        {endDate && ` - ${endDate}`}
      </SectionRight>
    </ContentContainer>
  </StyledButton>
);

SearchButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  place: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

export default SearchButton;
