import React from "react";
import styled from "styled-components";

const SettingsWrapper = styled.article`
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
  padding: 1rem;
  margin-bottom: 1rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #2c3e50;
    font-size: 0.9rem;
  }

  hr {
    margin: 1rem 0;
  }
`;

const SettingsGroup = ({ right, title, description, children }) => {
  return (
    <SettingsWrapper
      className={"shadow-md p-4 mb-4 " + (right ? "text-right" : "")}
    >
      <h2 className="text-xl mb-2">
        <span>{title}</span>
      </h2>
      <p className="text-sm text-gray-500">{description}</p>
      <hr className="my-4" />
      {children}
    </SettingsWrapper>
  );
};

export default SettingsGroup;
