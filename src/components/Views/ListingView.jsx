// src/components/ListingView.jsx

import React, { useState } from "react";
import styled from "styled-components";
import ListYourPlaceCard from "../cards/ListYourPlaceCard";
import ListingCard from "../cards/ListingCard";
import BottomDrawer from "../Drawers/BottomDrawer";
import ListingForm from "../molecules/ListingForm";
import Modal from "../Modal";
import Loader from "../Loader";
import { PlusIcon } from "../icons/Icons";
import DeleteAccountModal from "../DeleteModal"; // Import the DeleteAccountModal


// New Styled Component for Fixed Header
const FixedHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px; /* Adjust height as needed */
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 40; /* Ensure it stays above other elements */
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  color: #333333;
  margin: 0;
  font-weight: bold;
`;

const ManageButton = styled.button`
  background-color: #9333ea;
  color: white;
  border: none;
  padding: 10px 16px;
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
    padding: 8px 12px;
    font-size: 16px;
    font-weight: 500;
  }
`;

// Adjust BodyContainer to account for the fixed header
const BodyContainer = styled.div`
  position: relative;
  padding: 100px 20px 20px 20px; /* Added padding-top to prevent overlap with the fixed header */
  max-width: 1200px;
  margin: 0 auto;
`;


// Existing Styled Components
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
  handleManageToggle,
  currentUser,
  userData,
}) => {
  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);

  // Handler to open the delete modal
  const openDeleteModal = (listingId) => {
    setListingToDelete(listingId);
    setIsDeleteModalOpen(true);
  };

  // Handler to confirm deletion
  const confirmDelete = async (password) => { // Assuming password is not required
    // Since requiresPassword is false, password can be ignored
    if (listingToDelete) {
      await handleRemoveListing(listingToDelete);
      setListingToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  // Handler to cancel deletion
  const cancelDelete = () => {
    setListingToDelete(null);
    setIsDeleteModalOpen(false);
  };

  if (loading) {
    return (
      <>
        <FixedHeader>
          <HeaderTitle>My Listings</HeaderTitle>
          {userListings.length > 0 && (
            <ManageButton onClick={handleManageToggle}>
              {isManaging ? "Done" : "Manage Listings"}
            </ManageButton>
          )}
        </FixedHeader>
        <BodyContainer>
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        </BodyContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <FixedHeader>
          <HeaderTitle>My Listings</HeaderTitle>
          {userListings.length > 0 && (
            <ManageButton onClick={handleManageToggle}>
              {isManaging ? "Done" : "Manage Listings"}
            </ManageButton>
          )}
        </FixedHeader>
        <BodyContainer>
          <ErrorContainer>{error}</ErrorContainer>
        </BodyContainer>
      </>
    );
  }

  return (
    <>
      {/* Fixed Header */}
      <FixedHeader>
        <HeaderTitle>My Listings</HeaderTitle>
        {userListings.length > 0 && (
          <ManageButton onClick={handleManageToggle}>
            {isManaging ? "Done" : "Manage Listings"}
          </ManageButton>
        )}
      </FixedHeader>

      {/* Main Content */}
      <BodyContainer>
        {userListings.length === 0 ? (
          <ListYourPlaceCard
            onButtonClick={handleListYourPlaceClick}
            currentUser={currentUser}
          />
        ) : (
          <>
            <ListingsContainer>
              {userListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  data={listing}
                  isManaging={isManaging}
                  onUpdate={handleUpdateListing}
                  onRemove={() => openDeleteModal(listing.id)} // Open modal on delete
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

        {/* Delete Account Modal */}
        {isDeleteModalOpen && (
          <DeleteAccountModal
            onCancel={cancelDelete}
            onConfirm={confirmDelete}
            title="Confirm Deletion"
            message="Are you sure you want to delete this listing?"
            animate={true}
            requiresPassword={false} // Set to true if password confirmation is needed
          />
        )}
      </BodyContainer>
    </>
  );
};

export default ListingView;
