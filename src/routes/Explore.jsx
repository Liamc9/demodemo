// Explore.js
import React, {useState} from "react";
import SearchPageDrawer from "../components/search/LettzSearch/SearchPageDrawer";
import { collection, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase-config";

const Explore = () => {
  const [listingsSnapshot, loading, error] = useCollection(query(collection(db, "listings")));

  const listings = listingsSnapshot?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) || [];

 
  return (
    <SearchPageDrawer
      searchResults={listings}
      loading={loading}
      error={error ? "Failed to load listings. Please try again later." : null}
    />
  );
};

export default Explore;
