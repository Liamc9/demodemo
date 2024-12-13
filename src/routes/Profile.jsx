// src/components/ProfileData.js

import React, { useState, useEffect, useRef } from "react";
import ProfileView from "../components/Views/ProfileView";
import { useAuth } from "../context/AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc, getDoc, writeBatch } from "firebase/firestore";
import { getAuth, deleteUser, GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const { currentUser, userData, updateUserData, logout } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [newProfilePicFile, setNewProfilePicFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const storage = getStorage();
  const firestore = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.displayName || "");
      setProfilePic(userData.photoURL || "https://via.placeholder.com/120");
    }
  }, [userData]);

  const handleProfilePicSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, and GIF files are allowed.");
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size exceeds 5MB.");
        return;
      }

      setNewProfilePicFile(file);
      const previewURL = URL.createObjectURL(file);
      setProfilePic(previewURL);
    }
  };

  useEffect(() => {
    return () => {
      if (newProfilePicFile) {
        URL.revokeObjectURL(profilePic);
      }
    };
  }, [newProfilePicFile, profilePic]);

  const handleSaveChanges = async () => {
    if (!firstName.trim()) {
      toast.error("First name cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);

      let downloadURL = userData.photoURL || "https://via.placeholder.com/120";

      if (newProfilePicFile) {
        const storageRef = ref(storage, `profile_pictures/${currentUser.uid}/${newProfilePicFile.name}`);
        await uploadBytes(storageRef, newProfilePicFile);
        downloadURL = await getDownloadURL(storageRef);
      }

      const docRef = doc(firestore, "users", currentUser.uid);

      // Determine if profile is complete
      // For example: If firstName is not empty and profilePic is not a placeholder, consider it complete
      const isProfileComplete = firstName.trim() !== "" && downloadURL !== "https://via.placeholder.com/120";

      await updateDoc(docRef, {
        displayName: firstName,
        photoURL: downloadURL,
        profileComplete: isProfileComplete,
      });

      await updateUserData({
        displayName: firstName,
        photoURL: downloadURL,
        profileComplete: isProfileComplete,
      });

      setNewProfilePicFile(null);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found.");
      }

      const providerData = user.providerData;
      if (providerData.length === 0) {
        throw new Error("No provider data available.");
      }

      const providerId = providerData[0].providerId;

      if (providerId === "google.com") {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
      } else {
        throw new Error(`Unsupported provider: ${providerId}`);
      }

      const userDocRef = doc(firestore, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error("User document does not exist.");
      }

      const userDocData = userDocSnap.data();
      const listings = userDocData.listings || [];

      const batch = writeBatch(firestore);

      listings.forEach((listingId) => {
        const listingDocRef = doc(firestore, "listings", listingId);
        batch.delete(listingDocRef);
      });

      batch.delete(userDocRef);
      await batch.commit();

      await deleteUser(user);

      await logout();
      toast.success("Account and associated listings deleted successfully.");
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete account and listings:", error);

      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else if (error.code === "auth/requires-recent-login") {
        toast.error("Please re-authenticate to delete your account.");
      } else if (error.message.includes("Unsupported provider")) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete account. Please try again later.");
      }
    } finally {
      setShowDeleteModal(false);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
  };

  const handleNavigateBack = () => {
    navigate(`/settings/${currentUser?.uid}`);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <ProfileView
      firstName={firstName}
      setFirstName={setFirstName}
      profilePic={profilePic}
      triggerFileInput={triggerFileInput}
      handleProfilePicSelect={handleProfilePicSelect}
      fileInputRef={fileInputRef}
      handleSaveChanges={handleSaveChanges}
      isSaving={isSaving}
      handleNavigateBack={handleNavigateBack}
      handleDeleteAccount={handleDeleteAccount}
      showDeleteModal={showDeleteModal}
      cancelDeleteAccount={cancelDeleteAccount}
      confirmDeleteAccount={confirmDeleteAccount}
    />
  );
};

export default Profile;
