import styled from "styled-components";

const PrimaryButton = styled.button`
  background-color: var(--primary);
  border: none;
  padding: 0.5rem 1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;
  border-radius: 0.5rem;

  &:hover {
    background-color: var(--primary-dark);
    color: white;
  }

  img {
    width: 20px;
  }

  cursor: ${(props) => (!!props.$loading ? "not-allowed" : "pointer")};

  :disabled {
    cursor: not-allowed;
    opacity: 50%;
  }
`;

export default PrimaryButton;
