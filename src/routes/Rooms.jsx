// src/components/Rooms.jsx

import React, { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { doc, serverTimestamp, arrayUnion, writeBatch, getDoc, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { useAuth } from "../context/AuthContext";
import { useDocument } from "react-firebase-hooks/firestore";
import RoomsView from "../components/Views/RoomsView";

const Rooms = () => {
  const { id } = useParams(); // Extract the `id` from the URL parameters
  const { currentUser } = useAuth(); // Access the current user from AuthContext
  const navigate = useNavigate(); // Initialize navigation
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control the drawer
  const [roomData, setRoomData] = useState(null);

    const [roomSnapshot, roomLoading, roomError] = useDocument(
        doc(db, "listings", id),
    );
    useEffect(() => {
        if (roomSnapshot) {
          setRoomData({
            id: roomSnapshot.id, // Include the document ID
            ...roomSnapshot.data(), // Spread the document data
          });        }
    }, [roomSnapshot]);

  const handleSendMessage = () => {
    if (!currentUser) {
      // Redirect to login if the user is not logged in
      navigate("/login", { state: { from: `/rooms/${id}` } });
      return;
    }

    // Open the message form drawer
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSend = async (message) => {
    try {
      if (!roomData) {
        throw new Error("Room data is not available.");
      }

      const senderUID = currentUser.uid;
      const receiverUID = roomData.userId; // Ensure 'userId' is correct in roomData

      // Fetch receiver's user data
      const receiverDocRef = doc(db, "users", receiverUID);
      const receiverDocSnap = await getDoc(receiverDocRef);

      if (!receiverDocSnap.exists()) {
        throw new Error("Receiver user data not found.");
      }

      const receiverData = receiverDocSnap.data();

      const now = serverTimestamp();

      const conversationData = {
        listingId: id,
        participants: [
          {
            uid: senderUID,
            name: currentUser.displayName || "Sender Name",
            avatarUrl: currentUser.photoURL || "",
          },
          {
            uid: receiverUID,
            name: receiverData.displayName || "Receiver Name",
            avatarUrl: receiverData.photoURL || "",
          },
        ],
        messages: [
          {
            sender: senderUID,
            text: message,
            localTimestamp: Date.now(), // Use client-side timestamp
          },
        ],
        lastMessage: {
          text: message,
          timestamp: now, // Server timestamp for last message
        },
        createdAt: now, // Server timestamp for conversation creation
      };

      // Initialize a batch write
      const batch = writeBatch(db);

      // Create a new conversation in 'conversations' collection
      const conversationRef = doc(collection(db, "conversations")); // Auto-generated ID
      batch.set(conversationRef, conversationData);

      const conversationID = conversationRef.id;

      // Update sender's user document (use set with merge)
      const senderDocRef = doc(db, "users", senderUID);
      batch.set(
        senderDocRef,
        {
          conversationIDs: arrayUnion(conversationID),
        },
        { merge: true }
      );

      // Update receiver's user document (use set with merge)
      batch.set(
        receiverDocRef,
        {
          conversationIDs: arrayUnion(conversationID),
        },
        { merge: true }
      );

      // Commit the batch
      await batch.commit();

      // Close the drawer
      closeDrawer();

    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, you can set an error state here to display to the user
      throw error; // Re-throw to let MessageForm handle it
    }
  };

  return (
    <RoomsView
      roomData={roomData}
      isDrawerOpen={isDrawerOpen}
      handleSendMessage={handleSendMessage}
      handleSend={handleSend}
      closeDrawer={closeDrawer}
    />
  );
};

export default Rooms;
