import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  flex: 1;
  position: relative;
  background-color: ${(props) => (props.color ? props.color : "white")};
  padding: 1rem 1rem 1rem;
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "100%")};
`;

export const Page = ({ children, padding, color, maxWidth }) => {
  return (
    <Wrapper padding={padding} maxWidth={maxWidth} color={color} id="page">
      {children}
    </Wrapper>
  );
};
