// src/components/MessageForm.jsx

import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify"; // Import toast

const FormContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TextArea = styled.textarea`
  flex: 1;
  resize: none;
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
  outline: none;

  &:focus {
    border-color: #007bff;
  }
`;

const SendButton = styled.button`
  background-color: #28a745;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-end;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const MessageForm = ({ onSend, onClose }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    setSending(true);

    try {
      // Call the onSend function passed from the parent
      await onSend(message);

      // Optionally, close the drawer after sending the message
      onClose();

      // Reset the form
      setMessage("");

      // Show success toast
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send the message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <FormContainer>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <TextArea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
        />
        <SendButton type="submit" disabled={sending}>
          {sending ? "Sending..." : "Send Message"}
        </SendButton>
      </form>
    </FormContainer>
  );
};

export default MessageForm;
