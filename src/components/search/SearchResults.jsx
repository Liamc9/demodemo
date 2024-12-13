import React from 'react';

const SearchResults = ({
  results,
  loading,
  error,
  page,
  onPageChange,
  hasNextPage,
  renderResult,
}) => {
  const handleNextPage = () => {
    onPageChange(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      onPageChange(page - 1);
    }
  };
  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-red-500">
        Error: {error.message}
      </div>
    );
  if (!results.length)
    return <div className="text-center py-4">No results found</div>;

  return (
    <div className="p-4">
      <ul className="grid md:grid-cols-2 grid-cols-1 gap-4 md:gap-6">
        {results.map((result, index) => (
          <li key={index}>
            {renderResult(result)}
          </li>
        ))}
      </ul>
      <div className="flex justify-center items-center space-x-4 py-4">
      <button
        onClick={handlePreviousPage}
        disabled={page === 0}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Previous
      </button>
      <span className="text-gray-700 font-semibold">Page {page + 1}</span>
      <button
        onClick={handleNextPage}
        disabled={!hasNextPage}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Next
      </button>
    </div>
    </div>
  );
};

export default SearchResults;
