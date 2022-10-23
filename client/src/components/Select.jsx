import React from "react";
import styled from "styled-components";
import { ErrorStyle } from "./FloatingTextField";

export const LabelStyle = styled.label`
  display: block;
  transform: scale(0.75);
  color: #0c5460;
  margin-bottom: 0.25rem;
`;

const SelectStyle = styled.select`
  border: 1px solid #0c5460;
  padding: 0.75rem;
  width: 100%;
`;

function Select({ label, value, onChange, error, children, className }) {
  return (
    <div style={{ width: "100%" }}>
      {label && <LabelStyle>{label}</LabelStyle>}
      <div style={{ display: "flex", alignItems: "center" }}>
        <SelectStyle value={value} onChange={onChange} className={className}>
          {children}
        </SelectStyle>
      </div>
      {error && <ErrorStyle>{error}</ErrorStyle>}
    </div>
  );
}

export default Select;
