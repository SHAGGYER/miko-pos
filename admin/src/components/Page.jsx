import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

export default function Page({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
