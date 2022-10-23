import styled from "styled-components";

// Select

export const SelectStyle = styled.select`
  border: 1px solid #ccc;
  padding: 0.75rem;
  font-size: 18px;
  width: 100%;
  font-size: ${(props) => (props.slim ? "9px" : "auto")};
  color: ${(props) => (props.dark ? "white" : "black")};
  background-color: ${(props) => (props.dark ? "#37394B" : "white")};
`;

// Switch

export const SwitchWrapperStyle = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

export const SwitchInputStyle = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #2196f3;
  }

  &:focus + span {
    box-shadow: 0 0 1px #2196f3;
  }

  &:checked + span::before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`;

export const SwitchSliderStyle = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;

  &::before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

// Form

export const FormStyle = styled.form`
  width: 100%;
  max-width: 540px;
  margin: 1.5rem auto;
  background-color: white;
  position: relative;
`;

// Textarea

export const TextAreaStyle = styled.textarea`
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  width: 100%;
  height: 200px;
  color: ${(props) => (props.dark ? "white" : "black")};
  background-color: ${(props) => (props.dark ? "var(--light-green)" : "white")};
  resize: none;
`;

// Error

export const ErrorStyle = styled.span`
  color: var(--red);
  text-align: left;
  font-size: 12px;
`;

// Text Field

export const TextFieldStyle = styled.input`
  border: 1px solid var(--primary-dark) !important;
  padding: 0.5rem;
  width: 100%;
  font-size: 18px;
  border: none;
  outline: none;
  color: ${(props) => (props.dark ? "white" : "black")};
  background-color: ${(props) => (props.dark ? "var(--light-green)" : "white")};
`;

// Label

export const LabelStyle = styled.label`
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  color: ${(props) => (props.dark ? "white" : "black")};
  margin-bottom: ${props => props.noMarginLabel ? "0" : "0.5rem"};
`;
