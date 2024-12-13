// SearchPageDrawer.js
import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import GhostLoader from "../../GhostLoader";
import BottomDrawer from "../../Drawers/BottomDrawer";
import FilterDrawer from "./FilterDrawer";
import SearchButton from "./SearchButton";
import ListingCard from "../../cards/ListingCard";

const ResultsWrapper = styled.div`
  background-color: #f9f9f9;
  margin-top: 100px; /* Ensure content is below the buttons */
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #ffffff; /* Ensure a consistent background */
  position: fixed; /* Fixed position to stay on top of the viewport */
  top: 0; /* Align to the top of the viewport */
  width: 100%; /* Full-width to match the viewport */
  z-index: 20; /* High z-index to stay above other elements */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional shadow for separation */
  border-bottom: 1px solid #e0e0e0; /* Optional border for visual distinction */
`;

// Mapping of three-letter lowercase month abbreviations to their numerical values
const monthToNumber = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

// Mapping of month abbreviations to labels for display
const monthAbbrToLabel = {
  jan: "Jan",
  feb: "Feb",
  mar: "Mar",
  apr: "Apr",
  may: "May",
  jun: "Jun",
  jul: "Jul",
  aug: "Aug",
  sep: "Sep",
  oct: "Oct",
  nov: "Nov",
  dec: "Dec",
};

const SearchPageDrawer = ({ searchResults = [] }) => {
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [cardsLoading, setCardsLoading] = useState(false); // New state for card loading

  const handleFilterDrawerOpen = () => setFilterDrawerOpen(true);
  const handleFilterDrawerClose = () => setFilterDrawerOpen(false);

  const handleFilterChange = (filters) => {
    console.log("Applied Filters:", filters); // Debugging
    setSelectedFilters(filters);
    setFilterDrawerOpen(false); // Close filter drawer
  };

  const handleSortChange = (newSortOption) => {
    console.log("Selected Sort Option:", newSortOption); // Debugging
    setSelectedSortOption(newSortOption);
  };
 // Simulate loading when filters or sorting options change
 useEffect(() => {
  if (selectedFilters || selectedSortOption) {
    setCardsLoading(true);
    // Simulate a delay for loading
    const timeout = setTimeout(() => {
      setCardsLoading(false);
    }, 500); // 500ms delay
    return () => clearTimeout(timeout);
  }
}, [selectedFilters, selectedSortOption]);

  // Compute filtered and sorted results using useMemo for optimization
  const sortedResults = useMemo(() => {
    // Helper function to convert month abbreviation to number
    const getMonthNumber = (monthAbbr) => {
      if (!monthAbbr) return null;
      const normalized = monthAbbr.toLowerCase().substring(0, 3); // Ensure it's a three-letter lowercase abbreviation
      return monthToNumber[normalized] || null;
    };

    // Filter results based on search term and selected filters
    const filtered = searchResults.filter((result) => {
      // Apply search term filter if needed (currently not in UI)
      const matchesQuery =
        !searchTerm ||
        result.title.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesQuery) return false;

      // Initialize variables for date filtering
      let matchesDateFilters = true;

      const { startMonth, endMonth, ...otherFilters } = selectedFilters;

      // Handle startMonth and endMonth separately for outside range filtering
      if (startMonth || endMonth) {
        // Ensure the result has a startDate
        if (!result.startDate) {
          matchesDateFilters = false;
        } else {
          const resultMonth = getMonthNumber(result.startDate);
          if (!resultMonth) {
            // Invalid month abbreviation in result.startDate
            matchesDateFilters = false;
          } else {
            let condition = false;

            if (startMonth) {
              const filterStartMonth = getMonthNumber(startMonth);
              if (filterStartMonth) {
                // Check if resultMonth is on or before startMonth
                if (resultMonth <= filterStartMonth) {
                  condition = true;
                }
              }
            }

            if (endMonth) {
              const filterEndMonth = getMonthNumber(endMonth);
              if (filterEndMonth) {
                // Check if resultMonth is on or after endMonth
                if (resultMonth >= filterEndMonth) {
                  condition = true;
                }
              }
            }

            // Final condition: at least one of the conditions must be true (OR)
            if (!condition) {
              matchesDateFilters = false;
            }
          }
        }
      }

      if (!matchesDateFilters) return false;

      // Apply other selected filters
      let matchesOtherFilters = true;
      for (const [filterKey, filterValue] of Object.entries(otherFilters)) {
        if (
          filterValue !== undefined &&
          filterValue !== null &&
          filterValue.length !== 0 &&
          filterValue !== ""
        ) {
          if (filterKey === "type") {
            // Handle multi-select type filter
            if (
              !Array.isArray(filterValue) || // Ensure filterValue is an array
              (Array.isArray(filterValue) && filterValue.length === 0)
            ) {
              // If filterValue is not an array or is empty, skip filtering by type
              continue;
            }
            // Ensure result.type is a string
            if (typeof result.type !== "string") {
              matchesOtherFilters = false;
              break;
            }
            // Case-insensitive comparison
            const resultType = result.type.toLowerCase();
            const selectedTypes = filterValue.map((type) => type.toLowerCase());
            if (!selectedTypes.includes(resultType)) {
              matchesOtherFilters = false;
              break;
            }
          } else if (filterKey === "rentRange") {
            // Handle range filter
            const [minRent, maxRent] = filterValue;
            if (result.rent < minRent || result.rent > maxRent) {
              matchesOtherFilters = false;
              break;
            }
          } else {
            // Handle direct equality filters (e.g., county)
            if (
              typeof result[filterKey] === "string" &&
              typeof filterValue === "string"
            ) {
              if (
                result[filterKey].toLowerCase() !== filterValue.toLowerCase() &&
                filterValue !== ""
              ) {
                matchesOtherFilters = false;
                break;
              }
            } else {
              // For non-string fields, use strict equality
              if (result[filterKey] !== filterValue && filterValue !== "") {
                matchesOtherFilters = false;
                break;
              }
            }
          }
        }
      }

      return matchesOtherFilters;
    });

    console.log("Filtered Results Count:", filtered.length); // Debugging

    // Sort the filtered results
    const sorted = [...filtered];
    if (selectedSortOption) {
      sorted.sort((a, b) => {
        switch (selectedSortOption) {
          case "title_asc":
            return a.title.localeCompare(b.title);
          case "title_desc":
            return b.title.localeCompare(a.title);
          case "rent_lowest":
            return a.rent - b.rent;
          case "rent_highest":
            return b.rent - a.rent;
          default:
            return 0;
        }
      });
    }

    return sorted;
  }, [searchResults, searchTerm, selectedFilters, selectedSortOption]);

  // Define sort options to pass to FilterDrawer
  const sortOptions = [
    { value: "", label: "None" },
    { value: "title_asc", label: "Title (A-Z)" },
    { value: "title_desc", label: "Title (Z-A)" },
    { value: "rent_lowest", label: "Rent (Lowest First)" },
    { value: "rent_highest", label: "Rent (Highest First)" },
  ];

  // Helper function to get month label from abbreviation
  const getMonthLabel = (monthAbbr) => {
    return monthAbbrToLabel[monthAbbr.toLowerCase()] || "";
  };

  // Compute display values for SearchButton
  const displayCounty = selectedFilters.county || "Anywhere";
  const displayStartDate = selectedFilters.startMonth
    ? getMonthLabel(selectedFilters.startMonth)
    : "Anytime";
  const displayEndDate = selectedFilters.endMonth
    ? getMonthLabel(selectedFilters.endMonth)
    : "";

  return (
    <div>
      <ButtonsContainer>
        <SearchButton
          onClick={handleFilterDrawerOpen}
          place={displayCounty}
          startDate={displayStartDate}
          endDate={displayEndDate}
        />
      </ButtonsContainer>
      {cardsLoading ? (
        <ResultsWrapper>
          <GhostLoader /> {/* Show GhostLoader while cards are loading */}
        </ResultsWrapper>
      ) : sortedResults.length > 0 ? (
        <ResultsWrapper>
          {sortedResults.map((result) => (
            <ListingCard key={result.id} data={result}/>
          ))}
        </ResultsWrapper>
      ) : (
        <ResultsWrapper>
          <h3>No Results Found</h3>
        </ResultsWrapper>
      )}
      <BottomDrawer
        isOpen={isFilterDrawerOpen}
        onClose={handleFilterDrawerClose}
        transitionDuration={300}
        height="90%"
      >
        <FilterDrawer
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          closeDrawer={handleFilterDrawerClose}
          selectedSortOption={selectedSortOption}
          onSortChange={handleSortChange}
          sortOptions={sortOptions}
        />
      </BottomDrawer>
    </div>
  );
};

export default SearchPageDrawer;
