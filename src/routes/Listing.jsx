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
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, list } from "firebase/storage";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
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
        // Update existing listing
        await updateDoc(doc(firestore, "listings", editingListing.id), {
          ...formData,
          images: combinedImages,
          title,
        });
        toast.success("Listing updated successfully!");
      } else {
        // Add new listing
        const listingDoc = await addDoc(collection(firestore, "listings"), {
          ...formData,
          images: combinedImages,
          userId: currentUser.uid,
          photoURL: userData.photoURL,
          title,
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

  const handleRemoveListing = async (listingId) => {
    if (!currentUser) {
      toast.error("You must be logged in.");
      return;
    }

    if (!window.confirm("Are you sure you want to remove this listing?")) return;

    try {
      await deleteDoc(doc(firestore, "listings", listingId));
      if (currentUser) {
        await updateDoc(doc(db, "users", currentUser.uid), { listings: arrayRemove(listingId) });
      }
      toast.success("Listing removed successfully!");
    } catch (e) {
      console.error("Error removing listing:", e);
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
