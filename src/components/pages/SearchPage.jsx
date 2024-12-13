/*import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  startAfter,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../../firebase-config'; // Adjust the path accordingly
import SearchBar from '../search/SearchBar';
import SearchResults from '../search/SearchResults';
import SearchFilters from '../search/SearchFilters';
import SearchSort from '../search/SearchSort'; // Assuming you renamed SortButton to SearchSort
import CardProduct from '../cards/CardProduct';

const PAGE_SIZE = 5;

const SearchPage = () => {
  const [queryText, setQueryText] = useState('');
  const [filters, setFilters] = useState([]);
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const handleSearch = (searchQuery) => {
    setQueryText(searchQuery);
    setPage(0); // Reset to first page on new search
  };

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = prevFilters.filter((filter) => filter.name !== name);
      if (value) {
        updatedFilters.push({ name, value });
      }
      return updatedFilters;
    });
    setPage(0); // Reset to first page on filter change
  };

  const handleSortChange = (sortCriteria) => {
    setSort(sortCriteria);
    setPage(0); // Reset to first page on sort change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        let q = collection(db, 'searchresults');

        if (queryText) {
          q = query(
            q,
            where('name', '>=', queryText),
            where('name', '<=', queryText + '\uf8ff')
          );
        }

        filters.forEach((filter) => {
          if (filter.value) {
            q = query(q, where(filter.name, '==', filter.value));
          }
        });

        if (sort) {
          const [attribute, order] = sort.split(':');
          q = query(q, orderBy(attribute, order));
        }

        q = query(q, limit(PAGE_SIZE));

        if (page > 0 && lastVisible) {
          q = query(q, startAfter(lastVisible));
        }

        const querySnapshot = await getDocs(q);
        const resultsData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include the document ID
          ...doc.data(),
        }));
        setResults(resultsData);

        if (!querySnapshot.empty) {
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setHasNextPage(querySnapshot.docs.length === PAGE_SIZE);
        } else {
          setHasNextPage(false);
        }
      } catch (err) {
        setError(err);
      }

      setLoading(false);
    };

    fetchResults();
  }, [queryText, filters, sort, page]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Search Page</h1>
        <SearchBar onSearch={handleSearch} />
        <div className="flex justify-between items-center mb-4">
          <SearchFilters
            attributes={[
              {
                name: 'gender',
                label: 'Gender',
                options: [
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ],
              },
            ]}
            onFilterChange={handleFilterChange}
          />
          <SearchSort
            attributes={['name', 'gender']}
            onSortChange={handleSortChange}
          />
        </div>
        <SearchResults
          results={results}
          loading={loading}
          error={error}
          page={page}
          onPageChange={handlePageChange}
          hasNextPage={hasNextPage}
          renderResult={(result) => (
            <CardProduct
              title={result.name}
              image={result.image1}
              price={result.gender}
            />
          )}
        />
      </div>
    </div>
  );
};

export default SearchPage;
*/
