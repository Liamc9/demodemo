import React, { useState } from "react";
import styled from "styled-components";
import BottomDrawer from "../Drawers/BottomDrawer";
import SearchDrawer from "./SearchDrawer";
import FilterDrawer from "./FilterDrawer";
import SearchButton from "./SearchButton";
import FilterButton from "./FilterButton";
import SearchResultItem from "./SearchResultItem";

// Styled components...
const ResultsWrapper = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SearchPageDrawer = ({
  trendingItems,
  searchResults,
  filters,       // Now passed as a prop
  sortOptions,   // Now passed as a prop
}) => {
  const [isSearchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Separate states for the search input and the search term used for filtering
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedSortOption, setSelectedSortOption] = useState("");

  // Handlers for opening and closing drawers
  const handleSearchDrawerOpen = () => setSearchDrawerOpen(true);
  const handleSearchDrawerClose = () => setSearchDrawerOpen(false);

  const handleFilterDrawerOpen = () => setFilterDrawerOpen(true);
  const handleFilterDrawerClose = () => setFilterDrawerOpen(false);

  // Handler for search input change in the drawer
  const handleQueryChange = (newQuery) => {
    setSearchInput(newQuery);
  };

  // Handler for submitting the search
  const handleSearchSubmit = () => {
    setSearchTerm(searchInput); // Update the search term for filtering main results
    setSearchInput(""); // Clear the search input in the drawer
    setSelectedFilters({}); // Reset filters when a new search is submitted
    setSelectedSortOption(""); // Reset sort option if desired
    setSearchDrawerOpen(false); // Close search drawer
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
    setFilterDrawerOpen(false); // Close filter drawer
  };

  const handleSortChange = (newSortOption) => {
    setSelectedSortOption(newSortOption);
  };

  // Compute filtered results based on searchTerm and selected filters
  const filteredResults = searchResults.filter((result) => {
    // Apply searchTerm filtering
    const matchesQuery =
      searchTerm === "" ||
      result.title.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesQuery) {
      return false;
    }

    // Apply filters
    let matchesFilters = true;
    for (const [filterKey, filterValue] of Object.entries(selectedFilters)) {
      if (
        filterValue !== undefined &&
        filterValue !== null &&
        filterValue !== ""
      ) {
        if (typeof filterValue === "boolean") {
          // Handle toggle filters
          if (result[filterKey] !== filterValue) {
            matchesFilters = false;
            break;
          }
        } else {
          // Handle other filters
          if (result[filterKey] !== filterValue) {
            matchesFilters = false;
            break;
          }
        }
      }
    }

    return matchesFilters;
  });

  // Apply sorting to the filtered results
  const sortedResults = [...filteredResults]; // Create a copy to avoid mutating the original array

  if (selectedSortOption) {
    sortedResults.sort((a, b) => {
      switch (selectedSortOption) {
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        case "date_newest":
          return new Date(b.date) - new Date(a.date);
        case "date_oldest":
          return new Date(a.date) - new Date(b.date);
        default:
          return 0;
      }
    });
  }

  // Custom renderer for search results
  const renderSearchResult = (result, index) => (
    <SearchResultItem key={index} data={result} />
  );

  // Custom renderer for trending items
  const renderTrendingItem = (item, index) => (
    <SearchResultItem
      key={index}
      data={{
        title: item,
        description: "Trending topic",
        thumbnail: null,
      }}
    />
  );

  return (
    <div>
      <ButtonsContainer>
        <SearchButton onClick={handleSearchDrawerOpen} />
        <FilterButton onClick={handleFilterDrawerOpen} />
      </ButtonsContainer>
      {sortedResults.length > 0 ? (
        <ResultsWrapper>
          <h3>Search Results</h3>
          {sortedResults.map((result, index) =>
            renderSearchResult(result, index)
          )}
        </ResultsWrapper>
      ) : (
        <ResultsWrapper>
          <h3>No Results Found</h3>
        </ResultsWrapper>
      )}
      {/* Search Drawer */}
      <BottomDrawer
        isOpen={isSearchDrawerOpen}
        onClose={handleSearchDrawerClose}
        transitionDuration={100}
        height="100vh"
      >
        <SearchDrawer
          trendingItems={trendingItems}
          query={searchInput} // Use searchInput for the input field
          onQueryChange={handleQueryChange}
          searchResults={searchResults} // Pass full search results
          closeDrawer={handleSearchDrawerClose}
          onSearchSubmit={handleSearchSubmit}
          renderSearchResult={renderSearchResult}
          renderTrendingItem={renderTrendingItem}
          isOpen={isSearchDrawerOpen} // Pass isOpen prop to SearchDrawer
        />
      </BottomDrawer>
      {/* Filter Drawer */}
      <BottomDrawer
        isOpen={isFilterDrawerOpen}
        onClose={handleFilterDrawerClose}
        transitionDuration={300}
        height="60vh"
      >
        <FilterDrawer
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          closeDrawer={handleFilterDrawerClose}
          sortOptions={sortOptions}
          selectedSortOption={selectedSortOption}
          onSortChange={handleSortChange}
        />
      </BottomDrawer>
    </div>
  );
};

export default SearchPageDrawer;
