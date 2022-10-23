import styled from "styled-components";

const LogoutButton = styled.button`
  background-color: var(--primary);
  border: none;
  padding: 1rem 1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  justify-content: center;

  img {
    width: 20px;
  }

  &:hover {
    background-color: var(--primary-light);
  }

  cursor: ${(props) => (!!props.$loading ? "not-allowed" : "pointer")};
`;

export default LogoutButton;
