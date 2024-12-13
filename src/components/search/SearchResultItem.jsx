import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// Styled container for each search result item
const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #eaeaea;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

// Styled container for any thumbnail or icon
const Thumbnail = styled.div`
  width: 40px;
  height: 40px;
  background-color: #dcdcdc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

// Styled text container
const TextContainer = styled.div`
  flex: 1;
`;

// Styled title
const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
`;

// Styled description
const Description = styled.div`
  font-size: 14px;
  color: #666;
`;

const SearchResultItem = ({ data }) => {
  const { title, description, thumbnail } = data;

  return (
    <ItemContainer>
      {thumbnail && (
        <Thumbnail>
          <img src={thumbnail} alt={`${title} thumbnail`} />
        </Thumbnail>
      )}
      <TextContainer>
        {title && <Title>{title}</Title>}
        {description && <Description>{description}</Description>}
      </TextContainer>
    </ItemContainer>
  );
};

SearchResultItem.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    thumbnail: PropTypes.string, // URL to a thumbnail image
  }).isRequired,
};

export default SearchResultItem;
