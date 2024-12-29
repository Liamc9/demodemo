// src/components/molecules/ListingForm.jsx

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Input from "../Input";
import CheckedItem from "../CheckedItem";
import { ChevronLeftIcon, HomeIcon } from "../icons/Icons";
import SelectInput from "../atoms/inputs/SelectInput";
import ImageUploading from "./ImageUploading";
import { toast } from "react-toastify"; // Ensure only toast methods are imported
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique IDs


const ListingForm = ({ onClose, onSubmit, initialData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({
    streetAddress: "",
    city: "",
    county: "",
    eircode: "",
    rent: "",
    startDate: "",
    endDate: "",
    type: "",
    description: "",
  });
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        streetAddress: initialData.streetAddress || "",
        city: initialData.city || "",
        county: initialData.county || "",
        eircode: initialData.eircode || "",
        rent: initialData.rent || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        type: initialData.type || "",
        description: initialData.description || "",
      });

      if (initialData.images?.length) {
        setUploadedImages(
          initialData.images.map((url) => ({
            id: uuidv4(), // Assign a unique ID
            file: null,
            preview: url,
            url,
          }))
        );
      }
    }
  }, [initialData]);

  const handleChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setCurrentPage(0);
    setFormData({
      streetAddress: "",
      city: "",
      county: "",
      eircode: "",
      rent: "",
      startDate: "",
      endDate: "",
      type: "",
      description: "",
    });
    uploadedImages.forEach((image) => {
      if (image.preview && image.file) {
        URL.revokeObjectURL(image.preview);
      }
    });
    setUploadedImages([]);
    onClose();
  }, [uploadedImages, onClose]);

  const handleSubmit = useCallback(() => {
    const requiredFields = [
      "streetAddress",
      "city",
      "county",
      "eircode",
      "rent",
      "startDate",
      "endDate",
      "type",
      "description",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field]?.toString().trim()
    );

    if (missingFields.length) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`,
        { position: "top-center", autoClose: 5000 }
      );
      return;
    }

    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one image.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    // Separate existing image URLs and new image Files
    const imageFiles = uploadedImages
      .filter((image) => image.file)
      .map((image) => image.file);
    const imageUrls = uploadedImages
      .filter((image) => image.url)
      .map((image) => image.url);

    // Combine existing URLs with new image Files
    // Depending on backend requirements, you might need to handle these separately
    const combinedImages = [...imageUrls, ...imageFiles];

    const validImages = imageFiles.filter((file) => file instanceof File);
    if (validImages.length !== imageFiles.length) {
      toast.warn("Some images are invalid and will not be submitted.", {
        position: "top-center",
        autoClose: 5000,
      });
    }

    onSubmit({ ...formData, images: combinedImages });
    resetForm();
  }, [formData, uploadedImages, onSubmit, resetForm]);

  const pageHeadings = ["Location", "Sublet Details & Images"];
  const pages = [
    <PageOne key="page1" formData={formData} handleChange={handleChange} />,
    <PageTwo
      key="page2"
      formData={formData}
      handleChange={handleChange}
      uploadedImages={uploadedImages}
      setUploadedImages={setUploadedImages}
    />,
  ];

  const progressPercentage = ((currentPage + 1) / pages.length) * 100;

  const isFormValid = () => {
    const requiredFields = [
      "streetAddress",
      "city",
      "county",
      "eircode",
      "rent",
      "startDate",
      "endDate",
      "type",
      "description",
    ];
    return (
      requiredFields.every((field) => formData[field]?.toString().trim()) &&
      uploadedImages.length > 0
    );
  };

  return (
    <FormContainer>
      {currentPage === 0 && (
        <BackButton onClick={resetForm} aria-label="Close form">
          <ChevronLeftIcon className="w-8 h-8" />
        </BackButton>
      )}
      <Heading>{pageHeadings[currentPage]}</Heading>
      <ProgressBar
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <ProgressFill style={{ width: `${progressPercentage}%` }} />
      </ProgressBar>
      <Content>{pages[currentPage]}</Content>
      <NavButtons hasPrev={currentPage > 0}>
        {currentPage > 0 && (
          <PrevButton onClick={() => setCurrentPage((prev) => prev - 1)}>
            Previous
          </PrevButton>
        )}
        {currentPage < pages.length - 1 ? (
          <NextButton onClick={() => setCurrentPage((prev) => prev + 1)}>
            Next
          </NextButton>
        ) : (
          <SubmitButton onClick={handleSubmit}>
            {initialData ? "Update" : "Submit"}
          </SubmitButton>
        )}
      </NavButtons>
    </FormContainer>
  );
};

// PageOne Component
const PageOne = ({ formData, handleChange }) => (
  <FormSection>
    <SectionHeader>Address</SectionHeader>
    <Input
      name="streetAddress"
      type="text"
      label="Street Address"
      color="#A855F7"
      value={formData.streetAddress}
      onChange={(e) => handleChange("streetAddress", e.target.value)}
      required
    />
    <Input
      name="city"
      type="text"
      label="Town/City"
      color="#A855F7"
      value={formData.city}
      onChange={(e) => handleChange("city", e.target.value)}
      required
    />
    <SelectInput
      name="county"
      label="County"
      value={formData.county}
      onChange={(e) => handleChange("county", e.target.value)}
      color="#A855F7"
      options={countiesOptions}
      required
    />
    <Input
      name="eircode"
      type="text"
      label="Eircode"
      color="#A855F7"
      value={formData.eircode}
      onChange={(e) =>
        handleChange(
          "eircode",
          e.target.value.toUpperCase().replace(/\s/g, "").slice(0, 7)
        )
      }
      required
    />

    <SectionHeader>Property Type</SectionHeader>
    <CheckboxGroup>
      {["House", "Apartment", "Room"].map((type) => (
        <CheckedItem
          key={type}
          label={type}
          height="5rem"
          width="5rem"
          color="#A855F7"
          checked={formData.type === type}
          onChange={() => handleChange("type", type)}
          svg={<HomeIcon className="w-6 h-6" />}
          required
        />
      ))}
    </CheckboxGroup>
  </FormSection>
);

// PageTwo Component
const PageTwo = ({ formData, handleChange, uploadedImages, setUploadedImages }) => (
  <FormSection>
    <SectionHeader>Sublet Details</SectionHeader>
    <Input
      name="rent"
      type="number"
      label="Monthly Rent (€)"
      color="#A855F7"
      value={formData.rent}
      onChange={(e) => handleChange("rent", e.target.value)}
      required
    />
    <DateSelectors>
      {["startDate", "endDate"].map((dateField) => (
        <SelectInput
          key={dateField}
          name={dateField}
          label={dateField === "startDate" ? "Start Date" : "End Date"}
          color="#A855F7"
          value={formData[dateField]}
          onChange={(e) => handleChange(dateField, e.target.value)}
          options={monthsOptions}
          required
        />
      ))}
    </DateSelectors>
    <Input
      name="description"
      type="textarea"
      label="Description"
      color="#A855F7"
      value={formData.description}
      onChange={(e) => handleChange("description", e.target.value)}
      required
    />

    <SectionHeader>Images</SectionHeader>
    <ImageUploading
      uploadedImages={uploadedImages}
      setUploadedImages={setUploadedImages}
      maxImages={6}
      acceptedFormats={["image/jpeg", "image/png", "image/gif"]}
      customMessages={{
        maxLimit: "You can only upload up to {maxImages} images.",
        invalidFormat: "Only JPG, PNG, and GIF formats are allowed.",
        success: "You have successfully uploaded {count} images.",
        rearrange: "You can rearrange the order of images by dragging them.",
      }}
    />
  </FormSection>
);

// Options for Counties and Months
const countiesOptions = [
  "Antrim",
  "Armagh",
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
].map((county) => ({ value: county, label: county }));

const monthsOptions = [
  { value: "", label: "Select Month..." },
  { value: "Jan", label: "Jan" },
  { value: "Feb", label: "Feb" },
  { value: "Mar", label: "Mar" },
  { value: "Apr", label: "Apr" },
  { value: "May", label: "May" },
  { value: "Jun", label: "Jun" },
  { value: "Jul", label: "Jul" },
  { value: "Aug", label: "Aug" },
  { value: "Sept", label: "Sept" },
  { value: "Oct", label: "Oct" },
  { value: "Nov", label: "Nov" },
  { value: "Dec", label: "Dec" },
];

// Styled Components

const FormContainer = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0px auto 40px; /* Added top margin for spacing */
  padding: 20px 30px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  min-height: 80vh; /* Adjusted height for better spacing */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  @media (max-width: 640px) {
    padding: 15px 20px;
    min-height: auto;
  }
`;

const Heading = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.75rem;
  color: #333333;
`;

const Content = styled.div`
  flex: 1;
  margin-bottom: 80px; /* Increased bottom margin for better spacing */
`;

// Progress Bar Styled Components
const ProgressBar = styled.div`
  width: 100%;
  background-color: #e5e7eb;
  height: 8px;
  border-radius: 4px;
  margin-bottom: 24px;
`;

const ProgressFill = styled.div`
  background-color: #a855f7;
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
`;

// Updated NavButtons with Top Border
const NavButtons = styled.div`
  display: flex;
  justify-content: ${({ hasPrev }) => (hasPrev ? "space-between" : "flex-end")};
  padding: 10px 0;
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #e0e0e0;
  z-index: 1000;

  @media (max-width: 640px) {
    padding: 8px 10px;
  }
`;

// Styled Components for Buttons

const PrevButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #d1d5db; /* Gray background */
  color: #fff;
  transition: background-color 0.2s;

  &:hover {
    background-color: #a1a1aa; /* Darker gray on hover */
  }

  @media (max-width: 640px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const NextButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #000000; /* Black background */
  color: #fff;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333333; /* Darker black on hover */
  }

  @media (max-width: 640px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #a855f7; /* Tailwind's purple-500 */
  color: #fff;
  transition: background-color 0.2s;
  /* Removed opacity and pointer-events to keep the button always enabled */

  &:hover {
    background-color: #9333ea; /* Tailwind's purple-600 */
  }

  @media (max-width: 640px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #9333ea;
  }

  @media (max-width: 640px) {
    top: 15px;
    left: 15px;
  }
`;

// Additional Styled Components for Layout
const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const DateSelectors = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

// Section Header Styled Component
const SectionHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
`;

export default ListingForm;
