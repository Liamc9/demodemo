// src/components/Listing.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  addDoc,
  collection,
  getFirestore,
  query,
  where,
  serverTimestamp,
  getDocs,
  writeBatch, // Import writeBatch for batch operations
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase-config";
import { useAuth } from "../context/AuthContext";
import ListingView from "../components/Views/ListingView"; // Corrected import path
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const firestore = getFirestore();
const storage = getStorage();

const Listing = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const userDisplayName = userData?.displayName || "";
  const profileComplete = userData?.profileComplete || false;
  const listingIds = userData?.listings || [];
  const [listings, setListings] = useState([]);

  // Firestore query using useCollection
  const [listingsSnapshot, listingsLoading, listingsError] = useCollection(
    listingIds.length > 0
      ? query(
          collection(db, "listings"),
          where("__name__", "in", listingIds)
        )
      : null // If no listing IDs, don't run the query
  );

  // Update listings state when snapshot changes
  useEffect(() => {
    if (listingsSnapshot) {
      setListings(
        listingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    }
  }, [listingsSnapshot]);

  const uploadImagesToStorage = async (images) => {
    try {
      const urls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(storage, `listings/${image.name}-${Date.now()}`);
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        })
      );
      return urls;
    } catch (e) {
      console.error("Error uploading images:", e);
      toast.error("Error uploading images.");
      return [];
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const existingImageUrls = formData.images.filter(
        (img) => typeof img === "string" && img.startsWith("http")
      );
      const newFiles = formData.images.filter((img) => img instanceof File);
      const uploadedUrls = newFiles.length > 0 ? await uploadImagesToStorage(newFiles) : [];
      const combinedImages = [...existingImageUrls, ...uploadedUrls];
      const title = `${userDisplayName}'s ${formData.type}`;

      if (editingListing) {
        // Update existing listing with updatedAt timestamp
        await updateDoc(doc(firestore, "listings", editingListing.id), {
          ...formData,
          images: combinedImages,
          title,
          updatedAt: serverTimestamp(), // Add updatedAt field
        });
        toast.success("Listing updated successfully!");
      } else {
        // Add new listing with createdAt timestamp
        const listingDoc = await addDoc(collection(firestore, "listings"), {
          ...formData,
          images: combinedImages,
          userId: currentUser.uid,
          photoURL: userData.photoURL,
          title,
          createdAt: serverTimestamp(), // Add createdAt field
        });
        if (currentUser) {
          await updateDoc(doc(db, "users", currentUser.uid), { listings: arrayUnion(listingDoc.id) });
        }
        toast.success("Listing added successfully!");
      }

      setIsDrawerOpen(false);
      setEditingListing(null);
    } catch (e) {
      console.error("Error handling form submission:", e);
      toast.error("An error occurred. Please try again.");
    }
  };

  /**
   * Enhanced handleRemoveListing to also delete related conversations
   * and update users' conversationIDs arrays accordingly.
   */
  const handleRemoveListing = async (listingId) => {
    if (!currentUser) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    const batch = writeBatch(firestore);
    try {
      // Step 1: Delete the listing document
      const listingRef = doc(firestore, "listings", listingId);
      batch.delete(listingRef);

      // Step 2: Query conversations with listingId equal to the deleted listing
      const conversationsQuery = query(
        collection(firestore, "conversations"),
        where("listingId", "==", listingId)
      );

      const conversationsSnapshot = await getDocs(conversationsQuery);

      // Array to hold all conversation IDs to be deleted
      const conversationIdsToDelete = [];

      // Map to hold conversation ID to participant UIDs
      const conversationIdToParticipants = new Map();

      conversationsSnapshot.forEach((conversationDoc) => {
        const convoId = conversationDoc.id;
        const convoData = conversationDoc.data();
        conversationIdsToDelete.push(convoId);
        
        // Extract participant UIDs
        const participants = convoData.participants.map(participant => participant.uid);
        conversationIdToParticipants.set(convoId, participants);

        // Delete each conversation
        const convoRef = doc(firestore, "conversations", convoId);
        batch.delete(convoRef);
      });

      // If there are no conversations to delete, proceed to update user listings
      if (conversationIdsToDelete.length === 0) {
        // Remove the listing ID from the user's listings array
        batch.update(doc(firestore, "users", currentUser.uid), {
          listings: arrayRemove(listingId),
        });

        // Commit the batch
        await batch.commit();
        toast.success("Listing removed successfully!");
        return;
      }

      // Step 3: For each conversation ID, remove it from each participant's conversationIDs array
      conversationIdsToDelete.forEach((convoId) => {
        const participants = conversationIdToParticipants.get(convoId);
        participants.forEach((uid) => {
          const userRef = doc(firestore, "users", uid);
          batch.update(userRef, {
            conversationIDs: arrayRemove(convoId),
          });
        });
      });

      // Step 4: Remove the listing ID from the user's listings array
      batch.update(doc(firestore, "users", currentUser.uid), {
        listings: arrayRemove(listingId),
      });

      // Commit the batch
      await batch.commit();
      toast.success("Listing and associated conversations removed successfully!");
    } catch (e) {
      console.error("Error removing listing and related data:", e);
      toast.error("Failed to remove listing. Please try again.");
    }
  };

  const handleUpdateListing = (listing) => {
    setEditingListing(listing);
    setIsDrawerOpen(true);
  };

  const handleListYourPlaceClick = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: "/listing" } });
    } else if (!profileComplete) {
      setShowProfileModal(true);
    } else {
      setIsDrawerOpen(true);
    }
  };

  const closeModal = () => setShowProfileModal(false);

  const navigateToProfile = () => navigate(`/profile/${currentUser?.uid}`);

  // Define handleManageToggle to toggle isManaging state
  const handleManageToggle = () => {
    setIsManaging((prev) => !prev);
  };

  return (
    <ListingView
      userListings={listings}
      isManaging={isManaging}
      handleRemoveListing={handleRemoveListing}
      handleUpdateListing={handleUpdateListing}
      handleListYourPlaceClick={handleListYourPlaceClick}
      isDrawerOpen={isDrawerOpen}
      setIsDrawerOpen={setIsDrawerOpen}
      handleFormSubmit={handleFormSubmit}
      editingListing={editingListing}
      showProfileModal={showProfileModal}
      closeModal={closeModal}
      navigateToProfile={navigateToProfile}
      loading={listingsLoading}
      error={listingsError ? "Error loading data." : null} // Simplified error handling
      listingIds={listingIds}
      setEditingListing={setEditingListing}
      handleManageToggle={handleManageToggle} // Passed prop
      currentUser={currentUser} // Passed prop
      userData={userData} // Passed prop
    />
  );
};

export default Listing;
