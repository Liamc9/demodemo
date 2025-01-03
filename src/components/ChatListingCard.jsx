// src/components/ChatListingCard.jsx

import React, { useState } from "react";
import styled from "styled-components";
import BottomDrawer from "./Drawers/BottomDrawer"; // Adjust the path as needed
import ImageCarousel2 from "./ImageCarousel2"; // Assuming you have an ImageCarousel component
import MapWithMarker from "./Map"; // Reuse the Map component
import { CalendarIcon, LocationIcon, MoneyIcon2 } from "./icons/Icons";

// Styled Components

const CardButton = styled.button`
  position: fixed;
  max-width: 800px;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  height: 160px;
  cursor: pointer;
  z-index: 50;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ImageThumbnail = styled.img`
  width: 40%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 16px;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
`;

const CardTitle = styled.span`
  font-size: 1.4rem;
  font-weight: bold;
  color: #111827;
  text-align: left;
`;

const County = styled.span`
  font-size: 1rem;
  color: #6b7280;
  text-align: left;
`;
const CardDetails = styled.div`
    font-size: 1rem;
    margin-top: 8px;
    padding: 5px 8px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;

    span {
        font-weight: bold;
    }
`;


const DetailsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    width: 100%;
`;

// Drawer Content Styled Components (Replicated from Rooms.jsx)

const DrawerContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const DrawerSection = styled.div`
  margin-bottom: 16px;
`;

const DrawerSectionHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const DrawerText = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
`;

const DrawerInfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const DrawerIcon = styled.span`
  margin-right: 8px;
  display: flex;
  align-items: center;

  svg {
    width: 24px;
    height: 24px;
    color: #4b5563;
  }
`;


const DatesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  margin: 1rem auto 0;
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);

  .icon-container {
    flex: 0 0 20%; /* 20% of the container */
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 30px;
      height: 30px;
    }
  }

  .dates {
    display: flex;
    flex: 1;
    justify-content: space-between;

    .date-item {
      flex: 0 0 40%; /* Each section takes 40% of the container */
      display: flex;
      flex-direction: column;
      align-items: left;
      margin-left: 2rem;

      .date-label {
        font-size: 1rem;
        font-weight: 600; /* semi-bold */
        color: #555;
      }

      .date-value {
        font-size: 1.4rem;
        font-weight: bold;
        color: #333;
      }
    }
  }
`;

const DrawerMapContainer = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 12px;
`;


// ChatListingCard Component

export default function ChatListingCard({ data }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    title,
    city,
    county,
    description,
    eircode,
    endDate,
    images,
    rent,
    startDate,
    streetAddress,
    type,
  } = data;

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <CardButton onClick={handleOpenDrawer}>
        {images && images.length > 0 && (
          <ImageThumbnail src={images[0]} alt={`${type} in ${city}`} />
        )}
        <CardContent>
          <CardTitle>{title}</CardTitle>
          <County>
            {city}, {county}
          </County>
          <DetailsContainer>
          <CardDetails>€{rent}</CardDetails>
          <CardDetails>
            {startDate} - {endDate}
          </CardDetails>
          </DetailsContainer>
        </CardContent>
      </CardButton>

      <BottomDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        transitionDuration={300}
        height="80%" // Adjust height as needed
        maxWidth="600px"
        hideHandle={false} // Show the handle if desired
        noRoundedCorners={false} // Rounded corners if desired
      >
        <DrawerContentContainer>
          {/* Image Carousel */}
          {images && images.length > 0 ? (
            <ImageCarousel2 images={images} />
          ) : (
            <p>No images available</p>
          )}

          {/* Title */}
          <DrawerSection>
            <DrawerSectionHeader>{title}</DrawerSectionHeader>
          </DrawerSection>

          {/* Dates */}
          <DrawerSection>
          <DatesContainer>
          <div className="icon-container">
            <CalendarIcon />
          </div>
          <div className="dates">
            <div className="date-item">
              <span className="date-label">From</span>
              <span className="date-value">{startDate || "Anytime"}</span>
            </div>
            <div className="date-item">
              <span className="date-label">To</span>
              <span className="date-value">{endDate || "Anytime"}</span>
            </div>
          </div>
        </DatesContainer>
            </DrawerSection>

          {/* Location */}
          <DrawerSection>
            <DrawerSectionHeader>Location</DrawerSectionHeader>
            <DrawerInfoRow>
              <DrawerIcon>
                <LocationIcon />
              </DrawerIcon>
              <DrawerText>
                {streetAddress || "No address provided"}, {city || "City"}, {county || "County"}, {eircode || "Eircode"}
              </DrawerText>
            </DrawerInfoRow>
            {/* Map */}
            <DrawerMapContainer>
              <MapWithMarker eircode={eircode} />
            </DrawerMapContainer>
          </DrawerSection>

          {/* Description */}
          <DrawerSection>
            <DrawerSectionHeader>Description</DrawerSectionHeader>
            <DrawerText>
              {description || "No description provided."}
            </DrawerText>
          </DrawerSection>

         
        </DrawerContentContainer>
      </BottomDrawer>

    
    </>
  );
}
