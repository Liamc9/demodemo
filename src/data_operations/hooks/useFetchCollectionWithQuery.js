// hooks/useFetchCollectionWithQuery.js
import { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, query, onSnapshot } from 'firebase/firestore';

const useFetchCollectionWithQuery = (collectionName, queryConstraints) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...queryConstraints);

    const unsubscribe = onSnapshot(
      q,
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

    return () => unsubscribe();
  }, [collectionName, queryConstraints]);

  return { data, loading, error };
};

export default useFetchCollectionWithQuery;
