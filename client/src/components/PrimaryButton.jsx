import React from "react";
import styled from "styled-components";

export const PrimaryButton = styled.button`
  background-color: #0c5460;
  border: none;
  padding: 0.5rem 2rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 17px;
  transition: all 0.3s ease-in-out;

  :disabled {
    cursor: not-allowed;
    opacity: 0.25;
  }

  :hover:not(:disabled) {
    background-color: #ccc;
  }

  cursor: ${(props) => (!!props.$loading ? "not-allowed" : "pointer")};
`;
