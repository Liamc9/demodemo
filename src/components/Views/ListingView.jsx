// src/components/ListingView.jsx

import React from "react";
import styled from "styled-components";
import ListYourPlaceCard from "../cards/ListYourPlaceCard";
import ListingCard from "../cards/ListingCard";
import BottomDrawer from "../Drawers/BottomDrawer";
import ListingForm from "../molecules/ListingForm";
import Modal from "../Modal";
import Loader from "../Loader";
import { PlusIcon } from "../icons/Icons";


const BodyContainer = styled.div`
  position: relative;
  padding: 20px 0;
  max-width: 1200px;
  margin: 0 auto;
`;


const HeaderSection = styled.div`
  margin-bottom: 20px;
`;

const ManageSection = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ManageButton = styled.button`
  background-color: #9333ea;
  color: white;
  border: none;
  margin-right: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #7e22ce;
  }
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const ListingsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const AddListingButton = styled.button`
  background-color: #ffffff;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  padding: 12px 24px;
  border-radius: 5px;
  width: 90%;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin: 0 auto;
  transition: background-color 0.3s ease, color 0.3s ease;
  &:hover {
    background-color: #3b82f6;
    color: #ffffff;
  }
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 20px;
    font-weight: bold;
  }
`;

const ModalButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #a855f7;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #9333ea;
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

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const ListingView = ({
    userListings,
    isManaging,
    handleRemoveListing,
    handleUpdateListing,
    handleListYourPlaceClick,
    isDrawerOpen,
    setIsDrawerOpen,
    handleFormSubmit,
    editingListing,
    showProfileModal,
    closeModal,
    navigateToProfile,
    loading,
    error,
    listingIds,
    setEditingListing,
    handleManageToggle, // Added prop
  }) => {
  
    if (loading) {
      return (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      );
    }
  
    if (error) {
      return <ErrorContainer>{error}</ErrorContainer>;
    }
  
    return (
      <BodyContainer>
        {userListings.length > 0 && (
          <HeaderSection>
            <ManageSection>
              <ManageButton onClick={handleManageToggle}>
                {isManaging ? "Stop Managing" : "Manage Listings"}
              </ManageButton>
            </ManageSection>
          </HeaderSection>
        )}
  
        {userListings.length === 0 ? (
          <ListYourPlaceCard onButtonClick={handleListYourPlaceClick} />
        ) : (
          <>
            <ListingsContainer>
              {userListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  data={listing}
                  isManaging={isManaging}
                  onUpdate={handleUpdateListing}
                  onRemove={handleRemoveListing}
                />
              ))}
            </ListingsContainer>
            {listingIds.length < 10 && ( // Changed to < 10 to respect Firestore 'in' query limit
              <AddListingButton onClick={handleListYourPlaceClick}>
                <PlusIcon className="w-6 h-6 mr-2" />
                Add Another Listing
              </AddListingButton>
            )}
          </>
        )}
  
        <BottomDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            editingListing && setEditingListing(null);
          }}
          transitionDuration={300}
          height="100%"
          maxWidth="600px"
          hideHandle={true}
          noRoundedCorners={true}
        >
          <ListingForm
            onClose={() => {
              setIsDrawerOpen(false);
              editingListing && setEditingListing(null);
            }}
            onSubmit={handleFormSubmit}
            initialData={editingListing}
          />
        </BottomDrawer>
  
        <Modal
          isModalOpen={showProfileModal}
          closeModal={closeModal}
          title="Profile Incomplete"
        >
          <p>You must complete your profile to post a listing.</p>
          <ModalButton onClick={navigateToProfile}>Go to Profile</ModalButton>
        </Modal>
      </BodyContainer>
    );
  };
  
  export default ListingView;