// src/components/RoomsView.jsx

import React from "react";
import styled from "styled-components";
import ImageCarousel2 from "../ImageCarousel2";
import { CalendarIcon, LocationIcon } from "../icons/Icons";
import MapWithMarker from "../Map";
import BottomDrawer from "../Drawers/BottomDrawer";
import MessageForm from "../MessageForm";

// Styled Components (Moved from Rooms.jsx)
const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 100px; /* Space for the fixed bottom bar */
`;

const RoomTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  font-weight: bold;
  margin-left: 1rem;
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

const SectionHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-top: 2rem;
  text-align: left;
  width: 100%;
  margin-left: 1rem;
`;

const SectionContent = styled.div`
  font-size: 1rem;
  color: #666;
  text-align: left;
  width: 100%;
  line-height: 1.5;
  margin-left: 1rem;
`;

// New Styled Components for Location
const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* Space between address and map */
  width: 90%;
`;

const AddressText = styled.span`
  font-size: 1.1rem;
  color: #666;
`;

// Styled components for the drawer and message form
const FixedBottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  z-index: 20;
`;

const RentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const RentLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 400;
  color: #999;
`;

const RentText = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;

const SendMessageButton = styled.button`
  background-color: #007bff;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 1.5rem;
  color: red;
`;

// Display Component
const RoomsView = ({
  roomData,
  isDrawerOpen,
  handleSendMessage,
  handleSend,
  closeDrawer,
}) => {
  if (!roomData) {
    return <ErrorContainer>Room not found.</ErrorContainer>;
  }

  const images = roomData.images && Array.isArray(roomData.images) ? roomData.images : [];

  return (
    <>
      <RoomContainer>
        {images?.length > 0 ? (
          <ImageCarousel2 images={images} />
        ) : (
          <p>No images available</p>
        )}
        <RoomTitle>{roomData.title || "Room Title"}</RoomTitle>
        <DatesContainer>
          <div className="icon-container">
            <CalendarIcon />
          </div>
          <div className="dates">
            <div className="date-item">
              <span className="date-label">From</span>
              <span className="date-value">{roomData.startDate || "Anytime"}</span>
            </div>
            <div className="date-item">
              <span className="date-label">To</span>
              <span className="date-value">{roomData.endDate || "Anytime"}</span>
            </div>
          </div>
        </DatesContainer>

        <SectionHeader>Location</SectionHeader>
        <SectionContent>
          <LocationContainer>
            <LocationIcon className="w-6 h-6" />
            <AddressText>
              {roomData.streetAddress ? roomData.streetAddress : "No address provided"},{" "}
              {roomData.city ? roomData.city : "City"}, {roomData.county ? roomData.county : "County"}
              , {roomData.eircode ? roomData.eircode : "eirCode"}
            </AddressText>
          </LocationContainer>
          <MapWithMarker eircode={roomData.eircode} />
        </SectionContent>

        <SectionHeader>Description</SectionHeader>
        <SectionContent>
          {roomData.description ? roomData.description : "No description provided"}
        </SectionContent>
      </RoomContainer>
      <FixedBottomBar>
        <RentContainer>
          <RentLabel>Monthly Rent</RentLabel>
          <RentText>€{roomData.rent || "N/A"}</RentText>
        </RentContainer>
        <SendMessageButton onClick={handleSendMessage}>Send Message</SendMessageButton>
      </FixedBottomBar>
      <BottomDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        transitionDuration={300}
        height="50%" // Adjust height as needed
        maxWidth="600px"
      >
        <MessageForm onSend={handleSend} onClose={closeDrawer} />
      </BottomDrawer>
    </>
  );
};

export default RoomsView;
