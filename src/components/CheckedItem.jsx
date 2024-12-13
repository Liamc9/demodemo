import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";

// Styled Components

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 91.666667%; /* Equivalent to w-11/12 */
  margin: 0 auto;
  user-select: none;
  gap: 1rem;
  max-width: 500px;
`;

const Label = styled.label`
  color: #94a3b8; /* Equivalent to text-slate-400 */
  position: relative;
  cursor: pointer;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  height: 1px;
  width: 1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
`;

const StyledSpan = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 3px solid #cbd5e1; /* Equivalent to border-slate-300 */
  background-color: #ffffff; /* bg-white */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-lg */
  transition: all 0.2s ease-in-out;
  width: ${({ width }) => width};
  height: ${({ height }) => height};

  /* Checked State */
  ${HiddenCheckbox}:checked + & {
    border-color: ${({ color }) => color || "#3b82f6"}; /* Default to blue-500 */
    box-shadow: 0 4px 6px ${({ color }) => color}33; /* 10% opacity */
    color: ${({ color }) => color || "#3b82f6"};

    &::before {
      content: '✓';
      position: absolute;
      top: 0.25rem;
      left: 0.25rem;
      width: 1.25rem;
      height: 1.25rem;
      border: 3px solid ${({ color }) => color || "#3b82f6"};
      border-radius: 50%;
      background-color: ${({ color }) => color || "#3b82f6"};
      opacity: 1;
      transform: scale(1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 0.75rem;
      transition: all 0.2s ease-in-out;
    }
  }

  /* Hover State */
  &:hover {
    border-color: ${({ color }) => color || "#3b82f6"};

    &::before {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Pseudo-element before */
  &::before {
    content: '';
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    width: 1.25rem;
    height: 1.25rem;
    border: 3px solid ${({ color }) => color || "#3b82f6"};
    border-radius: 50%;
    background-color: ${({ color }) => color || "#3b82f6"};
    opacity: 0;
    transform: scale(0);
    transition: all 0.2s ease-in-out;
  }

  /* SVG and Label Text */
  > span {
    transition: all 0.2s ease-in-out;
    text-align: center;
    font-size: 0.875rem; /* Equivalent to text-sm */
  }
`;

// Component

const CheckedItem = ({
  label,
  svg,
  onChange,
  checked,
  height = "7rem",
  width = "7rem",
  color = "#3b82f6", // Default to blue-500
}) => {
  return (
    <Container>
      <Label>
        <HiddenCheckbox onChange={onChange} checked={checked} />
        <StyledSpan height={height} width={width} color={color}>
          <span>{svg}</span>
          <span>{label}</span>
        </StyledSpan>
      </Label>
    </Container>
  );
};

// PropTypes for type checking
CheckedItem.propTypes = {
  label: PropTypes.string.isRequired,
  svg: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  height: PropTypes.string,
  width: PropTypes.string,
  color: PropTypes.string,
};

export default CheckedItem;
