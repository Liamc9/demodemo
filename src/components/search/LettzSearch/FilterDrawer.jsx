// FilterDrawer.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SelectInput from "../../atoms/inputs/SelectInput";
import CheckedItem from "../../CheckedItem";
import RangeSlider from "../../atoms/inputs/RangeSlider";
import { HomeIcon } from "../../icons/Icons";

// Styled Components
const DrawerContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  padding-bottom: 64px; /* To ensure content doesn't overlap with the button bar */
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px; /* Add consistent spacing between inputs */
  margin-bottom: 64px; /* To ensure content doesn't overlap with the button bar */
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const FixedButtonBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const Button = styled.button`
  padding: 8px 16px;
  font-size: 18px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) => (props.primary ? "#A855F7" : "#e0e0e0")};
  color: ${(props) => (props.primary ? "#fff" : "#333")};
`;

// Constants for Months and Counties
const MONTHS = [
  { value: "jan", label: "Jan" },
  { value: "feb", label: "Feb" },
  { value: "mar", label: "Mar" },
  { value: "apr", label: "Apr" },
  { value: "may", label: "May" },
  { value: "jun", label: "Jun" },
  { value: "jul", label: "Jul" },
  { value: "aug", label: "Aug" },
  { value: "sep", label: "Sep" },
  { value: "oct", label: "Oct" },
  { value: "nov", label: "Nov" },
  { value: "dec", label: "Dec" },
];

const COUNTIES = [
  "Carlow",
  "Cavan",
  "Clare",
  "Cork",
  "Derry",
  "Donegal",
  "Down",
  "Dublin",
  "Fermanagh",
  "Galway",
  "Kerry",
  "Kildare",
  "Kilkenny",
  "Laois",
  "Leitrim",
  "Limerick",
  "Longford",
  "Louth",
  "Mayo",
  "Meath",
  "Monaghan",
  "Offaly",
  "Roscommon",
  "Sligo",
  "Tipperary",
  "Tyrone",
  "Waterford",
  "Westmeath",
  "Wexford",
  "Wicklow",
  // Add more counties if necessary
];

const TYPE_OPTIONS = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "room", label: "Room" },
  // Add more types if necessary
];

const FilterDrawer = ({
  selectedFilters,
  onFilterChange,
  closeDrawer,
  sortOptions = [], // Default to an empty array
  selectedSortOption,
  onSortChange,
}) => {
  const [localFilters, setLocalFilters] = useState(selectedFilters || {});
  const [localSortOption, setLocalSortOption] = useState(selectedSortOption || "");

  // Update local state when selectedFilters prop changes
  useEffect(() => {
    setLocalFilters(selectedFilters || {});
  }, [selectedFilters]);

  // Update local sort option when selectedSortOption prop changes
  useEffect(() => {
    setLocalSortOption(selectedSortOption || "");
  }, [selectedSortOption]);

  const handleFilterChange = (key, value) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleTypeChange = (type, isChecked) => {
    setLocalFilters((prevFilters) => {
      const currentTypes = prevFilters.type || [];
      if (isChecked) {
        // Add the type if it's not already in the array
        if (!currentTypes.includes(type)) {
          return {
            ...prevFilters,
            type: [...currentTypes, type],
          };
        }
      } else {
        // Remove the type from the array
        return {
          ...prevFilters,
          type: currentTypes.filter((t) => t !== type),
        };
      }
      return prevFilters;
    });
  };

  const handleSortChangeLocal = (event) => {
    setLocalSortOption(event.target.value);
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onSortChange(localSortOption);
    closeDrawer();
  };

  const handleClear = () => {
    setLocalFilters({});
    setLocalSortOption("");
    onFilterChange({});
    onSortChange("");
    closeDrawer();
  };

  return (
    <DrawerContainer>
      <InputContainer>
        {/* County Filter */}
        <SelectInput
          name="county"
          label="County"
          color="#A855F7"
          value={localFilters.county || ""}
          onChange={(e) => handleFilterChange("county", e.target.value)}
          options={[
            { value: "", label: "Any County" },
            ...COUNTIES.map((county) => ({
              value: county,
              label: county,
            })),
          ]}
        />

        {/* Start and End Month Filters */}
        <div className="grid grid-cols-2 gap-4">
          {/* Start Month Filter */}
          <SelectInput
            name="startMonth"
            label="From"
            color="#A855F7"
            value={localFilters.startMonth || ""}
            onChange={(e) => handleFilterChange("startMonth", e.target.value)}
            options={[
              { value: "", label: "Any" },
              ...MONTHS.map((month) => ({
                value: month.value,
                label: month.label,
              })),
            ]}
          />

          {/* End Month Filter */}
          <SelectInput
            name="endMonth"
            label="To"
            color="#A855F7"
            value={localFilters.endMonth || ""}
            onChange={(e) => handleFilterChange("endMonth", e.target.value)}
            options={[
              { value: "", label: "Any" },
              ...MONTHS.map((month) => ({
                value: month.value,
                label: month.label,
              })),
            ]}
          />
        </div>

        {/* Rent Range Filter */}
        <div className="mx-8">
          <RangeSlider
            min={0}
            max={5000}
            step={50}
            minimumGap={100}
            label="Rent"
            valuePrefix="€"
            value={localFilters.rentRange || [0, 5000]}
            onChange={(range) => handleFilterChange("rentRange", range)}
          />
        </div>

        {/* Type Filter - Multi Select with Checkboxes */}
        <CheckboxGroup>
          {TYPE_OPTIONS.map((typeOption) => (
            <CheckedItem
              height="5rem"
              width="5rem"
              color="#A855F7"
              key={typeOption.value}
              label={typeOption.label}
              onChange={(e) => handleTypeChange(typeOption.value, e.target.checked)}
              checked={localFilters.type && localFilters.type.includes(typeOption.value)}
              svg={<HomeIcon className="w-6 h-6" />}
            />
          ))}
        </CheckboxGroup>

        {/* Sort By */}
        <SelectInput
          name="sort"
          label="Sort By"
          color="#A855F7"
          value={localSortOption}
          onChange={handleSortChangeLocal}
          options={sortOptions}
        />
      </InputContainer>

      <FixedButtonBar>
        <Button onClick={handleClear}>Clear</Button>
        <Button primary onClick={handleApply}>
          Apply
        </Button>
      </FixedButtonBar>
    </DrawerContainer>
  );
};

export default FilterDrawer;
