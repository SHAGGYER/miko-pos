import React from "react";
import styled from "styled-components";
import { v4 } from "uuid";

export const ErrorStyle = styled.span`
  color: #de1511;
  text-align: left;
`;

const FloatingTextFieldStyled = styled.div`
  &.field {
    display: flex;
    flex-flow: column-reverse;
    min-width: 100px;
  }

  label,
  input {
    transition: all 0.2s ease-in-out;
  }

  input {
    font-size: 1.25rem;
    border: 0;
    border-bottom: 1px solid #ccc;
    padding: 0.25rem 0;
    width: 100%;
  }

  input:focus {
    outline: 0;
    border-bottom: 1px solid #3d5471;
  }

  label {
    color: #3d5471;
  }

  input:placeholder-shown + label {
    cursor: text;
    max-width: 66.66%;
    transform-origin: left bottom;
    transform: translate(0, 1.6rem) scale(1.25);
  }

  input::placeholder {
    opacity: 0;
    transition: inherit;
  }

  input:not(:placeholder-shown) + label,
  input:focus + label {
    transform: translate(0, 0) scale(1);
  }
`;

function FloatingTextField({
  label,
  autoFocus,
  onChange,
  onClick,
  onFocus,
  onBlur,
  value,
  type,
  error,
  width,
  readOnly,
}) {
  const uuid = v4();

  return (
    <FloatingTextFieldStyled className="field" style={{ width }}>
      {!!error && <ErrorStyle>{error}</ErrorStyle>}
      <input
        autoFocus={autoFocus}
        readOnly={readOnly}
        id={uuid}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        type={type}
        value={value}
        onChange={onChange}
        placeholder="Type here..."
      />

      <label htmlFor={uuid}>{label}</label>
    </FloatingTextFieldStyled>
  );
}

export default FloatingTextField;
