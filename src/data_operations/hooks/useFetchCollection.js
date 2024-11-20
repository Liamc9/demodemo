// hooks/useFetchCollection.js
import { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, onSnapshot } from 'firebase/firestore';

const useFetchCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Indicates data is being fetched
  const [error, setError] = useState(null); // Holds any error that occurs

  useEffect(() => {
    const collectionRef = collection(db, collectionName);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(results);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
};

export default useFetchCollection;
