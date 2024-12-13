// CustomFileUpload.js
import React from "react";
import styled from "styled-components";

const CustomFileUpload = ({ label, onUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      onUpload(fileUrl);
    }
  };

  return (
    <FileUploadContainer>
      <label>{label}</label>
      <input type="file" onChange={handleFileChange} />
    </FileUploadContainer>
  );
};

export default CustomFileUpload;

const FileUploadContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;
