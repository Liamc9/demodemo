// ConfirmDeleteModal.js
import React from "react";
import styled from "styled-components";
import { DeleteModal } from "liamc9npm";

const ConfirmDeleteModal = ({ onCancel, onConfirm }) => (
  <ConfirmModalOverlay>
    <DeleteModal
      title="Confirm Delete"
      message="Are you sure you want to delete this item?"
      onCancel={onCancel}
      onConfirm={onConfirm}
      className="w-48 bg-blue-500"
    />
  </ConfirmModalOverlay>
);

export default ConfirmDeleteModal;

const ConfirmModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;
