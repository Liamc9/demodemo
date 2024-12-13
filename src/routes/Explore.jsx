// Explore.js
import React from "react";
import SearchPageDrawer from "../components/search/LettzSearch/SearchPageDrawer";
import { collection, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase-config";

const Explore = () => {
  const listingsQuery = query(collection(db, "listings"));
  const [listingsSnapshot, loading, error] = useCollection(listingsQuery);

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
